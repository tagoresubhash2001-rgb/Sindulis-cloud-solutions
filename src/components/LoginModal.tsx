import React, { useEffect, useState } from 'react';
import { X, Lock, Key, ShieldCheck, AlertCircle } from 'lucide-react';
import type { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Firebase Auth is loaded on demand so the public site's initial bundle stays small.
const loadAuth = async () => {
  const [{ auth }, sdk] = await Promise.all([import('../lib/firebase'), import('firebase/auth')]);
  return { auth, ...sdk };
};

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: (email: string) => void;
}

const friendlyError = (code: string): string => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact your administrator.';
    default:
      return 'Sign-in failed. Please try again.';
  }
};

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<'all' | 'edulis' | 'sinfoxmedia' | 'sindulis'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;
    loadAuth().then(({ auth, onAuthStateChanged }) => {
      if (!cancelled) unsub = onAuthStateChanged(auth, setUser);
    });
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  const finish = (signedInEmail: string) => {
    onLoginSuccess?.(signedInEmail);
    onClose();
    navigate('/erp');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setIsLoading(true);
    try {
      const { auth, signInWithEmailAndPassword } = await loadAuth();
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      finish(cred.user.email ?? email.trim());
    } catch (err) {
      setError(friendlyError((err as { code?: string }).code ?? ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setInfo(null);
    setIsLoading(true);
    try {
      const { auth, signInWithPopup, GoogleAuthProvider } = await loadAuth();
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      finish(cred.user.email ?? '');
    } catch (err) {
      setError(friendlyError((err as { code?: string }).code ?? ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setError(null);
    setInfo(null);
    if (!email.trim()) {
      setError('Enter your email address first, then choose “Forgot password”.');
      return;
    }
    try {
      const { auth, sendPasswordResetEmail } = await loadAuth();
      await sendPasswordResetEmail(auth, email.trim());
    } catch {
      // Do not reveal whether the address exists.
    }
    setInfo('If an account exists for that address, a password reset link has been sent.');
  };

  const handleLogout = async () => {
    const { auth, signOut } = await loadAuth();
    await signOut(auth);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0B1299] via-[#0B1299] to-[#111827] text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-bold text-white border border-white/20">
              <Key className="w-3.5 h-3.5 text-[#E65100]" />
              <span>SINGLE SIGN-ON VAULT</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white pt-1">ACCOUNT LOGIN PORTAL</h3>
            <p className="text-xs text-slate-300">
              Unified authentication for EduLis, Sinfox Media & Sindulis Solutions
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {user ? (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-10 h-10 text-emerald-600" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  Welcome, {user.displayName || (user.email ?? '').split('@')[0]}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Connected Session: <span className="font-semibold text-slate-800">{user.email}</span>
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Sign Out SSO
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/erp');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#0B1299] text-white text-xs font-bold hover:bg-[#E65100] transition-colors cursor-pointer"
                >
                  Open ERP Workspace
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Target Workspace Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Destination Service
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPillar('edulis')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                      selectedPillar === 'edulis'
                        ? 'bg-[#E65100]/10 border-[#E65100] text-[#E65100]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    edulis
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPillar('sinfoxmedia')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                      selectedPillar === 'sinfoxmedia'
                        ? 'bg-[#111827] border-[#111827] text-white'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Sinfox Media
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPillar('sindulis')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                      selectedPillar === 'sindulis'
                        ? 'bg-[#0B1299]/10 border-[#0B1299] text-[#0B1299]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Sindulis
                  </button>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="sso-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Corporate Email Address
                </label>
                <input
                  id="sso-email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1299] text-sm text-slate-900 font-medium"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="sso-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Security Token / Password
                </label>
                <input
                  id="sso-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1299] text-sm text-slate-900 font-medium"
                />
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-1.5 text-xs font-semibold text-[#0B1299] hover:text-[#E65100] cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {info && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">{info}</div>
              )}

              {/* SSO Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0B1299] shrink-0" />
                <span>Encrypted authentication managed by Firebase Auth. Accounts are created by your administrator.</span>
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                Continue with Google
              </button>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B1299] hover:bg-[#E65100] text-white text-sm font-bold transition-all shadow-md shadow-[#0B1299]/20 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Verifying SSO Token...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#E65100]" />
                      <span>AUTHENTICATE SSO</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
