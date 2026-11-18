import { assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where, writeBatch, type Firestore,
} from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import { USERS, baseTask, makeEnv, seed, type UserKey } from './setup';

let env: RulesTestEnvironment;
const as = (u: UserKey): Firestore => env.authenticatedContext(u, { email: `${u}@example.com`, email_verified: true }).firestore() as unknown as Firestore;
const anon = (): Firestore => env.unauthenticatedContext().firestore() as unknown as Firestore;
const touched = (u: string) => ({ updatedAt: serverTimestamp(), updatedBy: u });
const created = (u: string) => ({ createdAt: serverTimestamp(), createdBy: u, ...touched(u), isArchived: false });
const log = (u: string, extra: Record<string, unknown> = {}) => ({ entityType: 'task', entityId: 't1', projectId: 'p1', departmentId: 'd1', action: 'x', summary: 's', before: null, after: null, actorId: u, at: serverTimestamp(), ...extra });

beforeAll(async () => { env = await makeEnv(); });
afterAll(async () => { await env.cleanup(); });
beforeEach(async () => { await seed(env); });

describe('authentication & identity', () => {
  it('denies unauthenticated reads of ERP data', async () => {
    await assertFails(getDoc(doc(anon(), 'projects/p1')));
    await assertFails(getDoc(doc(anon(), 'tasks/t1')));
    await assertFails(getDoc(doc(anon(), 'employees/emp')));
  });
  it('denies signed-in users without an employee record', async () => {
    const stranger = env.authenticatedContext('stranger').firestore() as unknown as Firestore;
    await assertFails(getDoc(doc(stranger, 'projects/p1')));
    await assertFails(getDocs(collection(stranger, 'departments')));
  });
  it('denies deactivated employees, even admins', async () => {
    await assertFails(getDocs(collection(as('inactive'), 'projects')));
    await assertSucceeds(getDoc(doc(as('inactive'), 'employees/inactive'))); // own record, to show "deactivated"
  });
});

describe('project scoping', () => {
  it('members read their project; others are denied', async () => {
    await assertSucceeds(getDoc(doc(as('emp'), 'projects/p1')));
    await assertFails(getDoc(doc(as('emp'), 'projects/p2')));
    await assertFails(getDoc(doc(as('outsider'), 'projects/p1')));
  });
  it('department heads read their department only', async () => {
    await assertSucceeds(getDocs(query(collection(as('head2'), 'projects'), where('departmentId', '==', 'd2'))));
    await assertFails(getDocs(query(collection(as('head2'), 'projects'), where('departmentId', '==', 'd1'))));
  });
  it('admins list everything; employees cannot list unscoped', async () => {
    await assertSucceeds(getDocs(collection(as('admin'), 'projects')));
    await assertFails(getDocs(collection(as('emp'), 'projects')));
    await assertSucceeds(getDocs(query(collection(as('emp'), 'projects'), where('memberIds', 'array-contains', 'emp'))));
  });
  it('PM can create a project they manage; employees cannot', async () => {
    const p = { code: 'PRJ-9', name: 'New', clientId: 'c1', departmentId: 'd1', projectManagerId: 'pm', memberIds: ['pm'], startDate: null, endDate: null, priority: 'LOW', budget: 0, description: '', status: 'PLANNING', clientVisible: false };
    await assertSucceeds(setDoc(doc(as('pm'), 'projects/new1'), { ...p, ...created('pm') }));
    await assertFails(setDoc(doc(as('pm'), 'projects/new2'), { ...p, projectManagerId: 'tl', memberIds: ['tl'], ...created('pm') }));
    await assertFails(setDoc(doc(as('emp'), 'projects/new3'), { ...p, projectManagerId: 'emp', memberIds: ['emp'], ...created('emp') }));
    await assertFails(setDoc(doc(as('head2'), 'projects/new4'), { ...p, ...created('head2') }));
  });
  it('PM cannot move a project to another department or hand it off', async () => {
    await assertSucceeds(updateDoc(doc(as('pm'), 'projects/p1'), { name: 'Renamed', ...touched('pm') }));
    await assertFails(updateDoc(doc(as('pm'), 'projects/p1'), { departmentId: 'd2', ...touched('pm') }));
    await assertFails(updateDoc(doc(as('emp'), 'projects/p1'), { name: 'Hijack', ...touched('emp') }));
  });
});

describe('task reads', () => {
  it('assignees and project members read tasks via scoped queries', async () => {
    await assertSucceeds(getDocs(query(collection(as('emp'), 'tasks'), where('assigneeIds', 'array-contains', 'emp'))));
    await assertSucceeds(getDocs(query(collection(as('viewer'), 'tasks'), where('projectId', 'in', ['p1']))));
    await assertFails(getDocs(query(collection(as('emp'), 'tasks'), where('projectId', '==', 'p2'))));
    await assertFails(getDoc(doc(as('emp'), 'tasks/t2')));
  });
});

describe('task creation', () => {
  it('managers create tasks in their project only', async () => {
    const t = baseTask({ ...created('pm') });
    await assertSucceeds(setDoc(doc(as('pm'), 'tasks/n1'), t));
    await assertSucceeds(setDoc(doc(as('tl'), 'tasks/n2'), baseTask({ ...created('tl') })));
    await assertSucceeds(setDoc(doc(as('head1'), 'tasks/n3'), baseTask({ ...created('head1') })));
    await assertFails(setDoc(doc(as('emp'), 'tasks/n4'), baseTask({ ...created('emp') })));
    await assertFails(setDoc(doc(as('head2'), 'tasks/n5'), baseTask({ ...created('head2') })));
    await assertFails(setDoc(doc(as('viewer'), 'tasks/n6'), baseTask({ ...created('viewer') })));
  });
  it('rejects assignees outside the project and forged starting state', async () => {
    await assertFails(setDoc(doc(as('pm'), 'tasks/n7'), baseTask({ assigneeIds: ['emp', 'outsider'], ...created('pm') })));
    await assertFails(setDoc(doc(as('pm'), 'tasks/n8'), baseTask({ status: 'COMPLETED', ...created('pm') })));
    await assertFails(setDoc(doc(as('pm'), 'tasks/n9'), baseTask({ departmentId: 'd2', ...created('pm') })));
    await assertFails(setDoc(doc(as('pm'), 'tasks/n10'), baseTask({ ...created('emp') }))); // forged createdBy
  });
});

describe('task workflow (field-level)', () => {
  it('assignee can start, but not skip states or edit other fields', async () => {
    await assertFails(updateDoc(doc(as('emp'), 'tasks/t1'), { status: 'COMPLETED', ...touched('emp') }));
    await assertFails(updateDoc(doc(as('emp'), 'tasks/t1'), { status: 'WAITING_APPROVAL', ...touched('emp') }));
    await assertFails(updateDoc(doc(as('emp'), 'tasks/t1'), { title: 'Mine now', ...touched('emp') }));
    await assertFails(updateDoc(doc(as('emp'), 'tasks/t1'), { dueDate: null, reviewerId: 'emp', ...touched('emp') }));
    await assertSucceeds(updateDoc(doc(as('emp'), 'tasks/t1'), { status: 'IN_PROGRESS', ...touched('emp') }));
  });
  it('non-assignees and viewers cannot update the task', async () => {
    await assertFails(updateDoc(doc(as('emp2'), 'tasks/t1'), { status: 'IN_PROGRESS', ...touched('emp2') }));
    await assertFails(updateDoc(doc(as('viewer'), 'tasks/t1'), { status: 'IN_PROGRESS', ...touched('viewer') }));
    await assertFails(updateDoc(doc(as('outsider'), 'tasks/t1'), { status: 'IN_PROGRESS', ...touched('outsider') }));
  });
  it('assignee updates checklist counters and hours (hours never decrease)', async () => {
    await assertSucceeds(updateDoc(doc(as('emp'), 'tasks/t1'), { checklistTotal: 2, checklistDone: 1, actualHours: 1.5, ...touched('emp') }));
    await assertFails(updateDoc(doc(as('emp'), 'tasks/t1'), { actualHours: 0, ...touched('emp') }));
  });
  it('submit writes task + submission + approval request atomically', async () => {
    await env.withSecurityRulesDisabled(async (c) => { await updateDoc(doc(c.firestore(), 'tasks/t1'), { status: 'IN_PROGRESS' }); });
    const db = as('emp');
    const b = writeBatch(db);
    b.update(doc(db, 'tasks/t1'), { status: 'WAITING_APPROVAL', ...touched('emp') });
    b.set(doc(db, 'task_submissions/s2'), { taskId: 't1', projectId: 'p1', submittedBy: 'emp', note: 'done', fileRefs: [], version: 1, status: 'SUBMITTED', ...created('emp') });
    b.set(doc(db, 'approvals/a2'), { entityType: 'task', entityId: 't1', projectId: 'p1', departmentId: 'd1', submissionId: 's2', level: 1, reviewerId: 'reviewer', requestedBy: 'emp', decision: null, comment: '', decidedAt: null, decidedBy: null, ...created('emp') });
    b.set(doc(db, 'activity_logs/l2'), log('emp'));
    await assertSucceeds(b.commit());
  });
  it('approval request must target the task reviewer', async () => {
    await env.withSecurityRulesDisabled(async (c) => { await updateDoc(doc(c.firestore(), 'tasks/t1'), { status: 'IN_PROGRESS' }); });
    await assertFails(setDoc(doc(as('emp'), 'approvals/a3'), { entityType: 'task', entityId: 't1', projectId: 'p1', departmentId: 'd1', submissionId: '', level: 1, reviewerId: 'emp', requestedBy: 'emp', decision: null, comment: '', decidedAt: null, decidedBy: null, ...created('emp') }));
  });
  it('only the reviewer (or a manager) approves; assignees cannot self-approve', async () => {
    await assertFails(updateDoc(doc(as('emp'), 'tasks/tWait'), { status: 'COMPLETED', completedAt: serverTimestamp(), ...touched('emp') }));
    await assertFails(updateDoc(doc(as('emp2'), 'tasks/tWait'), { status: 'COMPLETED', completedAt: serverTimestamp(), ...touched('emp2') }));
    await assertSucceeds(updateDoc(doc(as('reviewer'), 'tasks/tWait'), { status: 'COMPLETED', completedAt: serverTimestamp(), ...touched('reviewer') }));
  });
  it('rejection must increment revisionCount', async () => {
    await assertFails(updateDoc(doc(as('reviewer'), 'tasks/tWait'), { status: 'IN_PROGRESS', ...touched('reviewer') }));
    await assertSucceeds(updateDoc(doc(as('reviewer'), 'tasks/tWait'), { status: 'IN_PROGRESS', revisionCount: 1, ...touched('reviewer') }));
  });
  it('reviewer cannot change anything else', async () => {
    await assertFails(updateDoc(doc(as('reviewer'), 'tasks/tWait'), { status: 'COMPLETED', completedAt: serverTimestamp(), title: 'x', ...touched('reviewer') }));
  });
  it('illegal transitions are denied even for managers', async () => {
    await assertFails(updateDoc(doc(as('pm'), 'tasks/t1'), { status: 'COMPLETED', ...touched('pm') }));
    await assertFails(updateDoc(doc(as('admin'), 'tasks/t1'), { status: 'WAITING_APPROVAL', ...touched('admin') }));
  });
  it('cancel requires a manager and a reason', async () => {
    await assertFails(updateDoc(doc(as('emp'), 'tasks/t1'), { status: 'CANCELLED', cancelReason: 'nope', ...touched('emp') }));
    await assertFails(updateDoc(doc(as('pm'), 'tasks/t1'), { status: 'CANCELLED', cancelReason: '', ...touched('pm') }));
    await assertSucceeds(updateDoc(doc(as('pm'), 'tasks/t1'), { status: 'CANCELLED', cancelReason: 'Client dropped scope', ...touched('pm') }));
  });
  it('managers reassign within project members only', async () => {
    await assertSucceeds(updateDoc(doc(as('pm'), 'tasks/t1'), { assigneeIds: ['emp2'], ownerId: 'emp2', ...touched('pm') }));
    await assertFails(updateDoc(doc(as('pm'), 'tasks/t1'), { assigneeIds: ['outsider'], ...touched('pm') }));
    await assertFails(updateDoc(doc(as('pm'), 'tasks/t1'), { projectId: 'p2', ...touched('pm') }));
  });
});

describe('approvals', () => {
  const decide = (u: string, decision = 'APPROVED', comment = '') => ({ decision, comment, decidedAt: serverTimestamp(), decidedBy: u, ...touched(u) });
  it('reviewer decides once; others are denied', async () => {
    await assertFails(updateDoc(doc(as('emp'), 'approvals/a1'), decide('emp')));
    await assertFails(updateDoc(doc(as('emp2'), 'approvals/a1'), decide('emp2')));
    await assertFails(updateDoc(doc(as('reviewer'), 'approvals/a1'), decide('reviewer', 'REJECTED', '')));
    await assertSucceeds(updateDoc(doc(as('reviewer'), 'approvals/a1'), decide('reviewer', 'REJECTED', 'Fix the header')));
    await assertFails(updateDoc(doc(as('pm'), 'approvals/a1'), decide('pm')));
  });
  it('project manager can decide', async () => {
    await assertSucceeds(updateDoc(doc(as('pm'), 'approvals/a1'), decide('pm')));
  });
  it('reviewer reads their queue', async () => {
    await assertSucceeds(getDocs(query(collection(as('reviewer'), 'approvals'), where('reviewerId', '==', 'reviewer'))));
    await assertFails(getDocs(query(collection(as('outsider'), 'approvals'), where('projectId', '==', 'p1'))));
  });
});

describe('append-only activity logs', () => {
  it('create own entries only; never update or delete', async () => {
    await assertSucceeds(setDoc(doc(as('emp'), 'activity_logs/x1'), log('emp')));
    await assertFails(setDoc(doc(as('emp'), 'activity_logs/x2'), log('pm')));
    await assertFails(updateDoc(doc(as('super'), 'activity_logs/log1'), { summary: 'rewritten' }));
    await assertFails(deleteDoc(doc(as('super'), 'activity_logs/log1')));
  });
  it('scoped reads', async () => {
    await assertSucceeds(getDocs(query(collection(as('emp'), 'activity_logs'), where('projectId', 'in', ['p1']))));
    await assertFails(getDocs(query(collection(as('outsider'), 'activity_logs'), where('projectId', '==', 'p1'))));
  });
});

describe('deletes and archive', () => {
  it('only Super Admin can delete', async () => {
    await assertFails(deleteDoc(doc(as('admin'), 'tasks/t1')));
    await assertFails(deleteDoc(doc(as('pm'), 'tasks/t1')));
    await assertSucceeds(deleteDoc(doc(as('super'), 'tasks/t1')));
  });
  it('archived records are read-only; admins restore, PMs cannot', async () => {
    await assertFails(updateDoc(doc(as('pm'), 'tasks/tArch'), { title: 'edit', ...touched('pm') }));
    await assertFails(updateDoc(doc(as('emp'), 'tasks/tArch'), { checklistDone: 1, ...touched('emp') }));
    const restore = (u: string) => ({ isArchived: false, archivedAt: null, archivedBy: null, ...touched(u) });
    await assertFails(updateDoc(doc(as('pm'), 'tasks/tArch'), restore('pm')));
    await assertSucceeds(updateDoc(doc(as('admin'), 'tasks/tArch'), restore('admin')));
  });
  it('PM archives a task with an archive record', async () => {
    const db = as('pm');
    const b = writeBatch(db);
    b.update(doc(db, 'tasks/t1'), { isArchived: true, archivedAt: serverTimestamp(), archivedBy: 'pm', ...touched('pm') });
    b.set(doc(db, 'archive_records/r1'), { originalCollection: 'tasks', originalId: 't1', originalProjectId: 'p1', departmentId: 'd1', title: 'x', finalStatus: 'PENDING', historicalOwnerId: 'emp', archivedAt: serverTimestamp(), archivedBy: 'pm', documentRefs: [], restoredAt: null, restoredBy: null });
    await assertSucceeds(b.commit());
    await assertFails(setDoc(doc(as('pm'), 'archive_records/r2'), { originalCollection: 'tasks', originalId: 'tWait', originalProjectId: 'p1', departmentId: 'd1', title: 'x', finalStatus: 'x', historicalOwnerId: null, archivedAt: serverTimestamp(), archivedBy: 'pm', documentRefs: [], restoredAt: null, restoredBy: null }));
  });
});

describe('employees & roles', () => {
  it('employees cannot change their own role or others', async () => {
    await assertFails(updateDoc(doc(as('emp'), 'employees/emp'), { role: 'ADMIN', ...touched('emp') }));
    await assertFails(updateDoc(doc(as('emp'), 'employees/emp2'), { name: 'x', ...touched('emp') }));
    await assertSucceeds(updateDoc(doc(as('emp'), 'employees/emp'), { name: 'Emp One', phone: '123', ...touched('emp') }));
  });
  it('admins cannot grant admin roles; super admin can', async () => {
    await assertSucceeds(updateDoc(doc(as('admin'), 'employees/emp'), { role: 'TEAM_LEADER', ...touched('admin') }));
    await assertFails(updateDoc(doc(as('admin'), 'employees/emp2'), { role: 'ADMIN', ...touched('admin') }));
    await assertFails(updateDoc(doc(as('admin'), 'employees/super'), { active: false, ...touched('admin') }));
    await assertSucceeds(updateDoc(doc(as('super'), 'employees/emp2'), { role: 'ADMIN', ...touched('super') }));
    await assertFails(updateDoc(doc(as('admin'), 'employees/admin'), { active: false, ...touched('admin') }));
  });
  it('a verified invitee claims their invite with the invited role only', async () => {
    const claimDb = (verified: boolean) => env.authenticatedContext('newUid', { email: 'Newbie@example.com', email_verified: verified }).firestore() as unknown as Firestore;
    const emp = (role: string) => ({ name: 'Newbie', email: 'newbie@example.com', phone: '', departmentId: 'd1', role, designation: '', managerId: null, active: true, avatarUrl: null, weeklyCapacityHours: 40, ...created('newUid') });
    const claim = (db: Firestore, role: string) => {
      const b = writeBatch(db);
      b.set(doc(db, 'employees/newUid'), emp(role));
      b.update(doc(db, 'invites/newbie@example.com'), { claimedBy: 'newUid', claimedAt: serverTimestamp() });
      return b.commit();
    };
    await assertFails(claim(claimDb(false), 'EMPLOYEE'));
    await assertFails(claim(claimDb(true), 'SUPER_ADMIN'));
    await assertSucceeds(claim(claimDb(true), 'EMPLOYEE'));
  });
  it('strangers cannot self-create an employee record', async () => {
    const db = env.authenticatedContext('evil', { email: 'evil@example.com', email_verified: true }).firestore() as unknown as Firestore;
    await assertFails(setDoc(doc(db, 'employees/evil'), { name: 'e', email: 'evil@example.com', role: 'SUPER_ADMIN', departmentId: null, active: true, ...created('evil') }));
  });
});

describe('notifications', () => {
  it('users read and mark only their own', async () => {
    await assertSucceeds(updateDoc(doc(as('emp'), 'notifications/n1'), { read: true, readAt: serverTimestamp() }));
    await assertFails(getDoc(doc(as('emp2'), 'notifications/n1')));
    await assertFails(updateDoc(doc(as('emp2'), 'notifications/n1'), { read: true }));
    await assertSucceeds(getDocs(query(collection(as('emp'), 'notifications'), where('userId', '==', 'emp'))));
    await assertFails(getDocs(query(collection(as('emp'), 'notifications'), where('userId', '==', 'emp2'))));
  });
  it('active staff notify others; self-notifications only for reminders', async () => {
    const n = (userId: string, type: string, by: string) => ({ userId, type, title: 't', body: 'b', link: '/erp', read: false, createdAt: serverTimestamp(), createdBy: by });
    await assertSucceeds(addDoc(collection(as('pm'), 'notifications'), n('emp', 'TASK_ASSIGNED', 'pm')));
    await assertFails(addDoc(collection(as('pm'), 'notifications'), n('emp', 'TASK_ASSIGNED', 'emp')));
    await assertSucceeds(setDoc(doc(as('emp'), 'notifications/r1'), n('emp', 'TASK_OVERDUE', 'emp')));
    await assertFails(setDoc(doc(as('emp'), 'notifications/r2'), n('emp', 'TASK_APPROVED', 'emp')));
    await assertFails(addDoc(collection(anon(), 'notifications'), n('emp', 'TASK_ASSIGNED', 'x')));
  });
});

describe('comments, checklists, counters', () => {
  it('members comment; viewers and outsiders cannot', async () => {
    const c = (u: string) => ({ projectId: 'p1', taskId: 't1', authorId: u, body: 'Hello @emp', mentions: ['emp'], editedAt: null, ...created(u) });
    await assertSucceeds(setDoc(doc(as('emp2'), 'task_comments/c1'), c('emp2')));
    await assertFails(setDoc(doc(as('viewer'), 'task_comments/c2'), c('viewer')));
    await assertFails(setDoc(doc(as('outsider'), 'task_comments/c3'), c('outsider')));
    await assertFails(updateDoc(doc(as('emp'), 'task_comments/c1'), { body: 'edited by someone else', editedAt: serverTimestamp(), ...touched('emp') }));
    await assertSucceeds(updateDoc(doc(as('emp2'), 'task_comments/c1'), { body: 'edited', editedAt: serverTimestamp(), ...touched('emp2') }));
  });
  it('assignee manages checklist; non-assignee cannot', async () => {
    const item = (u: string) => ({ taskId: 't1', projectId: 'p1', text: 'Step 1', done: false, doneBy: null, doneAt: null, order: 0, ...created(u) });
    await assertSucceeds(setDoc(doc(as('emp'), 'task_checklists/i1'), item('emp')));
    await assertFails(setDoc(doc(as('emp2'), 'task_checklists/i2'), item('emp2')));
  });
  it('counters only move up by one', async () => {
    await assertSucceeds(updateDoc(doc(as('pm'), 'counters/tasks'), { value: 6 }));
    await assertFails(updateDoc(doc(as('pm'), 'counters/tasks'), { value: 100 }));
    await assertFails(updateDoc(doc(as('viewer'), 'counters/tasks'), { value: 7 }));
  });
});

describe('public leads', () => {
  const lead = (over: Record<string, unknown> = {}) => ({ source: 'techlis-contact', name: 'Ravi', email: 'ravi@example.com', phone: '', company: '', service: 'ERP', message: 'Hi', extra: {}, status: 'NEW', createdAt: serverTimestamp(), ...over });
  it('anyone can submit a well-formed lead', async () => {
    await assertSucceeds(addDoc(collection(anon(), 'leads'), lead()));
  });
  it('rejects malformed leads and public reads', async () => {
    await assertFails(addDoc(collection(anon(), 'leads'), lead({ status: 'QUALIFIED' })));
    await assertFails(addDoc(collection(anon(), 'leads'), lead({ admin: true })));
    await assertFails(addDoc(collection(anon(), 'leads'), lead({ source: 'spam' })));
    await assertFails(getDocs(collection(anon(), 'leads')));
    await assertFails(getDocs(collection(as('emp'), 'leads')));
    await assertSucceeds(getDocs(collection(as('admin'), 'leads')));
  });
});

// Keep the USERS import referenced for readers scanning which roles are covered.
void USERS;
