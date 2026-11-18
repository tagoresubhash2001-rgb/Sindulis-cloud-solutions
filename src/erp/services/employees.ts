import { deleteApp, initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  type User,
} from 'firebase/auth';
import { getDoc, onSnapshot, query, serverTimestamp, writeBatch } from 'firebase/firestore';
import { firebaseConfig, usingEmulators } from '../../lib/firebase';
import { employeeUpdateSchema, inviteSchema, type EmployeeUpdateInput, type InviteInput } from '../lib/schemas';
import { DEFAULT_SETTINGS, type Employee, type Invite } from '../types';
import { COL, asWriter, auditCreate, colRef, db, diffFields, docRef, rowsOf, touched, writeLog, type ErrorHandler } from './db';

export function subscribeEmployees(onData: (rows: Employee[]) => void, onError?: ErrorHandler) {
  return onSnapshot(query(colRef(COL.employees)), (s) => onData(rowsOf<Employee>(s)), onError);
}

export function subscribeEmployee(uid: string, onData: (e: Employee | null) => void, onError?: ErrorHandler) {
  return onSnapshot(
    docRef(COL.employees, uid),
    (s) => onData(s.exists() ? ({ ...(s.data() as Omit<Employee, 'id'>), id: s.id }) : null),
    onError,
  );
}

export function subscribeInvites(onData: (rows: Invite[]) => void, onError?: ErrorHandler) {
  return onSnapshot(query(colRef(COL.invites)), (s) => onData(rowsOf<Invite>(s)), onError);
}

export async function updateEmployee(actor: Employee, emp: Employee, input: EmployeeUpdateInput): Promise<void> {
  const data = employeeUpdateSchema.parse(input);
  if (emp.id === actor.id && (data.role !== emp.role || !data.active)) {
    throw new Error('You cannot change your own role or deactivate yourself');
  }
  const diff = diffFields(emp, data);
  if (!diff) return;
  const b = writeBatch(db);
  b.update(docRef(COL.employees, emp.id), { ...data, ...touched(actor.id) });
  writeLog(asWriter(b), actor.id, {
    entityType: 'employee',
    entityId: emp.id,
    projectId: null,
    departmentId: data.departmentId,
    action: diff.after.role ? 'role_changed' : 'updated',
    summary: `Updated employee ${data.name}`,
    ...diff,
  });
  await b.commit();
}

export async function updateOwnProfile(actor: Employee, input: { name: string; phone: string }): Promise<void> {
  const name = input.name.trim();
  if (!name) throw new Error('Name is required');
  const b = writeBatch(db);
  b.update(docRef(COL.employees, actor.id), { name: name.slice(0, 100), phone: input.phone.trim().slice(0, 30), ...touched(actor.id) });
  await b.commit();
}

const randomPassword = () => {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('') + 'Aa1!';
};

export interface InviteResult {
  accountCreated: boolean;
  message: string;
}

/**
 * Invite an employee. Creates an `invites/{email}` record (claimed on first verified sign-in)
 * and, without signing the admin out, an Email/Password account with a random password via a
 * secondary Firebase app. The invitee receives a verification email and a password-reset link.
 * Google sign-in with the same address also works once the email is verified.
 */
export async function inviteEmployee(actor: Employee, input: InviteInput): Promise<InviteResult> {
  const data = inviteSchema.parse(input);
  const existing = await getDoc(docRef(COL.invites, data.email));
  if (existing.exists()) throw new Error('This email has already been invited');

  const b = writeBatch(db);
  b.set(docRef(COL.invites, data.email), { ...data, claimedBy: null, ...auditCreate(actor.id) });
  writeLog(asWriter(b), actor.id, {
    entityType: 'invite',
    entityId: data.email,
    projectId: null,
    departmentId: data.departmentId,
    action: 'invited',
    summary: `Invited ${data.name} (${data.email}) as ${data.role}`,
  });
  await b.commit();

  const secondary = initializeApp(firebaseConfig, `invite-${Date.now()}`);
  const secAuth = getAuth(secondary);
  if (usingEmulators) connectAuthEmulator(secAuth, 'http://127.0.0.1:9099', { disableWarnings: true });
  try {
    const cred = await createUserWithEmailAndPassword(secAuth, data.email, randomPassword());
    await sendEmailVerification(cred.user);
    await sendPasswordResetEmail(secAuth, data.email);
    return { accountCreated: true, message: `Invitation sent to ${data.email}. They will receive a verification email and a link to set their password.` };
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === 'auth/email-already-in-use') {
      return {
        accountCreated: false,
        message: `${data.email} already has a login. The invite is recorded; they get access the next time they sign in with a verified email.`,
      };
    }
    if (code === 'auth/operation-not-allowed') {
      return { accountCreated: false, message: 'Invite saved, but Email/Password sign-in is disabled in Firebase Auth. They can sign in with Google instead.' };
    }
    throw err;
  } finally {
    await signOut(secAuth).catch(() => undefined);
    await deleteApp(secondary).catch(() => undefined);
  }
}

/**
 * First sign-in: turn an unclaimed invite for this verified email into an employee record.
 * Returns the created employee id, or null if there is no invite.
 */
export async function claimInvite(user: User): Promise<string | null> {
  const email = user.email?.toLowerCase();
  if (!email) return null;
  const snap = await getDoc(docRef(COL.invites, email)).catch(() => null);
  if (!snap || !snap.exists()) return null;
  const inv = snap.data() as Omit<Invite, 'id'>;
  if (inv.claimedBy) return null;
  const b = writeBatch(db);
  b.set(docRef(COL.employees, user.uid), {
    name: inv.name,
    email,
    phone: '',
    departmentId: inv.departmentId,
    role: inv.role,
    designation: inv.designation,
    managerId: null,
    active: true,
    avatarUrl: user.photoURL ?? null,
    weeklyCapacityHours: DEFAULT_SETTINGS.defaultWeeklyCapacityHours,
    ...auditCreate(user.uid),
  });
  b.update(docRef(COL.invites, email), { claimedBy: user.uid, claimedAt: serverTimestamp() });
  writeLog(asWriter(b), user.uid, {
    entityType: 'employee',
    entityId: user.uid,
    projectId: null,
    departmentId: inv.departmentId,
    action: 'joined',
    summary: `${inv.name} accepted the invitation`,
  });
  await b.commit();
  return user.uid;
}
