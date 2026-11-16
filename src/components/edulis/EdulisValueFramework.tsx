import React from 'react';
import { BookOpen, Hammer, Play, Briefcase, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export const EdulisValueFramework: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'LEARN',
      subtitle: 'Domain AI Foundations',
      desc: 'Master prompt engineering, LLMs, Python automation, and domain-specific models directly applicable to your degree.',
      icon: BookOpen,
      badge: 'Weeks 1-3'
    },
    {
      num: '02',
      title: 'BUILD',
      subtitle: 'Live Capstone Projects',
      desc: 'Architect functional AI diagnostic tools, financial models, or engineering bots using real enterprise datasets.',
      icon: Hammer,
      badge: 'Weeks 4-6'
    },
    {
      num: '03',
      title: 'PRACTICE',
      subtitle: 'AI Mock Interviews',
      desc: 'Simulate high-stakes technical & domain interviews with instant feedback on speech, logic, and code.',
      icon: Play,
      badge: 'Weeks 7-8'
    },
    {
      num: '04',
      title: 'APPLY',
      subtitle: 'Corporate Internships',
      desc: 'Deploy live projects with corporate partner mentors at leading Pharma, Tech, and Financial institutions.',
      icon: Briefcase,
      badge: 'Weeks 9-10'
    },
    {
      num: '05',
      title: 'GET HIRED',
      subtitle: 'Direct Placement Drives',
      desc: 'Get referred directly to hiring managers with an ATS-optimized resume and verified AI digital portfolio.',
      icon: Award,
      badge: 'Weeks 11-12'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E65100] bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
            The EduLis Career Multiplier
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            College Degree Is The Foundation. AI Is The Multiplier.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Why traditional coaching fails: it teaches isolated theory. Our 5-stage transformation pipeline turns academic degree holders into industry-ready AI leaders.
          </p>
        </div>

        {/* Workflow Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="group relative bg-slate-50 hover:bg-[#0B1299] transition-all duration-300 rounded-2xl p-5 border border-slate-200/90 hover:border-[#0B1299] shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-extrabold text-[#0B1299] group-hover:text-orange-400 transition-colors">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300 bg-white group-hover:bg-white/10 px-2 py-0.5 rounded-full border border-slate-200 group-hover:border-white/20 transition-colors">
                      {step.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[#0B1299]/10 group-hover:bg-white/20 flex items-center justify-center text-[#0B1299] group-hover:text-white mb-3 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-white transition-colors">
                    {step.title}
                  </h3>
                  <div className="text-xs font-bold text-[#E65100] group-hover:text-orange-300 mb-2 transition-colors">
                    {step.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 group-hover:text-slate-200 leading-relaxed transition-colors">
                    {step.desc}
                  </p>
                </div>

                {/* Arrow indicator for step flow */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center text-slate-400 group-hover:text-[#0B1299]">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Outcomes Banner */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-[#0B1299] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-bold text-white">
              Ready to supercharge your career path?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Join 25,000+ students from Pharmacy, Engineering, Business, and Law who accelerated their placements.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-emerald-400">94.2% Placement Rate</div>
              <div className="text-[11px] text-slate-400">Verified by EduLis Alumni Network</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
