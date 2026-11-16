import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenLogin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <section className="relative pt-12 pb-6 sm:pt-16 sm:pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC]">
      {/* Background Subtle Mesh / Grid Decor */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-[#0B1299]/10 to-[#E65100]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E65100] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E65100]"></span>
          </span>
          <span className="text-[#0B1299]">Sindulis Cloud Infrastructure</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-normal">Single-Sign-On Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          One Ecosystem.{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0B1299] via-[#2A34C6] to-[#E65100]">
            Infinite Possibilities.
          </span>
        </h1>
      </div>
    </section>
  );
};

interface PortalBottomDetailsProps {
  activeTab: 'all' | 'active' | 'coming-soon';
  setActiveTab: (tab: 'all' | 'active' | 'coming-soon') => void;
}

export const PortalBottomDetails: React.FC<PortalBottomDetailsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="relative max-w-5xl mx-auto text-center space-y-8">
        
        {/* Supporting statement */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 font-normal leading-relaxed">
          Bridging Education, Enterprise Technology, and AI-Driven Brand Growth.
        </p>

        {/* Three value indicators */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-600 font-medium pt-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#0B1299]" />
            <span>AI Industry Readiness</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#E65100]" />
            <span>High-Ticket Brand Scale</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#111827]" />
            <span>Enterprise ERP & AI Agents</span>
          </div>
        </div>

        {/* Filter / View Switcher Tabs */}
        <div className="pt-6 flex justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-slate-200/70 border border-slate-300/60 shadow-inner">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Ecosystem Cards (6)
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-white text-[#0B1299] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Active Pillars (3)
            </button>
            <button
              onClick={() => setActiveTab('coming-soon')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'coming-soon'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Future Modules (3)
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
