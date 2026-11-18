import React, { useState } from 'react';
import { saveLeadOrAlert } from '../lib/leads';
import { EcosystemCardData } from '../types';
import { X, Send, Sparkles, CheckCircle2, Clock } from 'lucide-react';

interface WaitlistModalProps {
  card: EcosystemCardData;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  card,
  onClose,
  onShowToast
}) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const saved = await saveLeadOrAlert('portal-waitlist', { name: fullName, email, company: organization, service: card.title });
    if (!saved) return;
    setIsSubmitted(true);
    setTimeout(() => {
      onShowToast(`Thank you ${fullName || 'Innovator'}! You're added to the early access list for ${card.title}.`);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300">
              <Clock className="w-3 h-3 text-[#E65100]" />
              <span>FUTURE MODULE</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white">
              {card.headline}
            </h3>
            <p className="text-xs text-slate-400">
              {card.subtext || 'Get Priority Access'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-slate-600 text-sm leading-relaxed">
            {card.description}
          </p>

          {isSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 text-emerald-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-extrabold text-base">You're on the priority list!</h4>
              <p className="text-xs text-emerald-700">
                We will notify you at <span className="font-bold">{email}</span> as soon as beta access opens.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1299] text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Work / Personal Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1299] text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institution / Company (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stanford University / Acme Corp"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1299] text-sm text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1299] hover:bg-[#E65100] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#0B1299]/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Registration</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
