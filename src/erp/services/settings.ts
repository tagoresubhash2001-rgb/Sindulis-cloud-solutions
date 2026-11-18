import { onSnapshot, setDoc } from 'firebase/firestore';
import { settingsSchema } from '../lib/schemas';
import { DEFAULT_SETTINGS, type Employee, type OrgSettings } from '../types';
import { COL, docRef, touched, type ErrorHandler } from './db';

export function subscribeSettings(onData: (s: OrgSettings) => void, onError?: ErrorHandler) {
  return onSnapshot(docRef(COL.settings, 'org'), (s) => onData({ ...DEFAULT_SETTINGS, ...(s.exists() ? (s.data() as Partial<OrgSettings>) : {}) }), onError);
}

export async function saveSettings(actor: Employee, input: OrgSettings): Promise<void> {
  const data = settingsSchema.parse(input);
  await setDoc(docRef(COL.settings, 'org'), { ...data, ...touched(actor.id) });
}
