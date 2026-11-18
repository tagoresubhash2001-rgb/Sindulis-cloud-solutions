import { query, runTransaction, where, writeBatch } from 'firebase/firestore';
import { isAdmin } from '../lib/permissions';
import { projectSchema, type ProjectInput } from '../lib/schemas';
import type { Employee, Project } from '../types';
import {
  COL,
  asWriter,
  auditCreate,
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

/** Projects the actor may read, using one query per scope the security rules can verify. */
export function subscribeVisibleProjects(me: Employee, onData: (rows: Project[]) => void, onError?: ErrorHandler) {
  const c = colRef(COL.projects);
  const queries = isAdmin(me)
    ? [query(c)]
    : [
        query(c, where('memberIds', 'array-contains', me.id)),
        ...(me.role === 'DEPARTMENT_HEAD' && me.departmentId ? [query(c, where('departmentId', '==', me.departmentId))] : []),
      ];
  return subscribeUnion<Project>(queries, onData, onError);
}

export async function createProject(actor: Employee, input: ProjectInput): Promise<string> {
  const data = projectSchema.parse(input);
  const ref = newDocRef(COL.projects);
  await runTransaction(db, async (tx) => {
    const n = await nextSequence(tx, 'projects');
    const code = formatCode('PRJ', n, 4);
    tx.set(ref, { ...data, code, ...auditCreate(actor.id) });
    const w = asWriter(tx);
    writeLog(w, actor.id, { entityType: 'project', entityId: ref.id, projectId: ref.id, departmentId: data.departmentId, action: 'created', summary: `Created project ${code} ${data.name}` });
    notifyMany(w, actor.id, data.memberIds, { type: 'TASK_ASSIGNED', title: `Added to project ${code}`, body: data.name, link: `/erp/projects/${ref.id}` });
  });
  return ref.id;
}

export async function updateProject(actor: Employee, project: Project, input: ProjectInput): Promise<void> {
  const data = projectSchema.parse(input);
  const diff = diffFields(project, data);
  if (!diff) return;
  const b = writeBatch(db);
  b.update(docRef(COL.projects, project.id), { ...data, ...touched(actor.id) });
  const w = asWriter(b);
  writeLog(w, actor.id, { entityType: 'project', entityId: project.id, projectId: project.id, departmentId: data.departmentId, action: 'updated', summary: `Updated project ${project.code}`, ...diff });
  const added = data.memberIds.filter((m) => !project.memberIds.includes(m));
  notifyMany(w, actor.id, added, { type: 'TASK_ASSIGNED', title: `Added to project ${project.code}`, body: data.name, link: `/erp/projects/${project.id}` });
  await b.commit();
}

/** Input shape of an existing project, for edit forms. */
export function projectToInput(p: Project): ProjectInput {
  return {
    name: p.name,
    clientId: p.clientId,
    departmentId: p.departmentId,
    projectManagerId: p.projectManagerId,
    memberIds: p.memberIds,
    startDate: p.startDate?.toDate() ?? null,
    endDate: p.endDate?.toDate() ?? null,
    priority: p.priority,
    budget: p.budget,
    description: p.description,
    status: p.status,
    clientVisible: p.clientVisible,
  };
}
