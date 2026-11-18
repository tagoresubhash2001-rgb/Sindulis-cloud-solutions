# SINDULIS ERP — Work Management: progress log

Running log for the build described in `WORK_MANAGEMENT_BUILD_PROMPT.md`.

## Phase 1 — Audit (done)

**Repository**
- Vite 6 + React 19 + TS 5.8 + Tailwind v4 + lucide + motion. No router. Public site = `src/App.tsx` (view switching via `useState`).
- `LoginModal` was a fake (setTimeout) login. All 7 public forms (portal waitlist, Tech Lis contact/quote, Sinfox contact/quote, EduLis contact/enroll) only flipped a `submitted` flag.
- Baseline `npm run lint` passed only because `@types/react` was not installed. Once installed, 10 pre-existing type errors appeared in the public site: props that were passed but not declared (`onNavigate`, `onOpenLogin`, `onShowToast`), `fetchpriority` instead of `fetchPriority`, and a motion `ease` tuple. All fixed, with no visual change.
  Two of them were real bugs: the portal CTA "Login" button had no handler wired, and "Launch Workspace" in the pillar modal threw on click.
- Baseline public bundle: 1,011 kB (259 kB gzip), one chunk.

**Firebase project `sindulis`** (from the Firebase MCP environment)
- Billing: **not enabled → Spark plan**. No Cloud Functions. Notifications and deadline reminders are written client-side in the same batch as the action / on app load (see decisions).
- Storage bucket is `sindulis.firebasestorage.app`. Buckets in this format need the **Blaze** plan, so file uploads in production need Blaze (or an existing no-cost bucket). Files are fully implemented and tested against the emulator.
- This container has **no Firebase CLI credentials**, so deploys need the owner to sign in (see report).

## Architecture decisions

| Decision | Choice | Why |
|---|---|---|
| Routing | `react-router-dom` in `main.tsx`; `/erp/*` → lazy `ErpApp`; everything else → existing `App` unchanged | Public site untouched; ERP is a separate chunk |
| Data layer | `src/erp/services/*` (one per collection) + `src/erp/hooks/*`; UI never imports `firebase/firestore` | Brief §2.4 |
| Validation | zod schemas in `src/erp/lib/schemas.ts`, parsed in every service write | Brief §2.4 |
| Roles | `employees/{uid}.role`, read in rules via `get()` | Spark plan → no custom-claims function |
| Query scoping | Every list query is shaped so rules can prove it: `projectId in [≤30]`, `assigneeIds array-contains me`, `departmentId == myDept` | Firestore rules are not filters; verified with an emulator probe |
| Workflow | Pure engine `src/erp/lib/workflow.ts` (unit tested), executed by `services/workflow.ts` as one batch: task + submission/approval + activity log + notifications | Brief §7 |
| Self-approval | Reviewer path blocked if the reviewer is also an assignee (managers may still approve) | Separation of duties |
| Invites | Admin creates `invites/{email}` + an Email/Password account via a secondary app (admin stays signed in), which sends verification + password-set emails. First **verified** sign-in claims the invite (rules check token email, `email_verified`, and the invited role) | No self-signup; works with Google too; no Functions needed |
| Reminders | Each user creates their own "due soon/overdue" notifications on load (deterministic ids, once/day) | Spark plan substitute for the hourly scheduled job |
| Project progress | Computed from tasks at read time (not stored) | Assignees can't write projects; avoids drift |
| Deletes | Only `SUPER_ADMIN`, via Archive Center; everything else is soft-archived | Brief §2.8 |
| Strict TS | `tsconfig.erp.json` (strict) for `src/erp/**`; public site keeps its existing config | Brief §8 |

## Phase status

| # | Phase | Status |
|---|---|---|
| 1 | Audit + plan | ✅ |
| 2 | Router, real Auth, roles | ✅ router + LoginModal on Firebase Auth; ERP shell in progress |
| 3 | Data model, services, zod, counters, rules + rules tests | ✅ 46 rules tests (41 Firestore + 5 Storage) pass in the emulator; 36 unit tests pass |
| 4–12 | UI modules | in progress |
| 13 | Testing, CI/CD, deploy | pending |

## Notes for local testing in a proxied sandbox
`firebase-tools` routes its own loopback calls (Storage emulator → Firestore emulator) through `HTTPS_PROXY` and ignores `NO_PROXY`. Here the cross-service storage rules were tested with a local preload shim that sends only loopback traffic directly. CI runners have no proxy, so they don't need it.
