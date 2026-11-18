import { onAuthStateChanged, sendEmailVerification, signOut, type User } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { auth } from '../../lib/firebase';
import { COL, docRef } from '../services/db';
import { claimInvite, subscribeEmployee } from '../services/employees';
import type { Employee } from '../types';

export type AuthState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'unverified'; user: User }
  | { status: 'noAccess'; user: User; error?: string }
  | { status: 'inactive'; user: User; employee: Employee }
  | { status: 'ready'; user: User; employee: Employee };

interface AuthApi {
  state: AuthState;
  signOutNow: () => Promise<void>;
  /** After clicking the email verification link: refresh token and retry the invite claim. */
  recheck: () => Promise<void>;
  resendVerification: () => Promise<void>;
}

const Ctx = createContext<AuthApi | null>(null);

export function ErpAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [state, setState] = useState<AuthState>({ status: 'loading' });
  const [nonce, setNonce] = useState(0);
  const claiming = useRef(false);

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), []);

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      setState({ status: 'signedOut' });
      return;
    }
    setState({ status: 'loading' });
    let cancelled = false;
    const unsub = subscribeEmployee(
      user.uid,
      async (emp) => {
        if (cancelled) return;
        if (emp) {
          setState(emp.active ? { status: 'ready', user, employee: emp } : { status: 'inactive', user, employee: emp });
          return;
        }
        // No employee record yet: try to claim an invite for this (verified) email.
        const email = user.email?.toLowerCase();
        const invite = email ? await getDoc(docRef(COL.invites, email)).catch(() => null) : null;
        if (cancelled) return;
        if (!invite?.exists()) {
          setState({ status: 'noAccess', user });
          return;
        }
        if (!user.emailVerified) {
          setState({ status: 'unverified', user });
          return;
        }
        if (claiming.current) return;
        claiming.current = true;
        try {
          await user.getIdToken(true);
          await claimInvite(user); // snapshot fires again with the new record
        } catch (e) {
          if (!cancelled) setState({ status: 'noAccess', user, error: (e as Error).message });
        } finally {
          claiming.current = false;
        }
      },
      (err) => !cancelled && setState({ status: 'noAccess', user, error: err.message }),
    );
    return () => {
      cancelled = true;
      unsub();
    };
  }, [user, nonce]);

  const signOutNow = useCallback(async () => {
    await signOut(auth);
  }, []);

  const recheck = useCallback(async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    await auth.currentUser.getIdToken(true);
    setUser(auth.currentUser);
    setNonce((n) => n + 1);
  }, []);

  const resendVerification = useCallback(async () => {
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
  }, []);

  return <Ctx.Provider value={{ state, signOutNow, recheck, resendVerification }}>{children}</Ctx.Provider>;
}

export function useErpAuth(): AuthApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useErpAuth outside ErpAuthProvider');
  return v;
}
