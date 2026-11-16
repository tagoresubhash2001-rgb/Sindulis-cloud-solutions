import React from 'react';
import { EdulisPage } from '../../types';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Building2,
  Users,
  Check,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Zap,
  Coins,
  GraduationCap,
  BookOpen,
  Award,
  Globe,
  Briefcase,
  Target,
  FileCheck,
  Laptop,
  Lightbulb,
  Award as AwardIcon,
  Search,
  School
} from 'lucide-react';
import { MENTORS } from '../../data/edulisData';

interface Props {
  onNavigate: (page: EdulisPage) => void;
  onOpenEnrollModal: (programId?: string, domainId?: string) => void;
}

export const EdulisHome: React.FC<Props> = ({ onNavigate, onOpenEnrollModal }) => {
  return (
    <div className="bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-[#E65100]/20 selection:text-[#0B1299]">
      
      {/* ==================================================================== */}
      {/* 1. HERO SECTION (SPLIT GRID: LEFT TEXT + RIGHT CAMPUS PHOTO FRAME)   */}
      {/* ==================================================================== */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center bg-slate-950 overflow-hidden py-24 lg:py-32">
        {/* Full-Bleed Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=2000&q=85"
            alt="EduLis AI Campus"
            className="w-full h-full object-cover object-center opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-900/80" />
        </div>

        {/* Hero Content Grid Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* LEFT COLUMN: HEADLINE, SUBTEXT & DUAL CTAS */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#E65100]" />
                <span>A SUBSIDIARY OF SINDULIS INNOVATIVE SOLUTIONS</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-serif font-black text-white tracking-tight leading-[1.1]">
                BUILDING <span className="text-[#E65100]">AI-READY</span> CAMPUSES.
              </h1>

              <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed max-w-xl">
                Empowering Institutions. Preparing Future Generations. College degree is the foundation — AI is the multiplier.
              </p>

              {/* Dual Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onOpenEnrollModal()}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0B1299] hover:bg-indigo-900 text-white font-bold text-sm rounded-xl transition-all shadow-xl hover:shadow-indigo-900/40 border border-indigo-400/30 hover:-translate-y-0.5"
                >
                  <span>Partner With EduLis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenEnrollModal()}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E65100] hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-all shadow-xl hover:-translate-y-0.5"
                >
                  <Coins className="w-4 h-4 text-amber-200" />
                  <span>Claim Free AI Lab Setup</span>
                </button>
              </div>

              {/* Highlight Badges */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-300 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI Centre of Excellence</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>NAAC / NIRF Rating Boost</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sindulis Certified</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CAMPUS BANNER PHOTO FRAME */}
            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-white/5 p-3 shadow-2xl backdrop-blur-md">
                <div className="relative h-[380px] sm:h-[460px] rounded-2xl overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80"
                    alt="EduLis AI Campus Transformation"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/80 border border-white/20 backdrop-blur-md text-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-300 uppercase tracking-wider">CAMPUS INFRASTRUCTURE</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">ACTIVE COE</span>
                    </div>
                    <div className="text-sm font-serif font-bold text-white">AI Centre of Excellence Setup</div>
                    <div className="text-[11px] text-slate-300">Equipping Tier-2/3 University Campuses with GPU Labs & RAG Databases</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. HIGH-CONVERTING GRANT HOOK SECTION                                */}
      {/* ==================================================================== */}
      <section className="py-12 bg-[#0B1299] text-white border-b border-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-950 via-[#0B1299] to-indigo-900 border border-indigo-400/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#E65100] text-white text-xs font-black uppercase tracking-wider shadow-sm">
                <Zap className="w-3.5 h-3.5" />
                <span>UPTO ₹20 LAKHS LAB SUPPORT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight leading-tight">
                Get FREE AI Centre of Excellence & Lab Setup For Your College or School
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl font-medium">
                Up to ₹20 Lakhs Hardware, Cloud Server Access & Curriculum Support. We provide complete hardware, cloud AI server access, curriculum, and expert trainers.
              </p>
            </div>

            <button
              onClick={() => onOpenEnrollModal()}
              className="shrink-0 px-8 py-4 bg-[#E65100] hover:bg-orange-600 text-white font-black text-sm rounded-xl transition-all shadow-xl hover:scale-105 inline-flex items-center gap-2"
            >
              <span>Apply For Free College AI Lab Setup →</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. COMPLETE 10-COURSE TECHNICAL CATALOG                               */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              ACCREDITED ACADEMIC CURRICULUMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B1299] tracking-tight">
              Complete 10-Course Technical Catalog
            </h2>
            <p className="text-base text-slate-600">
              Each track provides intensive hands-on lab work, live capstones, and industry certifications for college students across all disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 'course-1',
                title: 'Java Core & Advanced',
                duration: '3 Months',
                img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
                desc: 'OOP design, Collections, multithreading, Spring Boot, Hibernate, REST APIs, and microservices architecture.'
              },
              {
                id: 'course-2',
                title: 'Python Programming & AI Scripting',
                duration: '2 Months',
                img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
                desc: 'Core syntax, automation scripts, REST API integration, data parsing, and custom AI agent workflows.'
              },
              {
                id: 'course-3',
                title: 'C Language & Low-Level Logic',
                duration: '2 Months',
                img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
                desc: 'Memory allocation, pointer arithmetic, file systems, low-level data structures, and embedded logic.'
              },
              {
                id: 'course-4',
                title: 'Data Structures & Algorithms',
                duration: '2 Months',
                img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
                desc: 'Linear & non-linear data structures, trees, graphs, dynamic programming, and interview problem solving.'
              },
              {
                id: 'course-5',
                title: 'DevOps & Cloud Infrastructure',
                duration: '2 Months',
                img: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80',
                desc: 'Docker containerization, Kubernetes orchestration, GitHub Actions CI/CD pipelines, and cloud hosting.'
              },
              {
                id: 'course-6',
                title: 'Power BI & Business Intelligence',
                duration: '2 Months',
                img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                desc: 'Power Query ETL, relational modeling, DAX queries, and interactive corporate dashboard reporting.'
              },
              {
                id: 'course-7',
                title: 'Digital Marketing & Growth Systems',
                duration: '2 Months',
                img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                desc: 'Performance marketing, programmatic SEO engines, conversion funnels, and automated campaign tracking.'
              },
              {
                id: 'course-8',
                title: 'Data Analytics & Visualization',
                duration: '2 Months',
                img: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
                desc: 'SQL querying, Pandas data cleaning, statistical hypothesis testing, and dashboard storytelling.'
              },
              {
                id: 'course-9',
                title: 'System Design & Architecture',
                duration: '3 Months',
                img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
                desc: 'Monolithic to microservices, database sharding, Redis caching, load balancing, and Kafka event systems.'
              },
              {
                id: 'course-10',
                title: 'Entrepreneurship & Startup Ecosystem',
                duration: '2 Months',
                img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
                desc: 'Lean canvas, product-market fit validation, pitch decks, financial modeling, and venture funding.'
              }
            ].map((track, idx) => (
              <div
                key={track.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-[#0B1299]/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={track.img}
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#0B1299] text-white px-3 py-1 rounded-full text-[11px] font-black uppercase shadow-sm">
                      Course {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </div>
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-300 px-3 py-1 rounded-full text-[11px] font-bold border border-white/20">
                      {track.duration}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-serif font-black text-[#0B1299] leading-tight">
                      {track.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {track.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => onOpenEnrollModal(track.id)}
                    className="w-full py-3 bg-[#0B1299] hover:bg-indigo-900 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#E65100]" />
                    <span>Request Syllabus</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Custom Syllabus Card */}
            <div className="bg-gradient-to-br from-[#0B1299] to-indigo-950 text-white rounded-2xl border border-indigo-800 p-8 flex flex-col justify-between space-y-6 shadow-md md:col-span-2 lg:col-span-2">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 border border-white/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-black text-white">Custom Campus Curriculums</h3>
                <p className="text-xs text-slate-200 leading-relaxed max-w-xl">
                  Need a custom syllabus tailored for Pharmacy, Civil Engineering, MBA, or Law departments? We engineer custom credit-compliant course modules tailored to your university needs.
                </p>
              </div>

              <button
                onClick={() => onOpenEnrollModal()}
                className="w-fit px-8 py-3.5 bg-[#E65100] hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                <span>Request Custom Syllabus Framework</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. PROGRAM DELIVERY MODEL (EXACTLY 6 PILLARS WITH SVG VECTOR ICONS)  */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-32 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              INSTITUTIONAL EXECUTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B1299] tracking-tight">
              Program Delivery Model
            </h2>
            <p className="text-base text-slate-600">
              Structured across 6 operational pillars to guarantee seamless integration with regular university timetables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'On-Campus Hybrid Training',
                desc: 'Flexible campus schedules and hybrid workshops integrated directly into regular university timetables.',
                icon: Laptop
              },
              {
                title: 'Faculty Coordination Support',
                desc: 'Faculty Development Programs (FDP), teaching kits, and continuous academic coordination with professors.',
                icon: Users
              },
              {
                title: 'Practical Industry Assignments',
                desc: 'Hands-on coding inside live terminal environments, building production capstones and AI agents.',
                icon: Cpu
              },
              {
                title: 'Internship & Placement Guidance',
                desc: 'Direct corporate internship opportunities, resume transformations, and portfolio links for students.',
                icon: Briefcase
              },
              {
                title: 'Co-Branded Institutional Certifications',
                desc: 'Co-branded certificates from EduLis & Sindulis Innovative Solutions recognized by top employers.',
                icon: AwardIcon
              },
              {
                title: 'Dedicated Campus Coordinator',
                desc: 'On-ground operational manager assigned to handle lab schedules, student doubts, and infrastructure.',
                icon: FileCheck
              }
            ].map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAF9F6] rounded-2xl border border-slate-200 p-8 shadow-sm hover:border-[#0B1299]/50 transition-all space-y-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0B1299]/10 flex items-center justify-center text-[#0B1299]">
                    <IconComp className="w-6 h-6 text-[#0B1299]" />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#0B1299]/10 text-[#0B1299] text-[11px] font-black uppercase tracking-wider">
                      PILLAR 0{idx + 1}
                    </span>
                    <h3 className="font-serif font-extrabold text-[#0B1299] text-lg pt-1">{pillar.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. OUTCOMES FOR PARTNER INSTITUTIONS (EXACTLY 8 EXPLICIT OUTCOMES)   */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              INSTITUTIONAL ADVANTAGES
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B1299] tracking-tight">
              Outcomes for Partner Institutions
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Transforming college metrics through 8 measurable academic, placement, and institutional accreditation outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Enhanced Student Employability',
                desc: 'Students graduate with live web portfolio links and verified AI project proof for immediate hiring.'
              },
              {
                icon: Cpu,
                title: 'Industry Skill Development',
                desc: 'Mastery over agentic workflows, prompt engineering, RAG pipelines, and cloud deployments.'
              },
              {
                icon: ShieldCheck,
                title: 'NAAC & NIRF Accreditation Boost',
                desc: 'Documented evidence of industry interactions, CoE lab metrics, and skill-oriented outcomes for audits.'
              },
              {
                icon: Laptop,
                title: 'Exposure to Real AI Tools',
                desc: 'Hands-on practice with N8N, Make, LangChain, Pinecone, and Google Gemini API suites.'
              },
              {
                icon: Lightbulb,
                title: 'Entrepreneurship Development',
                desc: 'Incubation support for student AI startups, buildathons, and product prototype launches.'
              },
              {
                icon: School,
                title: 'Institutional PR & Branding',
                desc: 'Positioning partner colleges as regional AI-First Innovation Campuses with press coverage.'
              },
              {
                icon: Users,
                title: 'Faculty Development (FDP)',
                desc: 'Equipping professors with modern AI tools, research assistance, and paper co-authorship.'
              },
              {
                icon: Briefcase,
                title: 'Direct Corporate Placements',
                desc: 'Direct hiring drives and corporate interview invitations via the Sindulis partner ecosystem.'
              }
            ].map((outcome, idx) => {
              const IconComp = outcome.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between gap-4 hover:border-[#0B1299]/50 transition-all shadow-sm group"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1299]/10 text-[#0B1299] flex items-center justify-center">
                      <IconComp className="w-5 h-5 text-[#0B1299]" />
                    </div>
                    <h3 className="text-base font-serif font-black text-[#0B1299] leading-snug">
                      {outcome.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {outcome.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-[#E65100]">
                    <Check className="w-3.5 h-3.5" />
                    <span>Verified Outcome</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. MENTORS & DIRECTORS SECTION                                       */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              INDUSTRY MENTORSHIP
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B1299] tracking-tight">
              Guided By Senior AI Architects & Researchers
            </h2>
            <p className="text-base text-slate-600">
              Our academic board leads AI engineering teams at global technology, healthcare, and enterprise firms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MENTORS.map((m) => (
              <div
                key={m.id}
                className="bg-[#FAF9F6] rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-[#0B1299]/40 transition-all text-center space-y-4"
              >
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-slate-200"
                />
                <div>
                  <h3 className="font-serif font-bold text-[#0F172A] text-base">{m.name}</h3>
                  <div className="text-xs font-bold text-[#E65100]">{m.role}</div>
                  <div className="text-xs font-semibold text-slate-500">{m.company}</div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {m.bio}
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-slate-200/80 text-[11px] font-bold text-[#0B1299]">
                  {m.domain}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};


