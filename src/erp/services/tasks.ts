import { query, runTransaction, where, writeBatch } from 'firebase/firestore';
import { isAdmin } from '../lib/permissions';
import { taskSchema, type TaskInput } from '../lib/schemas';
import type { Employee, Project, Task } from '../types';
import {
  COL,
  asWriter,
  auditCreate,
  chunk,
  colRef,
  db,
  diffFields,
  docRef,
  formatCode,
  newDocRef,
  nextSequence,
  notifyMany,
  subscribeUnion,
  touched,
  writeLog,
  type ErrorHandler,
} from './db';

/**
 * Tasks visible to the actor: everything for admins; otherwise tasks in readable projects
 * (chunked `projectId in` queries) plus tasks the actor is assigned to directly.
 */
export function subscribeVisibleTasks(me: Employee, projectIds: string[], onData: (rows: Task[]) => void, onError?: ErrorHandler) {
  const c = colRef(COL.tasks);
  const queries = isAdmin(me)
    ? [query(c)]
    : [query(c, where('assigneeIds', 'array-contains', me.id)), ...chunk(projectIds).map((ids) => query(c, where('projectId', 'in', ids)))];
  return subscribeUnion<Task>(queries, onData, onError);
}

export async function createTask(actor: Employee, project: Project, input: TaskInput): Promise<string> {
  const data = taskSchema.parse(input);
  if (data.projectId !== project.id) throw new Error('Project mismatch');
  const outsiders = data.assigneeIds.filter((a) => !project.memberIds.includes(a));
  if (outsiders.length) throw new Error('Assignees must be members of the project. Add them to the project team first.');
  if (data.reviewerId && !project.memberIds.includes(data.reviewerId)) throw new Error('The reviewer must be a project member');
  const ref = newDocRef(COL.tasks);
  let code = '';
  await runTransaction(db, async (tx) => {
    const n = await nextSequence(tx, 'tasks');
    code = formatCode('TSK', n, 5);
    tx.set(ref, {
      ...data,
      code,
      departmentId: project.departmentId,
      actualHours: 0,
      status: 'PENDING',
      checklistTotal: 0,
      checklistDone: 0,
      revisionCount: 0,
      completedAt: null,
      cancelReason: null,
      ...auditCreate(actor.id),
    });
    const w = asWriter(tx);
    writeLog(w, actor.id, { entityType: 'task', entityId: ref.id, projectId: project.id, departmentId: project.departmentId, action: 'created', summary: `Created ${code} “${data.title}”` });
    notifyMany(w, actor.id, data.assigneeIds, {
      type: 'TASK_ASSIGNED',
      title: `New task ${code}`,
      body: `${data.title} — ${project.name}`,
      link: `/erp/tasks?task=${ref.id}`,
    });
  });
  return ref.id;
}

export async function updateTask(actor: Employee, project: Project, task: Task, input: TaskInput): Promise<void> {
  if (task.isArchived) throw new Error('Archived tasks are read-only');
  const data = taskSchema.parse(input);
  const outsiders = data.assigneeIds.filter((a) => !project.memberIds.includes(a));
  if (outsiders.length) throw new Error('Assignees must be members of the project');
  const { projectId: _ignored, ...editable } = data;
  void _ignored;
  const diff = diffFields(task, editable);
  if (!diff) return;
  const b = writeBatch(db);
  b.update(docRef(COL.tasks, task.id), { ...editable, ...touched(actor.id) });
  const w = asWriter(b);
  const reassigned = diff.after.assigneeIds !== undefined;
  const dueChanged = diff.after.dueDate !== undefined;
  writeLog(w, actor.id, {
    entityType: 'task',
    entityId: task.id,
    projectId: project.id,
    departmentId: project.departmentId,
    action: reassigned ? 'reassigned' : dueChanged ? 'deadline_changed' : 'updated',
    summary: `Updated ${task.code}`,
    ...diff,
  });
  const added = editable.assigneeIds.filter((a) => !task.assigneeIds.includes(a));
  const link = `/erp/tasks?task=${task.id}`;
  notifyMany(w, actor.id, added, { type: task.assigneeIds.length ? 'TASK_REASSIGNED' : 'TASK_ASSIGNED', title: `Assigned to ${task.code}`, body: editable.title, link });
  if (dueChanged) {
    notifyMany(w, actor.id, editable.assigneeIds.filter((a) => !added.includes(a)), { type: 'TASK_REASSIGNED', title: `Deadline changed on ${task.code}`, body: editable.title, link });
  }
  await b.commit();
}

export function taskToInput(t: Task): TaskInput {
  return {
    title: t.title,
    description: t.description,
    projectId: t.projectId,
    milestoneId: t.milestoneId,
    ownerId: t.ownerId,
    assigneeIds: t.assigneeIds,
    reviewerId: t.reviewerId,
    priority: t.priority,
    startDate: t.startDate?.toDate() ?? null,
    dueDate: t.dueDate?.toDate() ?? null,
    estimatedHours: t.estimatedHours,
    blockedByTaskIds: t.blockedByTaskIds,
    tags: t.tags,
  };
}
