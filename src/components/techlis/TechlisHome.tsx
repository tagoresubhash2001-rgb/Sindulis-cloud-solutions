import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Zap, Activity, CheckCircle2, Server, Database, Lock, Building2, GraduationCap, Building, Truck } from 'lucide-react';
import { TechlisPage } from '../../types';
import { CountUp } from '../CountUp';

interface TechlisHomeProps {
  onNavigate: (page: TechlisPage) => void;
  onOpenQuoteModal: (serviceName?: string) => void;
}

export const TechlisHome: React.FC<TechlisHomeProps> = ({
  onNavigate,
  onOpenQuoteModal,
}) => {
  const stats = [
    {
      metric: '99.99%',
      label: 'Enterprise Uptime SLA',
      subtext: 'High-availability multi-region cloud cluster deployment with zero failover impact.',
      icon: <Server className="w-5 h-5 text-[#0088FF]" />,
    },
    {
      metric: '45+',
      label: 'Proprietary Systems Built',
      subtext: 'Bespoke enterprise billing engines, multi-branch inventory, and executive portals.',
      icon: <Database className="w-5 h-5 text-[#0B1299]" />,
    },
    {
      metric: '3.5x',
      label: 'Operational Efficiency',
      subtext: 'Autonomous AI workflows reducing operational latency and administrative overhead.',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
    },
    {
      metric: '24/7',
      label: 'Dedicated Engineering Support',
      subtext: 'L3 engineering support hotline, direct SOC response, and continuous security patching.',
      icon: <Activity className="w-5 h-5 text-emerald-600" />,
    },
  ];

  const industries = [
    {
      id: 'healthcare',
      number: '01',
      badge: 'HEALTHCARE ARCHITECTURE',
      title: 'Healthcare Systems & Hospital Networks',
      subtitle: 'NABH-compliant patient portals, automated billing, and EHR/EMR cloud sync.',
      desc: 'Modernize hospital administration with intelligent patient scheduling engines, automated pharmacy inventory control, multi-department telemetry dashboards, and encrypted health data pipelines.',
      highlights: [
        'Automated OPD/IPD Patient Registration & Queue Control',
        'Multi-location Pharmacy & Asset Management Engine',
        'NABH Audit Readiness & Encrypted EHR Cloud Storage',
        'WhatsApp Automated Appointment Reminders & Lab Reports'
      ],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Get Hospital ERP Architecture',
      icon: <Building2 className="w-5 h-5 text-[#0088FF]" />,
      textLeft: true,
    },
    {
      id: 'education',
      number: '02',
      badge: 'ACADEMIC SYSTEMS',
      title: 'Educational Campuses & Universities',
      subtitle: 'Unified student portals, fee collection platforms, and AI-powered academic analytics.',
      desc: 'Empower university administrators with frictionless digital fee portals, biometric attendance sync, automated examination grading workflows, and real-time student performance tracking.',
      highlights: [
        'Automated Fee Collection & Payment Gateway Reconciliation',
        'Biometric Attendance & Leave Management Integration',
        'Student & Parent Portal Web App with Grade Analytics',
        'Multi-Campus Resource Scheduling & Facility Portals'
      ],
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Get Campus Management Portal',
      icon: <GraduationCap className="w-5 h-5 text-[#0B1299]" />,
      textLeft: false,
    },
    {
      id: 'real-estate',
      number: '03',
      badge: 'REAL ESTATE TECH',
      title: 'Real Estate & Infrastructure Developers',
      subtitle: 'Project walkthrough portals, booking CRMs, and buyer installment tracking.',
      desc: 'Accelerate property inventory sales with custom real estate CRMs, automated buyer milestone invoicing, interactive plot availability maps, and channel partner commission portals.',
      highlights: [
        'Interactive Masterplan Availability & Plot Booking CRM',
        'Automated Construction Milestone Invoicing & Payment Links',
        'Channel Partner Lead Attribution & Commission Engine',
        'Client Document Portal with Digital Signature Support'
      ],
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Get Developer CRM Engine',
      icon: <Building className="w-5 h-5 text-amber-600" />,
      textLeft: true,
    },
    {
      id: 'logistics',
      number: '04',
      badge: 'LOGISTICS & SUPPLY CHAIN',
      title: 'Corporate Logistics & Fleet Enterprise',
      subtitle: 'Real-time fleet tracking engines, dispatch automation, and ERP billing.',
      desc: 'Streamline complex supply chains with real-time GPS telemetry ingestion, automated dispatch routing, driver app connectivity, and cloud-hosted enterprise inventory auditing.',
      highlights: [
        'Real-Time GPS Fleet Telemetry & Route Optimization',
        'Automated Waybill & Dispatch Invoicing Systems',
        'Warehouse Inventory Multi-Location Reconciliation',
        'Driver & Partner Portal with Automated Payouts'
      ],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Get Fleet & Supply Chain ERP',
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
      textLeft: false,
    },
  ];

  return (
    <div className="bg-white text-[#0F172A] font-sans selection:bg-[#0088FF]/20 selection:text-[#0B1299]">
      
      {/* 1. HERO SECTION WITH GLASSMORPHISM METRICS */}
      <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-36 bg-slate-950 overflow-hidden border-b border-slate-800">
        {/* BACKGROUND GRADIENTS */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* HERO TEXT CONTENT */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight leading-[1.15]">
                We Architect Enterprise Systems That <span className="text-[#0088FF] bg-gradient-to-r from-[#0088FF] to-cyan-300 bg-clip-text text-transparent">Multiply Valuation & Scale Revenue.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
                Engineering bespoke AI-first ERPs, autonomous enterprise workflows, and high-security SaaS architectures for ambitious market leaders.
              </p>

              {/* DUAL CTAS */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenQuoteModal('Technical Architecture Blueprint')}
                  className="bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-xs px-8 py-4 rounded-full shadow-lg shadow-[#0088FF]/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Claim Technical Blueprint</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenQuoteModal('Enterprise SLA Consultation')}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-bold text-xs px-8 py-4 rounded-full shadow-sm flex items-center gap-2 transition-all hover:border-white/60"
                >
                  <span>Schedule SLA Consultation</span>
                </button>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>ISO 27001 Security Standard</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                  <Lock className="w-4 h-4 text-[#0088FF]" />
                  <span>99.99% Guaranteed SLA Uptime</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: TECH LIS SYSTEM BANNER PHOTO FRAME */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl border border-slate-800 bg-white/5 p-3 shadow-2xl backdrop-blur-md">
                <div className="relative h-[380px] sm:h-[460px] rounded-2xl overflow-hidden group">
                  <img
                    src="/assets/brands/techlis/hero.png"
                    alt="Tech Lis Enterprise Cloud Architecture"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/80 border border-white/20 backdrop-blur-md text-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">Cloud Systems</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">CLUSTER ACTIVE</span>
                    </div>
                    <div className="text-sm font-serif font-bold text-white">Enterprise AI & ERP Architecture</div>
                    <div className="text-[11px] text-slate-300">ISO 27001 Security Standard & 99.99% Guaranteed SLA Uptime</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE STATS ENGINE (SYMMETRICAL BADGE GRID) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#FAF9F6] rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-serif font-black text-[#0F172A]">
                    <CountUp value={item.metric} />
                  </span>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                    {item.icon}
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">{item.label}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTEGRATED "INDUSTRIES WE TRANSFORM & SCALE" */}
      <section className="py-24 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              ENTERPRISE DOMAINS
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              Industries We Transform & Scale
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Custom-engineered software engines designed around specific operational constraints and compliance mandates.
            </p>
          </div>

          {/* ALTERNATING ROWS FOR THE 4 INDUSTRIES */}
          <div className="space-y-20">
            {industries.map((ind) => (
              <div
                key={ind.id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm"
              >
                {/* TEXT COLUMN */}
                <div className={`space-y-6 ${!ind.textLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-slate-200 text-xs font-bold text-[#0B1299]">
                    {ind.icon}
                    <span>{ind.badge}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-serif font-black text-[#0F172A] tracking-tight">
                    {ind.title}
                  </h3>

                  <p className="text-sm font-semibold text-[#0088FF]">
                    {ind.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {ind.desc}
                  </p>

                  <div className="space-y-2.5 pt-1">
                    {ind.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-[#0088FF] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => onOpenQuoteModal(ind.title)}
                      className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs px-7 py-3.5 rounded-full shadow-md flex items-center gap-2 transition-all"
                    >
                      <span>{ind.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* IMAGE COLUMN */}
                <div className={`${!ind.textLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg relative bg-slate-900 group">
                    <img
                      src={ind.image}
                      alt={ind.title}
                      className="w-full h-[360px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-white/50 shadow-md flex items-center justify-between">
                      <div className="text-xs font-serif font-bold text-[#0F172A]">{ind.title}</div>
                      <span className="text-[10px] font-extrabold uppercase text-[#0088FF] bg-[#0088FF]/10 px-2 py-0.5 rounded">
                        DEPLOYED
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
