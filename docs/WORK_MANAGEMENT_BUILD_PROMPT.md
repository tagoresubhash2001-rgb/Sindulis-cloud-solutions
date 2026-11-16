# SINDULIS ERP — Work Management System: Build & Deploy Brief for Claude Code

> Paste the short kick-off prompt at the bottom of this file into Claude Code,
> or tell Claude Code: "Read docs/WORK_MANAGEMENT_BUILD_PROMPT.md and execute it."

---

## 0. Role & ground rules

Act as a Senior ERP Architect, Full-stack Engineer, Product Designer and Firebase specialist.

- Repository: `tagoresubhash2001-rgb/Sindulis-cloud-solutions` (branch `main`).
- Firebase project: **`sindulis`** (web config already in `src/lib/firebase.ts`).
- Owner has authorised you to commit, push, open PRs and deploy to Firebase without asking each time. Still: never delete production data, and always deploy to a **preview channel first**, verify, then promote to live.
- Do not claim a feature is done unless it is implemented AND tested.
- Work in phases. After each phase: `npm run lint`, `npm run build`, run tests, commit with a clear message, push.
- Write a running log in `docs/WORK_MANAGEMENT_PROGRESS.md` (what's done, what's pending, decisions made).

## 1. Current state of the repo (audit this first, do not assume)

- Vite 6 + React 19 + TypeScript + Tailwind CSS v4 + lucide-react. No router yet.
- `src/App.tsx` is the public marketing site (Sindulis portal + Tech Lis + Sinfox Media + Edulis) switched by `useState` views — **this must keep working exactly as it does now**.
- `src/components/LoginModal.tsx` is a fake login (no real auth). Contact / Quote / Waitlist / Enroll forms don't save anywhere.
- `src/lib/firebase.ts` exports `app`, `db`, `auth`, `storage`, `analytics` for project `sindulis`.
- `firebase.json` hosts `dist/` with SPA rewrite `** → /index.html`. `.firebaserc` default = `sindulis`.
- There is **no ERP yet**. You are building the Work Management module as the first module of SINDULIS ERP, inside this same repo.

## 2. Architecture decisions (already decided — follow these)

1. **Same app, new area:** add `react-router-dom`. Public site stays at `/` (render existing `App` unchanged as the `/` route). ERP lives under **`/erp/*`**, lazy-loaded (`React.lazy`) so the public site bundle does not grow.
2. **Login:** the existing LoginModal gets real Firebase Auth (Email/Password + Google). After login → `/erp`. Add a dedicated `/erp/login` page too. No public self-signup into the ERP; employees are invited by Admin.
3. **Data:** Firestore only (no production data in LocalStorage). Files in Firebase Storage. Real-time via `onSnapshot`.
4. **State/data layer:** a typed service layer `src/erp/services/*` (one file per collection) + React hooks `src/erp/hooks/*`. Use `zod` for validation of every write. UI never calls Firestore directly.
5. **Permissions enforced in Firestore & Storage security rules**, not only in UI.
6. **Roles:** stored on `employees/{uid}.role` and mirrored to Auth custom claims if Cloud Functions are available (see §9). Rules read the employee doc via `get()` as the fallback.
7. **Unified status engine** for every department: `PENDING → IN_PROGRESS → WAITING_APPROVAL → COMPLETED`, plus `CANCELLED` (reason required). Rejection sends a task back to `IN_PROGRESS` with feedback and increments `revisionCount`.
8. **Archive = soft archive.** Records get `isArchived: true`, `archivedAt`, `archivedBy`, and a reference doc in `archive_records`. Nothing is hard-deleted except by Super Admin through an explicit confirmed action.
9. **Open questions — use these defaults for v1** (make them configurable in Settings where cheap):
   - Multiple assignees per task: **YES** (`assigneeIds[]`, one `ownerId` = primary responsible).
   - Time tracking: **optional** (`work_time_entries`, manual log + start/stop timer). Not linked to attendance in v1.
   - Approval: **single-level** (task `reviewerId`). Data model must allow multi-level later (`approvals` stores `level`).
   - Client portal: **NO** in v1 (keep `clientVisible` flag on projects for later).
   - Recurring tasks: **NO** in v1.
   - Task dependencies: **simple** `blockedByTaskIds[]` with a warning, no auto-scheduling.
   - KPI scoring: basic metrics only (on-time %, completed count, avg approval cycles, overdue count).

## 3. Hierarchy & data rules

```
Client → Project → Milestones → Tasks → Assigned Employees
       → Work Submission → Review → Approval → Completion → Archive
```

- Every project belongs to a client, a department, and has a projectManagerId.
- Every task belongs to a project (milestone optional), has an owner.
- Employee IDs = Firebase Auth UID everywhere.
- Every important change writes an `activity_logs` entry with `serverTimestamp()`.
- Human-readable IDs: `PRJ-0001`, `TSK-00001`, `CLI-0001` generated with a Firestore transaction on `counters/{name}`.

## 4. Firestore collections (top-level, all with `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `isArchived`)

| Collection | Key fields |
|---|---|
| `departments` | name, code, headId, active |
| `employees` (doc id = uid) | name, email, phone, departmentId, role, designation, managerId, active, avatarUrl |
| `clients` | code, name, company, contactPerson, phone, email, address, departmentIds[], status |
| `projects` | code, name, clientId, departmentId, projectManagerId, memberIds[], startDate, endDate, priority, budget, description, status (PLANNING/ACTIVE/ON_HOLD/COMPLETED/CANCELLED), progress, clientVisible |
| `milestones` | projectId, title, description, dueDate, order, status, deliverables[] |
| `tasks` | code, title, description, projectId, milestoneId, departmentId, ownerId, assigneeIds[], reviewerId, priority (LOW/MEDIUM/HIGH/URGENT), startDate, dueDate, estimatedHours, actualHours, status, checklistTotal, checklistDone, blockedByTaskIds[], revisionCount, completedAt, cancelReason, tags[] |
| `task_checklists` | taskId, text, done, doneBy, doneAt, order |
| `task_submissions` | taskId, submittedBy, note, fileRefs[], version, status (SUBMITTED/APPROVED/REJECTED) |
| `approvals` | entityType, entityId, level, reviewerId, decision (APPROVED/REJECTED/CHANGES_REQUESTED), comment, decidedAt |
| `task_comments` | taskId / projectId, authorId, body, mentions[], editedAt |
| `project_files` | projectId, taskId?, name, storagePath, size, contentType, uploadedBy, version |
| `activity_logs` | entityType, entityId, projectId, action, before, after, actorId, at (serverTimestamp) — **append-only** |
| `notifications` | userId, type, title, body, link, read, createdAt |
| `work_time_entries` | taskId, employeeId, start, end, minutes, note |
| `archive_records` | originalCollection, originalId, originalProjectId, departmentId, finalStatus, historicalOwnerId, archivedAt, archivedBy, documentRefs[] |
| `counters` | next value per sequence |
| `settings` | org-level config (statuses colours, defaults) |

Create `firestore.indexes.json` for every compound query you use (e.g. tasks by assigneeIds array-contains + status + dueDate; tasks by projectId + status; notifications by userId + read + createdAt) and deploy it.

## 5. Roles & permissions

| Role | Can |
|---|---|
| SUPER_ADMIN | everything, incl. permanent delete & role management |
| ADMIN | all departments/projects, employees, settings, archive/restore, reports |
| DEPARTMENT_HEAD | everything inside own department |
| PROJECT_MANAGER | projects they manage: create/edit tasks, milestones, assign, approve/reject, extend deadlines |
| TEAM_LEADER | assign & review tasks in projects they're a member of |
| EMPLOYEE | read projects they belong to; update status/checklist/time/comments/files on tasks where they are assignee; submit work. Cannot delete or edit others' tasks |
| VIEWER | read-only on permitted records |

Rules must enforce: department scoping, project membership, assignee-only task updates (field-level: employees may only change `status` (legal transitions only), checklist, actualHours, updatedAt/By), reviewer-only approvals, append-only activity logs, no deletes except SUPER_ADMIN, archived records read-only.

**Bootstrap:** write `scripts/bootstrap-super-admin.ts` (firebase-admin) that takes an email from an env var / CLI arg and creates the `employees/{uid}` doc with role SUPER_ADMIN + seeds departments (Marketing, Software, Education, Design, Video Production, Front Office, HR & Accounts, Administration). Do not hardcode personal emails in the repo. Also provide an optional `scripts/seed-demo.ts` for demo data — **run demo seed only against the emulator**, never production.

## 6. Screens (ERP shell under `/erp`)

Shell: left sidebar (collapsible, mobile drawer), top bar with global search (Ctrl/⌘+K), quick-create (+ Task / Project / Client), notifications bell, profile menu. Professional white enterprise UI, consistent status colours, loading / empty / error states, confirm dialogs for destructive actions. Fully responsive (desktop, tablet, mobile).

1. **Work Dashboard** `/erp` — KPI cards (Total/Active/Completed projects, Total/Pending/In progress/Overdue/Pending approval/Completed tasks), employee workload chart, department performance, upcoming deadlines, recent activity.
2. **Projects** `/erp/projects` (table + cards, filters) and **Project Workspace** `/erp/projects/:id` with tabs: Overview, Timeline (Gantt-style), Tasks, Kanban, Calendar, Files, Discussions, Approvals, Reports, Activity Logs.
3. **Tasks** `/erp/tasks` — Table, Kanban (drag & drop changes status with rule-valid transitions), Calendar, Timeline views; advanced filters (project, department, assignee, priority, status, due range, overdue); task detail drawer with checklist, files, comments (@mentions), submissions & revisions, time log, history.
4. **My Workspace** `/erp/my` — My tasks, Today, Upcoming, Overdue, In progress, Waiting approval, Completed, My projects, My calendar, My performance. Actions: start task, update checklist/progress, log time, upload, comment, submit, see feedback, resubmit.
5. **Team Management** `/erp/team` — department-wise allocation, workload per employee (open tasks, hours estimated vs capacity), reassign.
6. **Milestones** `/erp/milestones` — per project, progress auto-computed from tasks.
7. **Calendar & Timeline** `/erp/calendar`.
8. **Approvals & Reviews** `/erp/approvals` — queue for the current reviewer; approve / reject / request changes with comment; history.
9. **Files & Documents** `/erp/files` — Storage-backed, versioned, permission-aware.
10. **Discussions** — per project/task threads.
11. **Activity Logs** `/erp/activity` — filterable audit trail.
12. **Notifications** `/erp/notifications` — in-app (real-time). Triggers: task assigned / reassigned, deadline approaching (24h), overdue, submitted, approved, rejected, milestone completed, project deadline approaching, new comment/mention, approval pending.
13. **Reports & Analytics** `/erp/reports` — Daily/Weekly/Monthly work report, department performance, employee performance, project completion, delayed tasks, approvals pending, workload distribution, timeline report. Export CSV and print-to-PDF.
14. **Archive Center** `/erp/archive` — categories: completed/cancelled projects & tasks, documents, submissions, approval history, employee work history, comments, activity logs. Search, filter by project/employee/department/date, restore (Admin+), permanent delete (Super Admin, typed confirmation).
15. **Admin** `/erp/admin` — employees (invite, role, department, deactivate), departments, clients, settings.

Also: wire the public site's Contact / Quote / Waitlist / Enroll forms to save into a `leads` collection (create-only for public, read for Admin) and show them under `/erp/admin/leads`. Wire LoginModal to real auth.

## 7. Workflow logic (implement in a single `workflow` service, unit-tested)

- Legal transitions: PENDING→IN_PROGRESS; IN_PROGRESS→WAITING_APPROVAL (creates `task_submissions` + `approvals` request, notifies reviewer); WAITING_APPROVAL→COMPLETED (reviewer approves; sets completedAt); WAITING_APPROVAL→IN_PROGRESS (reject / changes requested, feedback required, revisionCount++); any→CANCELLED (manager+, reason required); COMPLETED→IN_PROGRESS only by manager (reopen, logged).
- Project progress = completed tasks / non-cancelled tasks; milestone progress likewise.
- Overdue = dueDate < now and status not in (COMPLETED, CANCELLED).
- Every transition: batch/transaction that updates the task + writes activity log + creates notifications.

## 8. Tech requirements

- Add deps as needed: `react-router-dom`, `zod`, `date-fns`, `@dnd-kit/core` (Kanban), `recharts` (charts), `firebase-admin` + `tsx` (scripts, devDependencies), `vitest` + `@testing-library/react`, `@firebase/rules-unit-testing`.
- Keep Tailwind v4; reuse existing design tokens where sensible, but the ERP uses a clean white enterprise theme.
- Code splitting: ERP chunks lazy-loaded; public site bundle must not grow significantly.
- TypeScript strict for `src/erp/**`. No `any` in services.
- Folder layout: `src/erp/{routes,layouts,pages,components,services,hooks,lib,types}`.

## 9. Firebase setup & deployment

1. `firebase use sindulis`. Check what is live first: `firebase hosting:sites:list --project sindulis` and `firebase hosting:channel:list`. Confirm whether `sindulis.web.app` belongs to project `sindulis`. If the live site is in a different project, report it in the progress log and deploy only to `sindulis` preview channel until the owner confirms.
2. Make sure Firestore (Native mode), Storage and Authentication (Email/Password + Google providers) are enabled. If a console-only step is required, list it clearly in the final report.
3. Check the billing plan. **If Blaze is active:** add `functions/` (TypeScript, Node 20, region `asia-south1`) for: custom claims sync on employee role change, scheduled job (hourly) for deadline-approaching / overdue notifications, activity-log & notification fan-out triggers. **If Spark:** implement the same logic client-side (notifications written in the same batch as the action; deadline/overdue computed on dashboard load) and note that the scheduled reminders need Blaze.
4. Write `firestore.rules`, `storage.rules`, `firestore.indexes.json`; update `firebase.json` to include firestore, storage, (functions), hosting and emulators.
5. Test rules with the Emulator Suite + `@firebase/rules-unit-testing` (allowed AND denied cases for each role).
6. Deploy order: `firebase deploy --only firestore:rules,firestore:indexes,storage` → `firebase hosting:channel:deploy preview` → smoke-test the preview URL (public site + ERP login + create client/project/task/submit/approve) → `firebase deploy --only hosting` (and functions if any).
7. Add GitHub Actions: on PR → lint, typecheck, test, build, deploy to a Firebase preview channel; on push to `main` → deploy to live. Use `FirebaseExtended/action-hosting-deploy`. Tell the owner exactly which secret to add (`FIREBASE_SERVICE_ACCOUNT_SINDULIS`) — never commit credentials.

## 10. Phases (commit + push after each)

| # | Phase | Priority |
|---|---|---|
| 1 | Audit repo + Firebase project, write plan in progress log | Critical |
| 2 | Router, ERP shell, real Auth, roles, bootstrap script | Critical |
| 3 | Data model, services, zod schemas, counters, rules v1 + rules tests | Critical |
| 4 | Clients, Projects, Project Workspace | Critical |
| 5 | Tasks (table/kanban/calendar/timeline), checklist, workflow engine | Critical |
| 6 | My Workspace, Team Management, Milestones | High |
| 7 | Submissions, Approvals & Reviews | High |
| 8 | Files (Storage), Discussions, Activity Logs | High |
| 9 | Archive Center | High |
| 10 | Notifications (+ Functions if Blaze) | Medium |
| 11 | Dashboard KPIs, Reports & Analytics, exports | Medium |
| 12 | Public site forms → leads, LoginModal → real auth | Medium |
| 13 | Full testing, security review, CI/CD, preview → live deploy | Critical |

## 11. Acceptance checklist (verify each before the final report)

- [ ] Public site at `/` looks and behaves exactly as before.
- [ ] Super Admin can log in, invite employees, create departments, clients, projects, milestones, tasks.
- [ ] Employee sees only own tasks/projects; cannot edit others' tasks or approve.
- [ ] Full cycle works: assign → start → checklist → submit → reject with feedback → resubmit → approve → complete → archive → restore.
- [ ] Data persists after refresh; two browsers sync in real time.
- [ ] Unauthorized reads/writes are denied by rules (proved by emulator tests).
- [ ] Files upload/download respect permissions.
- [ ] Notifications appear for every trigger in §6.12.
- [ ] Dashboard KPIs and reports match the underlying data.
- [ ] Mobile layout usable at 375px width.
- [ ] Lint, typecheck, unit + rules tests, build all pass in CI.
- [ ] Deployed to preview, verified, then live; URLs recorded.

## 12. Final report

Finish with `docs/WORK_MANAGEMENT_REPORT.md`: what was built, screenshots/URLs (preview + live), Firebase resources deployed, rules summary, tests run & results, known limitations, console steps the owner must do, and recommended next steps (client portal, recurring tasks, multi-level approvals, WhatsApp/email notifications, attendance link).

---

## Kick-off prompt (paste this into Claude Code)

```
Repo: tagoresubhash2001-rgb/Sindulis-cloud-solutions (branch main). Firebase project: sindulis.

Read docs/WORK_MANAGEMENT_BUILD_PROMPT.md fully and execute it end to end.
Build the complete SINDULIS ERP Work Management System described there under /erp,
without breaking the existing public website at /.

Rules:
- Audit first, write the plan to docs/WORK_MANAGEMENT_PROGRESS.md, then build phase by phase.
- After every phase: lint, typecheck, tests, build, commit and push to GitHub.
- Enforce permissions in Firestore/Storage rules and prove them with emulator tests.
- Deploy rules/indexes/storage, then a Firebase Hosting preview channel, verify, then deploy live.
- Never delete production data. Never commit secrets. Don't claim anything is done unless it's tested.
- If something needs the Firebase console or a GitHub secret, list it clearly for me.
- End with docs/WORK_MANAGEMENT_REPORT.md and the preview + live URLs.
```
