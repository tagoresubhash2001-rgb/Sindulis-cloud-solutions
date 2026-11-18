import { onSnapshot, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { commentSchema, extractMentions } from '../lib/schemas';
import type { Comment, Employee, Project, Task } from '../types';
import { COL, asWriter, auditCreate, colRef, db, docRef, newDocRef, notifyMany, rowsOf, touched, writeLog, type ErrorHandler } from './db';

/** Thread for a task (taskId) or the project-level discussion (taskId = null). */
export function subscribeComments(projectId: string, taskId: string | null, onData: (rows: Comment[]) => void, onError?: ErrorHandler) {
  const q = query(colRef(COL.comments), where('projectId', '==', projectId), where('taskId', '==', taskId));
  return onSnapshot(q, (s) => onData(rowsOf<Comment>(s).filter((c) => !c.isArchived).sort((a, b) => (a.createdAt?.toMillis() ?? Date.now()) - (b.createdAt?.toMillis() ?? Date.now()))), onError);
}

export function subscribeProjectComments(projectId: string, onData: (rows: Comment[]) => void, onError?: ErrorHandler) {
  return onSnapshot(query(colRef(COL.comments), where('projectId', '==', projectId)), (s) => onData(rowsOf<Comment>(s)), onError);
}

export async function addComment(actor: Employee, project: Project, task: Task | null, body: string, people: Employee[]): Promise<void> {
  const { body: clean } = commentSchema.parse({ body });
  const mentions = extractMentions(clean, people).filter((id) => project.memberIds.includes(id) || people.find((p) => p.id === id && (p.role === 'ADMIN' || p.role === 'SUPER_ADMIN')));
  const ref = newDocRef(COL.comments);
  const b = writeBatch(db);
  const w = asWriter(b);
  b.set(ref, { projectId: project.id, taskId: task?.id ?? null, authorId: actor.id, body: clean, mentions, editedAt: null, ...auditCreate(actor.id) });
  const where_ = task ? `${task.code}` : project.code;
  const link = task ? `/erp/tasks?task=${task.id}` : `/erp/projects/${project.id}?tab=discussions`;
  writeLog(w, actor.id, { entityType: task ? 'task' : 'project', entityId: task?.id ?? project.id, projectId: project.id, departmentId: project.departmentId, action: 'commented', summary: `${actor.name} commented on ${where_}` });
  notifyMany(w, actor.id, mentions, { type: 'MENTION', title: `${actor.name} mentioned you on ${where_}`, body: clean.slice(0, 200), link });
  const watchers = task ? [...task.assigneeIds, task.ownerId, task.reviewerId ?? ''] : [project.projectManagerId];
  notifyMany(w, actor.id, watchers.filter((id) => id && !mentions.includes(id)), { type: 'COMMENT', title: `New comment on ${where_}`, body: `${actor.name}: ${clean.slice(0, 180)}`, link });
  await b.commit();
}

export async function editComment(actor: Employee, c: Comment, body: string): Promise<void> {
  if (c.authorId !== actor.id) throw new Error('You can only edit your own comments');
  const { body: clean } = commentSchema.parse({ body });
  const b = writeBatch(db);
  b.update(docRef(COL.comments, c.id), { body: clean, editedAt: serverTimestamp(), ...touched(actor.id) });
  await b.commit();
}
