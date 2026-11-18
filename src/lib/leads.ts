/**
 * Public-site lead capture (Contact / Quote / Waitlist / Enroll forms → Firestore `leads`).
 * Kept dependency-light so the public bundle does not pull in the ERP. Rules allow create-only.
 */
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export type LeadSource =
  | 'portal-waitlist'
  | 'techlis-contact'
  | 'techlis-quote'
  | 'sinfox-contact'
  | 'sinfox-quote'
  | 'edulis-contact'
  | 'edulis-enroll';

export interface LeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  extra?: Record<string, string | number | boolean | string[] | undefined>;
}

const clip = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

export async function submitLead(source: LeadSource, p: LeadPayload): Promise<void> {
  const extra: Record<string, string> = {};
  for (const [k, v] of Object.entries(p.extra ?? {}).slice(0, 15)) {
    if (v === undefined) continue;
    extra[clip(k, 40)] = clip(Array.isArray(v) ? v.join(', ') : v, 500);
  }
  const email = clip(p.email, 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address');
  await addDoc(collection(db, 'leads'), {
    source,
    name: clip(p.name, 120),
    email,
    phone: clip(p.phone, 40),
    company: clip(p.company, 160),
    service: clip(p.service, 160),
    message: clip(p.message, 4000),
    extra,
    status: 'NEW',
    createdAt: serverTimestamp(),
  });
}
