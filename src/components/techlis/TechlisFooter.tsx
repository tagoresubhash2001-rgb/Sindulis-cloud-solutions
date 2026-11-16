import React from 'react';
import { TechlisPage, AppView } from '../../types';
import { LayoutGrid, Cpu, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface TechlisFooterProps {
  onPageChange: (page: TechlisPage) => void;
  onSwitchView: (view: AppView) => void;
  onOpenQuoteModal: () => void;
}

export const TechlisFooter: React.FC<TechlisFooterProps> = ({
  onPageChange,
  onSwitchView,
  onOpenQuoteModal,
}) => {
  return (
    <footer className="bg-[#0F172A] text-white border-t border-slate-800 font-sans">
      
      {/* TOP CTA BAND */}
      <div className="border-b border-slate-800 py-12 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs font-bold text-[#0088FF] uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
              <Cpu className="w-4 h-4 text-[#0088FF]" />
              <span>ENTERPRISE DIGITAL TRANSFORMATION</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Ready To Modernize Your Enterprise Infrastructure?
            </h3>
          </div>

          <button
            onClick={onOpenQuoteModal}
            className="bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-xs px-7 py-3.5 rounded-full shadow-lg shadow-[#0088FF]/20 flex items-center gap-2 transition-all shrink-0"
          >
            <span>Schedule SLA Consultation</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN FOOTER NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* BRAND COL (4 COLS) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <img
              src="/assets/brands/techlis/logo.png"
              alt="Tech Lis Logo"
              className="h-8 w-auto object-contain"
            />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            AI-First Digital Transformation, Custom Enterprise ERPs, Autonomous AI Agents, and Scalable Cloud Microservices Infrastructure.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onSwitchView('sindulis-portal')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#0088FF]" />
              <span>Sindulis Ecosystem Portal</span>
            </button>
          </div>
        </div>

        {/* QUICK LINKS (3 COLS) */}
        <div className="md:col-span-3 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Platform Pages
          </div>
          <ul className="space-y-2 text-xs text-slate-300 font-medium">
            <li>
              <button
                onClick={() => {
                  onPageChange('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#0088FF] transition-colors"
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
                className="hover:text-[#0088FF] transition-colors"
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
                className="hover:text-[#0088FF] transition-colors"
              >
                Services
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onPageChange('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#0088FF] transition-colors"
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* SINDULIS ECOSYSTEM PILLARS (4 COLS) */}
        <div className="md:col-span-4 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Ecosystem Solutions
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div
              onClick={() => onSwitchView('sinfox')}
              className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <div>
                <div className="font-bold text-white">Sinfox Media</div>
                <div className="text-[10px] text-slate-400">Branding & AI Growth Agency</div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div
              onClick={() => onSwitchView('edulis')}
              className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <div>
                <div className="font-bold text-white">EduLis</div>
                <div className="text-[10px] text-slate-400">AI-Powered Industry Readiness</div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM LEGAL BAR */}
      <div className="border-t border-slate-800 py-6 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>© 2026 Tech Lis • A Division of Sindulis Innovative Solutions.</span>
          </div>
          <div>1/18 Bradipeta, Guntur - 522006, Andhra Pradesh.</div>
        </div>
      </div>

    </footer>
  );
};
