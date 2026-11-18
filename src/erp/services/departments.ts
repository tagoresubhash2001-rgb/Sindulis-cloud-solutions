import { onSnapshot, query, writeBatch } from 'firebase/firestore';
import { departmentSchema, type DepartmentInput } from '../lib/schemas';
import type { Department, Employee } from '../types';
import { COL, auditCreate, colRef, db, diffFields, docRef, newDocRef, rowsOf, touched, writeLog, asWriter, type ErrorHandler } from './db';

export function subscribeDepartments(onData: (rows: Department[]) => void, onError?: ErrorHandler) {
  return onSnapshot(query(colRef(COL.departments)), (s) => onData(rowsOf<Department>(s)), onError);
}

export async function createDepartment(actor: Employee, input: DepartmentInput): Promise<string> {
  const data = departmentSchema.parse(input);
  const ref = newDocRef(COL.departments);
  const b = writeBatch(db);
  b.set(ref, { ...data, ...auditCreate(actor.id) });
  writeLog(asWriter(b), actor.id, { entityType: 'department', entityId: ref.id, projectId: null, departmentId: ref.id, action: 'created', summary: `Created department ${data.name}` });
  await b.commit();
  return ref.id;
}

export async function updateDepartment(actor: Employee, dept: Department, input: DepartmentInput): Promise<void> {
  const data = departmentSchema.parse(input);
  const diff = diffFields(dept, data);
  if (!diff) return;
  const b = writeBatch(db);
  b.update(docRef(COL.departments, dept.id), { ...data, ...touched(actor.id) });
  writeLog(asWriter(b), actor.id, { entityType: 'department', entityId: dept.id, projectId: null, departmentId: dept.id, action: 'updated', summary: `Updated department ${data.name}`, ...diff });
  await b.commit();
}
