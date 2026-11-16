import React from 'react';
import { EdulisPage } from '../../types';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  Trophy,
  Megaphone,
  Award,
  Users,
  ShieldCheck,
  Check,
  BookOpen,
  Clock,
  Coins,
  Zap
} from 'lucide-react';

interface Props {
  onNavigate?: (page: EdulisPage) => void;
  onOpenEnrollModal: (programId?: string, domainId?: string) => void;
}

export const EdulisServices: React.FC<Props> = ({ onNavigate, onOpenEnrollModal }) => {
  // Complete 15-Course Catalog (5 Flagship AI Tracks + 10 Core Technical Courses)
  const flagshipAiTracks = [
    {
      id: 'ai-track-1',
      title: 'AI Systems & Automation',
      duration: '120 Hours',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      imageRight: true, // Left Text, Right Image
      desc: 'Master end-to-end AI automation using industry tools. Build production-ready workflows, agentic pipelines, document parsers, and custom API integrations for modern enterprise environments.',
      features: [
        'Enterprise Automation Frameworks & N8N / Make Workflows',
        'Multi-Agent Systems & Tool Calling Execution',
        'Custom RAG Pipelines & Vector Database Operations',
        'Deploying Autonomous Customer & Operations Assistants'
      ]
    },
    {
      id: 'ai-track-2',
      title: 'Full-Stack & AI Infrastructure',
      duration: '100 Hours',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      imageRight: false, // Left Image, Right Text
      desc: 'Learn domains, cloud hosting, APIs, and production deployment. Architect full-stack web applications backed by serverless cloud backends, secure database tiers, and live custom domains.',
      features: [
        'React, TypeScript & Modern UI Framework Architecture',
        'Serverless API Routing & Secure Token Handling',
        'PostgreSQL, Cloud SQL & Firestore Schemas',
        'CI/CD Pipelines, Custom Domain SSL & Cloud Run Deployment'
      ]
    },
    {
      id: 'ai-track-3',
      title: 'AI Product & App Development',
      duration: '100 Hours',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      imageRight: true, // Left Text, Right Image
      desc: 'Build real-world apps, agentic workflows, and user systems. Turn product concepts into scalable web applications complete with interactive UI state management and user authentication.',
      features: [
        'User Research & AI Product Design Specifications',
        'LLM SDK Integrations & Streaming API Responses',
        'State Management, Real-Time Sync & Canvas Tools',
        'End-to-End Capstone Launch with Live Public URL'
      ]
    },
    {
      id: 'ai-track-4',
      title: 'AI Marketing & Growth Systems',
      duration: '100 Hours',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      imageRight: false, // Left Image, Right Text
      desc: 'AI-driven marketing funnels, SEO systems, and performance tools. Harness predictive analytics, automated content generation, and dynamic ad optimization to drive growth.',
      features: [
        'AI Content Production & Automated Copy Generation',
        'Programmatic SEO Engines & Keyword Clustering',
        'Performance Marketing Analytics & Attribution Modeling',
        'Customer Acquisition Funnels & Automated Lead Scoring'
      ]
    },
    {
      id: 'ai-track-5',
      title: 'AI Engineering & Prompt Systems',
      duration: '100 Hours',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      imageRight: true, // Left Text, Right Image
      desc: 'Master LLMs, prompt engineering, reasoning frameworks, and multi-model workflows. Deep dive into frontier models, fine-tuning methodologies, and safety guardrails.',
      features: [
        'Advanced Prompt Architecture & Chain-of-Thought Systems',
        'Model Evaluation, Benchmarking & Guardrail Policies',
        'Multimodal Vision & Speech Integration Patterns',
        'Local LLM Quantization & Edge Deployment'
      ]
    }
  ];

  const coreTechnicalCourses = [
    {
      id: 'course-1',
      title: 'Java Core & Advanced',
      duration: '3 Months',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      imageRight: false, // Left Image, Right Text
      desc: 'Comprehensive enterprise software development mastering object-oriented design, Collections Framework, multithreading, Spring Boot, Hibernate, and microservices architecture.',
      features: [
        'Object-Oriented Design (OOP) & SOLID Principles',
        'Java Collections, Exception Handling & Streams API',
        'Spring Boot Framework, RESTful APIs & Hibernate ORM',
        'Microservices Architecture & Enterprise Frameworks'
      ]
    },
    {
      id: 'course-2',
      title: 'Python Programming & AI Scripting',
      duration: '2 Months',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      imageRight: true, // Left Text, Right Image
      desc: 'Master Python fundamentals, automation scripting, API integration, data processing, and building custom AI agent workflows using modern LLM libraries.',
      features: [
        'Core Syntax, Data Structures & File I/O Mechanics',
        'Automated Scripting, Web Scraping & Async Processing',
        'REST API Integration, JSON Parsing & Cloud Utilities',
        'Building AI Autonomous Agents & LLM Scripting'
      ]
    },
    {
      id: 'course-3',
      title: 'C Language & Low-Level Fundamentals',
      duration: '2 Months',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      imageRight: false, // Left Image, Right Text
      desc: 'Build deep foundational computer science knowledge with low-level memory allocation, pointer arithmetic, file system manipulation, and hardware-level computing logic.',
      features: [
        'Memory Allocation (malloc, free) & Pointer Arithmetic',
        'Structures, Unions & Low-Level Storage Mechanics',
        'Dynamic Data Structures & Stack/Heap Mechanics',
        'Embedded Systems Computing & Compiler Concepts'
      ]
    },
    {
      id: 'course-4',
      title: 'Data Structures & Algorithms',
      duration: '2 Months',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
      imageRight: true, // Left Text, Right Image
      desc: 'Crack technical coding interviews with intensive problem-solving in linear & non-linear data structures, space/time complexity analysis, and algorithmic optimization.',
      features: [
        'Arrays, Linked Lists, Stacks, Queues & Hash Tables',
        'Trees, Graphs, BFS/DFS & Shortest Path Algorithms',
        'Dynamic Programming, Greedy Methods & Backtracking',
        'Big-O Time & Space Complexity Optimization'
      ]
    },
    {
      id: 'course-5',
      title: 'DevOps & Cloud Infrastructure',
      duration: '2 Months',
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80',
      imageRight: true, // Left Text, Right Image
      desc: 'Master modern cloud deployment infrastructure, CI/CD automation pipelines, containerization with Docker, Kubernetes orchestration, and server monitoring.',
      features: [
        'Docker Containerization & Multi-Stage Production Builds',
        'Kubernetes Cluster Orchestration & Deployment Pods',
        'GitHub Actions CI/CD Automated Build Pipelines',
        'Cloud Infrastructure (AWS / GCP) & Infrastructure as Code'
      ]
    },
    {
      id: 'course-6',
      title: 'Power BI & Business Intelligence',
      duration: '2 Months',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      imageRight: true, // Left Text, Right Image
      desc: 'Transform raw enterprise data into actionable business intelligence using Microsoft Power BI, DAX queries, relational data modeling, and interactive executive reporting.',
      features: [
        'Power Query ETL & Data Transformation Protocols',
        'Relational Data Modeling & Star Schema Architecture',
        'Advanced DAX Calculations & Time Intelligence Metrics',
        'Interactive Executive Dashboards & Automated Reporting'
      ]
    },
    {
      id: 'course-7',
      title: 'Digital Marketing & Growth Funnels',
      duration: '2 Months',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      imageRight: false, // Left Image, Right Text
      desc: 'Master performance marketing, programmatic SEO engines, automated customer acquisition funnels, conversion rate optimization, and multi-channel ad campaigns.',
      features: [
        'Performance Marketing & Meta/Google Ad Campaigns',
        'Technical & Programmatic SEO Engine Architecture',
        'Automated Lead Acquisition Funnels & Email Sequences',
        'Analytics Attribution Modeling & Growth Tracking'
      ]
    },
    {
      id: 'course-8',
      title: 'Data Analytics & Visualization',
      duration: '2 Months',
      image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
      imageRight: false, // Left Image, Right Text
      desc: 'Clean, explore, and visualize complex datasets using Python Pandas, NumPy, SQL databases, Seaborn, and statistical storytelling for strategic enterprise decisions.',
      features: [
        'Advanced SQL Querying, Joins & Window Functions',
        'Data Cleaning & Exploratory Analysis with Pandas/NumPy',
        'Statistical Hypothesis Testing & Trend Modeling',
        'Interactive Data Storytelling & Dashboard Presentations'
      ]
    },
    {
      id: 'course-9',
      title: 'System Design & Software Architecture',
      duration: '3 Months',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
      imageRight: false, // Left Image, Right Text
      desc: 'Architect large-scale enterprise systems handling millions of concurrent users. Learn microservices, database sharding, load balancing, caching strategies, and message queues.',
      features: [
        'Monolithic to Microservices Architectural Patterns',
        'Database Sharding, Replication & Redis NoSQL Caching',
        'Load Balancing, Rate Limiting & API Gateway Design',
        'Event-Driven Systems with Kafka & Message Queues'
      ]
    },
    {
      id: 'course-10',
      title: 'Entrepreneurship & Startup Ecosystem',
      duration: '2 Months',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      imageRight: true, // Left Text, Right Image
      desc: 'Turn tech innovations into viable venture-backed businesses. Learn business model canvas design, product-market fit validation, investor pitch decks, unit economics, and fundraising.',
      features: [
        'Lean Canvas Design & Value Proposition Validation',
        'Minimum Viable Product (MVP) Prototyping & Testing',
        'Financial Modeling, Unit Economics & Monetization',
        'Investor Pitch Decks, Term Sheets & Seed Round Funding'
      ]
    }
  ];

  // CoE Institutional Benefits Grid
  const coeBenefits = [
    {
      title: 'Sponsored Lab Infrastructure (Up to ₹20 Lakhs)',
      desc: 'Hardware & Software support up to ₹20 Lakhs including high-speed GPU server access, developer workstation kits, and cloud infrastructure credits.',
      icon: Building2
    },
    {
      title: 'Mass Hackathons & National Publicity',
      desc: 'Inter-college AI hackathons, solution buildathons, and annual code sprints sponsored by Sindulis network with cash rewards and national media coverage.',
      icon: Trophy
    },
    {
      title: 'Free Digital Marketing & Event Branding',
      desc: 'Promotional support, press releases, social media spotlights, and institutional brand visibility highlighting your college as an AI-First Campus.',
      icon: Megaphone
    },
    {
      title: 'Faculty Development Programs (FDP)',
      desc: 'Comprehensive training workshops for university faculty to align traditional academic teaching with modern industry software & AI workflows.',
      icon: Users
    },
    {
      title: 'NAAC & NIRF Accreditation Support',
      desc: 'Documentation support, industry-interaction metrics, and qualitative evidence files for NAAC, NIRF, and ISO institutional accreditation audits.',
      icon: Award
    },
    {
      title: 'ISO Process Certification Support',
      desc: 'Process auditing and quality standardization protocols to help partner campuses achieve international quality benchmark certifications.',
      icon: ShieldCheck
    }
  ];

  // 5 Credibility Pillars
  const credibilityPillars = [
    {
      title: '100% Industry Practicing Trainers',
      desc: 'All workshops and mentorship sessions are led by active senior software engineers and tech leads from top MNCs.',
      stat: '100% Practitioners'
    },
    {
      title: 'Hands-on Lab Approach',
      desc: '70% of course hours are spent inside live code editors, terminal environments, and Cloud server deployments.',
      stat: '70% Practical'
    },
    {
      title: 'Direct Corporate Placement Line',
      desc: 'Top graduates enter the Sindulis Partner Network for direct interview invites, stipends, and hiring drives.',
      stat: '100+ Hiring Partners'
    },
    {
      title: 'Regional AP & Telangana Coverage',
      desc: 'Dedicated regional academic coordinators on the ground across Visakhapatnam, Vijayawada, Guntur, Tirupati, and Hyderabad.',
      stat: 'Regional Network'
    },
    {
      title: 'Verified Portfolio Certification',
      desc: 'Certificates linked to immutable public web URL portfolios showcasing verified live projects for every student.',
      stat: 'Verified Portfolios'
    }
  ];

  return (
    <div className="bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-[#E65100]/20 selection:text-[#0B1299]">
      
      {/* ==================================================================== */}
      {/* 1. HERO BANNER                                                       */}
      {/* ==================================================================== */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-slate-950 overflow-hidden py-24">
        {/* Full-Bleed Lab Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=85"
            alt="EduLis AI Services & Lab Infrastructure"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#E65100]" />
            <span>FULL TECHNICAL CURRICULUM CATALOG</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black text-white tracking-tight leading-[1.1]">
            Industry Courses <span className="text-[#E65100]">& Campus Transformation.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 font-medium leading-relaxed max-w-3xl mx-auto">
            15 rigorous technical & AI tracks engineered alongside MNC tech leads to empower students with verified code portfolios and corporate job readiness.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onOpenEnrollModal()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0B1299] hover:bg-indigo-900 text-white font-bold text-sm rounded-xl transition-all shadow-xl border border-indigo-400/30 hover:-translate-y-0.5"
            >
              <span>Partner With EduLis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenEnrollModal()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-xl border border-white/30 transition-all hover:-translate-y-0.5"
            >
              <Coins className="w-4 h-4 text-[#E65100]" />
              <span>Request Lab Support Grant</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. COMPLETE 15-COURSE CATALOG (FULL ALTERNATING EDITORIAL ROWS)     */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-32 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              ACCREDITED ACADEMIC CURRICULUMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B1299] tracking-tight">
              Complete 15-Course Academic Catalog
            </h2>
            <p className="text-base text-slate-600">
              5 Flagship AI Specialization Tracks and 10 Core Technical & Management Courses designed alongside senior engineering managers to guarantee verified student capability.
            </p>
          </div>

          {/* --- PART A: 5 FLAGSHIP AI SPECIALIZATION TRACKS --- */}
          <div className="space-y-16">
            <div className="border-b-2 border-[#0B1299] pb-4 flex items-center justify-between">
              <h3 className="text-2xl font-serif font-black text-[#0B1299] flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#E65100]" />
                <span>5 FLAGSHIP AI SPECIALIZATION TRACKS</span>
              </h3>
              <span className="px-3 py-1 bg-[#0B1299]/10 text-[#0B1299] font-extrabold text-xs rounded-full">
                100 - 120 HOURS EACH
              </span>
            </div>

            <div className="space-y-24">
              {flagshipAiTracks.map((course, idx) => {
                const isImageRight = course.imageRight;
                return (
                  <div
                    key={course.id}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center border-b border-slate-100 pb-20 last:border-0 last:pb-0"
                  >
                    {/* TEXT CONTENT */}
                    <div className={`space-y-6 ${!isImageRight ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#E65100] text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                          AI {idx + 1}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#E65100]/10 text-[#E65100] font-black text-xs uppercase tracking-wider">
                          FLAGSHIP AI TRACK
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 ml-auto">
                          <Clock className="w-3.5 h-3.5 text-[#E65100]" />
                          <span>{course.duration}</span>
                        </span>
                      </div>

                      <h4 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#0B1299] tracking-tight leading-tight">
                        {course.title}
                      </h4>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {course.desc}
                      </p>

                      <div className="space-y-2 pt-2">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Key Curriculum Modules
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {course.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2 bg-[#FAF9F6] p-3 rounded-xl border border-slate-200">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="text-xs text-slate-700 font-medium leading-tight">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={() => onOpenEnrollModal(course.id)}
                          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0B1299] hover:bg-indigo-900 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:-translate-y-0.5"
                        >
                          <BookOpen className="w-4 h-4 text-[#E65100]" />
                          <span>Request Syllabus</span>
                        </button>
                      </div>
                    </div>

                    {/* IMAGE CONTAINER */}
                    <div className={`${!isImageRight ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-xl overflow-hidden group">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-[360px] sm:h-[420px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- PART B: 10 CORE TECHNICAL & MANAGEMENT COURSES --- */}
          <div className="space-y-16 pt-12">
            <div className="border-b-2 border-[#0B1299] pb-4 flex items-center justify-between">
              <h3 className="text-2xl font-serif font-black text-[#0B1299] flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#0B1299]" />
                <span>10 CORE TECHNICAL & MANAGEMENT COURSES</span>
              </h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 font-extrabold text-xs rounded-full">
                2 - 3 MONTHS EACH
              </span>
            </div>

            <div className="space-y-24">
              {coreTechnicalCourses.map((course, idx) => {
                const isImageRight = course.imageRight;
                const courseNum = idx + 6;
                return (
                  <div
                    key={course.id}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center border-b border-slate-100 pb-20 last:border-0 last:pb-0"
                  >
                    {/* TEXT CONTENT */}
                    <div className={`space-y-6 ${!isImageRight ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#0B1299] text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                          {courseNum < 10 ? `0${courseNum}` : courseNum}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#0B1299]/10 text-[#0B1299] font-black text-xs uppercase tracking-wider">
                          CORE TECHNICAL TRACK
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 ml-auto">
                          <Clock className="w-3.5 h-3.5 text-[#E65100]" />
                          <span>{course.duration}</span>
                        </span>
                      </div>

                      <h4 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#0B1299] tracking-tight leading-tight">
                        {course.title}
                      </h4>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {course.desc}
                      </p>

                      <div className="space-y-2 pt-2">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Key Curriculum Modules
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {course.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2 bg-[#FAF9F6] p-3 rounded-xl border border-slate-200">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="text-xs text-slate-700 font-medium leading-tight">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={() => onOpenEnrollModal(course.id)}
                          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0B1299] hover:bg-indigo-900 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:-translate-y-0.5"
                        >
                          <BookOpen className="w-4 h-4 text-[#E65100]" />
                          <span>Request Syllabus</span>
                        </button>
                      </div>
                    </div>

                    {/* IMAGE CONTAINER */}
                    <div className={`${!isImageRight ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-xl overflow-hidden group">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-[360px] sm:h-[420px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. OUR CENTER OF EXCELLENCE (CoE) SECTION                           */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              INSTITUTIONAL INFRASTRUCTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B1299] tracking-tight">
              AI Centre of Excellence (CoE) for Campuses
            </h2>
            <p className="text-base text-slate-600 font-medium">
              Transforming College Infrastructure into Future-Ready AI Innovation Hubs with Up to ₹20 Lakhs Support
            </p>
          </div>

          {/* REALISTIC HIGH-RES LAB IMAGE */}
          <div className="relative rounded-3xl border border-slate-200 overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80"
              alt="EduLis High-Tech AI Workstation Lab Setup"
              className="w-full h-[400px] sm:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute bottom-0 inset-x-0 p-8 sm:p-12 text-white flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E65100] text-white text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  <span>ON-CAMPUS COE LAB SETUP</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
                  Turnkey Hardware & Cloud Server Provisioning
                </h3>
                <p className="text-xs sm:text-sm text-slate-200">
                  EduLis installs high-performance GPU workstation clusters, dedicated server access, and local vector database environments directly on partner university grounds.
                </p>
              </div>

              <button
                onClick={() => onOpenEnrollModal()}
                className="shrink-0 px-6 py-3.5 bg-white text-[#0B1299] hover:bg-slate-100 font-extrabold text-xs rounded-xl transition-all shadow-lg hover:scale-105"
              >
                Apply For Campus CoE Setup
              </button>
            </div>
          </div>

          {/* INSTITUTIONAL BENEFITS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coeBenefits.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:border-[#0B1299]/50 transition-all space-y-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0B1299]/10 text-[#0B1299] flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-black text-[#0B1299]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <Check className="w-4 h-4" />
                    <span>Included in Partnership Agreement</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. 5 CREDIBILITY PILLARS (INSTITUTIONAL TRUST ANCHOR)              */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              TRUST ANCHOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B1299] tracking-tight">
              5 Credibility Pillars
            </h2>
            <p className="text-base text-slate-600">
              Deep-dive metrics establishing institutional trust and graduate outcomes across Southern India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {credibilityPillars.map((p, i) => (
              <div
                key={i}
                className="bg-[#FAF9F6] rounded-2xl border border-slate-200 p-6 space-y-3 text-center hover:border-[#0B1299] transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#0B1299]/10 text-[#0B1299] text-[11px] font-extrabold uppercase">
                    {p.stat}
                  </div>
                  <h3 className="text-base font-serif font-black text-[#0F172A]">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                  Pillar 0{i + 1} Benchmark
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0B1299] text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-2 text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
                Ready to Upgrade Your Campus Curriculum?
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                Schedule an official consultation with our Academic Transformation Directors today.
              </p>
            </div>

            <button
              onClick={() => onOpenEnrollModal()}
              className="shrink-0 px-8 py-4 bg-[#E65100] hover:bg-orange-600 text-white font-black text-xs rounded-xl transition-all shadow-lg hover:scale-105"
            >
              Schedule Campus Consultation
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};


