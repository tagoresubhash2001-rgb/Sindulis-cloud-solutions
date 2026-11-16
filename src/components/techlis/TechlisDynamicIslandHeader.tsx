import React, { useState } from 'react';
import { TechlisPage, AppView } from '../../types';
import { Menu, X } from 'lucide-react';

interface TechlisDynamicIslandHeaderProps {
  activePage: TechlisPage;
  onPageChange: (page: TechlisPage) => void;
  onSwitchView?: (view: AppView) => void;
  onOpenQuoteModal: () => void;
}

export const TechlisDynamicIslandHeader: React.FC<TechlisDynamicIslandHeaderProps> = ({
  activePage,
  onPageChange,
  onSwitchView,
  onOpenQuoteModal,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { id: TechlisPage; label: string }[] = [
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

  const handleNavClick = (pageId: TechlisPage) => {
    onPageChange(pageId);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-4 z-50 w-full max-w-6xl mx-auto px-4 sm:px-6 pointer-events-none">
      <div className="pointer-events-auto bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full px-4 sm:px-6 py-2.5 shadow-lg shadow-slate-200/10 flex items-center justify-between gap-3 transition-all duration-300">
        
        {/* BRAND LOGO - ROUTING TO PORTAL */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 group text-left focus:outline-none cursor-pointer"
          aria-label="Return to Sindulis Portal"
        >
          <img
            src="/assets/brands/techlis/logo.png"
            alt="Tech Lis Logo"
            className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-102"
          />
        </button>

        {/* CENTER NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0B1299] text-white shadow-sm font-bold border border-[#0B1299]/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
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
            className="bg-[#0B1299] hover:bg-[#0088FF] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md shadow-[#0B1299]/20 transition-all hover:scale-103 active:scale-97 cursor-pointer border border-[#0B1299]/30"
          >
            Get a Free Consultation
          </button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE NAV OVERLAY */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl flex flex-col gap-3 animate-fade-in">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1299] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="border-t border-slate-100 pt-3">
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full bg-[#0B1299] hover:bg-[#0088FF] text-white text-xs font-bold py-3 rounded-xl shadow-md transition-all text-center cursor-pointer block"
            >
              Get a Free Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
