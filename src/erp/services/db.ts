/** Core Firestore helpers shared by every service. UI code never imports firebase/firestore directly. */
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type DocumentReference,
  type FieldValue,
  type Query,
  type QuerySnapshot,
  type Transaction,
  type WriteBatch,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { NotificationType, WithId } from '../types';

export { db };

export const COL = {
  departments: 'departments',
  employees: 'employees',
  invites: 'invites',
  clients: 'clients',
  projects: 'projects',
  milestones: 'milestones',
  tasks: 'tasks',
  checklists: 'task_checklists',
  submissions: 'task_submissions',
  approvals: 'approvals',
  comments: 'task_comments',
  files: 'project_files',
  activity: 'activity_logs',
  notifications: 'notifications',
  time: 'work_time_entries',
  archive: 'archive_records',
  counters: 'counters',
  settings: 'settings',
  leads: 'leads',
} as const;
export type CollectionName = (typeof COL)[keyof typeof COL];

export const colRef = (name: CollectionName) => collection(db, name);
export const docRef = (name: CollectionName, id: string) => doc(db, name, id);
export const newDocRef = (name: CollectionName) => doc(collection(db, name));

export function rowsOf<T extends WithId>(snap: QuerySnapshot<DocumentData>): T[] {
  return snap.docs.map((d) => ({ ...(d.data() as Omit<T, 'id'>), id: d.id }) as T);
}

export type Unsubscribe = () => void;
export type ErrorHandler = (e: Error) => void;

/**
 * Subscribe to several queries and emit their union (deduplicated by id).
 * Used where rules require one query per scope (e.g. `projectId in [..30]` chunks).
 * Emits only after every query has reported once, so callers never see partial loads.
 */
export function subscribeUnion<T extends WithId>(
  queries: Query<DocumentData>[],
  onData: (rows: T[]) => void,
  onError?: ErrorHandler,
): Unsubscribe {
  if (queries.length === 0) {
    onData([]);
    return () => undefined;
  }
  const parts: (T[] | undefined)[] = queries.map(() => undefined);
  const emit = () => {
    if (parts.some((p) => p === undefined)) return;
    const merged = new Map<string, T>();
    for (const p of parts) for (const r of p ?? []) merged.set(r.id, r);
    onData(Array.from(merged.values()));
  };
  const unsubs = queries.map((q, i) =>
    onSnapshot(
      q,
      (snap) => {
        parts[i] = rowsOf<T>(snap);
        emit();
      },
      (err) => {
        parts[i] = [];
        emit();
        onError?.(err);
      },
    ),
  );
  return () => unsubs.forEach((u) => u());
}

export function chunk<T>(arr: T[], size = 30): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export interface AuditCreate {
  createdAt: FieldValue;
  createdBy: string;
  updatedAt: FieldValue;
  updatedBy: string;
  isArchived: false;
}
export const auditCreate = (uid: string): AuditCreate => ({
  createdAt: serverTimestamp(),
  createdBy: uid,
  updatedAt: serverTimestamp(),
  updatedBy: uid,
  isArchived: false,
});
export const touched = (uid: string) => ({ updatedAt: serverTimestamp(), updatedBy: uid });

/** Either a write batch or a transaction. */
export interface Writer {
  set(ref: DocumentReference<DocumentData>, data: DocumentData): unknown;
  update(ref: DocumentReference<DocumentData>, data: DocumentData): unknown;
}
export const asWriter = (w: WriteBatch | Transaction): Writer => w as unknown as Writer;

export interface LogEntry {
  entityType: string;
  entityId: string;
  projectId: string | null;
  departmentId: string | null;
  action: string;
  summary: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
}

/** Append-only audit trail entry, written in the same batch as the change it describes. */
export function writeLog(w: Writer, actorId: string, e: LogEntry): void {
  w.set(newDocRef(COL.activity), {
    entityType: e.entityType,
    entityId: e.entityId,
    projectId: e.projectId,
    departmentId: e.departmentId,
    action: e.action,
    summary: e.summary.slice(0, 500),
    before: e.before ?? null,
    after: e.after ?? null,
    actorId,
    at: serverTimestamp(),
  });
}

export interface NotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string;
}

/** In-app notification. People are not notified about their own actions unless allowSelf is set. */
export function writeNotification(w: Writer, actorId: string, n: NotificationInput, allowSelf = false, id?: string): void {
  if (!n.userId || (!allowSelf && n.userId === actorId)) return;
  w.set(id ? docRef(COL.notifications, id) : newDocRef(COL.notifications), {
    ...n,
    title: n.title.slice(0, 200),
    body: n.body.slice(0, 1000),
    read: false,
    createdAt: serverTimestamp(),
    createdBy: actorId,
  });
}

export function notifyMany(w: Writer, actorId: string, userIds: string[], n: Omit<NotificationInput, 'userId'>): void {
  for (const userId of new Set(userIds)) writeNotification(w, actorId, { ...n, userId });
}

/** Next value of a human-readable sequence, inside a transaction. */
export async function nextSequence(tx: Transaction, name: 'clients' | 'projects' | 'tasks'): Promise<number> {
  const ref = docRef(COL.counters, name);
  const snap = await tx.get(ref);
  const next = snap.exists() ? Number(snap.data().value ?? 0) + 1 : 1;
  tx.set(ref, { value: next });
  return next;
}

export const formatCode = (prefix: string, n: number, pad: number) => `${prefix}-${String(n).padStart(pad, '0')}`;

/** Only the keys whose values differ (for activity log before/after). */
export function diffFields(before: object, after: object): { before: Record<string, unknown>; after: Record<string, unknown> } | null {
  const b: Record<string, unknown> = {};
  const a: Record<string, unknown> = {};
  const bRec = before as Record<string, unknown>;
  const aRec = after as Record<string, unknown>;
  for (const key of Object.keys(aRec)) {
    const prev = bRec[key];
    const next = aRec[key];
    const norm = (v: unknown) =>
      v && typeof v === 'object' && 'toMillis' in (v as object)
        ? (v as { toMillis(): number }).toMillis()
        : v instanceof Date
          ? v.getTime()
          : JSON.stringify(v ?? null);
    if (norm(prev) !== norm(next)) {
      const plain = (v: unknown) => (v instanceof Date ? v.toISOString() : v && typeof v === 'object' && 'toDate' in (v as object) ? (v as { toDate(): Date }).toDate().toISOString() : (v ?? null));
      b[key] = plain(prev);
      a[key] = plain(next);
    }
  }
  return Object.keys(a).length ? { before: b, after: a } : null;
}
