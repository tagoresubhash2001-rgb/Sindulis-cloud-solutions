import { query, where, writeBatch } from 'firebase/firestore';
import { isAdmin } from '../lib/permissions';
import { milestoneSchema, type MilestoneInput } from '../lib/schemas';
import type { Employee, Milestone, Project } from '../types';
import { COL, asWriter, auditCreate, chunk, colRef, db, diffFields, docRef, newDocRef, subscribeUnion, touched, writeLog, type ErrorHandler } from './db';

export function subscribeMilestones(me: Employee, projectIds: string[], onData: (rows: Milestone[]) => void, onError?: ErrorHandler) {
  const c = colRef(COL.milestones);
  const queries = isAdmin(me) ? [query(c)] : chunk(projectIds).map((ids) => query(c, where('projectId', 'in', ids)));
  return subscribeUnion<Milestone>(queries, onData, onError);
}

export async function createMilestone(actor: Employee, project: Project, input: MilestoneInput): Promise<string> {
  const data = milestoneSchema.parse(input);
  const ref = newDocRef(COL.milestones);
  const b = writeBatch(db);
  b.set(ref, { ...data, departmentId: project.departmentId, ...auditCreate(actor.id) });
  writeLog(asWriter(b), actor.id, { entityType: 'milestone', entityId: ref.id, projectId: project.id, departmentId: project.departmentId, action: 'created', summary: `Added milestone “${data.title}” to ${project.code}` });
  await b.commit();
  return ref.id;
}

export async function updateMilestone(actor: Employee, project: Project, m: Milestone, input: MilestoneInput): Promise<void> {
  const data = milestoneSchema.parse(input);
  const diff = diffFields(m, data);
  if (!diff) return;
  const b = writeBatch(db);
  b.update(docRef(COL.milestones, m.id), { ...data, ...touched(actor.id) });
  writeLog(asWriter(b), actor.id, { entityType: 'milestone', entityId: m.id, projectId: project.id, departmentId: project.departmentId, action: data.status === 'COMPLETED' && m.status !== 'COMPLETED' ? 'completed' : 'updated', summary: `Updated milestone “${data.title}”`, ...diff });
  await b.commit();
}
