import React from 'react';
import { Lock, Key, ShieldCheck, ArrowRight, Layers, CheckCircle } from 'lucide-react';

interface BottomActionAreaProps {
  onOpenLogin: () => void;
}

export const BottomActionArea: React.FC<BottomActionAreaProps> = ({ onOpenLogin }) => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
      <div className="relative rounded-3xl p-8 sm:p-12 bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden">
        
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#0B1299]/5 to-[#E65100]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#111827]/5 to-[#0B1299]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto space-y-6">
          
          {/* Security Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#0B1299]/20 text-[#0B1299] text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-[#0B1299]" />
            <span>Unified Ecosystem Identity</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Access Your Sindulis Workspace
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-normal">
            Manage your cross-pillar credentials, institutional AI dashboards, and client brand assets through our centralized security vault.
          </p>

          {/* Prominent Primary CTA Button */}
          <div className="pt-2">
            <button
              onClick={onOpenLogin}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0B1299] via-[#0B1299] to-[#111827] hover:from-[#E65100] hover:to-[#0B1299] text-white text-base sm:text-lg font-extrabold tracking-wide shadow-lg shadow-[#0B1299]/25 hover:shadow-xl hover:shadow-[#E65100]/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                <Lock className="w-5 h-5 text-[#E65100] group-hover:text-white transition-colors" />
              </div>
              <span>ACCOUNT LOGIN PORTAL</span>
              <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Required Subtext */}
          <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1 flex items-center justify-center gap-2">
            <Key className="w-3.5 h-3.5 text-[#E65100]" />
            <span>Single sign-on for EduLis, Sinfox Media, and Tech Lis</span>
          </p>

          {/* SSO Supported Pillar Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-semibold">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">edulis SSO</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">Sinfox Media SSO</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">Tech Lis SSO</span>
          </div>

        </div>

      </div>
    </section>
  );
};
