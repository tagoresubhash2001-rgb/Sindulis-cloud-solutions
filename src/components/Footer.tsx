import React from 'react';
import { Shield, FileText, Mail, Globe, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenContact?: () => void;
  onSwitchView?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onSwitchView,
}) => {
  return (
    <footer className="w-full bg-[#0F172A] text-slate-300 border-t border-slate-800 py-16 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* LEFT COLUMN: Brand Identity (5 columns) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/brands/sindulis/logo_light.png"
                alt="Sindulis Cloud Logo"
                className="h-9 w-auto object-contain"
              />
            </div>
            <div className="text-xs font-bold text-[#0088FF] uppercase tracking-widest">
              Enterprise AI & Digital Ecosystem
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              A high-performance parent ecosystem bridging education, enterprise technology, and AI-driven brand growth through specialized enterprise platforms.
            </p>
          </div>

          {/* CENTER COLUMN: Ecosystem Pillars (3 columns) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => onSwitchView?.('techlis')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Tech Lis <span className="text-[10px] text-slate-500 font-normal">— Build</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSwitchView?.('sinfox')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sinfox Media <span className="text-[10px] text-slate-500 font-normal">— Grow</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSwitchView?.('edulis')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  edulis <span className="text-[10px] text-slate-500 font-normal">— Learn</span>
                </button>
              </li>
              <li className="text-slate-500 cursor-not-allowed">
                Internzy <span className="text-[10px] text-slate-600 font-normal">— Coming Soon</span>
              </li>
            </ul>
          </div>

          {/* RIGHT COLUMN 1: Secondary Links (2 columns) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Contact Support</span>
                </button>
              </li>
            </ul>
          </div>

          {/* RIGHT COLUMN 2: HQ Contact (2 columns) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Headquarters
            </h4>
            <div className="text-xs text-slate-400 space-y-2">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E65100] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  1/18 Bradipeta<br />
                  Guntur - 522006<br />
                  Andhra Pradesh<br />
                  India
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Sindulis Cloud. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-600">
            <Globe className="w-3.5 h-3.5" />
            <span>Deployed via Firebase Hosting • Regional Edge Node</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
