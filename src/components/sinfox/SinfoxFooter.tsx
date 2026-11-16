import React from 'react';
import { SinfoxPage, AppView } from '../../types';
import { Mail, Phone, MapPin, ArrowUpRight, Sparkles } from 'lucide-react';

interface SinfoxFooterProps {
  onPageChange: (page: SinfoxPage) => void;
  onSwitchView?: (view: AppView) => void;
  onOpenQuoteModal: () => void;
}

export const SinfoxFooter: React.FC<SinfoxFooterProps> = ({
  onPageChange,
  onSwitchView,
  onOpenQuoteModal,
}) => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 font-sans border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* TOP EDITORIAL ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* BRAND SUMMARY (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/assets/brands/sinfox/logo.png"
                alt="Sinfox Media Logo"
                className="h-8 w-auto object-contain"
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal max-w-sm">
              Visual Storytelling, Full-Stack Software Engineering & Digital Marketing Agency. A Subsidiary of Sindulis Innovative Solutions.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0088FF]" />
                <span>1/18 Bradipeta, Guntur - 522006, AP, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 94940 80479</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>sinfoxmedia@gmail.com</span>
              </div>
            </div>
          </div>

          {/* QUICK LINKS (2 COLS) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">NAVIGATION</div>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button
                  onClick={() => {
                    onPageChange('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onPageChange('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onPageChange('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Services Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onPageChange('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* CORE SERVICES (3 COLS) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">CORE VERTICALS</div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Digital Marketing & Meta Ads</li>
              <li>Custom CRM & Web Engineering</li>
              <li>Native iOS & Android Apps</li>
              <li>4K Drone Aerial Cinematography</li>
              <li>Commercial Videography & VFX</li>
              <li>Strategic Branding & Packaging</li>
            </ul>
          </div>

          {/* ECOSYSTEM LINK (3 COLS) */}
          <div className="lg:col-span-3 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>SINDULIS ECOSYSTEM</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore EduLis AI Academy or return to the main Sindulis Cloud Portal.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              {onSwitchView && (
                <button
                  onClick={() => onSwitchView('edulis')}
                  className="w-full bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-between transition-all"
                >
                  <span>EduLis AI Academy</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onSwitchView && (
                <button
                  onClick={() => onSwitchView('sindulis-portal')}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-between transition-all"
                >
                  <span>Sindulis Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Sinfox Media. All rights reserved. A Subsidiary of Sindulis Innovative Solutions.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenQuoteModal} className="hover:text-slate-300 transition-colors">
              Request Proposal
            </button>
            <span>•</span>
            <span className="text-slate-600">Privacy & Confidentiality</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
