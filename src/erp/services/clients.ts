import { onSnapshot, query, runTransaction, writeBatch } from 'firebase/firestore';
import { clientSchema, type ClientInput } from '../lib/schemas';
import type { Client, Employee } from '../types';
import { COL, asWriter, auditCreate, colRef, db, diffFields, docRef, formatCode, newDocRef, nextSequence, rowsOf, touched, writeLog, type ErrorHandler } from './db';

export function subscribeClients(onData: (rows: Client[]) => void, onError?: ErrorHandler) {
  return onSnapshot(query(colRef(COL.clients)), (s) => onData(rowsOf<Client>(s)), onError);
}

export async function createClient(actor: Employee, input: ClientInput): Promise<string> {
  const data = clientSchema.parse(input);
  const ref = newDocRef(COL.clients);
  await runTransaction(db, async (tx) => {
    const n = await nextSequence(tx, 'clients');
    const code = formatCode('CLI', n, 4);
    tx.set(ref, { ...data, code, ...auditCreate(actor.id) });
    writeLog(asWriter(tx), actor.id, { entityType: 'client', entityId: ref.id, projectId: null, departmentId: data.departmentIds[0] ?? null, action: 'created', summary: `Created client ${code} ${data.name}` });
  });
  return ref.id;
}

export async function updateClient(actor: Employee, client: Client, input: ClientInput): Promise<void> {
  const data = clientSchema.parse(input);
  const diff = diffFields(client, data);
  if (!diff) return;
  const b = writeBatch(db);
  b.update(docRef(COL.clients, client.id), { ...data, ...touched(actor.id) });
  writeLog(asWriter(b), actor.id, { entityType: 'client', entityId: client.id, projectId: null, departmentId: data.departmentIds[0] ?? null, action: 'updated', summary: `Updated client ${client.code}`, ...diff });
  await b.commit();
}
