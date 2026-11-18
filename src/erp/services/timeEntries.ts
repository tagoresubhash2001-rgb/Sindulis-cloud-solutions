import { increment, onSnapshot, query, serverTimestamp, Timestamp, where, writeBatch } from 'firebase/firestore';
import { timeEntrySchema } from '../lib/schemas';
import type { Employee, Task, TimeEntry } from '../types';
import { COL, asWriter, auditCreate, colRef, db, docRef, newDocRef, rowsOf, touched, writeLog, type ErrorHandler } from './db';

export function subscribeTimeEntries(task: Pick<Task, 'id' | 'projectId'>, onData: (rows: TimeEntry[]) => void, onError?: ErrorHandler) {
  const q = query(colRef(COL.time), where('projectId', '==', task.projectId), where('taskId', '==', task.id));
  return onSnapshot(q, (s) => onData(rowsOf<TimeEntry>(s).sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))), onError);
}

export function subscribeMyTimeEntries(me: Employee, onData: (rows: TimeEntry[]) => void, onError?: ErrorHandler) {
  return onSnapshot(query(colRef(COL.time), where('employeeId', '==', me.id)), (s) => onData(rowsOf<TimeEntry>(s)), onError);
}

/** Log time (manual entry or a stopped timer). Adds to the task's actualHours atomically. */
export async function logTime(actor: Employee, task: Task, input: { minutes: number; note: string; start?: Date | null }): Promise<void> {
  const data = timeEntrySchema.parse({ minutes: Math.round(input.minutes), note: input.note });
  const end = new Date();
  const start = input.start ?? new Date(end.getTime() - data.minutes * 60_000);
  const b = writeBatch(db);
  b.set(newDocRef(COL.time), {
    taskId: task.id,
    projectId: task.projectId,
    employeeId: actor.id,
    start: Timestamp.fromDate(start),
    end: serverTimestamp(),
    minutes: data.minutes,
    note: data.note,
    ...auditCreate(actor.id),
  });
  b.update(docRef(COL.tasks, task.id), { actualHours: increment(Math.round((data.minutes / 60) * 100) / 100), ...touched(actor.id) });
  writeLog(asWriter(b), actor.id, { entityType: 'task', entityId: task.id, projectId: task.projectId, departmentId: task.departmentId, action: 'time_logged', summary: `Logged ${data.minutes} min on ${task.code}` });
  await b.commit();
}
