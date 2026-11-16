import React from 'react';
import { EdulisPage, AppView } from '../../types';
import { GraduationCap, ArrowRight, Shield, Globe, Sparkles } from 'lucide-react';

interface Props {
  onPageChange: (page: EdulisPage) => void;
  onSwitchView: (view: AppView) => void;
  onOpenEnrollModal: () => void;
}

export const EdulisFooter: React.FC<Props> = ({
  onPageChange,
  onSwitchView,
  onOpenEnrollModal
}) => {
  return (
    <footer className="bg-[#FAFAFA] text-[#0F172A] border-t border-slate-200 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Minimalist Editorial Banner */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#E65100] text-xs font-bold border border-orange-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EduLis AI Career Multiplier</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0B1299]">
              Ready To Multiply Your Degree With AI?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Join the upcoming AI Industry Readiness Cohort for Pharmacy, Engineering, Business, and Law.
            </p>
          </div>

          <button
            onClick={onOpenEnrollModal}
            className="px-7 py-3.5 bg-[#0B1299] hover:bg-indigo-900 text-white font-bold text-xs rounded-xl transition-all shadow-sm whitespace-nowrap"
          >
            Apply For Cohort Seat →
          </button>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
          {/* Brand Info Column */}
          <div className="md:col-span-5 space-y-4">
            <img
              src="/assets/brands/edulis/logo.png"
              alt="edulis Logo"
              className="h-8 w-auto object-contain"
            />

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              EduLis is the AI-Powered Career & Industry Readiness Academy within the Sindulis Cloud ecosystem. Bridging college academia and real-world corporate demands through domain-adapted AI labs and placement drives.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onSwitchView('sindulis-portal')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-[#0B1299] hover:bg-slate-50 transition-colors font-semibold"
              >
                <Globe className="w-3.5 h-3.5 text-[#E65100]" />
                <span>Return to Sindulis Cloud Portal</span>
              </button>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#E65100] uppercase tracking-wider">
              Academy Pages
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button onClick={() => onPageChange('home')} className="hover:text-[#0B1299] transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('about')} className="hover:text-[#0B1299] transition-colors">
                  About Us & Vision
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('services')} className="hover:text-[#0B1299] transition-colors">
                  Services & Program Tracks
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('contact')} className="hover:text-[#0B1299] transition-colors">
                  Contact & Counseling Call
                </button>
              </li>
            </ul>
          </div>

          {/* Domain Tracks Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-[#E65100] uppercase tracking-wider">
              Domain AI Specialties
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
              <span className="hover:text-[#0B1299] cursor-pointer">• Pharmacy AI Lab</span>
              <span className="hover:text-[#0B1299] cursor-pointer">• Healthcare AI</span>
              <span className="hover:text-[#0B1299] cursor-pointer">• Engineering Edge AI</span>
              <span className="hover:text-[#0B1299] cursor-pointer">• Business & MBA AI</span>
              <span className="hover:text-[#0B1299] cursor-pointer">• FinTech & Commerce</span>
              <span className="hover:text-[#0B1299] cursor-pointer">• Legal Tech & Governance</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} EduLis Academy • Powered by <span className="text-[#0B1299] font-bold">Sindulis Cloud</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-[#0B1299] cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#0B1299] cursor-pointer">Terms of Enrollment</span>
            <span>•</span>
            <span className="hover:text-[#0B1299] cursor-pointer">Verification Portal</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
