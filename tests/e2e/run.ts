/**
 * End-to-end acceptance test against the Firebase Emulator Suite (auth, firestore, storage).
 * Run: npm run test:e2e   (wraps `firebase emulators:exec … "tsx tests/e2e/run.ts"`)
 *
 * Covers: public site still renders + lead capture, super-admin login, client/project/task
 * creation through the UI, employee scoping, full cycle start → checklist → submit → reject
 * with feedback → resubmit → approve → archive → restore, real-time sync between browsers,
 * notifications, file upload, invite + verified first sign-in, mobile layout at 375 px.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { appendFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { getFirestore } from 'firebase-admin/firestore';
import type { Browser, BrowserContext, Page } from 'playwright';
import { adminApp } from '../../scripts/lib/bootstrap';
import { DEMO_PASSWORD, DEMO_USERS, seedUsers } from '../../scripts/lib/demo';

const require_ = createRequire(import.meta.url);
const { chromium } = require_('playwright') as typeof import('playwright');

const PROJECT = process.env.GCLOUD_PROJECT ?? 'demo-sindulis';
const PORT = 5199;
const BASE = `http://localhost:${PORT}`;
const SHOTS = 'docs/screenshots';
const email = (k: string) => DEMO_USERS.find((u) => u.key === k)!.email;
const results: { step: string; ok: boolean; detail?: string }[] = [];
let failed = false;
let BROWSER: Browser | null = null;

async function step(name: string, fn: () => Promise<void>) {
  const t = Date.now();
  try {
    await fn();
    results.push({ step: name, ok: true });
    console.log(`  ✔ ${name} (${Date.now() - t} ms)`);
  } catch (e) {
    failed = true;
    let i = 0;
    for (const c of BROWSER?.contexts() ?? []) for (const pg of c.pages()) await pg.screenshot({ path: `test-results/fail-${i++}.png` }).catch(() => undefined);
    results.push({ step: name, ok: false, detail: (e as Error).message });
    console.log(`  ✖ ${name}\n      ${(e as Error).message.split('\n').slice(0, 6).join('\n      ')}`);
    throw e;
  }
}
const expect = (cond: unknown, msg: string) => { if (!cond) throw new Error(msg); };

async function startVite(): Promise<ChildProcess> {
  // Spawn the vite binary directly in its own process group so cleanup kills it (npx would orphan it).
  const proc = spawn('node_modules/.bin/vite', ['--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    detached: true,
    env: { ...process.env, VITE_USE_EMULATORS: 'true', VITE_EMULATOR_PROJECT_ID: PROJECT, DISABLE_HMR: 'true' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  proc.stderr?.on('data', (d) => process.env.E2E_DEBUG && process.stderr.write(d));
  let exited = false;
  proc.on('exit', () => { exited = true; });
  for (let i = 0; i < 60; i++) {
    if (exited) throw new Error(`Vite exited early — is port ${PORT} already in use by a stale dev server?`);
    try { if ((await fetch(BASE)).ok && !exited) { await new Promise((r) => setTimeout(r, 300)); if (!exited) return proc; } } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('Vite did not start');
}

async function login(browser: Browser, who: string, viewport = { width: 1440, height: 900 }): Promise<{ ctx: BrowserContext; page: Page }> {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`    [${who} pageerror] ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && appendFileSync('test-results/console.log', `[${who}] ${m.text().slice(0, 600)}\n`));
  await page.goto(`${BASE}/erp/login`);
  await page.getByTestId('login-email').fill(who.includes('@') ? who : email(who));
  await page.getByTestId('login-password').fill(DEMO_PASSWORD);
  await page.getByTestId('login-submit').click();
  await page.getByText(/^Welcome, /).waitFor({ timeout: 20000 });
  return { ctx, page };
}

const shot = (page: Page, name: string) => page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false });

async function main() {
  mkdirSync(SHOTS, { recursive: true });
  console.log(`E2E against emulators (project ${PROJECT})`);
  const ids = await seedUsers(PROJECT);
  const db = getFirestore(adminApp(PROJECT));
  const vite = await startVite();
  const browser = await chromium.launch();
  BROWSER = browser;
  mkdirSync('test-results', { recursive: true });
  let taskId = '';
  let projectId = '';
  try {
    await step('Public site at / renders as before and the waitlist form saves a lead', async () => {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(BASE);
      await page.getByText('Join Waitlist').first().waitFor();
      await shot(page, 'public-home');
      await page.getByText('Join Waitlist').first().click();
      await page.getByPlaceholder('e.g. Alex Morgan').fill('E2E Visitor');
      await page.getByPlaceholder('alex@organization.com').fill('visitor@example.com');
      await page.locator('form button[type="submit"]').click();
      await page.waitForTimeout(2500);
      const leads = await db.collection('leads').where('email', '==', 'visitor@example.com').get();
      expect(leads.size === 1, `expected 1 lead, got ${leads.size}`);
      expect(leads.docs[0]!.get('source') === 'portal-waitlist', 'wrong lead source');
      expect(errors.length === 0, `page errors: ${errors.join('; ')}`);
      await ctx.close();
    });

    const A = await login(browser, 'super');
    await step('Super Admin signs in and sees the dashboard', async () => {
      await A.page.getByTestId('stat-Total projects').waitFor();
      await shot(A.page, 'erp-dashboard-empty');
    });

    await step('Super Admin creates a client through the UI', async () => {
      await A.page.goto(`${BASE}/erp/clients`);
      await A.page.getByTestId('new-client').click();
      await A.page.getByRole('dialog').getByLabel('Client name *').fill('Acme Hospitals');
      await A.page.getByRole('dialog').getByLabel('Contact person').fill('Dr. Acme');
      await A.page.getByTestId('form-submit').click();
      await A.page.getByText('CLI-0001').waitFor();
    });

    await step('Super Admin creates a project with a team', async () => {
      await A.page.goto(`${BASE}/erp/projects`);
      await A.page.getByTestId('new-project').click();
      await A.page.getByRole('dialog').getByLabel('Project name *').fill('Acme Patient Portal');
      await A.page.getByRole('dialog').getByLabel('Client *').selectOption({ label: 'CLI-0001 · Acme Hospitals' });
      await A.page.getByRole('dialog').getByLabel('Department *').selectOption({ label: 'Software' });
      await A.page.getByRole('dialog').getByLabel('Project manager *').selectOption({ label: 'Priya Menon' });
      await A.page.getByRole('dialog').getByLabel('Status').selectOption('ACTIVE');
      for (const name of ['Arjun Varma', 'Divya Shah', 'Tarun Reddy']) await A.page.getByRole('dialog').getByRole('checkbox', { name }).check();
      await A.page.getByTestId('form-submit').click();
      for (let i = 0; i < 20 && !projectId; i++) {
        const q = await db.collection('projects').get();
        if (q.size) projectId = q.docs[0]!.id;
        else await A.page.waitForTimeout(250);
      }
      expect(projectId, `project was not written to Firestore; toasts: ${await A.page.locator('[role=status],[role=alert]').allTextContents()}`);
      await A.page.getByRole('link', { name: /PRJ-0001/ }).click();
      await A.page.getByTestId('project-new-task').waitFor();
    });

    await step('Super Admin creates a task assigned to the employee, reviewed by QA', async () => {
      await A.page.getByTestId('project-new-task').click();
      await A.page.getByRole('dialog').getByLabel('Title *').fill('Build login screen');
      await A.page.getByRole('dialog').getByRole('checkbox', { name: 'Arjun Varma' }).check();
      await A.page.getByRole('dialog').getByLabel(/^Reviewer/).selectOption({ label: 'Divya Shah' });
      const due = new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);
      await A.page.getByTestId('task-due').fill(due);
      await A.page.getByRole('dialog').getByLabel('Estimated hours').fill('6');
      await A.page.getByTestId('form-submit').click();
      await A.page.getByTestId('drawer-title').filter({ hasText: 'Build login screen' }).waitFor();
      taskId = new URL(A.page.url()).searchParams.get('task')!;
      expect(taskId, 'task id');
      const t = await db.doc(`tasks/${taskId}`).get();
      expect(t.get('code') === 'TSK-00001' && t.get('status') === 'PENDING', `unexpected task ${JSON.stringify(t.data())}`);
      await shot(A.page, 'erp-task-drawer');
    });

    const B = await login(browser, 'emp');
    await step('Employee sees the assigned task in My Workspace', async () => {
      await B.page.goto(`${BASE}/erp/my`);
      await B.page.getByTestId('task-row-TSK-00001').waitFor();
      await shot(B.page, 'erp-my-workspace');
    });

    await step('Employee outside the project sees nothing', async () => {
      const C = await login(browser, 'mkt');
      await C.page.goto(`${BASE}/erp/projects`);
      await C.page.getByText('No projects').waitFor();
      await C.page.goto(`${BASE}/erp/projects/${projectId}`);
      await C.page.getByText('Project not found').waitFor();
      await C.page.goto(`${BASE}/erp/tasks?task=${taskId}`);
      await C.page.getByText(/does not exist or you don’t have access/).waitFor();
      await C.ctx.close();
    });

    await step('Employee starts the task and completes a checklist', async () => {
      await B.page.getByTestId('task-row-TSK-00001').click();
      expect(!(await B.page.getByTestId('action-APPROVE').count()), 'employee must not see Approve');
      await B.page.getByTestId('action-START').click();
      await B.page.getByTestId('action-SUBMIT').waitFor();
      await B.page.getByRole('tab', { name: /Checklist/ }).click();
      await B.page.getByTestId('checklist-input').fill('Email + password form');
      await B.page.getByRole('button', { name: 'Add' }).click();
      await B.page.getByRole('checkbox', { name: 'Email + password form' }).click();
      let t = await db.doc(`tasks/${taskId}`).get();
      for (let i = 0; i < 40 && t.get('checklistDone') !== 1; i++) { await B.page.waitForTimeout(250); t = await db.doc(`tasks/${taskId}`).get(); }
      expect(t.get('status') === 'IN_PROGRESS' && t.get('checklistDone') === 1 && t.get('checklistTotal') === 1, `task state ${t.get('status')} ${t.get('checklistDone')}/${t.get('checklistTotal')}`);
    });

    await step('Employee uploads a deliverable to Storage', async () => {
      await B.page.getByRole('tab', { name: /Files/ }).click();
      await B.page.getByTestId('file-input').setInputFiles({ name: 'login-mockup.txt', mimeType: 'text/plain', buffer: Buffer.from('mockup v1') });
      await B.page.getByText('login-mockup.txt v1').waitFor({ timeout: 15000 });
      const files = await db.collection('project_files').where('taskId', '==', taskId).get();
      expect(files.size === 1 && files.docs[0]!.get('version') === 1, 'file metadata recorded');
    });

    await step('Employee submits for approval', async () => {
      await B.page.getByTestId('action-SUBMIT').click();
      await B.page.getByTestId('transition-text').fill('First version ready');
      await B.page.getByTestId('transition-confirm').click();
      await B.page.getByText('Waiting approval').first().waitFor();
    });

    const D = await login(browser, 'rev');
    await step('Reviewer sees the request and rejects with feedback', async () => {
      await D.page.goto(`${BASE}/erp/approvals`);
      await D.page.getByTestId('approval-TSK-00001').waitFor();
      await shot(D.page, 'erp-approvals');
      await D.page.getByTestId('approval-TSK-00001').getByTestId('reject-btn').click();
      await D.page.getByTestId('transition-text').fill('Please add a forgot-password link');
      await D.page.getByTestId('transition-confirm').click();
      await D.page.getByText('Nothing waiting for your review').waitFor();
    });

    await step('Employee browser updates in real time with the feedback (no reload)', async () => {
      await B.page.getByTestId('latest-feedback').filter({ hasText: 'forgot-password' }).waitFor({ timeout: 15000 });
      await B.page.getByTestId('unread-count').waitFor();
      const t = await db.doc(`tasks/${taskId}`).get();
      expect(t.get('status') === 'IN_PROGRESS' && t.get('revisionCount') === 1, 'task back in progress with revision 1');
    });

    await step('Employee resubmits', async () => {
      await B.page.getByTestId('action-SUBMIT').click();
      await B.page.getByTestId('transition-text').fill('Added forgot-password link');
      await B.page.getByTestId('transition-confirm').click();
      await B.page.getByText('Waiting approval').first().waitFor();
    });

    await step('Reviewer approves; task completes for everyone in real time', async () => {
      await D.page.getByTestId('approval-TSK-00001').getByTestId('approve-btn').click({ timeout: 15000 });
      await D.page.getByTestId('transition-confirm').click();
      await B.page.locator('span', { hasText: /^Completed$/ }).first().waitFor({ timeout: 15000 });
      const t = await db.doc(`tasks/${taskId}`).get();
      expect(t.get('status') === 'COMPLETED' && t.get('completedAt'), 'completed with timestamp');
      const approvals = await db.collection('approvals').where('entityId', '==', taskId).get();
      const decisions = approvals.docs.map((d) => d.get('decision')).sort();
      expect(JSON.stringify(decisions) === JSON.stringify(['APPROVED', 'CHANGES_REQUESTED']), `decisions ${decisions}`);
      const subs = await db.collection('task_submissions').where('taskId', '==', taskId).get();
      expect(subs.size === 2, `2 submissions, got ${subs.size}`);
    });

    await step('Notifications were created for each trigger', async () => {
      const n = await db.collection('notifications').get();
      const types = (uid: string) => n.docs.filter((d) => d.get('userId') === uid).map((d) => d.get('type'));
      for (const t of ['TASK_ASSIGNED', 'TASK_REJECTED', 'TASK_APPROVED']) expect(types(ids.emp).includes(t), `employee missing ${t}: ${types(ids.emp)}`);
      expect(types(ids.rev).includes('APPROVAL_PENDING'), `reviewer missing APPROVAL_PENDING: ${types(ids.rev)}`);
      await B.page.goto(`${BASE}/erp/notifications`);
      await B.page.getByTestId('notification-item').first().waitFor();
      await shot(B.page, 'erp-notifications');
    });

    await step('Activity log recorded the whole cycle', async () => {
      const logs = await db.collection('activity_logs').where('entityId', '==', taskId).get();
      const actions = logs.docs.map((d) => d.get('action'));
      for (const a of ['created', 'started', 'submitted', 'changes_requested', 'approved', 'file_uploaded']) expect(actions.includes(a), `missing log ${a}: ${actions}`);
    });

    await step('Super Admin archives the completed task, then restores it', async () => {
      await A.page.goto(`${BASE}/erp/tasks?task=${taskId}`);
      await A.page.getByTestId('archive-task').click();
      await A.page.getByRole('dialog', { name: /Archive TSK/ }).getByRole('button', { name: 'Archive', exact: true }).click();
      await A.page.waitForTimeout(800);
      expect((await db.doc(`tasks/${taskId}`).get()).get('isArchived') === true, 'archived');
      await A.page.goto(`${BASE}/erp/archive`);
      await A.page.getByTestId(`archive-row-${taskId}`).getByTestId('restore-btn').click();
      await A.page.getByRole('dialog', { name: 'Restore record?' }).getByRole('button', { name: 'Restore', exact: true }).click();
      await A.page.waitForTimeout(800);
      expect((await db.doc(`tasks/${taskId}`).get()).get('isArchived') === false, 'restored');
    });

    await step('Dashboard KPIs match the data', async () => {
      await A.page.goto(`${BASE}/erp`);
      const val = async (label: string) => (await A.page.getByTestId(`stat-${label}`).textContent())?.trim();
      expect((await val('Total projects')) === '1', 'projects = 1');
      expect((await val('Completed tasks')) === '1', 'completed = 1');
      expect((await val('Total tasks')) === '1', 'tasks = 1');
      await shot(A.page, 'erp-dashboard');
      await A.page.goto(`${BASE}/erp/projects/${projectId}?tab=kanban`);
      await A.page.getByTestId('kanban-col-COMPLETED').waitFor();
      await shot(A.page, 'erp-project-kanban');
    });

    await step('Admin invites a new employee; first verified sign-in grants access', async () => {
      const newEmail = 'newhire@demo.sindulis.test';
      await A.page.goto(`${BASE}/erp/admin`);
      await A.page.getByTestId('invite-btn').click();
      await A.page.getByTestId('invite-email').fill(newEmail);
      await A.page.getByTestId('invite-name').fill('New Hire');
      await A.page.getByTestId('invite-send').click();
      await A.page.getByTestId('invite-result').waitFor({ timeout: 15000 });
      const codes = (await (await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${PROJECT}/oobCodes`)).json()) as { oobCodes: { email: string; requestType: string; oobCode: string; oobLink: string }[] };
      const mine = codes.oobCodes.filter((c) => c.email === newEmail);
      const verify = mine.find((c) => c.requestType === 'VERIFY_EMAIL');
      const reset = mine.find((c) => c.requestType === 'PASSWORD_RESET');
      expect(verify && reset, `expected verify + reset emails, got ${mine.map((c) => c.requestType)}`);
      await fetch(verify!.oobLink);
      const r = await fetch(`http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=fake-api-key`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ oobCode: reset!.oobCode, newPassword: DEMO_PASSWORD }) });
      expect(r.ok, `reset password ${r.status}`);
      const N = await login(browser, newEmail);
      const users = await db.collection('employees').where('email', '==', newEmail).get();
      expect(users.size === 1 && users.docs[0]!.get('role') === 'EMPLOYEE', 'employee record claimed with invited role');
      await N.ctx.close();
    });

    await step('Mobile layout is usable at 375 px', async () => {
      const M = await login(browser, 'emp', { width: 375, height: 812 });
      const overflow = await M.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow <= 1, `horizontal overflow ${overflow}px on dashboard`);
      await shot(M.page, 'erp-mobile-dashboard');
      await M.page.getByRole('button', { name: 'Open menu' }).click();
      await M.page.getByRole('link', { name: 'Tasks' }).click();
      await M.page.getByTestId('task-row-TSK-00001').waitFor();
      await shot(M.page, 'erp-mobile-tasks');
      const overflow2 = await M.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow2 <= 1, `horizontal overflow ${overflow2}px on tasks`);
      await M.ctx.close();
    });
  } catch {
    /* recorded in results */
  } finally {
    await browser.close();
    try { process.kill(-vite.pid!, 'SIGTERM'); } catch { vite.kill('SIGTERM'); }
  }
  console.log(`\n${results.filter((r) => r.ok).length}/${results.length} E2E steps passed`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
