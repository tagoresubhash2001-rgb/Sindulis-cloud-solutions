/**
 * Public-site lead capture (Contact / Quote / Waitlist / Enroll forms → Firestore `leads`).
 * The Firebase SDK is loaded on demand so the public bundle stays small. Rules allow create-only.
 */
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

export function buildLead(source: LeadSource, p: LeadPayload) {
  const extra: Record<string, string> = {};
  for (const [k, v] of Object.entries(p.extra ?? {}).slice(0, 15)) {
    if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) continue;
    extra[clip(k, 40)] = clip(Array.isArray(v) ? v.join(', ') : v, 500);
  }
  const email = clip(p.email, 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address');
  return {
    source,
    name: clip(p.name, 120),
    email,
    phone: clip(p.phone, 40),
    company: clip(p.company, 160),
    service: clip(p.service, 160),
    message: clip(p.message, 4000),
    extra,
    status: 'NEW' as const,
  };
}

export async function submitLead(source: LeadSource, p: LeadPayload): Promise<void> {
  const lead = buildLead(source, p);
  const [{ db }, { addDoc, collection, serverTimestamp }] = await Promise.all([import('./firebase'), import('firebase/firestore')]);
  await addDoc(collection(db, 'leads'), { ...lead, createdAt: serverTimestamp() });
}

/** Save a lead; on failure tell the visitor instead of showing a false success. */
export async function saveLeadOrAlert(source: LeadSource, p: LeadPayload): Promise<boolean> {
  try {
    await submitLead(source, p);
    return true;
  } catch (err) {
    console.error('Lead submission failed', err);
    window.alert('Sorry, we could not send your request right now. Please try again in a moment, or contact us directly.');
    return false;
  }
}
