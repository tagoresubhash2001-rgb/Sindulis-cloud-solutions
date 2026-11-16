import React from 'react';
import { EdulisPage } from '../../types';
import { CountUp } from '../CountUp';
import { TimelineAnimate } from '../TimelineAnimate';
import {
  Sparkles,
  ArrowRight,
  Target,
  Compass,
  Lightbulb,
  Building2,
  Users,
  Award,
  CheckCircle2,
  ShieldCheck,
  Quote,
  Check,
  Coins,
  FileText,
  BadgeCheck,
  GraduationCap,
  Briefcase
} from 'lucide-react';

interface Props {
  onNavigate: (page: EdulisPage) => void;
  onOpenEnrollModal: () => void;
}

export const EdulisAbout: React.FC<Props> = ({ onNavigate, onOpenEnrollModal }) => {
  const coreValues = [
    {
      title: 'Innovation First',
      icon: Lightbulb,
      desc: 'Pioneering cutting-edge AI methodologies, agentic workflows, and LLM integrations directly into undergraduate academic environments.'
    },
    {
      title: 'Industry Alignment',
      icon: Building2,
      desc: 'Curriculums engineered alongside corporate engineering directors from Google, Microsoft, and global pharma giants to ensure day-one readiness.'
    },
    {
      title: 'Student Empowerment',
      icon: Users,
      desc: 'Shifting students from passive memorizers to active builders who create and deploy real-world software applications.'
    },
    {
      title: 'Quality & Excellence',
      icon: Award,
      desc: 'ISO-compliant quality frameworks, rigorous code reviews, and industry-standard portfolio benchmarks across every discipline.'
    }
  ];

  const approachSteps = [
    {
      num: '01',
      title: 'Assess Campus Needs',
      desc: 'In-depth audit of existing lab hardware, faculty expertise, and departmental student streams to formulate a customized AI roadmap.'
    },
    {
      num: '02',
      title: 'Setup AI Infrastructure',
      desc: 'Deploy high-performance workstation clusters, cloud GPU server access, and local vector DB environments on campus premises.'
    },
    {
      num: '03',
      title: 'Deliver Hybrid Curriculum',
      desc: 'Domain-adapted modules delivered by elite industry practitioner-mentors integrated directly with regular academic schedules.'
    },
    {
      num: '04',
      title: 'Real-World Hackathons',
      desc: 'Inter-college code sprints and 48-hour buildathons sponsored by Sindulis partner networks with live problem statements.'
    },
    {
      num: '05',
      title: 'Career & Placement Launch',
      desc: 'Resume transformation into live web portfolio links, AI mock interviews, and direct placement drives with regional tech hubs.'
    }
  ];

  const timelineNodes = [
    {
      year: '2024',
      badgeColor: 'bg-[#0B1299] text-white',
      dotColor: 'bg-[#0B1299]',
      title: 'Founded & Framework Co-Creation',
      side: 'left',
      desc: 'Engineered 5 domain-adapted course modules validated by senior engineering managers from top MNCs. Initiated core syllabus co-creation with academic advisory boards.',
      highlights: [
        'Curriculum co-creation with corporate AI directors',
        'Initial framework validation across engineering & pharmacy disciplines'
      ]
    },
    {
      year: '2025',
      badgeColor: 'bg-[#E65100] text-white',
      dotColor: 'bg-[#E65100]',
      title: 'Campus Pilot AI Labs & Hackathons',
      side: 'right',
      desc: 'Successfully launched pilot AI labs and inter-college hackathons across Andhra Pradesh & Telangana. Established Sindulis cloud backend for verified credentials.',
      highlights: [
        'Pilot AI CoE setups in select regional campuses',
        'First batch of 1,200+ students deploying live web portfolios'
      ]
    },
    {
      year: '2026',
      badgeColor: 'bg-indigo-600 text-white',
      dotColor: 'bg-indigo-600',
      title: 'Pan-Regional Scaling across AP & Telangana',
      side: 'left',
      desc: 'Scaling physical and digital AI Centers of Excellence across Visakhapatnam, Vijayawada, Guntur, Tirupati, and Hyderabad university hubs.',
      highlights: [
        'Establishing ₹20 Lakhs infrastructure support grants',
        'Direct corporate placement lines with 100+ hiring partners'
      ]
    },
    {
      year: '2027-2028',
      badgeColor: 'bg-emerald-600 text-white',
      dotColor: 'bg-emerald-600',
      title: '100+ Active CoEs & 50,000+ AI Graduates',
      side: 'right',
      desc: 'Expanding the Sindulis ecosystem to over 100 partner institutions, training 50,000+ graduates with verified AI portfolios and direct corporate hiring networks.',
      highlights: [
        '100+ Active Campus Centers of Excellence',
        '50,000+ AI-Ready Graduates with Public Web Portfolios'
      ]
    }
  ];

  const credibilityBoosterSections = [
    {
      id: '01',
      tag: 'FINANCIAL & LAB SUPPORT',
      title: '₹20 Lakhs Institutional Grant Program',
      desc: 'EduLis allocates up to ₹20 Lakhs in hardware workstation grants, GPU cloud computing credits, and enterprise software licenses for qualified higher education institutions across AP & Telangana.',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
      imageRight: true,
      ctaText: 'Apply For Campus Grant',
      highlights: [
        'Subsidized High-Speed GPU Lab Hardware',
        'Unlimited Developer Licenses & Cloud API Credits',
        'Turnkey Installation by EduLis Technical Engineers'
      ]
    },
    {
      id: '02',
      tag: 'ACADEMIC EXCELLENCE',
      title: 'ISO Quality Standards & Academic Compliance',
      desc: 'Our operational frameworks adhere strictly to ISO-compliant educational quality management standards, giving university leadership complete confidence in syllabus delivery and audit compliance.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      imageRight: false,
      ctaText: 'View Governance Standards',
      highlights: [
        'ISO-Compliant Quality Audits & Course Delivery',
        'Qualitative NAAC & NIRF Evidence Reporting',
        'Standardized Student Performance Tracking'
      ]
    },
    {
      id: '03',
      tag: 'VERIFIED CREDENTIALS',
      title: 'Co-Branded Industry Certifications',
      desc: 'Every graduate receives a co-branded certificate from EduLis & Sindulis Innovative Solutions, linked directly to an immutable public URL portfolio showcasing verified live code repositories.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      imageRight: true,
      ctaText: 'Verify Sample Certificate',
      highlights: [
        'Public Web URL Portfolio Verification',
        'Blockchain-Backed Credential Authentication',
        'Direct Employer Credential Scanning'
      ]
    },
    {
      id: '04',
      tag: 'POLICY & CREDIT COMPLIANCE',
      title: 'National Skill Framework Alignment',
      desc: 'Curriculums are engineered in strict accordance with AICTE, UGC, and NEP 2020 skill credit mandates, enabling universities to integrate our tracks into regular semester credit calculations.',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
      imageRight: false,
      ctaText: 'Check Curriculum Alignment',
      highlights: [
        'NEP 2020 Choice-Based Credit System (CBCS) Integration',
        'AICTE & UGC Industry Skills Guidelines',
        'Seamless Semester Credit Transfer Support'
      ]
    },
    {
      id: '05',
      tag: 'CORPORATE RECRUITMENT',
      title: 'Direct Corporate Hiring & Internship Pipeline',
      desc: 'Top-performing students enter the Sindulis Partner Network, gaining direct access to corporate internship drives, stipend positions, and priority interview slots with leading tech employers.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
      imageRight: true,
      ctaText: 'Explore Corporate Partners',
      highlights: [
        'Direct Corporate Hiring Drives & Interview Invites',
        'Paid Internship Sponsorships for Capstone Winners',
        'Regional Tech Hub Placement Desks in Hyderabad & Vizag'
      ]
    }
  ];

  return (
    <div className="bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-[#E65100]/20 selection:text-[#0B1299]">
      
      {/* ==================================================================== */}
      {/* 1. HERO SECTION                                                      */}
      {/* ==================================================================== */}
      <section className="relative min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center bg-slate-950 overflow-hidden">
        {/* Full-width crisp visual frame */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80"
            alt="EduLis Campus Innovation Architecture"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Soft dark text overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />
        </div>

        {/* Hero Text Content Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#E65100]" />
            <span>OUR STORY, PURPOSE, AND FOUNDATIONS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black text-white tracking-tight leading-[1.1]">
            Empowering Campuses, <span className="text-[#E65100]">Transforming Careers.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 font-medium leading-relaxed max-w-3xl mx-auto">
            EduLis is the premiere AI-Powered Career Acceleration Engine bridging academia with industry demands across Andhra Pradesh & Telangana.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={onOpenEnrollModal}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0B1299] hover:bg-indigo-900 text-white font-bold text-sm rounded-xl transition-all shadow-xl border border-indigo-400/30"
            >
              <span>Partner With Us</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-xl border border-white/30 transition-all"
            >
              <span>Explore Services & Courses</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. OUR VISION (SEPARATE FULL-WIDTH ROW)                             */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-28 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* LEFT (50%): Text Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1299]/10 text-[#0B1299] text-xs font-black uppercase tracking-wider">
                <Target className="w-3.5 h-3.5" />
                <span>OUR VISION</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#0B1299] tracking-tight leading-tight">
                Turning Every Educational Campus Into a High-Tech AI Hub
              </h2>

              <p className="text-base text-slate-600 leading-relaxed font-normal">
                Our vision is to revolutionize higher education across Andhra Pradesh & Telangana by transforming every campus into an active AI Center of Excellence. We are committed to completely eliminating graduate underemployment in Tier-2 and Tier-3 cities.
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                By making enterprise-grade AI infrastructure, live vector databases, and real-world project portfolios accessible to every student—whether in Pharmacy, Engineering, Business, or General Sciences—we ensure graduates step into the job market with verified, day-one technical authority.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4 border-t border-slate-100">
                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-slate-200">
                  <div className="text-2xl font-serif font-black text-[#0B1299]">
                    <CountUp value="100+" />
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase mt-0.5">Target AI CoEs</div>
                </div>
                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-slate-200">
                  <div className="text-2xl font-serif font-black text-[#E65100]">Zero</div>
                  <div className="text-xs font-bold text-slate-500 uppercase mt-0.5">Skill Disconnect</div>
                </div>
              </div>
            </div>

            {/* RIGHT (50%): High-res Editorial Photo */}
            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80"
                  alt="Modern University Architecture - EduLis Partner Campus"
                  className="w-full h-[400px] sm:h-[480px] object-cover rounded-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. OUR MISSION (SEPARATE FULL-WIDTH ROW - REVERSED)                 */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-28 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* LEFT (50%): High-res Student AI Lab Photo */}
            <div className="order-2 lg:order-1 relative">
              <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                  alt="Students Collaborating in Advanced AI Lab"
                  className="w-full h-[400px] sm:h-[480px] object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* RIGHT (50%): Text Content with ₹20 Lakhs CoE details */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E65100]/10 text-[#E65100] text-xs font-black uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>OUR MISSION</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#0B1299] tracking-tight leading-tight">
                Equipping Colleges with Complete AI Ecosystems & ₹20 Lakhs CoE Support
              </h2>

              <p className="text-base text-slate-600 leading-relaxed font-normal">
                Our mission is to equip educational institutions with end-to-end AI Infrastructure, domain-specific curriculums, and real-world project ecosystems that bridge traditional academic degrees with immediate corporate hiring demands.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-serif font-black text-[#0B1299] uppercase">Up to ₹20 Lakhs CoE Infrastructure Support</div>
                    <p className="text-xs text-slate-600 mt-0.5">Physical GPU workstation labs, cloud API server access, developer licenses, and full curriculum deployment for partner campuses.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-serif font-black text-[#0B1299] uppercase">Domain-Adapted Industry Tracks</div>
                    <p className="text-xs text-slate-600 mt-0.5">Specialized course modules engineered for B.Tech, B.Pharm, MBA, Law, and General Degree streams.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. OUR CORE VALUES (4 EDITORIAL COLUMNS)                            */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-28 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              ORGANIZATIONAL PILLARS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B1299] tracking-tight">
              Our 4 Core Values
            </h2>
            <p className="text-base text-slate-600">
              The foundational standards governing every course module, mentorship session, and campus partnership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, i) => {
              const IconComp = v.icon;
              return (
                <div
                  key={i}
                  className="bg-[#FAF9F6] rounded-2xl border border-slate-200 p-8 space-y-4 hover:border-[#0B1299] hover:bg-white transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0B1299]/10 text-[#0B1299] flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif font-black text-[#0B1299]">{v.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center gap-1 text-[11px] font-bold text-[#E65100]">
                    <Check className="w-3.5 h-3.5" />
                    <span>Non-Negotiable Standard</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. OUR 5-STEP APPROACH (CONNECTED STEPPER FLOW)                      */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-28 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              SYSTEMATIC METHODOLOGY
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B1299] tracking-tight">
              Our 5-Step Connected Approach
            </h2>
            <p className="text-base text-slate-600">
              How EduLis seamlessly integrates with university institutions without disrupting traditional degree schedules.
            </p>
          </div>

          {/* CONNECTED STEPPER WRAPPER WITH DASHED CONNECTOR LINE */}
          <TimelineAnimate>
            <div className="relative">
              {/* Dashed connector line across steps on desktop */}
              <div className="hidden md:block absolute top-12 left-12 right-12 border-t-2 border-dashed border-slate-300 z-0" />

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                {approachSteps.map((s, idx) => (
                  <div
                    key={s.num}
                    className={`bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-md relative flex flex-col justify-between hover:border-[#0B1299] transition-all timeline-card delay-card-${idx}`}
                  >
                    <div>
                      <div className="w-10 h-10 rounded-full bg-[#0B1299] text-white font-serif font-black text-sm flex items-center justify-center mb-4 shadow-sm border-2 border-white ring-4 ring-slate-100">
                        {s.num}
                      </div>
                      <h3 className="text-base font-serif font-bold text-[#0B1299] mb-2 leading-snug">{s.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Phase {s.num} Execution
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TimelineAnimate>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. OUR JOURNEY / TIMELINE (VERTICAL CENTRAL AXIS - HEBELETEN STYLE) */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-32 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              STRATEGIC ROADMAP
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B1299] tracking-tight">
              Our Journey & Strategic Roadmap
            </h2>
            <p className="text-base text-slate-600">
              From foundational framework development to pan-regional campus scaling across Andhra Pradesh & Telangana.
            </p>
          </div>

          {/* VERTICAL CENTRAL AXIS TIMELINE */}
          <TimelineAnimate>
            <div className="relative max-w-5xl mx-auto py-8">
              {/* Central Vertical Guide Line (Desktop) */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" />
              {/* Central Vertical Progress Line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 timeline-line-v-progress hidden md:block" />

              <div className="space-y-12 md:space-y-16">
                {timelineNodes.map((node, idx) => {
                  const isLeft = node.side === 'left';
                  return (
                    <div
                      key={idx}
                      className="relative flex flex-col md:flex-row items-center justify-between"
                    >
                      {/* Node Central Dot (Desktop) */}
                      <div className={`hidden md:block absolute left-1/2 -translate-x-1/2 top-6 w-5 h-5 rounded-full ${node.dotColor} ring-4 ring-white shadow-md z-10 timeline-node delay-node-${idx}`} />

                      {/* Content Box */}
                      <div
                        className={`w-full md:w-[45%] ${
                          isLeft ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'
                        }`}
                      >
                        <div className={`bg-[#FAF9F6] rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4 hover:border-[#0B1299]/50 transition-all timeline-card delay-card-${idx}`}>
                          <div className={`flex items-center gap-3 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${node.badgeColor}`}>
                              {node.year} Node
                            </span>
                          </div>

                          <h3 className="text-xl font-serif font-black text-[#0B1299]">
                            {node.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {node.desc}
                          </p>

                          <div className="pt-2 border-t border-slate-200 space-y-1.5">
                            {node.highlights.map((h, hIdx) => (
                              <div key={hIdx} className={`flex items-center gap-2 text-xs font-medium text-slate-700 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                                <span className="text-[#E65100] font-bold">•</span>
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TimelineAnimate>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 7. FOUNDER'S THOUGHT & PERSPECTIVE                                   */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-16 shadow-lg relative overflow-hidden space-y-8">
            
            {/* Large Decorative Quote Mark */}
            <div className="text-8xl font-serif font-black text-slate-200 absolute -top-4 -left-2 select-none pointer-events-none opacity-60">
              “
            </div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E65100]/10 text-[#E65100] text-xs font-extrabold uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5" />
                <span>FOUNDER'S PERSPECTIVE</span>
              </div>

              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#0B1299] leading-tight tracking-tight">
                "Degree certificates without functioning AI project proof are quickly losing value in the modern hiring market."
              </blockquote>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal italic">
                "Our mission at EduLis is not to replace university professors, but to supercharge them with the 'AI Multiplier'. Every pharmacy student, every civil engineer, every MBA candidate deserves access to live AI servers, domain workflows, and enterprise mentorship so they step into job interviews with confidence and verified proof."
              </p>

              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-serif font-extrabold text-[#0F172A] text-lg">Leadership Directorate</div>
                  <div className="text-xs font-bold text-[#E65100]">EduLis & Sindulis Innovative Solutions</div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1299]/10 text-[#0B1299] text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Executive Note</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 8. 5 CORE CREDIBILITY BOOSTERS (5 FULL ALTERNATING EDITORIAL SECTIONS)*/}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              INSTITUTIONAL TRUST ANCHORS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B1299] tracking-tight">
              5 Core Credibility Boosters
            </h2>
            <p className="text-base text-slate-600">
              Detailed breakdown of why university leadership and principal boards partner with EduLis across Southern India.
            </p>
          </div>

          {/* 5 FULL ALTERNATING SECTIONS */}
          <div className="space-y-24">
            {credibilityBoosterSections.map((sec) => {
              const isImageRight = sec.imageRight;
              return (
                <div
                  key={sec.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center border-b border-slate-100 pb-20 last:border-0 last:pb-0"
                >
                  {/* TEXT CONTENT */}
                  <div className={`space-y-6 ${!isImageRight ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#0B1299] text-white font-extrabold text-xs flex items-center justify-center">
                        {sec.id}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#0B1299]/10 text-[#0B1299] font-black text-xs uppercase tracking-wider">
                        {sec.tag}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#0B1299] tracking-tight leading-tight">
                      {sec.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {sec.desc}
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Key Institutional Pillars
                      </div>
                      <div className="space-y-2">
                        {sec.highlights.map((h, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-2.5 bg-[#FAF9F6] p-3 rounded-xl border border-slate-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="text-xs text-slate-700 font-semibold">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={onOpenEnrollModal}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0B1299] hover:bg-indigo-900 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:-translate-y-0.5"
                      >
                        <span>{sec.ctaText}</span>
                        <ArrowRight className="w-4 h-4 text-[#E65100]" />
                      </button>
                    </div>
                  </div>

                  {/* IMAGE CONTAINER */}
                  <div className={`${!isImageRight ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-xl overflow-hidden group">
                      <img
                        src={sec.image}
                        alt={sec.title}
                        className="w-full h-[360px] sm:h-[440px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
};


