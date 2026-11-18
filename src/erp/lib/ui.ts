import type { Priority, ProjectStatus, TaskStatus } from '../types';

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In progress',
  WAITING_APPROVAL: 'Waiting approval',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const TASK_STATUS_STYLE: Record<TaskStatus, string> = {
  PENDING: 'bg-slate-100 text-slate-700 ring-slate-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 ring-blue-200',
  WAITING_APPROVAL: 'bg-amber-50 text-amber-800 ring-amber-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export const TASK_STATUS_DOT: Record<TaskStatus, string> = {
  PENDING: 'bg-slate-400',
  IN_PROGRESS: 'bg-blue-500',
  WAITING_APPROVAL: 'bg-amber-500',
  COMPLETED: 'bg-emerald-500',
  CANCELLED: 'bg-rose-500',
};

export const PROJECT_STATUS_STYLE: Record<ProjectStatus, string> = {
  PLANNING: 'bg-slate-100 text-slate-700 ring-slate-200',
  ACTIVE: 'bg-blue-50 text-blue-700 ring-blue-200',
  ON_HOLD: 'bg-amber-50 text-amber-800 ring-amber-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export const PRIORITY_STYLE: Record<Priority, string> = {
  LOW: 'bg-slate-50 text-slate-600 ring-slate-200',
  MEDIUM: 'bg-sky-50 text-sky-700 ring-sky-200',
  HIGH: 'bg-orange-50 text-orange-700 ring-orange-200',
  URGENT: 'bg-red-50 text-red-700 ring-red-200',
};

export const humanize = (s: string) => s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ');

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
