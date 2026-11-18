import { onSnapshot, query, where } from 'firebase/firestore';
import { isAdmin } from '../lib/permissions';
import type { Approval, Employee, Submission, Task } from '../types';
import { COL, chunk, colRef, rowsOf, subscribeUnion, type ErrorHandler } from './db';

/** Approvals the actor reviews, plus all approvals in projects they can read. */
export function subscribeApprovals(me: Employee, projectIds: string[], onData: (rows: Approval[]) => void, onError?: ErrorHandler) {
  const c = colRef(COL.approvals);
  const queries = isAdmin(me)
    ? [query(c)]
    : [query(c, where('reviewerId', '==', me.id)), ...chunk(projectIds).map((ids) => query(c, where('projectId', 'in', ids)))];
  return subscribeUnion<Approval>(queries, onData, onError);
}

export function subscribeSubmissions(task: Pick<Task, 'id' | 'projectId'>, onData: (rows: Submission[]) => void, onError?: ErrorHandler) {
  const q = query(colRef(COL.submissions), where('projectId', '==', task.projectId), where('taskId', '==', task.id));
  return onSnapshot(q, (s) => onData(rowsOf<Submission>(s).sort((a, b) => b.version - a.version)), onError);
}
