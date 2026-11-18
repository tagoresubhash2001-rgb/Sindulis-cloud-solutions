import { describe, expect, it } from 'vitest';
import type { Employee, Project, Task } from '../types';
import { checkTransition, isDueSoon, isLegalTransition, isOverdue, openBlockers, progressOf, resolveTransition, transitionPatch } from './workflow';

const emp = (id: string, role: Employee['role'], departmentId = 'd1', active = true) => ({ id, role, departmentId, active }) as Employee;
const project = { projectManagerId: 'pm', memberIds: ['pm', 'tl', 'emp', 'rev'], departmentId: 'd1' } as Pick<Project, 'projectManagerId' | 'memberIds' | 'departmentId'>;
const task = (over: Partial<Task> = {}) =>
  ({ id: 't1', status: 'PENDING', assigneeIds: ['emp'], reviewerId: 'rev', revisionCount: 0, isArchived: false, dueDate: null, blockedByTaskIds: [], ...over }) as Task;
const D = (ms: number) => ({ toMillis: () => ms });

describe('legal transitions', () => {
  it.each([
    ['PENDING', 'IN_PROGRESS', true],
    ['IN_PROGRESS', 'WAITING_APPROVAL', true],
    ['WAITING_APPROVAL', 'COMPLETED', true],
    ['WAITING_APPROVAL', 'IN_PROGRESS', true],
    ['COMPLETED', 'IN_PROGRESS', true],
    ['IN_PROGRESS', 'CANCELLED', true],
    ['CANCELLED', 'PENDING', true],
    ['PENDING', 'COMPLETED', false],
    ['PENDING', 'WAITING_APPROVAL', false],
    ['IN_PROGRESS', 'PENDING', false],
    ['COMPLETED', 'CANCELLED', false],
    ['IN_PROGRESS', 'COMPLETED', false],
  ] as const)('%s → %s is %s', (from, to, ok) => expect(isLegalTransition(from, to)).toBe(ok));

  it('maps drops to transition kinds', () => {
    expect(resolveTransition('WAITING_APPROVAL', 'IN_PROGRESS')).toBe('REJECT');
    expect(resolveTransition('COMPLETED', 'IN_PROGRESS')).toBe('REOPEN');
    expect(resolveTransition('PENDING', 'COMPLETED')).toBeNull();
  });
});

describe('who may transition', () => {
  it('assignee starts and submits; non-assignee employee cannot', () => {
    expect(checkTransition(emp('emp', 'EMPLOYEE'), task(), project, 'START').ok).toBe(true);
    expect(checkTransition(emp('other', 'EMPLOYEE'), task(), project, 'START').ok).toBe(false);
    expect(checkTransition(emp('emp', 'EMPLOYEE'), task({ status: 'IN_PROGRESS' }), project, 'SUBMIT').ok).toBe(true);
  });
  it('cannot submit without a reviewer', () => {
    const r = checkTransition(emp('emp', 'EMPLOYEE'), task({ status: 'IN_PROGRESS', reviewerId: null }), project, 'SUBMIT');
    expect(r).toEqual({ ok: false, reason: 'Set a reviewer before submitting' });
  });
  it('reviewer approves; assignee cannot self-approve', () => {
    const waiting = task({ status: 'WAITING_APPROVAL' });
    expect(checkTransition(emp('rev', 'EMPLOYEE'), waiting, project, 'APPROVE').ok).toBe(true);
    expect(checkTransition(emp('emp', 'EMPLOYEE'), waiting, project, 'APPROVE').ok).toBe(false);
    expect(checkTransition(emp('emp', 'EMPLOYEE'), task({ status: 'WAITING_APPROVAL', reviewerId: 'emp' }), project, 'APPROVE').ok).toBe(false);
    expect(checkTransition(emp('pm', 'PROJECT_MANAGER'), waiting, project, 'APPROVE').ok).toBe(true);
  });
  it('rejection requires feedback', () => {
    const waiting = task({ status: 'WAITING_APPROVAL' });
    expect(checkTransition(emp('rev', 'EMPLOYEE'), waiting, project, 'REJECT').ok).toBe(false);
    expect(checkTransition(emp('rev', 'EMPLOYEE'), waiting, project, 'REJECT', { comment: 'Fix colours' }).ok).toBe(true);
  });
  it('cancel needs manager and reason; reopen needs manager', () => {
    expect(checkTransition(emp('emp', 'EMPLOYEE'), task(), project, 'CANCEL', { reason: 'x' }).ok).toBe(false);
    expect(checkTransition(emp('pm', 'PROJECT_MANAGER'), task(), project, 'CANCEL').ok).toBe(false);
    expect(checkTransition(emp('pm', 'PROJECT_MANAGER'), task(), project, 'CANCEL', { reason: 'Scope cut' }).ok).toBe(true);
    expect(checkTransition(emp('tl', 'TEAM_LEADER'), task({ status: 'COMPLETED' }), project, 'REOPEN').ok).toBe(true);
    expect(checkTransition(emp('emp', 'EMPLOYEE'), task({ status: 'COMPLETED' }), project, 'REOPEN').ok).toBe(false);
  });
  it('viewers, inactive users and archived tasks are blocked', () => {
    expect(checkTransition(emp('emp', 'VIEWER'), task(), project, 'START').ok).toBe(false);
    expect(checkTransition(emp('emp', 'EMPLOYEE', 'd1', false), task(), project, 'START').ok).toBe(false);
    expect(checkTransition(emp('emp', 'EMPLOYEE'), task({ isArchived: true }), project, 'START').ok).toBe(false);
  });
  it('illegal source status is reported', () => {
    expect(checkTransition(emp('rev', 'EMPLOYEE'), task(), project, 'APPROVE').ok).toBe(false);
  });
  it('department head of another department cannot manage', () => {
    expect(checkTransition(emp('h2', 'DEPARTMENT_HEAD', 'd2'), task(), project, 'CANCEL', { reason: 'x' }).ok).toBe(false);
    expect(checkTransition(emp('h1', 'DEPARTMENT_HEAD', 'd1'), task(), project, 'CANCEL', { reason: 'x' }).ok).toBe(true);
  });
});

describe('patches', () => {
  it('rejection increments revisionCount', () => {
    expect(transitionPatch(task({ status: 'WAITING_APPROVAL', revisionCount: 2 }), 'REJECT')).toEqual({ status: 'IN_PROGRESS', revisionCount: 3 });
  });
  it('cancel stores reason; reopen clears completedAt; reinstate clears reason', () => {
    expect(transitionPatch(task(), 'CANCEL', { reason: '  dropped ' })).toEqual({ status: 'CANCELLED', cancelReason: 'dropped' });
    expect(transitionPatch(task({ status: 'COMPLETED' }), 'REOPEN')).toEqual({ status: 'IN_PROGRESS', completedAt: null });
    expect(transitionPatch(task({ status: 'CANCELLED' }), 'REINSTATE')).toEqual({ status: 'PENDING', cancelReason: null });
  });
});

describe('time & progress', () => {
  const now = 1_000_000_000;
  it('overdue = past due and not closed', () => {
    expect(isOverdue({ dueDate: D(now - 1) as never, status: 'IN_PROGRESS' }, now)).toBe(true);
    expect(isOverdue({ dueDate: D(now - 1) as never, status: 'COMPLETED' }, now)).toBe(false);
    expect(isOverdue({ dueDate: D(now - 1) as never, status: 'CANCELLED' }, now)).toBe(false);
    expect(isOverdue({ dueDate: null, status: 'PENDING' }, now)).toBe(false);
    expect(isOverdue({ dueDate: D(now + 1) as never, status: 'PENDING' }, now)).toBe(false);
  });
  it('due soon within the window', () => {
    expect(isDueSoon({ dueDate: D(now + 3600_000) as never, status: 'PENDING' }, 24, now)).toBe(true);
    expect(isDueSoon({ dueDate: D(now + 48 * 3600_000) as never, status: 'PENDING' }, 24, now)).toBe(false);
  });
  it('progress = completed / non-cancelled', () => {
    expect(progressOf([])).toBe(0);
    expect(progressOf([{ status: 'COMPLETED' }, { status: 'PENDING' }, { status: 'CANCELLED' }])).toBe(50);
    expect(progressOf([{ status: 'COMPLETED' }, { status: 'COMPLETED' }, { status: 'IN_PROGRESS' }])).toBe(67);
    expect(progressOf([{ status: 'CANCELLED' }])).toBe(0);
  });
  it('blockers that are not done', () => {
    const all = [{ id: 'a', status: 'COMPLETED' as const }, { id: 'b', status: 'IN_PROGRESS' as const }, { id: 'c', status: 'CANCELLED' as const }];
    expect(openBlockers({ blockedByTaskIds: ['a', 'b', 'c', 'missing'] }, all)).toEqual(['b']);
  });
});
