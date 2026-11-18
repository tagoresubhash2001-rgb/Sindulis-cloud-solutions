import { onSnapshot, query, serverTimestamp, writeBatch } from 'firebase/firestore';
import type { Employee, Lead, LeadStatus } from '../types';
import { COL, colRef, db, docRef, rowsOf, type ErrorHandler } from './db';

export function subscribeLeads(onData: (rows: Lead[]) => void, onError?: ErrorHandler) {
  return onSnapshot(query(colRef(COL.leads)), (s) => onData(rowsOf<Lead>(s).sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))), onError);
}

export async function setLeadStatus(actor: Employee, lead: Lead, status: LeadStatus): Promise<void> {
  const b = writeBatch(db);
  b.update(docRef(COL.leads, lead.id), { status, updatedAt: serverTimestamp(), updatedBy: actor.id });
  await b.commit();
}
