# SINDULIS ERP — Work Management: final report

Branch: `claude/optimistic-allen-kb1z43` · Firebase project: `sindulis` (Spark plan)

## Status at a glance

| Area | State |
|---|---|
| ERP application under `/erp` | ✅ Built; verified end to end against the Firebase Emulator Suite |
| Public site at `/` | ✅ Unchanged visually; forms now save leads; initial JS bundle **smaller** than before (739 kB vs 1,011 kB) |
| Security rules (Firestore + Storage) | ✅ Written; **47 emulator tests pass** (allowed + denied per role) |
| Unit tests (workflow engine, permissions, KPIs, schemas, CSV) | ✅ 36 pass |
| End-to-end acceptance test (real browser, 4 users) | ✅ 20/20 steps pass |
| CI/CD (GitHub Actions) | ✅ Workflow written (`.github/workflows/ci.yml`) — needs the `FIREBASE_SERVICE_ACCOUNT_SINDULIS` secret |
| Deploy rules / indexes / preview / live | ⏳ **Not yet done** — this cloud session has no Firebase credentials. Needs one sign-in from the owner (see “Owner actions”) |

No preview or live URL exists yet. Nothing was deployed and no production data was touched.

## What was built

**Architecture.** `react-router-dom` routes `/erp/*` to a lazily loaded ERP bundle and everything else to the existing `App`. A typed service layer (`src/erp/services/*`, one module per collection) validates every write with zod (`src/erp/lib/schemas.ts`). React hooks (`src/erp/hooks/*`) provide real-time `onSnapshot` data. UI code never imports Firestore directly.

**Workflow engine** (`src/erp/lib/workflow.ts`, unit tested): `PENDING → IN_PROGRESS → WAITING_APPROVAL → COMPLETED`, plus `CANCELLED` (reason required), reject/request changes (feedback required, `revisionCount++`), reopen and reinstate (managers). Each transition is one atomic batch: task update, submission + approval records, activity-log entry, and notifications.

**Screens** (all under `/erp`): Dashboard (KPIs, workload and department charts, deadlines, activity) · Projects (table/cards, filters) · Project Workspace (Overview, Timeline/Gantt, Tasks, Kanban, Calendar, Files, Discussions, Approvals, Reports, Activity) · Tasks (Table, drag-and-drop Kanban that only permits legal transitions, Calendar, Timeline, advanced filters) · Task drawer (details, checklist, submissions and revisions, @mention comments, files, time log with timer, history) · My Workspace · Team workload · Milestones · Calendar · Approvals queue · Clients · Files · Discussions · Activity Logs (filters, CSV) · Notifications · Reports (8 reports, CSV + print-to-PDF) · Archive Center (search/filter, restore, typed-confirmation permanent delete) · Admin (employees + invitations, departments, website leads, settings) · Profile. Global Ctrl/⌘+K search, quick-create, notification bell, responsive down to 375 px.

**Auth.** The public LoginModal and `/erp/login` use real Firebase Auth (email/password, Google, password reset). There is no self-signup: an Admin invites by email, which creates the login and sends verification and set-password emails. The first verified sign-in claims the invite with exactly the invited role, and the rules check that.

**Public site.** All 7 forms (portal waitlist, Tech Lis contact/quote, Sinfox contact/quote, EduLis contact/enroll) save to `leads` (create-only for the public, readable by Admins under Admin → Website leads). If a save fails, the visitor sees an alert instead of a false success message.

## Security rules summary (`firestore.rules`, `storage.rules`)

- Deny by default. Role comes from `employees/{uid}.role` via `get()`. Deactivated users lose access.
- **Department scoping:** department heads read and manage only their department.
- **Project membership:** members, the PM, admins and the department head read a project's tasks, milestones, files, comments, approvals and logs. List queries must be scoped so the rules can prove access.
- **Field-level task updates:** assignees may only start or submit (legal transitions only) and change checklist counters and actual hours (never downwards). Reviewers may only approve or reject. Rejection must increment `revisionCount`. Reviewers cannot approve tasks they are assigned to.
- Assignees must be project members; tasks inherit the project's department; `code`/`projectId` are immutable.
- **Approvals:** only the assigned reviewer or a project manager decides, exactly once; feedback is required for rejections.
- **Activity logs:** append-only, written under the actor's own uid; nobody can update or delete them, Super Admin included.
- **Archive:** archived records are read-only. Only Admins restore. Only Super Admin deletes anything.
- **Roles:** only Super Admin grants or edits admin roles, and nobody changes their own role or active flag.
- **Storage:** project members upload (≤ 25 MB, uploader stamped). Readers follow project access. Delete is Super Admin only. Everything else is denied.
- **Leads:** public create with a strict schema; Admin read.

## Tests run (all in this session, against emulators)

| Suite | Command | Result |
|---|---|---|
| Typecheck (public + strict ERP) | `npm run lint` | ✅ |
| Unit | `npm test` | ✅ 36/36 |
| Rules | `npm run test:rules` | ✅ 47/47 (41 → 47 after adding invite-claim and log cases) |
| E2E acceptance | `npm run test:e2e` | ✅ 20/20 |
| Build | `npm run build` | ✅ |

The E2E run covers, in a real Chromium:
- Public site renders and a waitlist lead is saved.
- Super Admin logs in, then creates a client, a project and a task through the UI.
- A user outside the project sees no project or task, even by direct URL.
- The employee starts the task, completes a checklist item and uploads a file to Storage.
- The employee submits; the reviewer rejects with feedback; the employee's browser shows the feedback live, with no reload.
- The employee resubmits; the reviewer approves; the task completes live for everyone.
- Notifications fired for assigned, rejected, approved and approval-pending.
- The activity log recorded the whole cycle.
- The task was archived, then restored.
- Dashboard KPIs match the data.
- Admin invites a new person, who verifies their email, sets a password and gets access with the invited role.
- No horizontal overflow at 375 px.

**Bugs the E2E test caught and I fixed:**
- "New project" and "New task" from the list pages reported success but never saved (`onCreated?.(await create())` skips evaluation entirely).
- The invite-claim batch was rejected by the activity-log rule.
- A Firestore SDK internal assertion when an ID-token refresh overlapped an open listener.
- Mobile header overflow.

Screenshots from the run are in `docs/screenshots/`.

## Spark-plan substitutes (no Cloud Functions)

| Brief asked for (Blaze) | Implemented on Spark |
|---|---|
| Custom-claims sync | Rules read the employee doc via `get()`. The bootstrap script also sets a `role` claim, which is informational only. |
| Hourly deadline/overdue job | Each user's app creates their own "due within N h" / "overdue" (and PM "project deadline") notifications on load, once per task per day. A user who never opens the app gets no reminder. Real scheduled reminders need Blaze. |
| Notification fan-out triggers | Written in the same batch as the action |

## Known limitations

- **Storage needs Blaze.** The project's bucket is `sindulis.firebasestorage.app`, and new-format buckets require the Blaze plan. File upload is implemented and tested on the emulator only. In production it fails until Blaze is enabled.
- Notifications are in-app only (no email or WhatsApp). Reminders are not scheduled (see above).
- Approvals are single-level (`level` is stored for later). There is no client portal (`clientVisible` is stored), no recurring tasks, and dependencies only show a warning.
- The workspace loads all visible records into memory. That is fine for a team of tens with thousands of tasks; larger organisations will need pagination.
- Not tested: the Google sign-in popup (the emulator can't exercise it), print-to-PDF output, and real email delivery.
- Bundle: the ERP chunk is 780 kB (222 kB gzip), loaded only under `/erp`.
- The hosting cache headers changed: non-hashed images now cache for 1 day instead of 1 year immutable, so updated images actually reach users. Hashed JS/CSS stays immutable. I also added basic security headers.

## Owner actions required

1. **Sign in for deployment** (one time, in this session): I'll give you a Firebase login link. Alternatively, deploy yourself with the commands below.
2. **Firebase console** (project `sindulis`):
   - Authentication → Sign-in method → enable **Email/Password** and **Google**.
   - Firestore → create the database in **Native mode** if it doesn't exist (choose a region, e.g. `asia-south1`).
   - To use file uploads: upgrade to **Blaze**, then Storage → Get started. On the first `storage` deploy, accept the prompt that lets Storage rules read Firestore.
   - Authentication → Settings → Authorized domains: make sure `sindulis.web.app` and any custom domain are listed (needed for Google sign-in).
3. **First Super Admin** (after rules are deployed), from your machine with a service-account key that is never committed:

   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=./sa.json SUPER_ADMIN_EMAIL=you@yourcompany.com npm run bootstrap:super-admin
   ```

   This creates or promotes the account, seeds the 8 departments and prints a set-password link.
4. **GitHub secret** for CI/CD: Repository → Settings → Secrets and variables → Actions → `FIREBASE_SERVICE_ACCOUNT_SINDULIS`, containing the JSON of a service account with the *Firebase Hosting Admin*, *Firebase Rules Admin*, *Cloud Datastore Index Admin* and *Service Account User* roles. Optionally add a `production` environment with required reviewers.

### Deploy commands (in order)

```bash
npx firebase login
npx firebase deploy --only firestore:rules,firestore:indexes,storage --project sindulis
npm run build && npx firebase hosting:channel:deploy preview --project sindulis --expires 7d
npx firebase deploy --only hosting --project sindulis
```

Smoke-test the preview URL (public site, ERP login, create client → project → task → submit → approve) before running the last command.

## Local development

```bash
npm install
npm run emulators
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 npm run seed:demo
npm run dev:emulators
```

Run each in its own terminal. The ERP is at http://localhost:3000/erp. Demo logins are printed by the seed script (password `Demo@12345`). The seed script refuses to run against production.

## Recommended next steps

1. Blaze plan + Cloud Functions (`asia-south1`): scheduled reminders, custom claims, email and WhatsApp notifications.
2. Multi-level approvals (the data model already stores `level`).
3. Client portal using `clientVisible`, with a separate `CLIENT` role and rules.
4. Recurring tasks and task templates per department.
5. Attendance link for time entries.
6. Pagination and server-side aggregation (counters / `count()`) as data grows.
