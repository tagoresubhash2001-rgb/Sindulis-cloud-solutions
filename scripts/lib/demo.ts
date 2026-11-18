import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { adminApp, bootstrapSuperAdmin, usingEmulator } from './bootstrap';

export const DEMO_PASSWORD = 'Demo@12345';
export const DEMO_USERS = [
  { key: 'super', email: 'super@demo.sindulis.test', name: 'Sanjana Rao', role: 'SUPER_ADMIN', dept: 'adm', designation: 'Managing Director' },
  { key: 'head', email: 'head@demo.sindulis.test', name: 'Harish Kumar', role: 'DEPARTMENT_HEAD', dept: 'sw', designation: 'Head of Software' },
  { key: 'pm', email: 'pm@demo.sindulis.test', name: 'Priya Menon', role: 'PROJECT_MANAGER', dept: 'sw', designation: 'Project Manager' },
  { key: 'tl', email: 'tl@demo.sindulis.test', name: 'Tarun Reddy', role: 'TEAM_LEADER', dept: 'sw', designation: 'Tech Lead' },
  { key: 'emp', email: 'emp@demo.sindulis.test', name: 'Arjun Varma', role: 'EMPLOYEE', dept: 'sw', designation: 'Frontend Developer' },
  { key: 'rev', email: 'rev@demo.sindulis.test', name: 'Divya Shah', role: 'EMPLOYEE', dept: 'sw', designation: 'QA Engineer' },
  { key: 'designer', email: 'design@demo.sindulis.test', name: 'Meera Iyer', role: 'EMPLOYEE', dept: 'dsn', designation: 'UI Designer' },
  { key: 'mkt', email: 'mkt@demo.sindulis.test', name: 'Kiran Das', role: 'EMPLOYEE', dept: 'mkt', designation: 'Marketing Executive' },
  { key: 'viewer', email: 'viewer@demo.sindulis.test', name: 'Vivek Rao', role: 'VIEWER', dept: 'adm', designation: 'Auditor' },
] as const;
export type DemoKey = (typeof DEMO_USERS)[number]['key'];

const audit = (by: string) => ({ createdAt: FieldValue.serverTimestamp(), createdBy: by, updatedAt: FieldValue.serverTimestamp(), updatedBy: by, isArchived: false });
const day = (n: number) => Timestamp.fromDate(new Date(Date.now() + n * 86_400_000));

/** Users only (used by the E2E test, which creates everything else through the UI). */
export async function seedUsers(projectId: string): Promise<Record<DemoKey, string>> {
  if (!usingEmulator()) throw new Error('seedUsers is emulator-only');
  const app = adminApp(projectId);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const ids = {} as Record<DemoKey, string>;
  const superUser = DEMO_USERS[0];
  ids.super = (await bootstrapSuperAdmin(projectId, superUser.email, superUser.name, DEMO_PASSWORD)).uid;
  for (const u of DEMO_USERS.slice(1)) {
    const existing = await auth.getUserByEmail(u.email).catch(() => null);
    const user = existing ?? (await auth.createUser({ email: u.email, password: DEMO_PASSWORD, displayName: u.name, emailVerified: true }));
    ids[u.key] = user.uid;
    await db.doc(`employees/${user.uid}`).set({ name: u.name, email: u.email, phone: '', departmentId: u.dept, role: u.role, designation: u.designation, managerId: null, active: true, avatarUrl: null, weeklyCapacityHours: 40, ...audit(ids.super) });
  }
  await db.doc('departments/sw').update({ headId: ids.head });
  return ids;
}

export async function seedDemo(projectId: string) {
  const ids = await seedUsers(projectId);
  const db = getFirestore(adminApp(projectId));
  const by = ids.pm;
  await db.doc('counters/clients').set({ value: 2 });
  await db.doc('counters/projects').set({ value: 2 });
  await db.doc('clients/c1').set({ code: 'CLI-0001', name: 'Sri Venkateswara Hospitals', company: 'SVH Group', contactPerson: 'Dr. Rao', phone: '+91 90000 00001', email: 'it@svh.example', address: 'Tirupati', departmentIds: ['sw', 'mkt'], status: 'ACTIVE', ...audit(by) });
  await db.doc('clients/c2').set({ code: 'CLI-0002', name: 'Guntur Public School', company: 'GPS Trust', contactPerson: 'Mrs. Lakshmi', phone: '+91 90000 00002', email: 'office@gps.example', address: 'Guntur', departmentIds: ['edu', 'dsn'], status: 'ACTIVE', ...audit(by) });
  const members = [ids.pm, ids.tl, ids.emp, ids.rev, ids.designer, ids.viewer];
  await db.doc('projects/p1').set({ code: 'PRJ-0001', name: 'Hospital ERP & Billing', clientId: 'c1', departmentId: 'sw', projectManagerId: ids.pm, memberIds: members, startDate: day(-20), endDate: day(40), priority: 'HIGH', budget: 850000, description: 'Patient registration, billing, pharmacy and reporting.', status: 'ACTIVE', clientVisible: false, ...audit(by) });
  await db.doc('projects/p2').set({ code: 'PRJ-0002', name: 'School Website Redesign', clientId: 'c2', departmentId: 'dsn', projectManagerId: ids.pm, memberIds: [ids.pm, ids.designer, ids.mkt], startDate: day(-5), endDate: day(2), priority: 'MEDIUM', budget: 120000, description: '', status: 'ACTIVE', clientVisible: false, ...audit(by) });
  await db.doc('milestones/m1').set({ projectId: 'p1', departmentId: 'sw', title: 'Phase 1 — Registration & Billing', description: '', dueDate: day(10), order: 0, status: 'IN_PROGRESS', deliverables: ['Patient registration', 'OPD billing'], ...audit(by) });
  const tasks: [string, string, string, string[], string | null, string, number, number][] = [
    ['t1', 'Design patient registration screens', 'p1', [ids.designer], ids.pm, 'COMPLETED', -10, -12],
    ['t2', 'Build registration API', 'p1', [ids.emp], ids.rev, 'IN_PROGRESS', 3, -5],
    ['t3', 'OPD billing module', 'p1', [ids.emp, ids.tl], ids.rev, 'WAITING_APPROVAL', 1, -4],
    ['t4', 'Pharmacy stock report', 'p1', [ids.tl], ids.pm, 'PENDING', -1, -3],
    ['t5', 'Homepage hero design', 'p2', [ids.designer], ids.pm, 'IN_PROGRESS', 1, -2],
    ['t6', 'Admissions landing copy', 'p2', [ids.mkt], ids.pm, 'PENDING', 5, -1],
  ];
  let n = 0;
  for (const [id, title, projectId, assignees, reviewer, status, due, start] of tasks) {
    n++;
    await db.doc(`tasks/${id}`).set({
      code: `TSK-${String(n).padStart(5, '0')}`, title, description: '', projectId, milestoneId: projectId === 'p1' ? 'm1' : null, departmentId: projectId === 'p1' ? 'sw' : 'dsn',
      ownerId: assignees[0], assigneeIds: assignees, reviewerId: reviewer, priority: n % 3 === 0 ? 'HIGH' : 'MEDIUM', startDate: day(start), dueDate: day(due), estimatedHours: 8 + n * 2, actualHours: status === 'COMPLETED' ? 12 : 3,
      status, checklistTotal: 0, checklistDone: 0, blockedByTaskIds: id === 't3' ? ['t2'] : [], revisionCount: 0, completedAt: status === 'COMPLETED' ? day(-11) : null, cancelReason: null, tags: [], ...audit(by),
    });
    if (status === 'WAITING_APPROVAL') {
      await db.doc(`task_submissions/s-${id}`).set({ taskId: id, projectId, submittedBy: assignees[0], note: 'Ready for review', fileRefs: [], version: 1, status: 'SUBMITTED', ...audit(assignees[0]) });
      await db.doc(`approvals/a-${id}`).set({ entityType: 'task', entityId: id, projectId, departmentId: 'sw', submissionId: `s-${id}`, level: 1, reviewerId: reviewer, requestedBy: assignees[0], decision: null, comment: '', decidedAt: null, decidedBy: null, ...audit(assignees[0]) });
    }
  }
  await db.doc('counters/tasks').set({ value: n });
  return DEMO_USERS.map((u) => ({ email: u.email, role: u.role }));
}
