import React, { useState } from 'react';
import { saveLeadOrAlert } from '../../lib/leads';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export const TechlisContact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    serviceTier: 'Custom Enterprise ERP & Billing',
    budget: '$5,000 - $15,000',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, company, email, phone, serviceTier, budget, message } = formData;
    if (!(await saveLeadOrAlert('techlis-contact', { name, company, email, phone, service: serviceTier, message, extra: { budget } }))) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF9F6] text-[#0F172A] font-sans py-16 lg:py-24 selection:bg-[#0088FF]/20 selection:text-[#0B1299]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* HERO TITLE */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold text-[#0B1299]">
            <Cpu className="w-4 h-4 text-[#0088FF]" />
            <span>ENTERPRISE CONSULTATION HOTLINE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-[#0F172A] tracking-tight leading-tight">
            Schedule Your <span className="text-[#0088FF]">SLA Consultation.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Connect directly with our principal software architects and engineering team for custom ERP, AI agent, or cloud infrastructure planning.
          </p>
        </div>

        {/* 2-COLUMN GRID (DIRECT HQ DETAILS LEFT | FORM RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* DIRECT HQ DETAILS (LEFT 5 COLS) */}
          <div className="lg:col-span-5 space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0088FF]">
                HEADQUARTERS & DIRECT ACCESS
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A]">
                Engineering Command Center
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Operating as the technology arm of Sindulis Innovative Solutions, powering enterprise applications across South Asia.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FAF9F6] rounded-2xl border border-slate-200 text-[#0088FF] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">OFFICE ADDRESS</div>
                  <div className="text-sm font-bold text-[#0F172A] mt-0.5">
                    1/18 Bradipeta, Guntur - 522006, Andhra Pradesh, India
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FAF9F6] rounded-2xl border border-slate-200 text-[#0B1299] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">DIRECT HOTLINE</div>
                  <a
                    href="tel:+919494080479"
                    className="text-sm font-bold text-[#0F172A] hover:text-[#0088FF] transition-colors mt-0.5 block"
                  >
                    +91 94940 80479
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FAF9F6] rounded-2xl border border-slate-200 text-emerald-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">PRIMARY EMAILS</div>
                  <a
                    href="mailto:sinfoxmedia@gmail.com"
                    className="text-sm font-bold text-[#0F172A] hover:text-[#0088FF] transition-colors mt-0.5 block"
                  >
                    sinfoxmedia@gmail.com
                  </a>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">Response within 24 hours</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>NDA & Data Confidentiality Standard</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#0088FF]" />
                <span>24-Hour Technical Architecture Response</span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE FORM (RIGHT 7 COLS) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
            {submitted ? (
              <div className="py-16 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-[#0F172A]">
                    SLA Request Transmitted
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you, <span className="font-bold text-[#0F172A]">{formData.name}</span>. Our lead software architect will review your project scope and respond within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      company: '',
                      email: '',
                      phone: '',
                      serviceTier: 'Custom Enterprise ERP & Billing',
                      budget: '$5,000 - $15,000',
                      message: '',
                    });
                  }}
                  className="bg-[#0B1299] text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-[#090e7a] transition-colors"
                >
                  Submit Another Consultation Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-[#0F172A]">
                    Request Free Architecture Audit & Project Blueprint
                  </h3>
                  <p className="text-xs text-slate-500">
                    Provide your requirements below to receive a custom SLA roadmap, technical blueprint, and cost estimate.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Subhash Tagore"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0088FF] focus:ring-1 focus:ring-[#0088FF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Organization / Company *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g., Apex Healthcare Group"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0088FF] focus:ring-1 focus:ring-[#0088FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g., subhash@enterprise.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0088FF] focus:ring-1 focus:ring-[#0088FF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g., +91 94940 80479"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0088FF] focus:ring-1 focus:ring-[#0088FF]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Required Service Capability *
                  </label>
                  <select
                    value={formData.serviceTier}
                    onChange={(e) => setFormData({ ...formData, serviceTier: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0088FF] focus:ring-1 focus:ring-[#0088FF] bg-white"
                  >
                    <option value="Custom Enterprise ERP & Billing">Custom Enterprise ERP & Billing Portals</option>
                    <option value="AI Agents & Workflow Automation">AI Agents & Workflow Automation Engines</option>
                    <option value="Scalable Cloud & Microservices">Scalable Cloud & Microservices Infrastructure</option>
                    <option value="Web App & SaaS Portal Engineering">Web Application & SaaS Portal Engineering</option>
                    <option value="Data Engineering & Analytics">Data Engineering & Analytics Dashboards</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Project Scope / Specifications
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your current system bottlenecks, user count, or target timeline..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0088FF] focus:ring-1 focus:ring-[#0088FF]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0B1299] to-[#0088FF] hover:opacity-95 text-white font-bold text-xs py-4 rounded-xl shadow-lg shadow-[#0B1299]/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Consultation Request & Schedule SLA Call</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* INTERACTIVE GOOGLE MAPS HQ EMBED BLOCK */}
        <div className="mt-16 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
          <div className="p-6 sm:p-8 bg-[#FAF9F6] border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1299]/10 text-[#0B1299] text-[10px] font-extrabold uppercase tracking-widest mb-1">
                GLOBAL HEADQUARTERS & SOC
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0F172A]">
                Tech Lis Enterprise Headquarters — Guntur, AP
              </h3>
              <p className="text-xs text-slate-500">
                1/18 Bradipeta, Guntur - 522006, Andhra Pradesh, India | Direct Hotline: +91 94940 80479
              </p>
            </div>
            <a
              href="https://maps.google.com/maps?q=Bradipeta%2C%20Guntur%2C%20Andhra%20Pradesh%20522006"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0B1299] hover:bg-[#090e7a] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow transition-all hover:scale-105"
            >
              Open in Google Maps
            </a>
          </div>

          <div className="w-full h-80 sm:h-96 relative bg-slate-100">
            <iframe
              title="Tech Lis Headquarters Map - Guntur Bradipeta"
              src="https://maps.google.com/maps?q=Bradipeta%2C%20Guntur%2C%20Andhra%20Pradesh%20522006&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>

      </div>
    </div>
  );
};
