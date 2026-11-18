import { GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { auth, usingEmulators } from '../../lib/firebase';
import { Button, ErrorBanner, Field, Input, Spinner } from '../components/ui';
import { useErpAuth } from '../hooks/useAuth';

const message = (code: string) =>
  ({
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/user-not-found': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/user-disabled': 'This account is disabled.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  })[code] ?? 'Sign-in failed. Please try again.';

export function LoginPage() {
  const { state } = useErpAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const from = (location.state as { from?: string } | null)?.from ?? '/erp';

  if (state.status === 'loading') return <Spinner />;
  if (state.status !== 'signedOut') return <Navigate to={from} replace />;

  const attempt = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try { await fn(); } catch (e) { setError(message((e as { code?: string }).code ?? '')); } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sindulis-navy text-white mb-3"><ShieldCheck className="w-6 h-6" /></div>
          <h1 className="text-xl font-bold text-slate-900">SINDULIS ERP</h1>
          <p className="text-sm text-slate-500">Work Management · sign in with your company account</p>
        </div>
        <form className="bg-white rounded-xl ring-1 ring-slate-200 shadow-sm p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); void attempt(() => signInWithEmailAndPassword(auth, email.trim(), password)); }}>
          {error && <ErrorBanner message={error} />}
          {info && <p className="text-sm rounded-lg bg-emerald-50 text-emerald-800 px-3 py-2">{info}</p>}
          <Field label="Email">{(id) => <Input id={id} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email" />}</Field>
          <Field label="Password">{(id) => <Input id={id} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} data-testid="login-password" />}</Field>
          <Button type="submit" className="w-full" loading={busy} data-testid="login-submit"><Lock className="w-4 h-4" /> Sign in</Button>
          <Button variant="secondary" className="w-full" disabled={busy} onClick={() => attempt(() => signInWithPopup(auth, new GoogleAuthProvider()))}>Continue with Google</Button>
          <button type="button" className="w-full text-xs font-semibold text-indigo-700 hover:underline" onClick={async () => {
            if (!email.trim()) return setError('Enter your email first.');
            await sendPasswordResetEmail(auth, email.trim()).catch(() => undefined);
            setInfo('If that account exists, a reset link is on its way.');
          }}>Forgot password?</button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-4">No account? Access is by invitation from your administrator. <Link to="/" className="text-indigo-700 hover:underline">Back to website</Link></p>
        {usingEmulators && <p className="text-center text-[11px] text-amber-700 mt-2">Emulator mode</p>}
      </div>
    </div>
  );
}

export function GateScreen() {
  const { state, signOutNow, recheck, resendVerification } = useErpAuth();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const Shell = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl ring-1 ring-slate-200 shadow-sm p-6 space-y-4 text-center">
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        {children}
        <div className="flex justify-center gap-2 pt-2">
          <Button variant="secondary" onClick={() => signOutNow()}>Sign out</Button>
          <Link to="/" className="inline-flex items-center px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">Public website</Link>
        </div>
      </div>
    </div>
  );
  if (state.status === 'unverified')
    return (
      <Shell title="Verify your email">
        <p className="text-sm text-slate-600">You’ve been invited to SINDULIS ERP. Open the verification link we emailed to <b>{state.user.email}</b>, then continue.</p>
        <div className="flex justify-center gap-2">
          <Button loading={busy} onClick={async () => { setBusy(true); await recheck(); setBusy(false); }}>I’ve verified, continue</Button>
          <Button variant="ghost" disabled={sent} onClick={async () => { await resendVerification().catch(() => undefined); setSent(true); }}>{sent ? 'Sent' : 'Resend email'}</Button>
        </div>
      </Shell>
    );
  if (state.status === 'inactive')
    return <Shell title="Account deactivated"><p className="text-sm text-slate-600">Your ERP access has been deactivated. Contact your administrator.</p></Shell>;
  if (state.status === 'noAccess')
    return (
      <Shell title="No ERP access yet">
        <p className="text-sm text-slate-600">You are signed in as <b>{state.user.email}</b>, but this account has not been invited to SINDULIS ERP. Ask an administrator to invite this email address.</p>
        {state.error && <ErrorBanner message={state.error} />}
      </Shell>
    );
  return <Spinner />;
}
