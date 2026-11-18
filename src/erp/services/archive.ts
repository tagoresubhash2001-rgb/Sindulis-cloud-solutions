import { deleteDoc, onSnapshot, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { isAdmin } from '../lib/permissions';
import type { ArchiveRecord, Employee } from '../types';
import { COL, asWriter, colRef, db, docRef, newDocRef, rowsOf, writeLog, type CollectionName, type ErrorHandler } from './db';

export const ARCHIVABLE: { col: CollectionName; label: string }[] = [
  { col: COL.projects, label: 'Projects' },
  { col: COL.tasks, label: 'Tasks' },
  { col: COL.files, label: 'Documents' },
  { col: COL.submissions, label: 'Submissions' },
  { col: COL.approvals, label: 'Approval history' },
  { col: COL.comments, label: 'Comments' },
  { col: COL.milestones, label: 'Milestones' },
  { col: COL.clients, label: 'Clients' },
];

export function subscribeArchive(me: Employee, onData: (rows: ArchiveRecord[]) => void, onError?: ErrorHandler) {
  const c = colRef(COL.archive);
  const q = isAdmin(me) ? query(c) : query(c, where('departmentId', '==', me.departmentId ?? '__none__'));
  return onSnapshot(q, (s) => onData(rowsOf<ArchiveRecord>(s).sort((a, b) => (b.archivedAt?.toMillis() ?? Date.now()) - (a.archivedAt?.toMillis() ?? Date.now()))), onError);
}

export interface Archivable {
  id: string;
  projectId?: string | null;
  departmentId?: string | null;
  status?: string;
  ownerId?: string;
  projectManagerId?: string;
  code?: string;
  name?: string;
  title?: string;
}

/** Soft archive: flag the record read-only and index it in archive_records (one batch). */
export async function archiveEntity(actor: Employee, col: CollectionName, e: Archivable, finalStatus?: string): Promise<void> {
  const projectId = col === COL.projects ? e.id : (e.projectId ?? null);
  const title = [e.code, e.name ?? e.title].filter(Boolean).join(' ') || e.id;
  const b = writeBatch(db);
  b.update(docRef(col, e.id), { isArchived: true, archivedAt: serverTimestamp(), archivedBy: actor.id, updatedAt: serverTimestamp(), updatedBy: actor.id });
  b.set(newDocRef(COL.archive), {
    originalCollection: col,
    originalId: e.id,
    originalProjectId: projectId,
    departmentId: e.departmentId ?? null,
    title,
    finalStatus: finalStatus ?? e.status ?? 'ARCHIVED',
    historicalOwnerId: e.ownerId ?? e.projectManagerId ?? null,
    archivedAt: serverTimestamp(),
    archivedBy: actor.id,
    documentRefs: [`${col}/${e.id}`],
    restoredAt: null,
    restoredBy: null,
  });
  writeLog(asWriter(b), actor.id, { entityType: col, entityId: e.id, projectId, departmentId: e.departmentId ?? null, action: 'archived', summary: `Archived ${title}` });
  await b.commit();
}

export async function restoreEntity(actor: Employee, r: ArchiveRecord): Promise<void> {
  const col = r.originalCollection as CollectionName;
  const b = writeBatch(db);
  b.update(docRef(col, r.originalId), { isArchived: false, archivedAt: null, archivedBy: null, updatedAt: serverTimestamp(), updatedBy: actor.id });
  b.update(docRef(COL.archive, r.id), { restoredAt: serverTimestamp(), restoredBy: actor.id });
  writeLog(asWriter(b), actor.id, { entityType: col, entityId: r.originalId, projectId: r.originalProjectId, departmentId: r.departmentId, action: 'restored', summary: `Restored ${r.title}` });
  await b.commit();
}

/** Super Admin only (enforced by rules). Removes the record and its archive index entry. */
export async function permanentlyDelete(actor: Employee, r: ArchiveRecord): Promise<void> {
  const col = r.originalCollection as CollectionName;
  const b = writeBatch(db);
  writeLog(asWriter(b), actor.id, { entityType: col, entityId: r.originalId, projectId: r.originalProjectId, departmentId: r.departmentId, action: 'permanently_deleted', summary: `Permanently deleted ${r.title}` });
  await b.commit();
  await deleteDoc(docRef(col, r.originalId));
  await deleteDoc(docRef(COL.archive, r.id));
}
