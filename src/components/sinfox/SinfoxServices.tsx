import React from 'react';
import { SinfoxPage } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ArrowDown
} from 'lucide-react';

interface SinfoxServicesProps {
  onOpenQuoteModal: (serviceName?: string) => void;
  onNavigate: (page: SinfoxPage) => void;
}

export const SinfoxServices: React.FC<SinfoxServicesProps> = ({
  onOpenQuoteModal,
  onNavigate
}) => {

  const servicePillars = [
    {
      num: '01',
      id: 'strategy-advisory',
      eyebrow: '01 / STRATEGY & ADVISORY',
      headline: 'Know Where To Play. Know How To Win.',
      purpose: 'Help businesses understand their market position, growth constraints and strategic priorities before investing in execution.',
      tags: [
        'Business Growth Strategy', 'Brand Audit', 'Market Research', 'Competitor Analysis',
        'Customer Research', 'Positioning Strategy', 'Go-To-Market Strategy',
        'Growth Roadmapping', 'Digital Strategy', 'Campaign Strategy', 'Business & Digital Diagnosis'
      ],
      problems: [
        'Unclear growth constraints',
        'Market expansion risk',
        'Fragmented campaign efforts',
        'Undifferentiated positioning'
      ],
      deliverables: [
        'Strategic Direction',
        'Opportunity Map',
        'Competitive Landscape',
        'Positioning Framework',
        '90-Day Growth Priorities'
      ],
      image: '/assets/sinfox/about/about-strategy-hero.webp',
      imageLeft: false // Text Left / Image Right
    },
    {
      num: '02',
      id: 'brand-identity',
      eyebrow: '02 / BRAND & IDENTITY',
      headline: 'Make The Business Mean Something.',
      purpose: 'We shape how the business is understood, remembered and experienced across every important touchpoint.',
      tags: [
        'Brand Strategy', 'Brand Positioning', 'Brand Architecture', 'Naming',
        'Visual Identity', 'Logo Systems', 'Typography & Color Systems', 'Brand Guidelines',
        'Packaging Design', 'Communication Strategy', 'Messaging Framework', 'Creative Direction', 'Rebranding'
      ],
      problems: [
        'Inconsistent brand image',
        'Outgrown visual identity',
        'Low brand awareness',
        'Messaging misalignment'
      ],
      deliverables: [
        'Brand Strategy',
        'Identity System',
        'Messaging System',
        'Brand Guidelines',
        'Launch Direction'
      ],
      image: '/assets/sinfox/home/brand-system-cap.webp',
      imageLeft: true // Image Left / Text Right
    },
    {
      num: '03',
      id: 'growth-marketing',
      eyebrow: '03 / GROWTH MARKETING',
      headline: 'Turn Market Attention Into Business Growth.',
      purpose: 'We build acquisition and communication systems designed to generate demand, improve discovery and create measurable customer journeys.',
      tags: [
        'Digital Marketing Strategy', 'Performance Marketing', 'Google Ads', 'Google Search Ads',
        'Google Display Ads', 'Google Performance Max', 'YouTube Ads', 'Meta Ads',
        'Facebook Advertising', 'Instagram Advertising', 'Social Media Marketing', 'Social Media Management',
        'Campaign Management', 'Lead Generation', 'Landing Page Campaigns', 'Remarketing & Retargeting',
        'Funnel Strategy', 'Conversion Campaigns', 'Local Marketing', 'WhatsApp Marketing', 'Email Marketing'
      ],
      problems: [
        'High customer acquisition cost',
        'Unpredictable lead volume',
        'Low social media engagement',
        'Leaked funnel conversions'
      ],
      deliverables: [
        'Acquisition Strategy',
        'Campaign Architecture',
        'Lead Funnel',
        'Media Plan',
        'Performance Dashboard'
      ],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      imageLeft: false // Text Left / Image Right
    },
    {
      num: '04',
      id: 'digital-experiences',
      eyebrow: '04 / DIGITAL EXPERIENCES',
      headline: 'Turn Brand Strategy Into Digital Experience.',
      purpose: 'We design and build digital touchpoints that communicate clearly, convert effectively and strengthen how customers experience the business.',
      tags: [
        'Corporate Websites', 'Brand Websites', 'Landing Pages', 'E-Commerce Experiences',
        'UI/UX Design', 'Website Strategy', 'Information Architecture', 'Conversion UX',
        'SEO Architecture', 'Responsive Design', 'Web Development', 'E-Commerce Development', 'Website Optimization'
      ],
      problems: [
        'High website bounce rate',
        'Outdated digital design',
        'Mobile responsiveness issues',
        'Low site speed & conversions'
      ],
      deliverables: [
        'UX Strategy',
        'Website Architecture',
        'Design System',
        'Production Website',
        'Conversion Journey'
      ],
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      imageLeft: true // Image Left / Text Right
    },
    {
      num: '05',
      id: 'technology-automation',
      eyebrow: '05 / TECHNOLOGY & AUTOMATION',
      headline: 'Build Systems That Scale With Growth.',
      purpose: 'We turn repetitive processes and disconnected workflows into structured digital systems, extending custom technology infrastructure.',
      tags: [
        'Custom Software Development', 'Web Applications', 'CRM Development', 'CRM Integration',
        'ERP Solutions', 'Business Dashboards', 'WhatsApp Automation', 'WhatsApp AI Agents',
        'AI Chatbots', 'Workflow Automation', 'Lead Automation', 'Marketing Automation',
        'Internal Business Tools', 'API Integrations', 'Cloud Solutions', 'Customer Portals', 'Admin Portals'
      ],
      problems: [
        'Manual lead management leakages',
        'Disconnected operations tools',
        'Lack of data synchronization',
        'Operational inefficiencies'
      ],
      deliverables: [
        'Technology Architecture',
        'Automation Map',
        'Custom Platform',
        'Integrated CRM',
        'Operational Dashboard'
      ],
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      imageLeft: false // Text Left / Image Right
    },
    {
      num: '06',
      id: 'creative-content',
      eyebrow: '06 / CREATIVE & CONTENT',
      headline: 'Give Strategy A Powerful Market Voice.',
      purpose: 'We translate strategic direction into high-quality visual assets and stories built for campaigns, brands and customer experiences.',
      tags: [
        'Creative Strategy', 'Campaign Concepts', 'Content Strategy', 'Social Media Content',
        'Graphic Design', 'Campaign Design', 'Ad Creatives', 'Brand Collateral',
        'Presentation Design', 'Corporate Communication', 'Copywriting', 'Content Systems',
        'Motion Graphics', 'Product Creatives'
      ],
      problems: [
        'Ad creative fatigue',
        'Inconsistent visual assets',
        'Weak brand narrative',
        'Low conversion on ad copy'
      ],
      deliverables: [
        'Creative Direction',
        'Content System',
        'Campaign Toolkit',
        'Brand Assets',
        'Communication Library'
      ],
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
      imageLeft: true // Image Left / Text Right
    },
    {
      num: '07',
      id: 'media-production',
      eyebrow: '07 / MEDIA & PRODUCTION',
      headline: 'Create The Assets That Carry The Brand.',
      purpose: 'We translate strategic direction into high-quality visual assets and stories built for campaigns, brands and customer experiences.',
      tags: [
        'Commercial Photography', 'Brand Photography', 'Product Photography', 'Corporate Photography',
        'Architectural Photography', 'Drone Photography', 'Commercial Videography', 'Brand Films',
        'Corporate Films', 'Product Films', 'Campaign Films', 'Social Video Production', 'Reels Production',
        'Interview Production', '4K Cinematography', 'Drone Videography', 'Post Production', 'Video Editing',
        'Color Grading', 'Motion Graphics'
      ],
      problems: [
        'Low asset production quality',
        'Lack of video content library',
        'Poor storytelling impact',
        'High cost of ad asset updates'
      ],
      deliverables: [
        'Production Direction',
        'Campaign Asset Library',
        'Brand Film',
        'Photography Library',
        'Edited Content System'
      ],
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      imageLeft: false // Text Left / Image Right
    },
    {
      num: '08',
      id: 'analytics-optimization',
      eyebrow: '08 / ANALYTICS & OPTIMIZATION',
      headline: 'Measure What Matters. Improve What Moves Growth.',
      purpose: 'We establish structured metrics and analytics pipelines to attribute every conversion, campaign segment, and optimization path.',
      tags: [
        'Marketing Analytics', 'Campaign Analytics', 'Performance Reporting', 'ROI Management',
        'ROAS Tracking', 'Conversion Tracking', 'Google Analytics', 'Google Tag Manager',
        'Meta Pixel Setup', 'Attribution Tracking', 'Lead Quality Analysis', 'Funnel Analytics',
        'Website Analytics', 'SEO Reporting', 'Campaign Optimization', 'A/B Testing',
        'Conversion Rate Optimization', 'Budget Optimization', 'Monthly Performance Reviews', 'Executive Growth Reporting'
      ],
      problems: [
        'Lack of data transparency',
        'Inaccurate conversion attribution',
        'Inefficient campaign spend',
        'Unknown return on investment'
      ],
      deliverables: [
        'Measurement Framework',
        'Performance Dashboard',
        'ROI / ROAS Reporting',
        'Optimization Plan',
        'Executive Growth Review'
      ],
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      imageLeft: true // Image Left / Text Right
    }
  ];

  const handleScrollToPillars = () => {
    const el = document.getElementById('capabilities-intro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-[#0088FF]/20 selection:text-[#0B1299]">
      
      {/* ==================================================================== */}
      {/* 01 — SERVICES HERO (FULL-WIDTH STRATEGY ARCHITECTURE SCENE)           */}
      {/* ==================================================================== */}
      <section className="relative h-[620px] sm:h-[680px] lg:h-[720px] w-full flex items-center bg-slate-950 overflow-hidden border-b border-slate-900 -mt-20 pt-20">
        {/* Full-width Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/sinfox/services/services-growth-architecture.webp"
            alt="Sinfox Growth Architecture - Integrated capability environment"
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
              <span>STRATEGY • BRAND • TECHNOLOGY • GROWTH</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-serif font-black text-white tracking-tight leading-[1.1]">
              Different Disciplines.<br />
              One Growth<br />
              <span className="text-[#0088FF] bg-gradient-to-r from-[#0088FF] to-cyan-300 bg-clip-text text-transparent">Direction.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
              From strategic clarity and brand systems to technology, performance marketing and creative execution — Sinfox connects the capabilities businesses need to move from ambition to measurable growth.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleScrollToPillars}
                className="bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-sm px-8 py-4 rounded-full shadow-xl shadow-[#0088FF]/30 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                Explore Capabilities
              </button>

              <button
                onClick={() => onOpenQuoteModal('Business Strategy Consultation')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-7 py-4 rounded-full transition-all cursor-pointer backdrop-blur-sm"
              >
                Start With Your Business Problem
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
      {/* 02 — SERVICES INTRO (TYPOGRAPHY MANIFESTO BLOCK)                     */}
      {/* ==================================================================== */}
      <section id="capabilities-intro" className="py-24 sm:py-32 bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-6 text-left space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
                HOW TO READ OUR CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight leading-tight">
                We Don't Start With A Service List.
              </h2>
            </div>

            <div className="lg:col-span-6 text-left space-y-6">
              <p className="text-base text-slate-700 leading-relaxed font-semibold">
                The right solution depends on the business problem. Sometimes the constraint is positioning. Sometimes it is customer acquisition. Sometimes the brand has outgrown its identity. Sometimes the business needs better technology or automation.
              </p>
              
              <p className="text-sm text-slate-500 leading-relaxed">
                Our capabilities allow us to build the right combination around the objective, rather than forcing a pre-packaged template.
              </p>

              <div className="pt-6 border-t border-slate-200 text-xs font-mono text-[#0B1299] font-bold uppercase tracking-widest">
                Strategy → Brand → Experience → Technology → Growth → Optimization
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 03 — CAPABILITIES (EIGHT CORE PILLARS IN ALTERNATING LAYOUTS)        */}
      {/* ==================================================================== */}
      <div className="divide-y divide-slate-200">
        {servicePillars.map((col, index) => {
          const isImageLeft = col.imageLeft;
          return (
            <section
              key={col.id}
              id={col.id}
              className={`py-24 sm:py-32 ${index % 2 === 1 ? 'bg-[#FAF9F6]' : 'bg-white'}`}
            >
              <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  
                  {/* TEXT CONTENT: Respects alternating rules, stacks below image on mobile */}
                  <div className={`lg:col-span-6 space-y-6 text-left order-2 lg:order-none ${!isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-serif font-black text-[#0088FF]">{col.num}</span>
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">CAPABILITY PILLAR</div>
                        <span className="text-xs font-extrabold text-slate-800 tracking-widest uppercase">{col.eyebrow}</span>
                      </div>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0F172A] tracking-tight leading-tight">
                      {col.headline}
                    </h2>

                    <p className="text-sm text-slate-650 font-semibold leading-relaxed">
                      {col.purpose}
                    </p>

                    {/* Sub services tags */}
                    <div className="pt-2">
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">INCLUDED CAPABILITIES</div>
                      <div className="flex flex-wrap gap-2">
                        {col.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm hover:border-[#0088FF]/30 transition-all cursor-default"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Two-column Business Problems vs Outputs comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                      <div>
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">BUSINESS PROBLEMS</div>
                        <div className="flex flex-col gap-1.5 mt-2">
                          {col.problems.map((prob, pIdx) => (
                            <span key={pIdx} className="text-xs text-slate-550 font-semibold leading-tight">
                              • {prob}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-extrabold text-[#0088FF] uppercase tracking-widest">WHAT WE DELIVER</div>
                        <div className="flex flex-col gap-1.5 mt-2">
                          {col.deliverables.map((del, dIdx) => (
                            <span key={dIdx} className="text-xs text-slate-700 font-bold flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0088FF]" />
                              {del}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => onOpenQuoteModal(col.eyebrow)}
                        className="bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-xs px-6 py-3.5 rounded-full shadow-md transition-all cursor-pointer"
                      >
                        Explore {col.eyebrow.split('/')[1]?.trim()}
                      </button>
                    </div>
                  </div>

                  {/* IMAGE CONTENT: Enforced as first order element on mobile layout */}
                  <div className={`lg:col-span-6 order-1 lg:order-none ${!isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative h-[280px] sm:h-[350px] max-w-md mx-auto">
                      <img
                        src={col.image}
                        alt={col.eyebrow}
                        className="w-full h-full object-cover grayscale opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                    </div>
                  </div>

                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* 04 — CONNECTED CAPABILITIES (THE ADVANTAGE SEGMENT)                  */}
      {/* ==================================================================== */}
      <section className="py-24 sm:py-32 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-center">
          
          <div className="space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              THE ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              The Real Value Is How The Capabilities Connect.
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Our partners do not need to manage disconnected agencies. We assemble custom cross-discipline squads around the business objective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'NEW MARKET ENTRY',
                elements: ['Strategy', 'Brand', 'Website', 'Performance Marketing', 'Analytics'],
                purpose: 'Define positioning, establish visual authority, launch digital conversion hub, scale search/social acquisition, and attribute performance.'
              },
              {
                title: 'BRAND TRANSFORMATION',
                elements: ['Research', 'Positioning', 'Identity', 'Digital Experience', 'Campaign Launch'],
                purpose: 'Evaluate perception gaps, refine core differentiation, deploy updated assets, and run realignment campaigns.'
              },
              {
                title: 'LEAD GENERATION SYSTEM',
                elements: ['Growth Strategy', 'Landing Page', 'Google/Meta Ads', 'CRM/WhatsApp', 'ROI Optimization'],
                purpose: 'Map conversion constraints, design landing funnels, install custom lead CRMs, and automate nursery broadcasts with ROI analysis.'
              },
              {
                title: 'DIGITAL TRANSFORMATION',
                elements: ['Process Diagnosis', 'Software', 'CRM', 'Automation', 'Analytics'],
                purpose: 'Analyze internal operational friction, engineer React/Node dashboards, sync billing/automation workflows, and review progress metrics.'
              }
            ].map((comb, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-all duration-350 min-h-[320px]"
              >
                <div className="space-y-4">
                  <div className="text-xs font-extrabold text-[#0B1299] tracking-wider uppercase">EXAMPLE 0{idx + 1}</div>
                  <h4 className="text-sm font-bold text-[#0F172A] tracking-wider uppercase">{comb.title}</h4>
                  
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {comb.elements.map((el, eIdx) => (
                      <React.Fragment key={eIdx}>
                        <span className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          {el}
                        </span>
                        {eIdx < comb.elements.length - 1 && <span className="text-xs text-slate-400 font-bold">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-550 leading-relaxed font-semibold mt-6 border-t border-slate-100 pt-4">
                  {comb.purpose}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 05 — ENGAGEMENT MODEL                                                */}
      {/* ==================================================================== */}
      <section className="py-24 sm:py-32 bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl space-y-3 text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              HOW ENGAGEMENTS BEGIN
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              Start With The Problem. Build The Right Scope.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'GROWTH PROBLEM',
                desc: 'Unpredictable customer acquisition, high cost per lead, or declining search relevance. We scope performance funnels to stabilize demand.'
              },
              {
                num: '02',
                title: 'BRAND PROBLEM',
                desc: 'Company size has outgrown its market image, or messaging is inconsistent across touchpoints. We align visual positioning and visual guidelines.'
              },
              {
                num: '03',
                title: 'SYSTEMS PROBLEM',
                desc: 'Operational growth is blocked by manual workflows, fragmented tools, or lead leaks. We install CRM platforms and custom automation systems.'
              }
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-[#FAF9F6] p-8 rounded-3xl border border-slate-200 text-left min-h-[220px] flex flex-col justify-between hover:border-[#0088FF]/30 transition-all duration-300"
              >
                <div className="text-xs font-serif font-black text-[#0088FF]">{step.num}</div>
                <div className="mt-4">
                  <h4 className="text-xs font-extrabold text-[#0F172A] tracking-wider uppercase">{step.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold mt-2">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
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
            <span>NOT SURE WHICH SERVICE YOU NEED?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Good.<br />Start With The Business Problem.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Tell us what you are trying to achieve and what is getting in the way. We'll help determine what should happen next.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenQuoteModal('General Scope Consultation')}
              className="bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-sm px-8 py-4 rounded-full shadow-xl shadow-[#0088FF]/30 transition-all hover:scale-103 active:scale-97 cursor-pointer"
            >
              Book Strategic Consultation
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-8 py-4 rounded-full transition-all cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
