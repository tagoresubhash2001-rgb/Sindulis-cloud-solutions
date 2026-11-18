import React, { useState } from 'react';
import { saveLeadOrAlert } from '../../lib/leads';
import { X, CheckCircle2, Send, Sparkles } from 'lucide-react';

interface SinfoxQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const SinfoxQuoteModal: React.FC<SinfoxQuoteModalProps> = ({
  isOpen,
  onClose,
  defaultService = 'Digital Marketing & Growth',
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: defaultService,
    budget: '₹50,000 - ₹2 Lakhs',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, company, email, phone, service, budget, message } = formData;
    if (!(await saveLeadOrAlert('sinfox-quote', { name, company, email, phone, service, message, extra: { budget } }))) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden relative transition-all">
        
        {/* Header */}
        <div className="bg-[#FAF9F6] border-b border-slate-200 p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0088FF]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0088FF]">
                SINFOX EXECUTIVE CONSULTATION
              </span>
            </div>
            <h3 className="text-2xl font-serif font-black text-[#0F172A] mt-1">
              Get Instant Quote
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-serif font-black text-[#0F172A]">
                Consultation Requested!
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="font-bold text-slate-900">{formData.name}</span>. Our Senior Media Director will analyze your requirements for <span className="font-bold text-[#0088FF]">{formData.service}</span> and reach out within 4 business hours.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-full transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand / Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Apex Enterprises"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Service Required *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none bg-white"
                >
                  <option value="Digital Marketing & Growth Systems">Digital Marketing & Growth Systems (SEO, Ads, Political)</option>
                  <option value="Custom Software & Web Engineering">Custom Software & Web Engineering (CRM, SaaS, Portals)</option>
                  <option value="Mobile Application Development">Mobile Application Development (iOS, Android, Flutter)</option>
                  <option value="Creative Photography & Drone Production">Creative Photography & Drone Production (4K Aerial, Products)</option>
                  <option value="Commercial Videography & Post-Production">Commercial Videography & Post-Production (Films, 3D Motion)</option>
                  <option value="Strategic Branding & Identity">Strategic Branding & Identity (Logo, Packaging, Strategy)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Scope / Deliverables
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Briefly describe your objectives, target timeline, or current challenges..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0088FF] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0088FF] to-[#0B1299] hover:opacity-95 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-[#0088FF]/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Media & Tech Inquiry</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 text-center">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Zero obligations. NDA protected. Response within 4 hours.</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
