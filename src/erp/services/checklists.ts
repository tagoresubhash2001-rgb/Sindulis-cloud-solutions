import { onSnapshot, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { checklistItemSchema } from '../lib/schemas';
import type { ChecklistItem, Employee, Task } from '../types';
import { COL, auditCreate, colRef, db, docRef, newDocRef, rowsOf, touched, type ErrorHandler } from './db';

export function subscribeChecklist(task: Pick<Task, 'id' | 'projectId'>, onData: (rows: ChecklistItem[]) => void, onError?: ErrorHandler) {
  const q = query(colRef(COL.checklists), where('projectId', '==', task.projectId), where('taskId', '==', task.id));
  return onSnapshot(q, (s) => onData(rowsOf<ChecklistItem>(s).filter((i) => !i.isArchived).sort((a, b) => a.order - b.order)), onError);
}

/** Checklist counters on the task are kept in the same batch as the item change. */
function counts(items: ChecklistItem[]) {
  return { checklistTotal: items.length, checklistDone: items.filter((i) => i.done).length };
}

export async function addChecklistItem(actor: Employee, task: Task, items: ChecklistItem[], text: string): Promise<void> {
  const { text: clean } = checklistItemSchema.parse({ text });
  const ref = newDocRef(COL.checklists);
  const b = writeBatch(db);
  const order = items.length ? Math.max(...items.map((i) => i.order)) + 1 : 0;
  b.set(ref, { taskId: task.id, projectId: task.projectId, text: clean, done: false, doneBy: null, doneAt: null, order, ...auditCreate(actor.id) });
  b.update(docRef(COL.tasks, task.id), { checklistTotal: items.length + 1, checklistDone: items.filter((i) => i.done).length, ...touched(actor.id) });
  await b.commit();
}

export async function toggleChecklistItem(actor: Employee, task: Task, items: ChecklistItem[], item: ChecklistItem): Promise<void> {
  const done = !item.done;
  const next = items.map((i) => (i.id === item.id ? { ...i, done } : i));
  const b = writeBatch(db);
  b.update(docRef(COL.checklists, item.id), { done, doneBy: done ? actor.id : null, doneAt: done ? serverTimestamp() : null, ...touched(actor.id) });
  b.update(docRef(COL.tasks, task.id), { ...counts(next), ...touched(actor.id) });
  await b.commit();
}

/** Soft-remove (nothing is hard-deleted). */
export async function removeChecklistItem(actor: Employee, task: Task, items: ChecklistItem[], item: ChecklistItem): Promise<void> {
  const next = items.filter((i) => i.id !== item.id);
  const b = writeBatch(db);
  b.update(docRef(COL.checklists, item.id), { isArchived: true, archivedAt: serverTimestamp(), archivedBy: actor.id, ...touched(actor.id) });
  b.update(docRef(COL.tasks, task.id), { ...counts(next), ...touched(actor.id) });
  await b.commit();
}
