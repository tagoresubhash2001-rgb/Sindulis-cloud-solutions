import { describe, expect, it } from 'vitest';
import type { Employee, Task } from '../types';
import { toCsv } from './csv';
import { countTasks, employeePerformance, isOnTime } from './metrics';
import { assignableRoles, canCreateProject, canManageTasks, canReadProject } from './permissions';
import { extractMentions, projectSchema, taskSchema, decisionSchema } from './schemas';

const D = (ms: number) => ({ toMillis: () => ms }) as never;
const t = (over: Partial<Task>) => ({ id: Math.random().toString(), status: 'PENDING', assigneeIds: ['e'], isArchived: false, dueDate: null, completedAt: null, revisionCount: 0, estimatedHours: 0, actualHours: 0, departmentId: 'd1', ...over }) as Task;

describe('permissions', () => {
  const a = (role: Employee['role'], id = 'x', departmentId = 'd1') => ({ id, role, departmentId, active: true });
  const p = { projectManagerId: 'pm', memberIds: ['pm', 'tl', 'x'], departmentId: 'd1' };
  it('role grants', () => {
    expect(assignableRoles(a('ADMIN'))).not.toContain('ADMIN');
    expect(assignableRoles(a('SUPER_ADMIN'))).toContain('ADMIN');
    expect(assignableRoles(a('EMPLOYEE'))).toEqual([]);
  });
  it('project & task management', () => {
    expect(canCreateProject(a('PROJECT_MANAGER'))).toBe(true);
    expect(canCreateProject(a('DEPARTMENT_HEAD', 'h', 'd2'), 'd1')).toBe(false);
    expect(canManageTasks(a('TEAM_LEADER', 'tl'), p)).toBe(true);
    expect(canManageTasks(a('TEAM_LEADER', 'other'), p)).toBe(false);
    expect(canReadProject(a('EMPLOYEE', 'nobody'), p)).toBe(false);
    expect(canReadProject(a('DEPARTMENT_HEAD', 'h', 'd1'), p)).toBe(true);
  });
});

describe('metrics', () => {
  const now = 10_000;
  const tasks = [
    t({ status: 'COMPLETED', dueDate: D(5000), completedAt: D(4000), revisionCount: 1 }),
    t({ status: 'COMPLETED', dueDate: D(5000), completedAt: D(6000), revisionCount: 3 }),
    t({ status: 'IN_PROGRESS', dueDate: D(9000), estimatedHours: 8 }),
    t({ status: 'WAITING_APPROVAL' }),
    t({ status: 'CANCELLED' }),
    t({ status: 'PENDING', isArchived: true }),
  ];
  it('counts exclude archived', () => {
    expect(countTasks(tasks, now)).toEqual({ total: 5, pending: 0, inProgress: 1, waitingApproval: 1, completed: 2, cancelled: 1, overdue: 1 });
  });
  it('on-time and employee KPIs', () => {
    expect(isOnTime(tasks[0])).toBe(true);
    expect(isOnTime(tasks[1])).toBe(false);
    const perf = employeePerformance({ id: 'e', name: 'E' }, tasks, now);
    expect(perf).toMatchObject({ assigned: 4, completed: 2, open: 2, onTimePct: 50, overdue: 1, avgRevisions: 2, estimatedOpenHours: 8 });
  });
});

describe('schemas', () => {
  it('project manager is always a member', () => {
    const p = projectSchema.parse({ name: 'X', clientId: 'c', departmentId: 'd', projectManagerId: 'pm', memberIds: ['a'], startDate: null, endDate: null, priority: 'LOW', budget: 0, description: '', status: 'PLANNING', clientVisible: false });
    expect(p.memberIds).toEqual(['pm', 'a']);
  });
  it('task owner is always an assignee; dates ordered', () => {
    const base = { title: 'T', description: '', projectId: 'p', milestoneId: null, ownerId: 'o', assigneeIds: ['a'], reviewerId: null, priority: 'LOW' as const, startDate: null, dueDate: null, estimatedHours: 0, blockedByTaskIds: [], tags: [] };
    expect(taskSchema.parse(base).assigneeIds).toEqual(['o', 'a']);
    expect(() => taskSchema.parse({ ...base, startDate: new Date(2026, 1, 2), dueDate: new Date(2026, 1, 1) })).toThrow();
    expect(() => taskSchema.parse({ ...base, title: '  ' })).toThrow();
  });
  it('rejections need feedback', () => {
    expect(() => decisionSchema.parse({ decision: 'REJECTED', comment: '' })).toThrow();
    expect(decisionSchema.parse({ decision: 'APPROVED', comment: '' }).decision).toBe('APPROVED');
  });
  it('mentions resolve by email handle or first name', () => {
    const people = [{ id: '1', name: 'Asha Rao', email: 'asha.r@x.com' }, { id: '2', name: 'Vikram', email: 'vik@x.com' }];
    expect(extractMentions('ping @asha.r and @Vikram', people)).toEqual(['1', '2']);
    expect(extractMentions('no mentions', people)).toEqual([]);
  });
});

describe('csv', () => {
  it('quotes and neutralises formulas', () => {
    expect(toCsv(['a', 'b'], [['x,y', '=SUM(A1)'], ['he said "hi"', 3]])).toBe('a,b\r\n"x,y",\'=SUM(A1)\r\n"he said ""hi""",3');
  });
});
