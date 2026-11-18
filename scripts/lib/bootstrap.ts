import { getApps, initializeApp, applicationDefault, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

export const DEPARTMENTS: { id: string; name: string; code: string }[] = [
  { id: 'mkt', name: 'Marketing', code: 'MKT' },
  { id: 'sw', name: 'Software', code: 'SW' },
  { id: 'edu', name: 'Education', code: 'EDU' },
  { id: 'dsn', name: 'Design', code: 'DSN' },
  { id: 'vid', name: 'Video Production', code: 'VID' },
  { id: 'fo', name: 'Front Office', code: 'FO' },
  { id: 'hra', name: 'HR & Accounts', code: 'HRA' },
  { id: 'adm', name: 'Administration', code: 'ADM' },
];

export const usingEmulator = () => !!process.env.FIRESTORE_EMULATOR_HOST;

export function adminApp(projectId: string): App {
  if (getApps().length) return getApps()[0]!;
  // Emulators need no credentials; production uses Application Default Credentials
  // (GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json or `gcloud auth application-default login`).
  return usingEmulator() ? initializeApp({ projectId }) : initializeApp({ projectId, credential: applicationDefault() });
}

const audit = (by: string) => ({ createdAt: FieldValue.serverTimestamp(), createdBy: by, updatedAt: FieldValue.serverTimestamp(), updatedBy: by, isArchived: false });

export interface BootstrapResult {
  uid: string;
  created: boolean;
  resetLink: string | null;
  departmentsCreated: number;
}

/**
 * Idempotent: makes `email` a SUPER_ADMIN employee and seeds the default departments and settings.
 * Creates the Auth user if missing (password set via the returned reset link).
 */
export async function bootstrapSuperAdmin(projectId: string, email: string, name?: string, password?: string): Promise<BootstrapResult> {
  const app = adminApp(projectId);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const normalized = email.trim().toLowerCase();
  let created = false;
  let user = await auth.getUserByEmail(normalized).catch(() => null);
  if (!user) {
    user = await auth.createUser({ email: normalized, emailVerified: true, displayName: name, password: password ?? `${crypto.randomUUID()}Aa1!` });
    created = true;
  }
  await auth.setCustomUserClaims(user.uid, { ...(user.customClaims ?? {}), role: 'SUPER_ADMIN' });

  const empRef = db.doc(`employees/${user.uid}`);
  const existing = await empRef.get();
  await empRef.set(
    {
      name: name ?? existing.get('name') ?? user.displayName ?? normalized.split('@')[0],
      email: normalized,
      phone: existing.get('phone') ?? '',
      departmentId: existing.get('departmentId') ?? 'adm',
      role: 'SUPER_ADMIN',
      designation: existing.get('designation') ?? 'Super Administrator',
      managerId: null,
      active: true,
      avatarUrl: null,
      weeklyCapacityHours: existing.get('weeklyCapacityHours') ?? 40,
      ...(existing.exists ? { updatedAt: FieldValue.serverTimestamp(), updatedBy: 'bootstrap', isArchived: false } : audit('bootstrap')),
    },
    { merge: true },
  );

  let departmentsCreated = 0;
  for (const d of DEPARTMENTS) {
    const ref = db.doc(`departments/${d.id}`);
    if ((await ref.get()).exists) continue;
    await ref.set({ name: d.name, code: d.code, headId: null, active: true, ...audit('bootstrap') });
    departmentsCreated++;
  }
  const settings = db.doc('settings/org');
  if (!(await settings.get()).exists) {
    await settings.set({ orgName: 'SINDULIS', defaultWeeklyCapacityHours: 40, deadlineWarningHours: 24, allowMultipleAssignees: true, timeTrackingEnabled: true, updatedAt: FieldValue.serverTimestamp(), updatedBy: 'bootstrap' });
  }
  await db.collection('activity_logs').add({ entityType: 'employee', entityId: user.uid, projectId: null, departmentId: 'adm', action: 'bootstrap', summary: `Bootstrapped Super Admin ${normalized}`, before: null, after: null, actorId: user.uid, at: FieldValue.serverTimestamp() });

  const resetLink = created && !password ? await auth.generatePasswordResetLink(normalized).catch(() => null) : null;
  return { uid: user.uid, created, resetLink, departmentsCreated };
}
