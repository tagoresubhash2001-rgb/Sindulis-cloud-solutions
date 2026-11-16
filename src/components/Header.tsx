import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenLogin: () => void;
  isLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogin, isLoggedIn }) => {
  return (
    <header className="sticky top-4 z-50 w-full max-w-6xl mx-auto px-4 sm:px-6 pointer-events-none">
      <div className="pointer-events-auto bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full px-4 sm:px-6 py-2.5 shadow-lg shadow-slate-200/10 flex items-center justify-between gap-3 transition-all duration-300">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/assets/brands/sindulis/logo.png"
            alt="Sindulis Logo"
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </div>

        {/* Center: Ecosystem Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E65100] animate-pulse"></span>
          <span>Ecosystem</span>
        </div>

        {/* Right Actions: Login Button */}
        <div className="flex items-center">
          <button
            onClick={onOpenLogin}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1299] hover:bg-[#0088FF] text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {isLoggedIn ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portal Active</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#E65100]" />
                <span>Portal Login</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
