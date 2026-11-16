import React from 'react';
import { SinfoxPage } from '../../types';
import { CountUp } from '../CountUp';
import { TimelineAnimate } from '../TimelineAnimate';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  Palette,
  Code,
  TrendingUp
} from 'lucide-react';

interface SinfoxAboutProps {
  onNavigate: (page: SinfoxPage) => void;
  onOpenQuoteModal: (serviceName?: string) => void;
}

export const SinfoxAbout: React.FC<SinfoxAboutProps> = ({
  onNavigate,
  onOpenQuoteModal,
}) => {
  const stats = [
    {
      value: '19+',
      label: 'BRANDS WORKED WITH',
      subtext: 'Across regional hubs & growth sectors',
      icon: <Sparkles className="w-5 h-5 text-[#0088FF]" />,
    },
    {
      value: '77+',
      label: 'PROJECTS DELIVERED',
      subtext: 'From strategy to execution systems',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    },
    {
      value: '17+',
      label: 'CLIENT RELATIONSHIPS',
      subtext: 'Retained commercial partnerships',
      icon: <Users className="w-5 h-5 text-[#0B1299]" />,
    },
    {
      value: '24/7',
      label: 'DELIVERY SUPPORT',
      subtext: 'Structured support across active engagements',
      icon: <Clock className="w-5 h-5 text-amber-500" />,
    },
  ];

  const timelineMilestones = [
    {
      year: '2022',
      title: 'Foundation in Guntur (AP)',
      desc: 'Established at 1/18 Bradipeta, Guntur as a specialized brand agency serving regional business houses and educational institutes.',
    },
    {
      year: '2023',
      title: '4K Cinema & Drone Fleet Expansion',
      desc: 'Invested in high-end cinema camera rigs, studio lighting, and DGCA-licensed drone operators for real estate & campus films.',
    },
    {
      year: '2024',
      title: 'Software & Portal Integration',
      desc: 'Merged tech engineering into media services, building custom CRMs, billing portals, and automated WhatsApp growth systems.',
    },
    {
      year: '2025-2026',
      title: 'Pan-India Enterprise Scaling',
      desc: 'Crossed 77+ delivered projects across AP, Telangana, and national markets with a 98% enterprise retainer rate.',
    },
  ];

  const handleScrollToPhilosophy = () => {
    const el = document.getElementById('operating-philosophy');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-[#0088FF]/20 selection:text-[#0B1299]">
      
      {/* ==================================================================== */}
      {/* 01 — ABOUT HERO BANNER (FULL-WIDTH STRATEGY ENVIRONMENT)             */}
      {/* ==================================================================== */}
      <section className="relative h-[620px] sm:h-[680px] lg:h-[720px] w-full flex items-center bg-slate-950 overflow-hidden border-b border-slate-900 -mt-20 pt-20">
        {/* Full-width Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/sinfox/about/about-strategy-hero.webp"
            alt="Sinfox Strategy Environment - Premium executive desk with documents"
            className="w-full h-full object-cover object-[75%_center] sm:object-right opacity-70"
            loading="eager"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-2xl text-left space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-slate-300 text-[11px] sm:text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#0088FF]" />
              <span>THE THINKING BEHIND SINFOX</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-serif font-black text-white tracking-tight leading-[1.1]">
              Growth Is Never<br />
              Just A Marketing<br />
              <span className="text-[#0088FF] bg-gradient-to-r from-[#0088FF] to-cyan-300 bg-clip-text text-transparent">Problem.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
              Sinfox brings strategy, brand, technology and execution together to help ambitious businesses understand what matters, build what is needed and move forward with clarity.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleScrollToPhilosophy}
                className="bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-sm px-8 py-4 rounded-full shadow-xl shadow-[#0088FF]/30 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                How We Work
              </button>

              <button
                onClick={() => onOpenQuoteModal()}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-7 py-4 rounded-full transition-all cursor-pointer backdrop-blur-sm"
              >
                Start a Conversation
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 04 — TRANSITIONAL BREATHING ZONE                                    */}
      {/* ==================================================================== */}
      <div className="h-16 bg-[#FFFFFF] border-b border-slate-100" />

      {/* ==================================================================== */}
      {/* 02 — OUR BELIEF (SPACIOUS EDITORIAL SECTIONS)                        */}
      {/* ==================================================================== */}
      <section className="py-24 sm:py-32 bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-6 text-left space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
                WHAT WE BELIEVE
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight leading-tight">
                Better Execution Starts With Better Decisions.
              </h2>
            </div>

            <div className="lg:col-span-6 text-left space-y-6">
              <p className="text-base text-slate-700 leading-relaxed font-semibold">
                Businesses rarely struggle because they lack activity. They struggle when positioning is unclear, brand perception is weak, systems are disconnected, customer journeys are fragmented or growth efforts are moving in different directions.
              </p>
              
              <p className="text-sm text-slate-500 leading-relaxed">
                Sinfox exists to connect those decisions. We look at the business first — and the deliverable second. We align your narrative directly with operational scale.
              </p>

              <div className="pt-6 border-t border-slate-200">
                <blockquote className="text-lg sm:text-xl font-serif italic font-bold text-[#0B1299] leading-relaxed">
                  “We don't begin by asking what service you need. We begin by understanding what the business needs to achieve.”
                </blockquote>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 03 — OUR OPERATING MODEL (PREMIUM GRID CARDS)                         */}
      {/* ==================================================================== */}
      <section id="operating-philosophy" className="py-24 sm:py-32 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl space-y-3 text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              ONE PARTNER. FOUR DISCIPLINES.
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              Built To Connect Thinking With Execution.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: '01',
                title: 'STRATEGY',
                desc: 'We clarify the market, business problem, competitive position and priorities before deciding what should be built.',
                priorities: ['Business Diagnosis', 'Market Understanding', 'Positioning', 'Growth Direction'],
                icon: <Palette className="w-5 h-5 text-[#0088FF]" />
              },
              {
                num: '02',
                title: 'BRAND',
                desc: 'We shape how the business is understood, remembered and experienced.',
                priorities: ['Brand Strategy', 'Identity', 'Messaging', 'Experience', 'Creative Direction'],
                icon: <Users className="w-5 h-5 text-[#0B1299]" />
              },
              {
                num: '03',
                title: 'TECHNOLOGY',
                desc: 'We build the infrastructure required to turn ideas into scalable systems.',
                priorities: ['Web Platforms', 'Software', 'CRM', 'Automation', 'AI Systems'],
                icon: <Code className="w-5 h-5 text-emerald-600" />
              },
              {
                num: '04',
                title: 'GROWTH',
                desc: 'We take the strategy to market, measure what happens and continuously improve performance.',
                priorities: ['Performance Marketing', 'Search', 'Content', 'Lead Generation', 'Optimization'],
                icon: <TrendingUp className="w-5 h-5 text-amber-600" />
              }
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#0088FF]/30 transition-all duration-300"
              >
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-black text-[#0088FF]">{pillar.num}</span>
                    {pillar.icon}
                  </div>
                  <h3 className="text-lg font-serif font-black text-[#0F172A]">{pillar.title}</h3>
                  <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 space-y-1.5 text-left">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">FOCUS AREAS</div>
                  {pillar.priorities.map((item, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="text-[#0088FF]">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 04 — THE SINFOX DIFFERENCE (ALTERNATING SYSTEM ARCHITECTURE LAYOUT)  */}
      {/* ==================================================================== */}
      <section className="py-24 sm:py-32 bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left side text explanation */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
                WHY THE MODEL MATTERS
              </span>
              
              <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight leading-tight">
                The Problem With Disconnected Execution.
              </h2>

              <div className="text-sm text-slate-650 space-y-4 leading-relaxed font-semibold">
                <p>A brand consultant may define the positioning.</p>
                <p>A creative studio may design the identity.</p>
                <p>A software company may build the platform.</p>
                <p>A marketing agency may run campaigns.</p>
                <p className="text-slate-500 font-normal">
                  But when each works independently, the business often becomes fragmented. Context gets lost. Strategy gets diluted.
                </p>
              </div>

              <div className="pt-4 pl-4 border-l-2 border-[#0088FF] space-y-2">
                <div className="text-xs font-extrabold text-[#0B1299] uppercase tracking-wider">SINFOX CONNECTION</div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-serif font-black text-[#0F172A]">
                  <span>STRATEGY</span>
                  <span className="text-[#0088FF]">→</span>
                  <span>BRAND</span>
                  <span className="text-[#0088FF]">→</span>
                  <span>TECHNOLOGY</span>
                  <span className="text-[#0088FF]">→</span>
                  <span>GROWTH</span>
                </div>
                <p className="text-xs text-slate-500">
                  One direction. Multiple disciplines. One connected growth system.
                </p>
              </div>
            </div>

            {/* Right side strategic wall visual */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative h-[320px] sm:h-[380px] max-w-md mx-auto">
                <img
                  src="/assets/sinfox/home/brand-system-cap.webp"
                  alt="Sinfox Connected System strategy board"
                  className="w-full h-full object-cover grayscale-[10%]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 05 — HOW WE THINK (4 PRINCIPLES CARDS)                               */}
      {/* ==================================================================== */}
      <section className="py-24 sm:py-32 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl space-y-3 text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              OUR PRINCIPLES
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              How We Make Decisions.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: '01',
                title: 'CLARITY BEFORE ACTIVITY',
                desc: 'More activity does not automatically create more growth. We identify what matters before adding execution.'
              },
              {
                num: '02',
                title: 'BUSINESS BEFORE DELIVERABLE',
                desc: 'The objective determines the solution — not the service catalogue.'
              },
              {
                num: '03',
                title: 'SYSTEMS OVER CAMPAIGNS',
                desc: 'Strong growth comes from connected systems that improve over time.'
              },
              {
                num: '04',
                title: 'MEASURE WHAT MATTERS',
                desc: 'Attention alone is not success. We focus on meaningful business movement.'
              }
            ].map((p, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[260px] hover:border-[#0088FF]/30 transition-all duration-300 text-left"
              >
                <div>
                  <div className="text-xs font-serif font-black text-[#0088FF]">{p.num}</div>
                  <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mt-4 leading-snug">
                    {p.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-550 leading-relaxed font-semibold mt-4">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 06 — JOURNEY & TIMELINE Evolution (CLEAN NEUTRAL EDITORIAL TIMELINE) */}
      {/* ==================================================================== */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              OUR EVOLUTION
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              Built Through Execution. Evolving Through Strategy.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
              Sinfox began by helping businesses communicate better. Every project exposed a larger truth: growth problems are rarely isolated. Brand, technology, marketing and customer experience influence one another.
            </p>
          </div>

          {/* Premium Neutral/Transparent Vertical Timeline */}
          <TimelineAnimate>
            <div className="relative ml-4 sm:ml-32 space-y-12 bg-transparent">
              <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-slate-200" />
              <div className="absolute left-[7px] top-0 bottom-0 w-0.5 timeline-line-v-progress bg-[#0088FF]" />
              
              {timelineMilestones.map((item, idx) => (
                <div key={idx} className="relative pl-8 group transition-all duration-700 ease-out">
                  {/* Timeline Marker Point */}
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#0088FF] shadow-sm z-10 transition-colors" />
                  
                  <div className="bg-[#FAF9F6] p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-left max-w-2xl">
                    <div className="text-xs font-extrabold text-[#0088FF] uppercase tracking-wider">
                      {item.year}
                    </div>
                    <h3 className="text-lg font-serif font-black text-[#0F172A] mt-1.5 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-550 leading-relaxed font-semibold mt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TimelineAnimate>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 07 — PROOF NUMBERS (Fact-Based Asymmetric Stats)                     */}
      {/* ==================================================================== */}
      <section className="py-20 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((metric, idx) => (
              <div
                key={idx}
                className="p-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
              >
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-sm shrink-0">
                  {metric.icon}
                </div>
                <div className="space-y-1 text-left">
                  <div className="text-5xl font-serif font-black text-[#0F172A]">
                    <CountUp value={metric.value} />
                  </div>
                  <div className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest">
                    {metric.label}
                  </div>
                  <div className="text-xs text-slate-500">
                    {metric.subtext}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 08 — WHO WE WORK BEST WITH (COMPACT SECTOR TARGETS)                 */}
      {/* ==================================================================== */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl space-y-3 text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              THE RIGHT PARTNERSHIP
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              Built For Businesses Ready For Their Next Stage.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'ESTABLISHED BUSINESSES', desc: 'That have outgrown their current brand or growth model and need structural modernization.' },
              { title: 'AMBITIOUS FOUNDERS', desc: 'Who need deep brand differentiation and channel clarity before scaling operations.' },
              { title: 'INSTITUTIONS', desc: 'That need stronger market trust, doctor/campus authority, and optimized digital client paths.' },
              { title: 'GROWTH TEAMS', desc: 'That need strategic direction and tactical execution capabilities to operate under one connected system.' }
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-[#FAF9F6] p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#0088FF]/30 transition-all text-left flex flex-col justify-between min-h-[220px]"
              >
                <h4 className="text-sm font-bold text-[#0B1299] tracking-wider uppercase leading-snug">
                  {card.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold mt-4">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 09 — OUR VISION SECTION (HIGH-IMPACT EDITORIAL TYPOGRAPHY)           */}
      {/* ==================================================================== */}
      <section className="py-28 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
            WHERE WE ARE GOING
          </span>

          <h2 className="text-4xl sm:text-6xl font-serif font-black text-[#0F172A] tracking-tight leading-tight">
            Building A New Kind Of Growth Company.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Our ambition is not to become the agency with the longest service list. It is to build a company capable of understanding business problems from multiple angles — and bringing the right combination of strategy, brand, technology and execution to solve them.
          </p>

          <div className="pt-4 border-t border-slate-200 text-sm font-serif italic font-bold text-[#0B1299] uppercase tracking-widest">
            Think clearly. Build deliberately. Grow intelligently.
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 10 — PURPOSE & DIRECTION INTRO                                       */}
      {/* ==================================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
            PURPOSE & DIRECTION
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
            What Drives Us. Where We're Going.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Our mission defines the work we do today. Our vision defines the company we are building for tomorrow.
          </p>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 11 — MISSION & VISION EDITORIAL CARD BLOCKS                          */}
      {/* ==================================================================== */}
      <section className="pb-28 bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Mission: Image Left, Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#0088FF]/30 transition-all duration-300">
            <div className="lg:col-span-6 min-h-[300px] lg:min-h-full relative overflow-hidden order-1 lg:order-none">
              <img
                src="/assets/sinfox/about/mission-direction.webp"
                alt="Sinfox Mission - Directed strategy workspace"
                className="w-full h-full object-cover grayscale-[10%]"
              />
            </div>
            <div className="lg:col-span-6 p-8 sm:p-12 text-left space-y-6 flex flex-col justify-center order-2 lg:order-none">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
                OUR MISSION
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-black text-[#0F172A] tracking-tight leading-tight">
                Turn Business Ambition Into Structured Growth.
              </h3>
              <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-semibold">
                Our mission is to help ambitious businesses move forward with greater clarity by connecting strategy, brand, technology and market execution.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                We work to understand the real business challenge first, then build the positioning, experiences, systems and growth initiatives required to solve it.
              </p>
              <div className="pt-4 border-t border-slate-100 text-xs font-bold text-[#0B1299] uppercase tracking-wider">
                Think clearly. Build deliberately. Execute with purpose.
              </div>
            </div>
          </div>

          {/* Vision: Text Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#0088FF]/30 transition-all duration-300">
            <div className="lg:col-span-6 p-8 sm:p-12 text-left space-y-6 flex flex-col justify-center order-2 lg:order-none">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
                OUR VISION
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-black text-[#0F172A] tracking-tight leading-tight">
                Build A Growth Company Designed For What Comes Next.
              </h3>
              <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-semibold">
                Our vision is to build Sinfox into a deeply integrated growth partner where business thinking, brand intelligence, technology and execution operate as one connected system.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                We aim to help businesses move beyond fragmented vendors and isolated campaigns toward stronger brands, smarter systems and sustainable market growth.
              </p>
              <div className="pt-4 border-t border-slate-100 text-xs font-bold text-[#0B1299] uppercase tracking-wider">
                Strategy that creates direction. Systems that create scale. Growth that compounds.
              </div>
            </div>
            <div className="lg:col-span-6 min-h-[300px] lg:min-h-full relative overflow-hidden order-1 lg:order-none">
              <img
                src="/assets/sinfox/about/vision-future.webp"
                alt="Sinfox Vision - Scale and progression architecture"
                className="w-full h-full object-cover grayscale-[10%]"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 12 — FINAL CTA SECTION (NAVY BACKGROUND)                             */}
      {/* ==================================================================== */}
      <section className="py-28 bg-gradient-to-br from-[#0F172A] to-[#0B1299] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-widest border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>START WITH THE CHALLENGE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Tell Us Where The Business Needs To Go Next.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            You don't need to know which service you need. Start with the business objective, challenge or opportunity.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenQuoteModal()}
              className="bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-sm px-8 py-4 rounded-full shadow-xl shadow-[#0088FF]/30 transition-all hover:scale-103 active:scale-97 cursor-pointer"
            >
              Book a Strategic Consultation
            </button>
            <button
              onClick={() => {
                onNavigate('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-8 py-4 rounded-full transition-all cursor-pointer"
            >
              Explore Our Capabilities
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
