import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Database, Cpu, Server, Code, BarChart3, ShieldCheck } from 'lucide-react';

interface TechlisServicesProps {
  onOpenQuoteModal: (serviceName?: string) => void;
}

export const TechlisServices: React.FC<TechlisServicesProps> = ({
  onOpenQuoteModal,
}) => {
  const serviceRows = [
    {
      id: 'custom-erps-billing',
      title: 'Custom Enterprise ERPs & Billing Portals',
      subtitle: 'Multi-branch POS engines, automated invoicing, role-based access control, and payment gateway sync.',
      desc: 'Replace fragmented, off-the-shelf software with bespoke enterprise ERP systems crafted specifically for your organizational hierarchy. We build multi-tenant billing engines, automated GST invoicing, stock auditing, and executive dashboards.',
      highlights: [
        'Multi-Branch Multi-User Hierarchy & Permission Matrix',
        'Automated GST Billing & Tally/Zoho Sync Integrations',
        'Real-Time Stock & Warehouse Inventory Auditing',
        'Payment Gateway Auto-Reconciliation & WhatsApp Receipts'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      textLeft: true,
      badge: 'ENTERPRISE ERP & BILLING',
      ctaText: 'Request Technical Blueprint',
      icon: <Database className="w-5 h-5 text-[#0088FF]" />,
    },
    {
      id: 'ai-agents-workflow',
      title: 'AI Agents & Workflow Automation Engines',
      subtitle: 'Autonomous LLM execution agents, document OCR parsers, and automated lead triage workflows.',
      desc: 'Eliminate repetitive manual labor by deploying autonomous AI logic directly into core operational workflows. From automated document parsing and smart email routing to conversational customer support bots and predictive lead scoring.',
      highlights: [
        'Autonomous AI Agent Networks for Multi-Step Workflows',
        'OCR Document & Invoice Parsing with High Precision',
        'Conversational Customer Support & WhatsApp AI Bots',
        'Predictive Lead Scoring & Automated CRM Data Enrichment'
      ],
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
      textLeft: false,
      badge: 'AUTONOMOUS AI LOGIC',
      ctaText: 'Request Technical Blueprint',
      icon: <Cpu className="w-5 h-5 text-[#0B1299]" />,
    },
    {
      id: 'cloud-microservices',
      title: 'Scalable Cloud & Microservices Architecture',
      subtitle: 'Multi-region Kubernetes clusters, serverless API backends, active-active DB failover, and CI/CD pipelines.',
      desc: 'Build high-availability, fault-tolerant cloud backends engineered to handle rapid user growth and transaction spikes. We architect microservices on AWS/GCP, configure zero-downtime CI/CD deployment pipelines, and enforce strict ISO 27001 data security.',
      highlights: [
        'Multi-Region Kubernetes Container Orchestration',
        'Active-Active Database Replication & Auto-Failover',
        'Automated CI/CD Pipelines & Infrastructure as Code (Terraform)',
        'Zero-Trust SAML/OAuth2 Authentication & Rate Limiting'
      ],
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      textLeft: true,
      badge: 'CLOUD & BACKEND TECH',
      ctaText: 'Request Technical Blueprint',
      icon: <Server className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'web-saas-portals',
      title: 'Web Application & SaaS Portal Engineering',
      subtitle: 'Lightning-fast React/Next.js platforms, client portals, subscription billing, and responsive UX.',
      desc: 'Design and develop modern web applications and customer portals that deliver instantaneous response times and crisp user experiences. From subscription SaaS web apps to complex partner portals and client management interfaces.',
      highlights: [
        'High-Performance React & Next.js Single Page Applications',
        'Stripe & Razorpay Recurring Subscription Engines',
        'Role-Based Client & Vendor Management Dashboards',
        'Mobile-Responsive & Progressive Web App (PWA) Architecture'
      ],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      textLeft: false,
      badge: 'FULL-STACK SAAS & WEB',
      ctaText: 'Request Technical Blueprint',
      icon: <Code className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'data-analytics-dashboards',
      title: 'Real-Time Analytics & Executive Dashboards',
      subtitle: 'ETL data pipelines, real-time telemetry streaming, interactive BI charts, and executive reporting.',
      desc: 'Turn raw transactional data into actionable executive intelligence. We construct high-throughput data warehousing pipelines, custom business intelligence dashboards, real-time KPI streams, and automated executive email/PDF reports.',
      highlights: [
        'Real-Time Ingestion Data Pipelines & Warehousing',
        'Interactive BI Analytics Dashboards (Recharts / D3)',
        'Automated Daily/Weekly Executive Performance Summaries',
        'Predictive Anomaly Detection & Financial Telemetry'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      textLeft: true,
      badge: 'DATA & BI TELEMETRY',
      ctaText: 'Request Technical Blueprint',
      icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
    },
  ];

  return (
    <div className="bg-white text-[#0F172A] font-sans selection:bg-[#0088FF]/20 selection:text-[#0B1299]">
      
      {/* PAGE HERO HEADER WITH IMAGE SPLIT */}
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
                <Sparkles className="w-4 h-4 text-[#0088FF]" />
                <span>FULL-STACK ENTERPRISE ENGINEERING</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight leading-[1.15]">
                Full-Stack Enterprise <span className="text-[#0088FF] bg-gradient-to-r from-[#0088FF] to-cyan-300 bg-clip-text text-transparent">Engineering Capabilities</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
                5 core engineering pillars built to provide end-to-end digital transformation for modern organizations.
              </p>
            </div>

            {/* RIGHT COLUMN: HERO BANNER IMAGE FRAME */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl border border-slate-800 bg-white/5 p-3 shadow-2xl backdrop-blur-md">
                <div className="relative h-[340px] sm:h-[400px] rounded-2xl overflow-hidden group">
                  <img
                    src="/assets/techlis/banners/techlis-services-hero.png"
                    alt="Tech Lis Services Capabilities"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/80 border border-white/20 backdrop-blur-md text-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">Capabilities Model</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">ACTIVE SERVICES</span>
                    </div>
                    <div className="text-sm font-serif font-bold text-white">Cloud Backends & AI Agent Architectures</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5 FULL ALTERNATING EDITORIAL ROWS WITH BANNER IMAGE + TEXT + CTA */}
      <div className="divide-y divide-slate-200">
        {serviceRows.map((srv, index) => {
          const isTextLeft = srv.textLeft;

          return (
            <section
              key={srv.id}
              id={srv.id}
              className={`py-20 lg:py-28 ${index % 2 === 1 ? 'bg-[#FAF9F6]' : 'bg-white'}`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  
                  {/* TEXT CONTENT */}
                  <div className={`space-y-6 ${!isTextLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-800">
                      {srv.icon}
                      <span className="uppercase tracking-wider">{srv.badge}</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0F172A] tracking-tight leading-tight">
                      {srv.title}
                    </h2>

                    <p className="text-sm sm:text-base text-slate-700 font-semibold leading-relaxed">
                      {srv.subtitle}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {srv.desc}
                    </p>

                    {/* Bullet Highlights */}
                    <div className="space-y-2.5 pt-2">
                      {srv.highlights.map((item, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-[#0088FF] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                      <button
                        onClick={() => onOpenQuoteModal(srv.title)}
                        className="bg-gradient-to-r from-[#0B1299] to-[#0088FF] hover:opacity-95 text-white font-bold text-xs px-8 py-4 rounded-full shadow-lg shadow-[#0B1299]/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                      >
                        <span>{srv.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* IMAGE CONTENT */}
                  <div className={`${!isTextLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-2xl relative bg-slate-900 group">
                      <img
                        src={srv.image}
                        alt={srv.title}
                        className="w-full h-[400px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      
                      <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-xl flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0088FF]">TECH LIS CAPABILITY 0{index + 1}</div>
                          <div className="text-sm font-serif font-bold text-[#0F172A]">{srv.title}</div>
                        </div>
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          );
        })}
      </div>

    </div>
  );
};
