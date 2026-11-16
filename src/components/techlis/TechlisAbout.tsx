import React from 'react';
import { ArrowRight, ShieldCheck, Heart, Zap, Target, CheckCircle2, Sparkles, Eye, Rocket, Code, Lock, Server, Cpu } from 'lucide-react';
import { TechlisPage } from '../../types';
import { TimelineAnimate } from '../TimelineAnimate';

interface TechlisAboutProps {
  onNavigate: (page: TechlisPage) => void;
  onOpenQuoteModal: (serviceName?: string) => void;
}

export const TechlisAbout: React.FC<TechlisAboutProps> = ({
  onNavigate,
  onOpenQuoteModal,
}) => {
  const technicalPillars = [
    {
      title: 'Bank-Grade Security',
      desc: 'ISO 27001-aligned data encryption at rest & in transit, end-to-end OAuth2/SAML SSO, and continuous automated vulnerability scanning.',
      icon: <Lock className="w-5 h-5 text-[#0088FF]" />,
    },
    {
      title: 'Scalable Microservices',
      desc: 'Clean, type-safe TypeScript & Go microservices built to handle multi-million transaction bursts without performance degradation.',
      icon: <Code className="w-5 h-5 text-[#0B1299]" />,
    },
    {
      title: 'Autonomous AI Workflows',
      desc: 'Embedding custom LLM agents and predictive neural networks directly into daily operational workflows to eliminate human friction.',
      icon: <Cpu className="w-5 h-5 text-amber-500" />,
    },
    {
      title: 'Zero-Downtime Guarantee',
      desc: 'Automated CI/CD pipelines, multi-region Kubernetes clusters, blue-green deployment strategies, and active-active DB failover with 99.99% uptime.',
      icon: <Server className="w-5 h-5 text-emerald-600" />,
    },
  ];

  const timelineMilestones = [
    {
      year: '2023',
      title: 'Foundation & Custom Software Engine',
      desc: 'Established at 1/18 Bradipeta, Guntur as the engineering arm of Sindulis Innovative Solutions, building custom ERPs for healthcare & regional institutes.',
    },
    {
      year: '2024',
      title: 'Enterprise Billing & Portal Expansion',
      desc: 'Engineered multi-branch automated billing engines, real-time inventory portals, and payment gateway reconciliation software for 25+ enterprises.',
    },
    {
      year: '2025',
      title: 'AI Agents & Cloud Microservices',
      desc: 'Integrated autonomous AI workflow agents and cloud SaaS microservices into Tech Lis platform architecture, cutting operational delays by 70%.',
    },
    {
      year: '2026',
      title: 'Pan-India Enterprise Scaling',
      desc: 'Deployed enterprise software systems powering 45+ active corporate partners across AP, Telangana, and national markets with a 99.99% uptime SLA.',
    },
  ];

  return (
    <div className="bg-white text-[#0F172A] font-sans selection:bg-[#0088FF]/20 selection:text-[#0B1299]">
      
      {/* HERO SECTION WITH IMAGE SPLIT */}
      <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 bg-slate-950 overflow-hidden border-b border-slate-800">
        {/* BACKGROUND GRADIENTS */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* HERO TEXT CONTENT */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-slate-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#0088FF]" />
                <span>ENGINEERING PHILOSOPHY & CREDIBILITY</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight leading-[1.15]">
                Architecting The Digital Backbone <span className="text-[#0088FF] bg-gradient-to-r from-[#0088FF] to-cyan-300 bg-clip-text text-transparent">For Growth Enterprises.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
                Tech Lis merges AI-first software engineering, enterprise cloud architecture, and mission-critical reliability to power ambitious organizations.
              </p>
            </div>

            {/* RIGHT COLUMN: HERO BANNER IMAGE FRAME */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl border border-slate-800 bg-white/5 p-3 shadow-2xl backdrop-blur-md">
                <div className="relative h-[340px] sm:h-[400px] rounded-2xl overflow-hidden group">
                  <img
                    src="/assets/techlis/banners/techlis-about-hero.png"
                    alt="Tech Lis Engineering Credibility"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/80 border border-white/20 backdrop-blur-md text-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">Engineering System</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">VERIFIED</span>
                    </div>
                    <div className="text-sm font-serif font-bold text-white">System Architecture & Command</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* OUR VISION (TEXT LEFT / HIGH-RES CLOUD IMAGE RIGHT) */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0088FF]/10 text-[#0088FF] text-xs font-bold uppercase tracking-wider">
                <Eye className="w-4 h-4 text-[#0088FF]" />
                <span>OUR VISION</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight leading-tight">
                To Be India’s Premier AI-Native Enterprise Software Partner
              </h2>

              <p className="text-base text-slate-700 leading-relaxed font-normal">
                We envision an enterprise ecosystem where corporate leaders, healthcare directors, and educational institutions operate on intelligent, self-healing software infrastructure without technical debt or manual bottlenecks.
              </p>

              <p className="text-sm text-slate-500 leading-relaxed font-normal">
                By unifying cloud backend architecture, autonomous AI agents, and frictionless web interfaces under one engineering roof, Tech Lis empowers organizations to scale indefinitely.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onOpenQuoteModal('Tech Lis Vision Consultation')}
                  className="bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-xs px-7 py-3.5 rounded-full shadow-lg shadow-[#0088FF]/20 flex items-center gap-2 transition-all"
                >
                  <span>Explore Partner Vision</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-2xl relative bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="Tech Lis Vision & Team Architecture"
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-xl">
                  <div className="text-xs font-bold uppercase text-[#0088FF]">STRATEGIC ENGINEERING</div>
                  <div className="text-sm font-serif font-black text-[#0F172A]">Scalable Cloud Engines + Autonomous AI Logic</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* OUR MISSION (HIGH-RES AI IMAGE LEFT / TEXT RIGHT) */}
      <section className="py-20 lg:py-24 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <div className="lg:order-1">
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-2xl relative bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
                  alt="Tech Lis Mission & Server Racks"
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-xl">
                  <div className="text-xs font-bold uppercase text-[#0B1299]">MISSION EXECUTION</div>
                  <div className="text-sm font-serif font-black text-[#0F172A]">Zero Downtime • Guaranteed SLA • Security</div>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1299]/10 text-[#0B1299] text-xs font-bold uppercase tracking-wider">
                <Rocket className="w-4 h-4 text-[#0B1299]" />
                <span>OUR MISSION</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight leading-tight">
                Eliminating Operational Latency Through Software Excellence
              </h2>

              <p className="text-base text-slate-700 leading-relaxed font-normal">
                Our mission is to arm enterprise leadership across Andhra Pradesh, Telangana, and pan-India with robust software architecture, automated billing portals, and customized ERP systems.
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0088FF]" />
                  <span>Deliver 100% type-safe, resilient cloud application codebases.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0088FF]" />
                  <span>Deploy automated AI agent pipelines for real-time document & data parsing.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0088FF]" />
                  <span>Maintain rigorous 24/7 system telemetry and SOC security compliance.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenQuoteModal('Tech Lis Engineering Engagement')}
                  className="bg-[#0B1299] hover:bg-[#090e7a] text-white font-bold text-xs px-7 py-3.5 rounded-full shadow-lg shadow-[#0B1299]/20 flex items-center gap-2 transition-all"
                >
                  <span>Start Engineering Engagement</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 TECHNICAL PILLARS (SYMMETRICAL VECTOR CARDS) */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              THE TECH LIS STANDARD
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              4 Technical Pillars
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              The foundational engineering standards behind every deployed cloud service and custom portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalPillars.map((p, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#FAF9F6] rounded-3xl border border-slate-200 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm w-fit group-hover:scale-110 transition-transform">
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#0F172A]">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{p.desc}</p>
                </div>
                <div className="pt-2 text-[10px] font-extrabold uppercase text-[#0088FF]">
                  PILLAR 0{idx + 1}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ENGINEERING JOURNEY TIMELINE (CENTRAL VERTICAL AXIS) */}
      <section className="py-24 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              ENGINEERING EVOLUTION
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              Engineering Journey & Milestones
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              From bespoke internal modules to a pan-India enterprise digital transformation platform.
            </p>
          </div>

          {/* Central Vertical Axis Timeline */}
          <TimelineAnimate>
            <div className="relative ml-4 sm:ml-32 space-y-12">
              {/* Vertical Guide Line */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#0088FF]/20" />
              {/* Vertical Progress Line */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 timeline-line-v-progress" />
              
              {timelineMilestones.map((item, idx) => (
                <div key={idx} className="relative pl-8 group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0088FF] border-4 border-white shadow timeline-node delay-node-${idx}" />
                  
                  <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-shadow timeline-card delay-card-${idx}`}>
                    <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#0088FF]/10 text-[#0088FF] text-xs font-black tracking-wide">
                      {item.year}
                    </div>
                    <h3 className="text-xl font-serif font-bold text-[#0F172A]">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TimelineAnimate>

        </div>
      </section>

    </div>
  );
};
