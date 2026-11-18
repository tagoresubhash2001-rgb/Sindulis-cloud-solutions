import { getDoc, onSnapshot, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { format } from 'date-fns';
import { toMillis } from '../lib/dates';
import { isDueSoon, isOverdue } from '../lib/workflow';
import type { AppNotification, Employee, Project, Task } from '../types';
import { COL, asWriter, colRef, db, docRef, rowsOf, writeNotification, type ErrorHandler } from './db';

export function subscribeMyNotifications(me: Employee, onData: (rows: AppNotification[]) => void, onError?: ErrorHandler) {
  return onSnapshot(
    query(colRef(COL.notifications), where('userId', '==', me.id)),
    (s) => onData(rowsOf<AppNotification>(s).sort((a, b) => (b.createdAt?.toMillis() ?? Date.now()) - (a.createdAt?.toMillis() ?? Date.now()))),
    onError,
  );
}

export async function markRead(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const b = writeBatch(db);
  for (const id of ids.slice(0, 450)) b.update(docRef(COL.notifications, id), { read: true, readAt: serverTimestamp() });
  await b.commit();
}

/**
 * Deadline reminders without Cloud Functions (Spark plan): on load, each user creates their own
 * "due within N hours" / "overdue" notifications, once per task per day (deterministic ids).
 * Project managers get the same for project end dates.
 */
export async function ensureDeadlineReminders(me: Employee, tasks: Task[], projects: Project[], warningHours: number, now = Date.now()): Promise<number> {
  const day = format(now, 'yyyyMMdd');
  const candidates: { id: string; type: AppNotification['type']; title: string; body: string; link: string }[] = [];
  for (const t of tasks) {
    if (t.isArchived || !t.assigneeIds.includes(me.id)) continue;
    if (isOverdue(t, now)) candidates.push({ id: `${me.id}_overdue_${t.id}_${day}`, type: 'TASK_OVERDUE', title: `${t.code} is overdue`, body: t.title, link: `/erp/tasks?task=${t.id}` });
    else if (isDueSoon(t, warningHours, now)) candidates.push({ id: `${me.id}_due_${t.id}_${day}`, type: 'DEADLINE_APPROACHING', title: `${t.code} is due soon`, body: t.title, link: `/erp/tasks?task=${t.id}` });
  }
  for (const p of projects) {
    const end = toMillis(p.endDate);
    if (p.projectManagerId !== me.id || p.isArchived || end === null || p.status === 'COMPLETED' || p.status === 'CANCELLED') continue;
    if (end >= now && end - now <= Math.max(warningHours, 72) * 3600_000) {
      candidates.push({ id: `${me.id}_projdue_${p.id}_${day}`, type: 'PROJECT_DEADLINE', title: `${p.code} deadline approaching`, body: p.name, link: `/erp/projects/${p.id}` });
    }
  }
  const fresh: typeof candidates = [];
  for (const c of candidates.slice(0, 100)) {
    const snap = await getDoc(docRef(COL.notifications, c.id)).catch(() => null);
    if (snap && !snap.exists()) fresh.push(c);
  }
  if (!fresh.length) return 0;
  const b = writeBatch(db);
  for (const c of fresh) writeNotification(asWriter(b), me.id, { userId: me.id, type: c.type, title: c.title, body: c.body, link: c.link }, true, c.id);
  await b.commit();
  return fresh.length;
}
