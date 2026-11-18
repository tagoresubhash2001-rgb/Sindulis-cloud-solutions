import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, Send, Sparkles, ArrowRight } from 'lucide-react';
import { SinfoxPage } from '../../types';

interface SinfoxContactProps {
  onOpenQuoteModal: (serviceName?: string) => void;
  onNavigate: (page: SinfoxPage) => void;
}

export const SinfoxContact: React.FC<SinfoxContactProps> = ({
  onOpenQuoteModal,
  onNavigate
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'Founder / Owner',
    industry: 'Healthcare / Hospitals',
    stage: 'Growing Business',
    objectives: [] as string[],
    constraints: [] as string[],
    capabilities: [] as string[],
    timeline: 'Exploring / Planning',
    investment: 'Need Sinfox Recommendation',
    message: '',
    website: '',
    consent: false
  });

  const objectivesOptions = [
    'Strengthen Our Brand',
    'Generate More Qualified Leads',
    'Improve Marketing Performance',
    'Launch A New Brand / Product',
    'Build / Rebuild Our Website',
    'Develop Software / CRM',
    'Automate Business Processes',
    'Enter A New Market',
    'Improve Customer Experience',
    'Create A Content / Media System',
    'Understand Why Growth Is Stuck',
    'Not Sure Yet'
  ];

  const constraintsOptions = [
    'Positioning Is Unclear',
    'Brand Looks Weaker Than The Business',
    'Lead Generation Is Inconsistent',
    'Marketing ROI Is Unclear',
    'Website Is Not Converting',
    'Sales / Follow-Up Is Too Manual',
    'Technology Systems Are Disconnected',
    'Content Lacks Direction',
    'Entering A New Market',
    'We Know Something Needs To Change, But Not What',
    'Other'
  ];

  const capabilitiesOptions = [
    'Strategy & Advisory',
    'Brand & Identity',
    'Growth Marketing',
    'Google / PPC Ads',
    'Meta Ads',
    'Social Media Management',
    'SEO',
    'Web & Digital Experience',
    'Software / CRM',
    'AI & Automation',
    'Creative & Content',
    'Photography / Videography',
    'Analytics & ROI Optimization',
    'Not Sure'
  ];

  const toggleObjective = (val: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(val)
        ? prev.objectives.filter(o => o !== val)
        : [...prev.objectives, val]
    }));
  };

  const toggleConstraint = (val: string) => {
    setFormData(prev => ({
      ...prev,
      constraints: prev.constraints.includes(val)
        ? prev.constraints.filter(c => c !== val)
        : [...prev.constraints, val]
    }));
  };

  const toggleCapability = (val: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(val)
        ? prev.capabilities.filter(c => c !== val)
        : [...prev.capabilities, val]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) return;
    setSubmitted(true);
  };

  const handleScrollToForm = () => {
    const el = document.getElementById('consultation-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToDirect = () => {
    const el = document.getElementById('direct-contact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-[#0088FF]/20 selection:text-[#0B1299]">
      
      {/* ==================================================================== */}
      {/* 01 — CONTACT HERO (THE OPENING CONVERSATION ENVIRONMENT)               */}
      {/* ==================================================================== */}
      <section className="relative h-[620px] sm:h-[680px] lg:h-[720px] w-full flex items-center bg-slate-950 overflow-hidden border-b border-slate-900 -mt-20 pt-20">
        {/* Full-width Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/sinfox/contact/contact-consultation-hero.webp"
            alt="Sinfox Consultation Environment - Executive desk and meeting notebook"
            className="w-full h-full object-cover object-[75%_center] sm:object-right opacity-70"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-2xl text-left space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-slate-300 text-[11px] sm:text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#0088FF]" />
              <span>START WITH THE BUSINESS PROBLEM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-serif font-black text-white tracking-tight leading-[1.1]">
              Let's Understand<br />
              What Needs To<br />
              <span className="text-[#0088FF] bg-gradient-to-r from-[#0088FF] to-cyan-300 bg-clip-text text-transparent">Move Next.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
              Tell us where the business is today, where you want it to go and what is getting in the way. We'll start there — before recommending a service.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleScrollToForm}
                className="bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-sm px-8 py-4 rounded-full shadow-xl shadow-[#0088FF]/30 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                Start Strategic Consultation
              </button>

              <button
                onClick={handleScrollToDirect}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-7 py-4 rounded-full transition-all cursor-pointer backdrop-blur-sm"
              >
                Contact Us Directly
              </button>
            </div>

            <div className="pt-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-white/10 max-w-sm">
              Strategy • Brand • Technology • Growth
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 04 — TRANSITIONAL BREATHING ZONE                                    */}
      {/* ==================================================================== */}
      <div className="h-16 bg-[#FFFFFF] border-b border-slate-100" />

      {/* ==================================================================== */}
      {/* 02 — INTRODUCTION (TYPOGRAPHY MANIFESTO BLOCK)                      */}
      {/* ==================================================================== */}
      <section className="py-24 sm:py-32 bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-6 text-left space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
                A BETTER FIRST CONVERSATION
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight leading-tight">
                You Don't Need To Know Which Service You Need.
              </h2>
            </div>

            <div className="lg:col-span-6 text-left space-y-6">
              <p className="text-base text-slate-705 leading-relaxed font-semibold">
                Some businesses come to us asking for marketing when the real problem is positioning. Others ask for a website when the real issue is customer experience. Some need better campaigns. Others need better systems.
              </p>
              
              <p className="text-sm text-slate-500 leading-relaxed font-normal">
                Our first job is to understand the difference. We diagnose constraints before prescribing activities, ensuring execution targets correct objectives.
              </p>

              <div className="pt-6 border-t border-slate-200">
                <blockquote className="text-lg sm:text-xl font-serif italic font-bold text-[#0B1299] leading-relaxed">
                  “Start with the objective. We'll work backwards from there.”
                </blockquote>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 03 — STRATEGIC CONSULTATION EXPERIENCE FORM (MAIN)                   */}
      {/* ==================================================================== */}
      <section id="consultation-form-section" className="py-24 sm:py-32 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
            
            {/* LEFT COLUMN: CONSULTATION CONTEXT */}
            <div className="lg:col-span-4 bg-[#FAF9F6]/45 p-8 sm:p-12 text-left border-r border-slate-200 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
                    STRATEGIC CONSULTATION
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#0F172A] mt-2">
                    Help Us Understand The Business.
                  </h3>
                  <p className="text-xs text-slate-500 mt-2">
                    The more context you provide, the more useful our first conversation can be.
                  </p>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-200/80">
                  {[
                    { num: '01', title: 'WHERE ARE YOU NOW?', desc: 'Current business situation.' },
                    { num: '02', title: 'WHERE DO YOU WANT TO GO?', desc: 'Business objective or opportunity.' },
                    { num: '03', title: 'WHAT IS GETTING IN THE WAY?', desc: 'Primary challenge or uncertainty.' },
                    { num: '04', title: 'WHAT HAPPENS NEXT?', desc: 'We\'ll review the context and determine the right conversation.' },
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className="text-xs font-serif font-bold text-[#0088FF] pt-0.5">{step.num}</span>
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">{step.title}</div>
                        <p className="text-xs text-slate-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200/80 text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                NO OBLIGATION. NO GENERIC SALES PITCH.
              </div>
            </div>

            {/* RIGHT COLUMN: STRUCTURED QUALIFICATION FORM */}
            <div className="lg:col-span-8 p-8 sm:p-12 text-left">
              {submitted ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-serif font-black text-[#0F172A]">
                    Context Submitted.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-bold text-slate-900">{formData.name}</span>. We will review your constraints and schedule a strategy discovery conversation to match you with correct solutions.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-full transition-all"
                  >
                    Submit Another Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Row 1: Context introduction */}
                  <div>
                    <h4 className="text-lg font-serif font-black text-[#0F172A]">Tell Us About The Business</h4>
                    <p className="text-xs text-slate-450">This should take approximately 2–3 minutes.</p>
                  </div>

                  {/* Section A: About You */}
                  <div className="space-y-4">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">SECTION A // IDENTITY</div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Subhash Tagore"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Work Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="subhash@domain.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 94940 80479"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none bg-white"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization *</label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Amara Hospitals"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none bg-white"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Your Role</label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none bg-white"
                        >
                          <option value="Founder / Owner">Founder / Owner</option>
                          <option value="Director">Director</option>
                          <option value="Marketing Head">Marketing Head</option>
                          <option value="Growth Head">Growth Head</option>
                          <option value="Operations">Operations</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section B: About the Business */}
                  <div className="space-y-4">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">SECTION B // STAGE & SECTOR</div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Industry Sector *</label>
                        <select
                          value={formData.industry}
                          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none bg-white"
                        >
                          <option value="Healthcare / Hospitals">Healthcare / Hospitals</option>
                          <option value="Education">Education</option>
                          <option value="Real Estate / Infrastructure">Real Estate / Infrastructure</option>
                          <option value="Retail / D2C">Retail / D2C</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Professional Services">Professional Services</option>
                          <option value="Technology">Technology</option>
                          <option value="Hospitality">Hospitality</option>
                          <option value="Media / Entertainment">Media / Entertainment</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Company Stage *</label>
                        <select
                          value={formData.stage}
                          onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none bg-white"
                        >
                          <option value="Early Stage">Early Stage</option>
                          <option value="Growing Business">Growing Business</option>
                          <option value="Established Business">Established Business</option>
                          <option value="Expansion Stage">Expansion Stage</option>
                          <option value="Enterprise / Institution">Enterprise / Institution</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section C: The Objective */}
                  <div className="space-y-3">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">SECTION C // GOALS & OBJECTIVES *</div>
                    <label className="block text-xs font-bold text-slate-700">What are you trying to achieve?</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {objectivesOptions.map((opt, idx) => {
                        const active = formData.objectives.includes(opt);
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => toggleObjective(opt)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              active
                                ? 'bg-[#0088FF]/10 border-[#0088FF] text-[#0088FF]'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-355'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section D: Primary Challenge */}
                  <div className="space-y-3">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">SECTION D // GROWTH CONSTRAINTS</div>
                    <label className="block text-xs font-bold text-slate-700">What currently feels like the biggest constraint?</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {constraintsOptions.map((opt, idx) => {
                        const active = formData.constraints.includes(opt);
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => toggleConstraint(opt)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              active
                                ? 'bg-[#0088FF]/10 border-[#0088FF] text-[#0088FF]'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-355'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section E: Capability Interest */}
                  <div className="space-y-3">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">SECTION E // CAPABILITY INTERESTS</div>
                    <label className="block text-xs font-bold text-slate-700">Already know which capabilities may be relevant? (Optional)</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {capabilitiesOptions.map((opt, idx) => {
                        const active = formData.capabilities.includes(opt);
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => toggleCapability(opt)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              active
                                ? 'bg-[#0088FF]/10 border-[#0088FF] text-[#0088FF]'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-355'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section F: Engagement Context */}
                  <div className="space-y-4">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">SECTION F // TIMELINE & CONTEXT</div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Timeline</label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none bg-white"
                        >
                          <option value="As Soon As Possible">As Soon As Possible</option>
                          <option value="Within 30 Days">Within 30 Days</option>
                          <option value="1–3 Months">1–3 Months</option>
                          <option value="3–6 Months">3–6 Months</option>
                          <option value="Exploring / Planning">Exploring / Planning</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Investment Planning</label>
                        <select
                          value={formData.investment}
                          onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none bg-white"
                        >
                          <option value="Need Sinfox Recommendation">Need Sinfox Recommendation</option>
                          <option value="Budget Already Allocated">Budget Already Allocated</option>
                          <option value="Currently Evaluating Scope">Currently Evaluating Scope</option>
                          <option value="Still Planning">Still Planning</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section G: Detailed Context */}
                  <div className="space-y-4">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">SECTION G // DETAILED BRIEF</div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tell Us More About The Business, Goal Or Challenge</label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="What is happening today? What would a successful outcome look like? Include any context you think would help us understand the situation."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none bg-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Website / Social / Relevant Link (Optional)</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  {/* Consent & Submit */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-slate-200 text-[#0088FF] focus:ring-[#0088FF]"
                      />
                      <span>I agree to be contacted by Sinfox regarding this enquiry.</span>
                    </label>

                    <button
                      type="submit"
                      disabled={!formData.consent}
                      className="w-full bg-[#0088FF] hover:bg-[#0077E6] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Submit Strategic Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    <p className="text-[10px] text-slate-400 text-center">
                      We'll review your enquiry before the first conversation.
                    </p>
                  </div>

                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 04 — WHAT HAPPENS NEXT (NUMBERED STEPS)                             */}
      {/* ==================================================================== */}
      <section className="py-24 sm:py-32 bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              AFTER YOU SUBMIT
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              What Happens Next.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                num: '01',
                title: 'WE REVIEW THE CONTEXT',
                desc: 'We understand the objective, current situation and likely constraints.'
              },
              {
                num: '02',
                title: 'WE IDENTIFY THE RIGHT CONVERSATION',
                desc: 'Strategy, brand, technology, growth — or a combination.'
              },
              {
                num: '03',
                title: 'WE DISCUSS THE BUSINESS',
                desc: 'The first conversation focuses on understanding the problem before defining scope.'
              },
              {
                num: '04',
                title: 'WE RECOMMEND THE NEXT STEP',
                desc: 'If there is a fit, we define the appropriate engagement, scope and direction.'
              }
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-[#FAF9F6] p-8 rounded-3xl border border-slate-200 text-left min-h-[200px] flex flex-col justify-between hover:border-[#0088FF]/30 transition-all duration-300"
              >
                <div className="text-xs font-serif font-black text-[#0088FF]">{step.num}</div>
                <div className="mt-4">
                  <h4 className="text-xs font-extrabold text-[#0F172A] tracking-wider uppercase leading-snug">{step.title}</h4>
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
      {/* 05 — DIRECT CONTACT & HEADQUARTERS                                    */}
      {/* ==================================================================== */}
      <section id="direct-contact-section" className="py-24 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              DIRECT COMMUNICATIONS
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              Sinfox Media Directorate
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              A Subsidiary of Sindulis Innovative Solutions. Serving enterprise brands, educational institutions, and public figures nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'CALL',
                label: 'Direct Hotline',
                value: '+91 94940 80479',
                sub: 'Mon - Sat, 9:00 AM - 8:00 PM IST',
                icon: <Phone className="w-5 h-5 text-[#0088FF]" />,
                action: 'tel:+919494080479',
                actionLabel: 'Call Sinfox'
              },
              {
                title: 'EMAIL',
                label: 'Official Email',
                value: 'sinfoxmedia@gmail.com',
                sub: 'Executive campaign desk response',
                icon: <Mail className="w-5 h-5 text-[#0B1299]" />,
                action: 'mailto:sinfoxmedia@gmail.com',
                actionLabel: 'Send Email'
              },
              {
                title: 'VISIT',
                label: 'Official Headquarters',
                value: '1/18 Bradipeta, Guntur - 522006',
                sub: 'Andhra Pradesh, India',
                icon: <MapPin className="w-5 h-5 text-emerald-600" />,
                action: 'https://maps.google.com',
                actionLabel: 'View Location'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-slate-200 text-left flex flex-col justify-between min-h-[220px] hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{item.title}</span>
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                    <div className="text-base font-serif font-black text-[#0F172A]">{item.value}</div>
                    <div className="text-xs text-slate-500">{item.sub}</div>
                  </div>
                </div>

                <a
                  href={item.action}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 text-xs font-bold text-[#0088FF] hover:text-[#0B1299] flex items-center gap-1 transition-colors"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 06 — ENGAGEMENT PRINCIPLES / TRUST                                    */}
      {/* ==================================================================== */}
      <section className="py-24 sm:py-32 bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl space-y-3 text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
              WHAT TO EXPECT
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
              A Serious Conversation. Not A Sales Script.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'BUSINESS FIRST', desc: 'We begin with the objective and context. We analyze constraints before proposing work.' },
              { title: 'RIGHT SCOPE', desc: 'We recommend what the problem requires — not everything we sell.' },
              { title: 'CONNECTED THINKING', desc: 'Strategy, brand, technology and growth are considered together under one connected model.' },
              { title: 'CLEAR NEXT STEP', desc: 'Every meaningful conversation should end with absolute clarity about what happens next.' }
            ].map((p, idx) => (
              <div
                key={idx}
                className="bg-[#FAF9F6] p-6 rounded-2xl border border-slate-200/80 text-left flex flex-col justify-between min-h-[200px]"
              >
                <h4 className="text-xs font-extrabold text-[#0B1299] tracking-wider uppercase leading-snug">{p.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold mt-4">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 07 — UNDERSTATED QUALIFICATION NOTE                                   */}
      {/* ==================================================================== */}
      <section className="py-20 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h3 className="text-lg sm:text-2xl font-serif italic font-bold text-[#0F172A]">
            Not Every Conversation Needs To Become A Project.
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Sometimes the right next step is a brand engagement. Sometimes it is a campaign. Sometimes it is technology. Sometimes it is simply identifying what should be fixed first. The objective of the first conversation is clarity.
          </p>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 08 — FINAL MICRO CTA                                                 */}
      {/* ==================================================================== */}
      <section className="py-28 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
            READY WHEN YOU ARE
          </span>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Start With The Challenge.<br />We'll Start With The Questions.
          </h2>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleScrollToForm}
              className="bg-[#0088FF] hover:bg-[#0077E6] text-white font-bold text-sm px-8 py-4 rounded-full shadow-xl shadow-[#0088FF]/30 transition-all hover:scale-103 active:scale-97 cursor-pointer"
            >
              Begin Consultation
            </button>
            <button
              onClick={() => onNavigate('services')}
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
