import React from 'react';
import { SinfoxPage } from '../../types';
import { CountUp } from '../CountUp';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  Building2,
  GraduationCap,
  Building,
  ShoppingBag,
  TrendingUp,
  Code,
  Palette,
  Video,
  Layers,
  ArrowDown
} from 'lucide-react';

interface SinfoxHomeProps {
  onNavigate: (page: SinfoxPage) => void;
  onOpenQuoteModal: (service?: string) => void;
}

export const SinfoxHome: React.FC<SinfoxHomeProps> = ({
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

  const connectedSystem = [
    {
      num: '01',
      title: 'DIAGNOSE',
      desc: 'Understand the business, customer, market and constraint.',
    },
    {
      num: '02',
      title: 'POSITION',
      desc: 'Define where the business should compete and what it stands for.',
    },
    {
      num: '03',
      title: 'BUILD',
      desc: 'Create the brand, messaging, experience and assets.',
    },
    {
      num: '04',
      title: 'LAUNCH',
      desc: 'Translate strategy into market-facing execution.',
    },
    {
      num: '05',
      title: 'GROW',
      desc: 'Create demand through focused marketing & communication.',
    },
    {
      num: '06',
      title: 'OPTIMIZE',
      desc: 'Measure what is working and continuously improve.',
    },
  ];

  const diagnosticStatements = [
    {
      symptom: '“Our business has grown. Our brand still looks small.”',
      diagnosis: 'BRAND PERCEPTION GAP',
      perspective: 'The market may still be seeing the company that existed three years ago, not the company it has become.',
    },
    {
      symptom: '“Our marketing is active. Growth is still inconsistent.”',
      diagnosis: 'GROWTH SYSTEM GAP',
      perspective: 'More campaigns cannot compensate for weak positioning, fragmented journeys or unclear demand strategy.',
    },
    {
      symptom: '“We generate enquiries. Too few become customers.”',
      diagnosis: 'CONVERSION GAP',
      perspective: 'Friction in the lead lifecycle or mismatch between marketing message and actual sales intent.',
    },
    {
      symptom: '“Customers know the category. They don’t know why they should choose us.”',
      diagnosis: 'POSITIONING GAP',
      perspective: 'Failure to establish unique authority, leaving the business to compete purely on price.',
    },
    {
      symptom: '“We want to enter a bigger market. Our current brand cannot carry us there.”',
      diagnosis: 'MARKET READINESS GAP',
      perspective: 'The existing brand equity does not translate to higher-tier enterprise or premium customer credibility.',
    },
    {
      symptom: '“We create a lot of content. Very little builds brand value.”',
      diagnosis: 'COMMUNICATION GAP',
      perspective: 'Ad-hoc publishing without a single positioning anchor results in high noise but low commercial memory.',
    },
  ];

  const industries = [
    {
      id: 'healthcare',
      label: 'HEALTHCARE & HOSPITALS',
      keywords: 'TRUST. DISCOVERY. PATIENT ACQUISITION.',
      challenge: 'Healthcare growth depends on trust before promotion.',
      priorities: ['Institution positioning', 'Doctor authority', 'Local discovery', 'Patient acquisition journeys'],
      outcome: 'Become easier to trust, easier to discover and easier to choose.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      textLeft: true,
    },
    {
      id: 'education',
      label: 'EDUCATIONAL INSTITUTIONS',
      keywords: 'REPUTATION. ENROLMENT. PREFERENCE.',
      challenge: 'Scale rests on positioning and regional reputation.',
      priorities: ['Institution positioning', 'Admissions strategy', 'Student communication', 'Parent trust'],
      outcome: 'High preference rating, qualified student interest, and consistent enrollments.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      textLeft: false,
    },
    {
      id: 'realestate',
      label: 'REAL ESTATE & INFRASTRUCTURE',
      keywords: 'CREDIBILITY. DEMAND. CONVERSION.',
      challenge: 'High-ticket layouts require premium digital assurance.',
      priorities: ['High-ticket positioning', 'Site authority', 'Visual trust assets', 'WhatsApp journey'],
      outcome: 'Qualified buyers, shortened conversion paths, and high booking velocity.',
      image: '/assets/sinfox/home/real-estate.webp',
      textLeft: true,
    },
    {
      id: 'ecommerce',
      label: 'RETAIL & D2C BRANDS',
      keywords: 'DISTINCTION. DESIRE. REPEAT PURCHASE.',
      challenge: 'Margins depend on brand memory and repeat purchase cycles.',
      priorities: ['D2C brand narratives', 'Performance creative loops', 'Storefront optimization', 'Retention flows'],
      outcome: 'Elevated customer lifetime value and optimized marketing return on ad spend.',
      image: '/assets/sinfox/home/d2c-retail.webp',
      textLeft: false,
    },
  ];

  const handleExploreFrameworkScroll = () => {
    const el = document.getElementById('sinfox-growth-system');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-[#0088FF]/20 selection:text-[#0B1299]">
      
      {/* ==================================================================== */}
      {/* 01 — HERO BANNER (CHESS DECISIVE MOVE & NAVBAR INTERFACE RELATION)     */}
      {/* ==================================================================== */}
      <section className="relative h-[700px] sm:h-[760px] lg:h-[820px] w-full flex items-center bg-slate-950 overflow-hidden border-b border-slate-900 -mt-20 pt-20">
        {/* Full-width Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/sinfox/home/sinfox-strategy-hero.webp"
            alt="Sinfox Decisive Move - Upright chess knight showing deep chessboard positioning"
            className="w-full h-full object-cover object-[75%_center] sm:object-right opacity-75"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        {/* Dynamic breathing spacer below floating Nova Bar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32">
          <div className="max-w-2xl text-left space-y-8">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-slate-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#0088FF]" />
              <span>BRAND & BUSINESS GROWTH PARTNER</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-serif font-black text-white tracking-tight leading-[1.08]">
              Every Move<br />
              Should Move The<br />
              <span className="text-[#0088FF] bg-gradient-to-r from-[#0088FF] to-cyan-300 bg-clip-text text-transparent">Business Forward.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-lg">
              We align business strategy, brand and growth execution to help ambitious companies build stronger market positions and scale with clarity.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenQuoteModal()}
                className="bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-sm px-8 py-4 rounded-full shadow-xl shadow-[#0088FF]/30 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                Book a Strategic Consultation
              </button>

              <button
                onClick={handleExploreFrameworkScroll}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-7 py-4 rounded-full transition-all cursor-pointer backdrop-blur-sm"
              >
                See How We Think
              </button>
            </div>

            <div className="pt-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-white/10 max-w-sm">
              Strategy • Brand • Growth • Creative Execution
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 04 — TRANSITIONAL BREATHING ZONE                                    */}
      {/* ==================================================================== */}
      <div className="h-16 bg-[#FFFFFF] border-b border-slate-100" />

      {/* ==================================================================== */}
      {/* 05 — EDITORIAL MANIFESTO: GROWTH PROBLEMS (ASYMMETRIC COMPOSITION)   */}
      {/* ==================================================================== */}
      <section className="py-28 sm:py-36 bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column - Large Editorial Serif Title */}
            <div className="lg:col-span-6 text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
                MORE THAN EXECUTION
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-[72px] font-serif font-black text-[#0F172A] tracking-tight leading-[1.05] mt-4">
                Growth<br />
                Problems<br />
                Rarely Begin<br />
                With<br />
                Marketing.
              </h2>
            </div>

            {/* Right Column - Diagnostic Rows with Separators */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-semibold border-l-4 border-[#0088FF] pl-4">
                Marketing performance is often a symptom. Before increasing activity, we examine the underlying constraints:
              </p>

              <div className="border-t border-slate-200">
                {[
                  { num: '01', title: 'MARKET', text: 'Are we competing for the right opportunity?' },
                  { num: '02', title: 'POSITION', text: 'Is the business meaningfully differentiated?' },
                  { num: '03', title: 'BRAND', text: 'Does the market understand and trust it?' },
                  { num: '04', title: 'OFFER', text: 'Is the value proposition strong enough?' },
                  { num: '05', title: 'EXPERIENCE', text: 'Does the customer journey support conversion?' },
                  { num: '06', title: 'GROWTH', text: 'Can demand be created and captured efficiently?' },
                ].map((item, idx) => (
                  <div key={idx} className="py-4 border-b border-slate-100 flex items-center justify-between min-h-[68px]">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-serif font-black text-[#0088FF]">{item.num}</span>
                      <span className="text-xs font-extrabold text-slate-900 tracking-widest uppercase">{item.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-semibold text-right max-w-md">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-xs sm:text-sm font-serif font-bold text-[#0B1299] uppercase tracking-widest pt-2">
                “Fix the constraint before increasing the activity.”
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 07 — THE SINFOX GROWTH DISCIPLINES (MONUMENTAL 2X2 GRID)             */}
      {/* ==================================================================== */}
      <section className="py-28 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">THE SINFOX GROWTH DISCIPLINES</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              Four Disciplines. One Commercial Direction.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                num: '01',
                title: 'STRATEGY',
                q: 'Where should we compete — and how should we win?',
                items: ['Market Intelligence', 'Competitive Positioning', 'Go-To-Market', 'Growth Direction'],
                closing: 'CLARITY BEFORE ACTIVITY.'
              },
              {
                num: '02',
                title: 'BRAND',
                q: 'Why should the market choose, trust and remember us?',
                items: ['Brand positioning', 'Brand architecture', 'Identity systems', 'Messaging systems'],
                closing: 'MEANING BEFORE VISIBILITY.'
              },
              {
                num: '03',
                title: 'GROWTH',
                q: 'How do we create and capture demand?',
                items: ['Growth strategy', 'Performance marketing', 'Search ecosystems', 'Lead generation'],
                closing: 'DEMAND WITH DIRECTION.'
              },
              {
                num: '04',
                title: 'CREATIVE EXECUTION',
                q: 'How does strategy become something the market can actually experience?',
                items: ['Campaign creative', 'Commercial film', 'Photography systems', 'Brand communication'],
                closing: 'STRATEGY MADE VISIBLE.'
              }
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white p-10 sm:p-12 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[380px] hover:shadow-md hover:border-[#0088FF]/30 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Large Background Number Motif */}
                <div className="absolute right-8 bottom-4 text-9xl font-serif font-black text-slate-100 select-none pointer-events-none group-hover:text-slate-200/60 transition-colors">
                  {pillar.num}
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                    {pillar.title}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0F172A] leading-snug max-w-md">
                    {pillar.q}
                  </h3>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 pt-4 border-t border-slate-100 max-w-md">
                    {pillar.items.map((item, iIdx) => (
                      <span key={iIdx} className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0088FF]" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 text-xs font-bold text-[#0B1299] uppercase tracking-wider relative z-10">
                  {pillar.closing}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 08 — SINFOX GROWTH SYSTEM (SIGNATURE GRAPHIC PATHWAY)                 */}
      {/* ==================================================================== */}
      <section id="sinfox-growth-system" className="py-28 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              THE SINFOX GROWTH SYSTEM
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              From Business Ambition To Market Growth.
            </h2>
          </div>

          {/* Strategic continuous coordinate line graphic */}
          <div className="relative w-[90%] mx-auto py-8">
            
            {/* Chess-like strategic continuous line (Desktop only) */}
            <div className="hidden lg:block absolute top-[48px] left-[4%] right-[4%] h-[2px] bg-slate-200 z-0">
              {/* Colored active coordinate track */}
              <div className="absolute top-0 left-0 w-3/5 h-full bg-[#0088FF]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-4 relative z-10">
              {connectedSystem.map((step, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 group cursor-default"
                >
                  {/* Position coordinate marker node */}
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-200 text-lg font-serif font-black text-[#0B1299] flex items-center justify-center shadow-sm group-hover:border-[#0088FF] group-hover:text-[#0088FF] transition-all shrink-0">
                    {step.num}
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-[#0088FF] font-bold">POS_NODE_A{idx + 1}</div>
                    <h3 className="text-xs font-extrabold text-[#0B1299] uppercase tracking-wider">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-[190px]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden lg:flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-12 border-t border-slate-100 pt-4">
              <span>BOUNDS // BUSINESS AMBITION</span>
              <span>OUTFLOW // MARKET GROWTH</span>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 10 — BUSINESS GAPS (EDITORIAL 2-COLUMN DIAGNOSTIC STATEMENT GRID)    */}
      {/* ==================================================================== */}
      <section className="py-28 sm:py-36 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              DIAGNOSTIC CRITERIA
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              Identifiable Symptoms. Defined Business Gaps.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-16 border-t border-slate-200 pt-12">
            {diagnosticStatements.map((item, idx) => (
              <div key={idx} className="space-y-5 text-left pb-4 border-b border-slate-200/50">
                {/* Large client symptom quote */}
                <h3 className="text-xl sm:text-2xl lg:text-[28px] font-serif font-black text-[#0F172A] leading-snug tracking-tight">
                  {item.symptom}
                </h3>
                
                <div className="space-y-1.5 pl-4 border-l-2 border-[#0088FF]">
                  <div className="text-[10px] font-mono text-[#0088FF] uppercase tracking-widest font-extrabold">
                    DIAGNOSIS: {item.diagnosis}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                    {item.perspective}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 11 — SECTOR CONSTRAINTS (VARIED COMPOSITION & INTENTIONAL ASSETS)   */}
      {/* ==================================================================== */}
      <section className="py-28 sm:py-36 bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              SECTOR EXPERIENCE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              Different Markets. Different Growth Constraints.
            </h2>
          </div>

          <div className="space-y-24">
            {industries.map((row, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={row.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                >
                  {/* TEXT COLUMN */}
                  <div className={`lg:col-span-6 space-y-6 text-left ${!isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                      {row.label}
                    </div>

                    <h3 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-black text-[#0B1299] tracking-tight leading-none">
                      {row.keywords}
                    </h3>

                    <p className="text-sm text-slate-600 font-bold leading-relaxed">
                      {row.challenge}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">STRATEGIC PRIORITIES</div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {row.priorities.map((item, pIdx) => (
                          <span key={pIdx} className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="text-[10px] font-extrabold text-[#0088FF] uppercase tracking-widest">DESIRED OUTCOME</div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800">
                        {row.outcome}
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => onOpenQuoteModal(row.label)}
                        className="bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
                      >
                        Partner With Us
                      </button>
                    </div>
                  </div>

                  {/* IMAGE COLUMN (Smaller footprint grayscale context) */}
                  <div className={`lg:col-span-6 ${!isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-md relative h-[280px] sm:h-[320px] max-w-md mx-auto">
                      <img
                        src={row.image}
                        alt={row.label}
                        className="w-full h-full object-cover grayscale opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 12 — EXECUTION CAPABILITIES (VISUAL PRIORITY GRAPHICS)               */}
      {/* ==================================================================== */}
      <section className="py-28 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="space-y-4 max-w-3xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              EXECUTION INFRASTRUCTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              Strategy Means Little Without The Ability To Execute It.
            </h2>
            <p className="text-base text-slate-500 leading-relaxed font-normal pt-2">
              Sinfox combines strategic direction with the creative and growth capabilities required to take ideas into the market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: '01',
                title: 'BRAND & COMMUNICATION',
                desc: 'Brand positioning, identity systems, messaging guidelines, packaging, and commercial layouts.',
                image: '/assets/sinfox/home/brand-system-cap.webp',
                isLarge: true
              },
              {
                num: '02',
                title: 'GROWTH & PERFORMANCE',
                desc: 'Performance marketing, search engines, content distribution, lead capture, and channel optimizations.',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                isLarge: true
              },
              {
                num: '03',
                title: 'CONTENT & PRODUCTION',
                desc: 'Commercial film, drone photography, corporate photography packages, and color editing.',
                image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
                isLarge: false
              },
              {
                num: '04',
                title: 'DIGITAL ENABLEMENT',
                desc: 'Web experiences and technology-enabled growth requirements are delivered with ecosystem support through TechLis.',
                isEcosystem: true
              }
            ].map((cap, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {cap.isEcosystem ? (
                    <div className="h-44 bg-[#0F172A] text-white flex flex-col items-center justify-center p-6 text-center space-y-2">
                      <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">TECHNOLOGY EXTENSION</div>
                      <div className="text-[10px] font-bold text-slate-300 leading-snug">
                        SINFOX (Strategy/Brand/Growth)<br />↓<br />TECHLIS (Software/CRM/AI)
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={cap.image}
                        alt={cap.title}
                        className={`w-full h-full object-cover ${cap.isLarge ? 'grayscale-0' : 'grayscale'}`}
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-black text-[#0088FF]">{cap.num}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CAPABILITY</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider leading-snug">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {cap.isEcosystem ? (
                    <div className="text-[10px] font-bold text-[#0088FF] uppercase tracking-widest py-2 border-t border-slate-200">
                      Technology powered through TechLis.
                    </div>
                  ) : (
                    <button
                      onClick={() => onOpenQuoteModal(cap.title)}
                      className="w-full bg-white hover:bg-[#0088FF] text-[#0F172A] hover:text-white border border-slate-200 hover:border-[#0088FF] text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Explore Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 13 — SELECTED TRANSFORMATION (CASE STUDY CANVASES)                 */}
      {/* ==================================================================== */}
      <section className="py-28 bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              SELECTED TRANSFORMATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              Strategy Becomes Credible When It Changes The Business.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#FAF9F6] p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-md">
            
            {/* Left Case Study Information */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex items-center gap-3">
                <span className="text-5xl font-serif font-black text-[#0088FF]">01</span>
                <div>
                  <div className="text-[10px] font-mono text-[#0088FF] uppercase tracking-widest font-bold">CASE_COOR_B4</div>
                  <div className="text-sm font-bold text-slate-800">Amara Hospitals / Clinical Healthcare</div>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="space-y-1">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">THE PROBLEM</div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Weak local patient acquisition funnel and low brand recall for high-specialization clinics (Cardiology & Orthopedics).
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-extrabold text-[#0B1299] uppercase tracking-wider">THE DECISION</div>
                  <p className="text-xs sm:text-sm text-slate-850 font-bold leading-relaxed">
                    Pivot from generic clinical promotion to doctor personal branding and hyper-local search dominance.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">WHAT CHANGED</div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Patient-centric trust films, structured local SEO map architectures, and automated WhatsApp patient communication engines.
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-200">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">THE OUTCOME</div>
                  <p className="text-xs sm:text-sm text-slate-500 italic">
                    [Validation in progress — institutional clinical search index increased, direct outpatient queries pending audits]
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenQuoteModal('Amara Hospitals Case Study')}
                  className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-full transition-all cursor-pointer"
                >
                  View Case Study
                </button>
              </div>
            </div>

            {/* Right Case Study Visual representation */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg h-[300px] sm:h-[350px]">
                <img
                  src="/assets/sinfox/home/amara-case-study.webp"
                  alt="Amara Hospitals case study representation"
                  className="w-full h-full object-cover grayscale-[10%]"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 14 — PROOF NUMBERS (ASYMMETRIC EDITORIAL STATS)                       */}
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
      {/* 15 — ONE GROWTH PARTNER (THE SINFOX ADVANTAGE SYSTEM GRAPHIC)         */}
      {/* ==================================================================== */}
      <section className="py-28 sm:py-36 bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-center">
          
          <div className="space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              THE SINFOX ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              One Growth Partner. Three Strategic Disciplines. One Execution System.
            </h2>
          </div>

          {/* Large connected commercial visual system diagram */}
          <div className="max-w-4xl mx-auto bg-[#FAF9F6] p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-md space-y-8 relative overflow-hidden">
            <div className="absolute right-4 top-4 text-[10px] font-mono text-slate-400 font-bold uppercase select-none">GRID_COOR_F8</div>

            <div className="text-sm font-serif font-bold text-[#0088FF] uppercase tracking-wider">
              BUSINESS GROWTH
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto relative">
              {/* Connected strategic path lines */}
              <div className="absolute inset-0 top-1/2 h-[2px] bg-slate-200 -z-10" />

              {[
                { title: 'STRATEGY', sub: 'Decide Where To Win' },
                { title: 'BRAND', sub: 'Create Preference' },
                { title: 'GROWTH', sub: 'Create Demand' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
                  <div className="text-xs font-extrabold text-[#0B1299] tracking-wider">{item.title}</div>
                  <div className="text-[10px] text-slate-500 italic mt-0.5 leading-tight">{item.sub}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <ArrowDown className="w-5 h-5 text-slate-300" />
              <div className="bg-[#0B1299] border border-[#0B1299]/30 text-white rounded-xl py-3.5 px-10 shadow font-bold text-xs uppercase tracking-widest">
                CREATIVE EXECUTION
              </div>
              <div className="text-[10px] text-slate-500 italic mt-0.5">Bring Strategy Into The Market</div>
            </div>

            <div className="pt-6 border-t border-slate-200 text-sm sm:text-base font-serif font-bold text-slate-900 tracking-wider">
              FEWER DISCONNECTED VENDORS. BETTER STRATEGIC ALIGNMENT.
            </div>

            <p className="text-xs sm:text-sm text-slate-550 max-w-xl mx-auto leading-relaxed">
              When strategy, brand, growth and execution are separated across multiple partners, context gets lost. Sinfox keeps the commercial direction connected from decision to market execution.
            </p>

            <div className="pt-4 border-t border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              * Technology-intensive requirements can extend through TechLis when required.
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 22 — FINAL CTA SECTION (NAVY BACKGROUND)                             */}
      {/* ==================================================================== */}
      <section className="py-28 bg-gradient-to-br from-[#0F172A] to-[#0B1299] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-widest border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>START WITH THE PROBLEM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Before We Recommend A Service,<br />Let's Understand What's Stopping Growth.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Tell us where the business is today, where it needs to go, and what is getting in the way.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenQuoteModal()}
              className="bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-sm px-8 py-4 rounded-full shadow-xl shadow-[#0088FF]/30 transition-all hover:scale-103 active:scale-97 cursor-pointer"
            >
              Book Strategic Consultation
            </button>
            <button
              onClick={() => {
                onNavigate('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-8 py-4 rounded-full transition-all cursor-pointer"
            >
              Explore Services
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
