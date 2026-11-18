/**
 * Client-side mirror of firestore.rules, used only to decide what UI to show.
 * The rules are the real enforcement.
 */
import type { Employee, Project, Role, Task } from '../types';

type Actor = Pick<Employee, 'id' | 'role' | 'departmentId' | 'active'>;
type ProjectLike = Pick<Project, 'projectManagerId' | 'memberIds' | 'departmentId'>;

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  DEPARTMENT_HEAD: 'Department Head',
  PROJECT_MANAGER: 'Project Manager',
  TEAM_LEADER: 'Team Leader',
  EMPLOYEE: 'Employee',
  VIEWER: 'Viewer',
};

export const isSuperAdmin = (a: Actor | null) => !!a?.active && a.role === 'SUPER_ADMIN';
export const isAdmin = (a: Actor | null) => !!a?.active && (a.role === 'SUPER_ADMIN' || a.role === 'ADMIN');
export const canWrite = (a: Actor | null) => !!a?.active && a.role !== 'VIEWER';
export const isDeptHeadOf = (a: Actor | null, departmentId: string | null | undefined) =>
  !!a?.active && a.role === 'DEPARTMENT_HEAD' && !!departmentId && a.departmentId === departmentId;

/** Roles an actor may grant. Only Super Admin can create admins. */
export function assignableRoles(a: Actor | null): Role[] {
  if (isSuperAdmin(a)) return ['SUPER_ADMIN', 'ADMIN', 'DEPARTMENT_HEAD', 'PROJECT_MANAGER', 'TEAM_LEADER', 'EMPLOYEE', 'VIEWER'];
  if (isAdmin(a)) return ['DEPARTMENT_HEAD', 'PROJECT_MANAGER', 'TEAM_LEADER', 'EMPLOYEE', 'VIEWER'];
  return [];
}

export function canCreateProject(a: Actor | null, departmentId?: string | null): boolean {
  if (isAdmin(a)) return true;
  if (!a?.active) return false;
  if (a.role === 'DEPARTMENT_HEAD') return !departmentId || a.departmentId === departmentId;
  return a.role === 'PROJECT_MANAGER';
}

export function canManageClients(a: Actor | null): boolean {
  return !!a?.active && ['SUPER_ADMIN', 'ADMIN', 'DEPARTMENT_HEAD', 'PROJECT_MANAGER'].includes(a.role);
}

export function canManageProject(a: Actor | null, p: ProjectLike | null): boolean {
  if (!p || !a?.active) return false;
  return isAdmin(a) || isDeptHeadOf(a, p.departmentId) || p.projectManagerId === a.id;
}

export function canManageTasks(a: Actor | null, p: ProjectLike | null): boolean {
  if (!p || !a?.active) return false;
  return canManageProject(a, p) || (a.role === 'TEAM_LEADER' && p.memberIds.includes(a.id));
}

export function canReadProject(a: Actor | null, p: ProjectLike | null): boolean {
  if (!p || !a?.active) return false;
  return isAdmin(a) || isDeptHeadOf(a, p.departmentId) || p.memberIds.includes(a.id);
}

export const isAssignee = (a: Actor | null, t: Pick<Task, 'assigneeIds'>) => !!a && t.assigneeIds.includes(a.id);

export function canReviewTask(a: Actor | null, t: Pick<Task, 'reviewerId'> & Partial<Pick<Task, 'assigneeIds'>>, p: ProjectLike | null): boolean {
  if (!canWrite(a)) return false;
  // Assignees cannot approve their own work unless they manage the project.
  return (t.reviewerId === a!.id && !t.assigneeIds?.includes(a!.id)) || canManageProject(a, p);
}

export function canWorkOnTask(a: Actor | null, t: Pick<Task, 'assigneeIds' | 'isArchived'>, p: ProjectLike | null): boolean {
  if (!canWrite(a) || t.isArchived) return false;
  return isAssignee(a, t) || canManageTasks(a, p);
}

export function canArchive(a: Actor | null, departmentId: string | null | undefined): boolean {
  return isAdmin(a) || isDeptHeadOf(a, departmentId);
}

export const canRestore = (a: Actor | null) => isAdmin(a);
export const canPermanentlyDelete = (a: Actor | null) => isSuperAdmin(a);
