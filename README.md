# Sindulis Cloud Solutions

Public website (Sindulis portal · Tech Lis · Sinfox Media · EduLis) at `/`, and **SINDULIS ERP — Work Management** at `/erp`.
Vite + React 19 + TypeScript + Tailwind v4 on Firebase (Auth, Firestore, Storage, Hosting), project `sindulis`.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server against production Firebase |
| `npm run emulators` + `npm run dev:emulators` | Dev against local emulators (seed with `npm run seed:demo`) |
| `npm run lint` | Typecheck (public site + strict ERP) |
| `npm test` | Unit tests |
| `npm run test:rules` | Firestore/Storage security-rules tests in the emulator |
| `npm run test:e2e` | Browser acceptance test against the emulators (needs Playwright) |
| `npm run build` | Production build to `dist/` |
| `npm run bootstrap:super-admin -- you@company.com` | Create the first Super Admin + default departments |

Docs: `docs/WORK_MANAGEMENT_REPORT.md` (status, rules, owner actions), `docs/WORK_MANAGEMENT_PROGRESS.md` (decisions log).
