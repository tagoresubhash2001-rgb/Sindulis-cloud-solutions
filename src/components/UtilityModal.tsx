import React from 'react';
import { X, Shield, FileText, Mail, CheckCircle2 } from 'lucide-react';

interface UtilityModalProps {
  type: 'privacy' | 'terms' | 'contact';
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const UtilityModal: React.FC<UtilityModalProps> = ({
  type,
  onClose,
  onShowToast
}) => {
  const getTitle = () => {
    if (type === 'privacy') return 'Privacy Policy';
    if (type === 'terms') return 'Terms of Service';
    return 'Contact Support';
  };

  const getIcon = () => {
    if (type === 'privacy') return <Shield className="w-5 h-5 text-[#0B1299]" />;
    if (type === 'terms') return <FileText className="w-5 h-5 text-[#0B1299]" />;
    return <Mail className="w-5 h-5 text-[#E65100]" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800">
              {getIcon()}
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {getTitle()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-slate-600 max-h-[60vh] overflow-y-auto">
          {type === 'privacy' && (
            <div className="space-y-3">
              <p>
                At <strong>Sindulis Cloud</strong>, data security and privacy governance are paramount. All authentication data across <strong>EduLis</strong>, <strong>Sinfox Media</strong>, and <strong>Sindulis Solutions</strong> is protected under enterprise-grade TLS 1.3 encryption and zero-trust policies.
              </p>
              <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Key Commitments</h5>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No student or client AI training telemetry is sold or exposed.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Single Sign-On OAuth tokens strictly govern cross-pillar access.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hosted securely on Firebase Hosting & Cloud Run infrastructure.</span>
                </li>
              </ul>
            </div>
          )}

          {type === 'terms' && (
            <div className="space-y-3">
              <p>
                By accessing the <strong>Sindulis Cloud Ecosystem Portal</strong>, users agree to adhere to acceptable usage frameworks for AI training models, brand asset generation, and enterprise software execution.
              </p>
              <p className="text-xs text-slate-500">
                All software licenses, trademark assets for EduLis, Sinfox Media, and Sindulis Solutions remain protected property under international copyright laws (2026).
              </p>
            </div>
          )}

          {type === 'contact' && (
            <div className="space-y-4">
              <p>
                Have questions about enterprise onboarding, institutional AI integration, or brand growth partnerships?
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs text-slate-500">Direct Contact Hubs</div>
                <div className="font-bold text-slate-900 text-sm">support@sinduliscloud.com</div>
                <div className="text-xs text-[#0B1299] font-medium">Global Enterprise Helpdesk 24/7</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0B1299] text-white text-xs font-bold hover:bg-[#E65100] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
