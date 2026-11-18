import React, { useState } from 'react';
import { saveLeadOrAlert } from '../../lib/leads';
import { DOMAIN_TRACKS, EDULIS_PROGRAMS } from '../../data/edulisData';
import { X, CheckCircle2, Sparkles, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultProgramId?: string;
  defaultDomainId?: string;
}

export const EdulisEnrollModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultProgramId,
  defaultDomainId
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: defaultDomainId || 'pharmacy',
    program: defaultProgramId || 'domain-pro',
    gradYear: '2025'
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 8) errs.phone = 'Valid phone number required';
    if (!formData.college.trim()) errs.college = 'College/Institution name required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const { name, email, phone, college, degree, program, gradYear } = formData;
      if (!(await saveLeadOrAlert('edulis-enroll', { name, email, phone, company: college, service: program, extra: { degree, program, gradYear } }))) return;
      setSubmitted(true);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0B1299] to-indigo-900 p-6 text-white relative">
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EduLis AI Industry Cohort Enrollment</span>
          </div>

          <h3 className="text-2xl font-black text-white">
            Reserve Your AI Cohort Seat
          </h3>
          <p className="text-xs text-indigo-200 mt-1">
            Join the upcoming cohort with direct mentor feedback, domain labs, and placement drives.
          </p>
        </div>

        {/* Form Body or Success State */}
        <div className="p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">
                Application Received!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you <span className="font-bold text-slate-900">{formData.name}</span>. An EduLis Academic Counselor will review your application for the <span className="font-bold text-[#0B1299]">{formData.degree.toUpperCase()} AI Track</span> and contact you within 24 hours.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2">
                <div className="font-bold text-slate-800">Application Confirmation Summary:</div>
                <div className="text-slate-600">• Email: <span className="font-mono text-slate-900">{formData.email}</span></div>
                <div className="text-slate-600">• Phone: <span className="font-mono text-slate-900">{formData.phone}</span></div>
                <div className="text-slate-600">• College: <span className="font-semibold text-slate-900">{formData.college}</span></div>
              </div>

              <button
                onClick={resetAndClose}
                className="w-full py-3 bg-[#0B1299] hover:bg-indigo-900 text-white font-bold text-sm rounded-xl transition-colors"
              >
                Return to Website
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Rao"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-[#0B1299] outline-none ${
                    errors.name ? 'border-red-500 bg-red-50/50' : 'border-slate-300'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="ananya@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-[#0B1299] outline-none ${
                      errors.email ? 'border-red-500 bg-red-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-[#0B1299] outline-none ${
                      errors.phone ? 'border-red-500 bg-red-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* College & Grad Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    College / University *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Manipal Univ / IIT / NIPER"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-[#0B1299] outline-none ${
                      errors.college ? 'border-red-500 bg-red-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.college && <p className="text-[11px] text-red-500 mt-1">{errors.college}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Grad Year
                  </label>
                  <select
                    value={formData.gradYear}
                    onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#0B1299] outline-none bg-white"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027+</option>
                  </select>
                </div>
              </div>

              {/* Domain Discipline Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Domain Discipline
                </label>
                <select
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-[#0B1299] focus:ring-2 focus:ring-[#0B1299] outline-none bg-slate-50"
                >
                  {DOMAIN_TRACKS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — ({t.targetStudents})
                    </option>
                  ))}
                </select>
              </div>

              {/* Program Track Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Program Track
                </label>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#0B1299] outline-none bg-white"
                >
                  {EDULIS_PROGRAMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Privacy note */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your details are protected under Sindulis Cloud Data Policy. No spam.</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#E65100] hover:bg-[#c84400] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#E65100]/25 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Submit Cohort Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
