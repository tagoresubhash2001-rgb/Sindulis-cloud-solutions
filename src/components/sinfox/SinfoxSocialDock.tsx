import React from 'react';

export const SinfoxSocialDock: React.FC = () => {
  const socialLinks = [
    {
      id: 'whatsapp',
      label: 'Chat with Media Director (+91 94940 80479)',
      href: 'https://wa.me/919494080479?text=Hello%20Sinfox%20Media%20Team%2C%20I%20would%20like%20to%20request%20a%20consultation%20for%20a%20media%20and%20tech%20project.',
      colorClass: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30',
      pulse: true,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      )
    },
    {
      id: 'linkedin',
      label: 'Connect on LinkedIn',
      href: 'https://www.linkedin.com/company/sinfoxmedia',
      colorClass: 'bg-[#0A66C2] hover:bg-[#084e96] text-white shadow-[#0A66C2]/30',
      pulse: false,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
    {
      id: 'instagram',
      label: 'Instagram (@sinfox_media)',
      href: 'https://www.instagram.com/sinfox_media?igsh=MWZyNHg5aHlqeDljMA==',
      colorClass: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-rose-500/30',
      pulse: false,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      id: 'facebook',
      label: 'Join Brand Network',
      href: 'https://www.facebook.com/sinfoxmedia',
      colorClass: 'bg-[#1877F2] hover:bg-[#135cb8] text-white shadow-[#1877F2]/30',
      pulse: false,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
        </svg>
      )
    }
  ];

  return (
    <aside className="fixed right-6 bottom-8 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      {socialLinks.map((link) => (
        <div key={link.id} className="relative group flex items-center">
          {/* Tooltip on Left */}
          <div className="absolute right-14 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-x-2 group-hover:translate-x-0">
            <div className="bg-[#0F172A] text-white text-xs font-semibold py-1.5 px-3 rounded-xl whitespace-nowrap shadow-2xl border border-white/10 flex items-center gap-1.5">
              <span>{link.label}</span>
              <div className="w-1.5 h-1.5 bg-[#0088FF] rounded-full" />
            </div>
          </div>

          {/* Action Button */}
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={`relative p-3.5 rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${link.colorClass}`}
          >
            {/* Pulse effect for WhatsApp */}
            {link.pulse && (
              <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" />
            )}
            {link.icon}
          </a>
        </div>
      ))}
    </aside>
  );
};
