import { onSnapshot, query, where, writeBatch } from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import type { Employee, Project, ProjectFile, Task } from '../types';
import { COL, asWriter, auditCreate, colRef, db, newDocRef, rowsOf, writeLog, type ErrorHandler } from './db';

export const MAX_FILE_BYTES = 25 * 1024 * 1024;

export function subscribeProjectFiles(projectId: string, onData: (rows: ProjectFile[]) => void, onError?: ErrorHandler) {
  return onSnapshot(query(colRef(COL.files), where('projectId', '==', projectId)), (s) => onData(rowsOf<ProjectFile>(s).sort((a, b) => (b.createdAt?.toMillis() ?? Date.now()) - (a.createdAt?.toMillis() ?? Date.now()))), onError);
}

const safeName = (name: string) => name.replace(/[^\w.\- ]+/g, '_').slice(0, 120) || 'file';

/**
 * Upload to Storage at projects/{projectId}/files/{fileId}/{name} and record metadata.
 * Re-uploading a file with the same name in the same scope creates a new version.
 */
export async function uploadProjectFile(
  actor: Employee,
  project: Project,
  task: Task | null,
  file: File,
  existing: ProjectFile[],
  onProgress?: (pct: number) => void,
): Promise<ProjectFile['id']> {
  if (file.size > MAX_FILE_BYTES) throw new Error('Files must be 25 MB or smaller');
  const name = safeName(file.name);
  const meta = newDocRef(COL.files);
  const path = `projects/${project.id}/files/${meta.id}/${name}`;
  const task_ = task?.id ?? null;
  const version = existing.filter((f) => f.name === name && f.taskId === task_).reduce((m, f) => Math.max(m, f.version), 0) + 1;
  await new Promise<void>((resolve, reject) => {
    const up = uploadBytesResumable(storageRef(storage, path), file, { contentType: file.type || 'application/octet-stream', customMetadata: { uploadedBy: actor.id } });
    up.on('state_changed', (s) => onProgress?.(Math.round((s.bytesTransferred / s.totalBytes) * 100)), reject, () => resolve());
  });
  const b = writeBatch(db);
  b.set(meta, { projectId: project.id, taskId: task_, name, storagePath: path, size: file.size, contentType: file.type || 'application/octet-stream', uploadedBy: actor.id, version, ...auditCreate(actor.id) });
  writeLog(asWriter(b), actor.id, { entityType: task ? 'task' : 'project', entityId: task?.id ?? project.id, projectId: project.id, departmentId: project.departmentId, action: 'file_uploaded', summary: `${actor.name} uploaded ${name} (v${version})` });
  await b.commit();
  return meta.id;
}

export function fileUrl(f: Pick<ProjectFile, 'storagePath'>): Promise<string> {
  return getDownloadURL(storageRef(storage, f.storagePath));
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
