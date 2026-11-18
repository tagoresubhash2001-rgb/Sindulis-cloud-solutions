import { initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const PROJECT_ID = 'demo-sindulis-rules';

export async function makeEnv(): Promise<RulesTestEnvironment> {
  return initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8'), host: '127.0.0.1', port: 8080 },
    storage: { rules: readFileSync(resolve(__dirname, '../../storage.rules'), 'utf8'), host: '127.0.0.1', port: 9199 },
  });
}

const audit = (by = 'super') => ({ createdAt: Timestamp.now(), createdBy: by, updatedAt: Timestamp.now(), updatedBy: by, isArchived: false });

export const USERS = {
  super: { role: 'SUPER_ADMIN', departmentId: 'd1' },
  admin: { role: 'ADMIN', departmentId: 'd1' },
  head1: { role: 'DEPARTMENT_HEAD', departmentId: 'd1' },
  head2: { role: 'DEPARTMENT_HEAD', departmentId: 'd2' },
  pm: { role: 'PROJECT_MANAGER', departmentId: 'd1' },
  tl: { role: 'TEAM_LEADER', departmentId: 'd1' },
  emp: { role: 'EMPLOYEE', departmentId: 'd1' },
  emp2: { role: 'EMPLOYEE', departmentId: 'd1' },
  reviewer: { role: 'EMPLOYEE', departmentId: 'd1' },
  viewer: { role: 'VIEWER', departmentId: 'd1' },
  outsider: { role: 'EMPLOYEE', departmentId: 'd2' },
  inactive: { role: 'ADMIN', departmentId: 'd1', active: false },
} as const;
export type UserKey = keyof typeof USERS;

export const baseTask = (over: Record<string, unknown> = {}) => ({
  code: 'TSK-00001',
  title: 'Design homepage',
  description: '',
  projectId: 'p1',
  milestoneId: null,
  departmentId: 'd1',
  ownerId: 'emp',
  assigneeIds: ['emp'],
  reviewerId: 'reviewer',
  priority: 'MEDIUM',
  startDate: null,
  dueDate: null,
  estimatedHours: 4,
  actualHours: 0,
  status: 'PENDING',
  checklistTotal: 0,
  checklistDone: 0,
  blockedByTaskIds: [],
  revisionCount: 0,
  completedAt: null,
  cancelReason: null,
  tags: [],
  ...audit('pm'),
  ...over,
});

export async function seed(env: RulesTestEnvironment) {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    for (const [id, u] of Object.entries(USERS)) {
      await setDoc(doc(db, 'employees', id), {
        name: id, email: `${id}@example.com`, phone: '', departmentId: u.departmentId, role: u.role,
        designation: '', managerId: null, active: 'active' in u ? u.active : true, avatarUrl: null, weeklyCapacityHours: 40, ...audit(),
      });
    }
    await setDoc(doc(db, 'departments', 'd1'), { name: 'Software', code: 'SW', headId: 'head1', active: true, ...audit() });
    await setDoc(doc(db, 'departments', 'd2'), { name: 'Marketing', code: 'MKT', headId: 'head2', active: true, ...audit() });
    const project = (id: string, dept: string, pm: string, members: string[]) => ({
      code: id.toUpperCase(), name: `Project ${id}`, clientId: 'c1', departmentId: dept, projectManagerId: pm, memberIds: members,
      startDate: null, endDate: null, priority: 'MEDIUM', budget: 0, description: '', status: 'ACTIVE', clientVisible: false, ...audit(),
    });
    await setDoc(doc(db, 'projects', 'p1'), project('p1', 'd1', 'pm', ['pm', 'tl', 'emp', 'emp2', 'reviewer', 'viewer']));
    await setDoc(doc(db, 'projects', 'p2'), project('p2', 'd2', 'outsider', ['outsider']));
    await setDoc(doc(db, 'tasks', 't1'), baseTask());
    await setDoc(doc(db, 'tasks', 't2'), baseTask({ projectId: 'p2', departmentId: 'd2', ownerId: 'outsider', assigneeIds: ['outsider'], reviewerId: null }));
    await setDoc(doc(db, 'tasks', 'tWait'), baseTask({ status: 'WAITING_APPROVAL' }));
    await setDoc(doc(db, 'tasks', 'tArch'), baseTask({ isArchived: true, archivedBy: 'admin', archivedAt: Timestamp.now(), status: 'COMPLETED' }));
    await setDoc(doc(db, 'approvals', 'a1'), {
      entityType: 'task', entityId: 'tWait', projectId: 'p1', departmentId: 'd1', submissionId: 's1', level: 1,
      reviewerId: 'reviewer', requestedBy: 'emp', decision: null, comment: '', decidedAt: null, decidedBy: null, ...audit('emp'),
    });
    await setDoc(doc(db, 'task_submissions', 's1'), { taskId: 'tWait', projectId: 'p1', submittedBy: 'emp', note: '', fileRefs: [], version: 1, status: 'SUBMITTED', ...audit('emp') });
    await setDoc(doc(db, 'activity_logs', 'log1'), { entityType: 'task', entityId: 't1', projectId: 'p1', departmentId: 'd1', action: 'created', summary: 'x', before: null, after: null, actorId: 'pm', at: Timestamp.now() });
    await setDoc(doc(db, 'notifications', 'n1'), { userId: 'emp', type: 'TASK_ASSIGNED', title: 't', body: 'b', link: '/erp', read: false, createdAt: Timestamp.now(), createdBy: 'pm' });
    await setDoc(doc(db, 'counters', 'tasks'), { value: 5 });
    await setDoc(doc(db, 'invites', 'newbie@example.com'), { email: 'newbie@example.com', name: 'Newbie', role: 'EMPLOYEE', departmentId: 'd1', designation: '', claimedBy: null, ...audit('admin') });
  });
}
