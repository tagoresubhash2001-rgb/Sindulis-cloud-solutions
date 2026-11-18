/**
 * Unified status engine (pure, unit-tested). Every department uses the same lifecycle:
 * PENDING → IN_PROGRESS → WAITING_APPROVAL → COMPLETED, plus CANCELLED.
 * The same rules are enforced server-side in firestore.rules.
 */
import type { DateLike, Employee, Project, Task, TaskStatus } from '../types';
import { toMillis } from './dates';
import { canManageTasks, canReviewTask, canWrite, isAssignee } from './permissions';

export type TransitionKind =
  | 'START'
  | 'SUBMIT'
  | 'APPROVE'
  | 'REJECT'
  | 'CANCEL'
  | 'REOPEN'
  | 'REINSTATE';

export interface TransitionDef {
  kind: TransitionKind;
  from: TaskStatus[];
  to: TaskStatus;
  label: string;
}

export const TRANSITIONS: TransitionDef[] = [
  { kind: 'START', from: ['PENDING'], to: 'IN_PROGRESS', label: 'Start task' },
  { kind: 'SUBMIT', from: ['IN_PROGRESS'], to: 'WAITING_APPROVAL', label: 'Submit for approval' },
  { kind: 'APPROVE', from: ['WAITING_APPROVAL'], to: 'COMPLETED', label: 'Approve' },
  { kind: 'REJECT', from: ['WAITING_APPROVAL'], to: 'IN_PROGRESS', label: 'Reject / request changes' },
  { kind: 'CANCEL', from: ['PENDING', 'IN_PROGRESS', 'WAITING_APPROVAL'], to: 'CANCELLED', label: 'Cancel task' },
  { kind: 'REOPEN', from: ['COMPLETED'], to: 'IN_PROGRESS', label: 'Reopen' },
  { kind: 'REINSTATE', from: ['CANCELLED'], to: 'PENDING', label: 'Reinstate' },
];

export function isLegalTransition(from: TaskStatus, to: TaskStatus): boolean {
  return TRANSITIONS.some((t) => t.to === to && t.from.includes(from));
}

/**
 * Map a requested status change (e.g. a Kanban drop) to a transition.
 * WAITING_APPROVAL → IN_PROGRESS is a rejection; COMPLETED → IN_PROGRESS is a reopen.
 */
export function resolveTransition(from: TaskStatus, to: TaskStatus): TransitionKind | null {
  const def = TRANSITIONS.find((t) => t.to === to && t.from.includes(from));
  return def ? def.kind : null;
}

export interface TransitionInput {
  comment?: string;
  reason?: string;
}

/** `reason` is empty when `ok` is true. */
export interface Check {
  ok: boolean;
  reason: string;
}
const OK: Check = { ok: true, reason: '' };
const no = (reason: string): Check => ({ ok: false, reason });

export function checkTransition(
  actor: Employee,
  task: Task,
  project: Pick<Project, 'projectManagerId' | 'memberIds' | 'departmentId'> | null,
  kind: TransitionKind,
  input: TransitionInput = {},
): Check {
  const def = TRANSITIONS.find((t) => t.kind === kind);
  if (!def) return no('Unknown transition');
  if (!def.from.includes(task.status)) {
    return { ok: false, reason: `Cannot ${def.label.toLowerCase()} a task that is ${task.status.replace('_', ' ').toLowerCase()}` };
  }
  if (task.isArchived) return no('Archived tasks are read-only');
  if (!canWrite(actor)) return no('Your role is read-only');
  const manager = canManageTasks(actor, project);

  switch (kind) {
    case 'START':
    case 'SUBMIT':
      if (!isAssignee(actor, task) && !manager) return no('Only assignees can work on this task');
      if (kind === 'SUBMIT' && !task.reviewerId) return no('Set a reviewer before submitting');
      return OK;
    case 'APPROVE':
      if (!canReviewTask(actor, task, project)) return no('Only the reviewer or a manager can approve');
      return OK;
    case 'REJECT':
      if (!canReviewTask(actor, task, project)) return no('Only the reviewer or a manager can reject');
      if (!input.comment?.trim()) return no('Feedback is required when rejecting');
      return OK;
    case 'CANCEL':
      if (!manager) return no('Only managers can cancel tasks');
      if (!input.reason?.trim()) return no('A cancellation reason is required');
      return OK;
    case 'REOPEN':
    case 'REINSTATE':
      if (!manager) return no('Only managers can reopen tasks');
      return OK;
  }
}

/** Field patch the transition applies to the task (timestamps filled by the service). */
export function transitionPatch(task: Task, kind: TransitionKind, input: TransitionInput = {}): Partial<Task> {
  const def = TRANSITIONS.find((t) => t.kind === kind)!;
  const patch: Partial<Task> = { status: def.to };
  if (kind === 'REJECT') patch.revisionCount = task.revisionCount + 1;
  if (kind === 'CANCEL') patch.cancelReason = input.reason?.trim() ?? '';
  if (kind === 'REOPEN') patch.completedAt = null;
  if (kind === 'REINSTATE') patch.cancelReason = null;
  return patch;
}

export const CLOSED: TaskStatus[] = ['COMPLETED', 'CANCELLED'];

export function isOverdue(task: Pick<Task, 'dueDate' | 'status'>, now: number = Date.now()): boolean {
  const due = toMillis(task.dueDate as DateLike);
  return due !== null && due < now && !CLOSED.includes(task.status);
}

export function isDueSoon(task: Pick<Task, 'dueDate' | 'status'>, hours = 24, now: number = Date.now()): boolean {
  const due = toMillis(task.dueDate as DateLike);
  return due !== null && due >= now && due - now <= hours * 3600_000 && !CLOSED.includes(task.status);
}

/** completed / non-cancelled, as a 0–100 integer. */
export function progressOf(tasks: Pick<Task, 'status'>[]): number {
  const live = tasks.filter((t) => t.status !== 'CANCELLED');
  if (live.length === 0) return 0;
  return Math.round((live.filter((t) => t.status === 'COMPLETED').length / live.length) * 100);
}

/** Open blockers: dependency tasks that are not completed. */
export function openBlockers(task: Pick<Task, 'blockedByTaskIds'>, all: Pick<Task, 'id' | 'status'>[]): string[] {
  return task.blockedByTaskIds.filter((id) => {
    const b = all.find((t) => t.id === id);
    return b !== undefined && b.status !== 'COMPLETED' && b.status !== 'CANCELLED';
  });
}
