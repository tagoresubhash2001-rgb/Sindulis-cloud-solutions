import React, { useState } from 'react';
import { saveLeadOrAlert } from '../../lib/leads';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_ITEMS as EDULIS_FAQS } from '../../data/edulisData';

export const EdulisContact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    role: 'Principal / Management',
    studentsCount: '1000 - 3000 Students',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, college, role, studentsCount, message } = formData;
    if (!(await saveLeadOrAlert('edulis-contact', { name, email, phone, company: college, message, extra: { role, studentsCount } }))) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-[#E65100]/20 selection:text-[#0B1299]">
      
      {/* ==================================================================== */}
      {/* PAGE 4 HERO BANNER: FULL-BLEED IMAGE WITH DARK OVERLAY MASK        */}
      {/* ==================================================================== */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-slate-950 overflow-hidden">
        {/* Full-Bleed Hero Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2000&q=85"
            alt="EduLis Contact & Campus Admissions"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Dark Gradient Overlay Mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/50" />
        </div>

        {/* Hero Text Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#E65100]" />
            <span>CAMPUS PARTNERSHIP & ADMISSIONS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black text-white tracking-tight leading-[1.1]">
            Let's Build It <span className="text-[#E65100]">Together.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 font-medium leading-relaxed max-w-3xl mx-auto">
            Tell us about your campus scale and requirements. Our academic transformation team will connect with you.
          </p>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* BODY SECTION: INTERACTIVE DEMO CLASS & CAMPUS PARTNERSHIP FORM       */}
      {/* ==================================================================== */}
      <section className="py-24 lg:py-32 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* LEFT: Contact Information & Direct Lines */}
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#E65100]">
                  DIRECT HEADQUARTERS
                </span>
                <h2 className="text-3xl font-serif font-black text-[#0B1299] tracking-tight">
                  Academic Transformation Directorate
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Our regional academic coordinators assist university leadership, department heads, and placement officers across Andhra Pradesh & Telangana.
                </p>
              </div>

              {/* Detail Cards */}
              <div className="space-y-4">
                <div className="p-6 bg-[#FAF9F6] rounded-2xl border border-slate-200 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0B1299]/10 flex items-center justify-center text-[#0B1299] shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Institutional Inquiries</div>
                    <div className="text-base font-serif font-black text-[#0B1299]">edulis.trainings@gmail.com</div>
                    <div className="text-xs font-semibold text-slate-500">partnerships@edulis.ai</div>
                  </div>
                </div>

                <div className="p-6 bg-[#FAF9F6] rounded-2xl border border-slate-200 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0B1299]/10 flex items-center justify-center text-[#0B1299] shrink-0">
                    <Phone className="w-6 h-6 text-[#E65100]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campus Helpline</div>
                    <a href="tel:+919494080479" className="text-base font-serif font-black text-[#0B1299] hover:text-[#E65100] transition-colors">
                      +91 94940 80479
                    </a>
                    <div className="text-xs text-slate-500 mt-0.5">Mon - Sat, 9:00 AM - 7:00 PM IST</div>
                  </div>
                </div>

                <div className="p-6 bg-[#FAF9F6] rounded-2xl border border-slate-200 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0B1299]/10 flex items-center justify-center text-[#0B1299] shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parent Organization</div>
                    <div className="text-sm font-serif font-black text-slate-900">Sindulis Innovative Solutions</div>
                    <div className="text-xs text-slate-600">1/18 Bradipeta, Guntur - 522006, AP, India</div>
                  </div>
                </div>
              </div>

              {/* Grant Notice */}
              <div className="p-6 bg-[#0B1299] text-white rounded-2xl space-y-2 border border-indigo-900 shadow-xl">
                <div className="text-xs font-extrabold uppercase text-amber-300">Grant Allocation Priority</div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Colleges requesting on-campus AI Centre of Excellence support UPTO ₹20 Lakhs receive priority scheduling for faculty workshops.
                </p>
              </div>
            </div>

            {/* RIGHT: Campus Partnership & Demo Class Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-serif font-black text-[#0B1299]">Request Received!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you, <span className="font-bold text-slate-900">{formData.name}</span> from <span className="font-bold text-slate-900">{formData.college || 'your college'}</span>. Our Transformation Director will contact you via email at <span className="font-bold text-slate-900">{formData.email}</span>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-serif font-black text-[#0B1299]">Campus Partnership & Demo Form</h3>
                    <p className="text-xs text-slate-500">Request a free campus demo class or AI CoE grant discussion.</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Dr. K. Radhakrishnan"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0B1299]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="principal@college.edu.in"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0B1299]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0B1299]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">College / Institution Name</label>
                        <input
                          type="text"
                          required
                          value={formData.college}
                          onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                          placeholder="e.g., AP University College of Engineering"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0B1299]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Your Institutional Role</label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0B1299] bg-white"
                        >
                          <option value="Principal / Management">Principal / Trustee / Management</option>
                          <option value="Placement Officer">Head of Placements (TPO)</option>
                          <option value="HOD / Faculty">Department HOD / Senior Faculty</option>
                          <option value="Student Representative">Student Union / Representative</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Total Student Strength</label>
                      <select
                        value={formData.studentsCount}
                        onChange={(e) => setFormData({ ...formData, studentsCount: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0B1299] bg-white"
                      >
                        <option value="Under 1000 Students">Under 1,000 Students</option>
                        <option value="1000 - 3000 Students">1,000 - 3,000 Students</option>
                        <option value="3000 - 5000 Students">3,000 - 5,000 Students</option>
                        <option value="5000+ Students">5,000+ Students</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Campus Requirements & Message</label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your campus programs, student streams, and desired launch timeline..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0B1299]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0B1299] hover:bg-indigo-900 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center justify-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4 text-[#E65100]" />
                    <span>Submit Campus Request</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B1299] tracking-tight">
              Institutional Partnership FAQs
            </h2>
            <p className="text-base text-slate-600">
              Common questions regarding grant eligibility, timetable integration, and faculty training.
            </p>
          </div>

          <div className="space-y-4">
            {EDULIS_FAQS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all cursor-pointer"
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base font-serif font-bold text-[#0B1299]">{faq.question}</h3>
                    <div className="text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
};

