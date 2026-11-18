/** KPI and report calculations (pure, unit-tested). */
import type { Approval, Employee, Project, Task } from '../types';
import { toMillis } from './dates';
import { isOverdue, progressOf } from './workflow';

export interface TaskCounts {
  total: number;
  pending: number;
  inProgress: number;
  waitingApproval: number;
  completed: number;
  cancelled: number;
  overdue: number;
}

export function countTasks(tasks: Task[], now = Date.now()): TaskCounts {
  const live = tasks.filter((t) => !t.isArchived);
  return {
    total: live.length,
    pending: live.filter((t) => t.status === 'PENDING').length,
    inProgress: live.filter((t) => t.status === 'IN_PROGRESS').length,
    waitingApproval: live.filter((t) => t.status === 'WAITING_APPROVAL').length,
    completed: live.filter((t) => t.status === 'COMPLETED').length,
    cancelled: live.filter((t) => t.status === 'CANCELLED').length,
    overdue: live.filter((t) => isOverdue(t, now)).length,
  };
}

export function countProjects(projects: Project[]) {
  const live = projects.filter((p) => !p.isArchived);
  return {
    total: live.length,
    active: live.filter((p) => p.status === 'ACTIVE').length,
    completed: live.filter((p) => p.status === 'COMPLETED').length,
    planning: live.filter((p) => p.status === 'PLANNING').length,
    onHold: live.filter((p) => p.status === 'ON_HOLD').length,
  };
}

export function projectProgress(projectId: string, tasks: Task[]): number {
  return progressOf(tasks.filter((t) => t.projectId === projectId));
}

export function milestoneProgress(milestoneId: string, tasks: Task[]): number {
  return progressOf(tasks.filter((t) => t.milestoneId === milestoneId));
}

/** Completed on or before the due date (tasks without a due date count as on time). */
export function isOnTime(t: Task): boolean {
  if (t.status !== 'COMPLETED') return false;
  const due = toMillis(t.dueDate);
  const done = toMillis(t.completedAt);
  return due === null || done === null || done <= due;
}

export interface EmployeePerformance {
  employeeId: string;
  name: string;
  assigned: number;
  open: number;
  completed: number;
  onTimePct: number;
  overdue: number;
  avgRevisions: number;
  estimatedOpenHours: number;
  actualHours: number;
}

export function employeePerformance(emp: Pick<Employee, 'id' | 'name'>, tasks: Task[], now = Date.now()): EmployeePerformance {
  const mine = tasks.filter((t) => t.assigneeIds.includes(emp.id) && !t.isArchived && t.status !== 'CANCELLED');
  const completed = mine.filter((t) => t.status === 'COMPLETED');
  const open = mine.filter((t) => t.status !== 'COMPLETED');
  return {
    employeeId: emp.id,
    name: emp.name,
    assigned: mine.length,
    open: open.length,
    completed: completed.length,
    onTimePct: completed.length ? Math.round((completed.filter(isOnTime).length / completed.length) * 100) : 0,
    overdue: mine.filter((t) => isOverdue(t, now)).length,
    avgRevisions: completed.length
      ? Math.round((completed.reduce((s, t) => s + t.revisionCount, 0) / completed.length) * 10) / 10
      : 0,
    estimatedOpenHours: open.reduce((s, t) => s + (t.estimatedHours || 0) / Math.max(1, t.assigneeIds.length), 0),
    actualHours: mine.reduce((s, t) => s + (t.actualHours || 0), 0),
  };
}

export function departmentPerformance(departmentId: string, tasks: Task[], now = Date.now()) {
  const d = tasks.filter((t) => t.departmentId === departmentId && !t.isArchived);
  const c = countTasks(d, now);
  const live = c.total - c.cancelled;
  return { ...c, completionPct: live ? Math.round((c.completed / live) * 100) : 0 };
}

export function pendingApprovals(approvals: Approval[]): Approval[] {
  return approvals.filter((a) => a.decision === null && !a.isArchived);
}

/** Tasks whose relevant timestamp falls inside [from, to). */
export function tasksInWindow(tasks: Task[], from: number, to: number) {
  const inWin = (d: number | null) => d !== null && d >= from && d < to;
  return {
    created: tasks.filter((t) => inWin(toMillis(t.createdAt))),
    completed: tasks.filter((t) => t.status === 'COMPLETED' && inWin(toMillis(t.completedAt))),
    due: tasks.filter((t) => inWin(toMillis(t.dueDate))),
  };
}
