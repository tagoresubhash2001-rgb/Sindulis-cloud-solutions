import React, { useState } from 'react';
import { SinfoxPage, AppView } from '../../types';
import { Menu, X } from 'lucide-react';

interface SinfoxDynamicIslandHeaderProps {
  activePage: SinfoxPage;
  onPageChange: (page: SinfoxPage) => void;
  onSwitchView?: (view: AppView) => void;
  onOpenQuoteModal: () => void;
}

export const SinfoxDynamicIslandHeader: React.FC<SinfoxDynamicIslandHeaderProps> = ({
  activePage,
  onPageChange,
  onSwitchView,
  onOpenQuoteModal,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { id: SinfoxPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleLogoClick = () => {
    if (onSwitchView) {
      onSwitchView('sindulis-portal');
    }
  };

  const handleNavClick = (pageId: SinfoxPage) => {
    onPageChange(pageId);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-4 z-50 w-full max-w-6xl mx-auto px-4 sm:px-6 pointer-events-none">
      <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-900 rounded-full px-4 sm:px-6 py-2.5 shadow-xl shadow-black/25 flex items-center justify-between gap-3 transition-all duration-300">
        
        {/* BRAND LOGO - ROUTING TO PORTAL */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 group text-left focus:outline-none cursor-pointer"
          aria-label="Return to Sindulis Portal"
        >
          <img
            src="/assets/brands/sinfox/logo.png"
            alt="Sinfox Media Logo"
            className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-102"
          />
        </button>

        {/* CENTER NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-800/80">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-sm font-bold border border-slate-200/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT ACTION - CTA ONLY */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={onOpenQuoteModal}
            className="bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold px-5 py-2.5 rounded-full shadow-md transition-all hover:scale-103 active:scale-97 cursor-pointer"
          >
            Get a Free Consultation
          </button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-white focus:outline-none cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE NAV OVERLAY */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 pointer-events-auto bg-slate-950/95 backdrop-blur-md border border-slate-900 rounded-2xl p-4 shadow-xl flex flex-col gap-3 animate-fade-in">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-950'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="border-t border-slate-900 pt-3">
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full bg-white text-slate-950 text-xs font-bold py-3 rounded-xl shadow-md transition-all text-center cursor-pointer block"
            >
              Get a Free Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
