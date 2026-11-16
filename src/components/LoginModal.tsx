import React, { useState } from 'react';
import { X, Lock, Key, ShieldCheck, Sparkles, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { UserSession } from '../types';

interface LoginModalProps {
  onClose: () => void;
  session: UserSession;
  setSession: (session: UserSession) => void;
  onShowToast: (msg: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  session,
  setSession,
  onShowToast
}) => {
  const [email, setEmail] = useState('user@sinduliscloud.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedPillar, setSelectedPillar] = useState<'all' | 'edulis' | 'sinfoxmedia' | 'sindulis'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSession({
        isLoggedIn: true,
        email: email,
        name: email.split('@')[0].toUpperCase(),
        role: 'Enterprise Administrator',
        accessibleServices: ['edulis', 'sinfoxmedia', 'sindulis']
      });
      onShowToast(`Authenticated successfully as ${email.split('@')[0]} via Sindulis Cloud SSO!`);
      onClose();
    }, 1000);
  };

  const handleLogout = () => {
    setSession({ isLoggedIn: false });
    onShowToast('Logged out of Sindulis Cloud SSO session.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0B1299] via-[#0B1299] to-[#111827] text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-bold text-white border border-white/20">
              <Key className="w-3.5 h-3.5 text-[#E65100]" />
              <span>SINGLE SIGN-ON VAULT</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white pt-1">
              ACCOUNT LOGIN PORTAL
            </h3>
            <p className="text-xs text-slate-300">
              Unified authentication for EduLis, Sinfox Media & Sindulis Solutions
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {session.isLoggedIn ? (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-10 h-10 text-emerald-600" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  Welcome, {session.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Connected Session: <span className="font-semibold text-slate-800">{session.email}</span>
                </p>
              </div>

              {/* Service Access Badges */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Ecosystem Permissions
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#E65100]/10 text-[#E65100] font-bold text-xs">
                    ✓ edulis Portal
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#111827] text-white font-bold text-xs">
                    ✓ Sinfox Media Portal
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#0B1299]/10 text-[#0B1299] font-bold text-xs">
                    ✓ Sindulis Solutions Portal
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Sign Out SSO
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#0B1299] text-white text-xs font-bold hover:bg-[#E65100] transition-colors cursor-pointer"
                >
                  Return to Ecosystem
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Corporate Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1299] text-sm text-slate-900 font-medium"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Security Token / Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1299] text-sm text-slate-900 font-medium"
                />
              </div>

              {/* SSO Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0B1299] shrink-0" />
                <span>Encrypted OAuth2 / SAML authentication managed by Firebase Auth</span>
              </div>

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
