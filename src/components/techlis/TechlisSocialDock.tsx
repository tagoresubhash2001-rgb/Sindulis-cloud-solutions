import React from 'react';
import { Mail, MessageCircle, Linkedin, Instagram, Facebook } from 'lucide-react';

export const TechlisSocialDock: React.FC = () => {
  return (
    <aside className="fixed right-5 bottom-6 z-50 flex flex-col gap-3 pointer-events-auto">
      
      {/* WHATSAPP CONSULTATION HOTLINE */}
      <a
        href="https://wa.me/919494080479"
        target="_blank"
        rel="noopener noreferrer"
        title="Direct WhatsApp SLA Hotline"
        className="group relative w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20 hover:scale-110 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
          WhatsApp Architecture Hotline (+91 94940 80479)
        </span>
      </a>

      {/* LINKEDIN CORPORATE NETWORK */}
      <a
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        title="Tech Lis LinkedIn Enterprise"
        className="group relative w-12 h-12 bg-[#0B1299] hover:bg-[#090e7a] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#0B1299]/20 hover:scale-110 transition-all duration-300"
      >
        <Linkedin className="w-5 h-5 fill-current" />
        <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
          LinkedIn Enterprise Network
        </span>
      </a>

      {/* INSTAGRAM ENTERPRISE */}
      <a
        href="https://www.instagram.com/sinfox_media?igsh=MWZyNHg5aHlqeDljMA=="
        target="_blank"
        rel="noopener noreferrer"
        title="Sinfox & Tech Lis Instagram"
        className="group relative w-12 h-12 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300"
      >
        <Instagram className="w-5 h-5" />
        <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
          Instagram (@sinfox_media)
        </span>
      </a>

      {/* FACEBOOK ENTERPRISE */}
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        title="Tech Lis Facebook"
        className="group relative w-12 h-12 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300"
      >
        <Facebook className="w-5 h-5 fill-current" />
        <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
          Facebook Enterprise
        </span>
      </a>

      {/* DIRECT EMAIL DISPATCH */}
      <a
        href="mailto:sinfoxmedia@gmail.com"
        title="Direct Email Architecture Team"
        className="group relative w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300"
      >
        <Mail className="w-5 h-5" />
        <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
          Email Engineering Team
        </span>
      </a>

    </aside>
  );
};
