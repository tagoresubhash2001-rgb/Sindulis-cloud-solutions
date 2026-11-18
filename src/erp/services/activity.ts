import { onSnapshot, query, where } from 'firebase/firestore';
import { isAdmin } from '../lib/permissions';
import type { ActivityLog, Employee } from '../types';
import { COL, chunk, colRef, rowsOf, subscribeUnion, type ErrorHandler } from './db';

const byTimeDesc = (a: ActivityLog, b: ActivityLog) => (b.at?.toMillis() ?? Date.now()) - (a.at?.toMillis() ?? Date.now());

/** Audit trail the actor can see: all (admin), their department (head), their projects, their own actions. */
export function subscribeActivity(me: Employee, projectIds: string[], onData: (rows: ActivityLog[]) => void, onError?: ErrorHandler) {
  const c = colRef(COL.activity);
  const queries = isAdmin(me)
    ? [query(c)]
    : [
        query(c, where('actorId', '==', me.id)),
        ...(me.role === 'DEPARTMENT_HEAD' && me.departmentId ? [query(c, where('departmentId', '==', me.departmentId))] : []),
        ...chunk(projectIds).map((ids) => query(c, where('projectId', 'in', ids))),
      ];
  return subscribeUnion<ActivityLog>(queries, (rows) => onData(rows.sort(byTimeDesc)), onError);
}

export function subscribeEntityActivity(projectId: string, entityId: string, onData: (rows: ActivityLog[]) => void, onError?: ErrorHandler) {
  const q = query(colRef(COL.activity), where('projectId', '==', projectId), where('entityId', '==', entityId));
  return onSnapshot(q, (s) => onData(rowsOf<ActivityLog>(s).sort(byTimeDesc)), onError);
}
