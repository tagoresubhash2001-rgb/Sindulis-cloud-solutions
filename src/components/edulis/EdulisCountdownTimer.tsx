import React, { useState, useEffect } from 'react';
import { Clock, Users, Sparkles } from 'lucide-react';

interface Props {
  targetDateString?: string;
  onEnrollClick?: () => void;
  compact?: boolean;
}

export const EdulisCountdownTimer: React.FC<Props> = ({
  targetDateString,
  onEnrollClick,
  compact = false
}) => {
  // Target date set to 12 days from now for live urgency
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 12, hours: 18, minutes: 42, seconds: 15 });

  useEffect(() => {
    // Calculate target timestamp (default to fixed future date or 12 days ahead)
    const target = targetDateString
      ? new Date(targetDateString).getTime()
      : Date.now() + 12 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateString]);

  const pad = (num: number) => String(num).padStart(2, '0');

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-slate-900/90 text-white px-3.5 py-1.5 rounded-full text-xs font-mono shadow-md border border-slate-700">
        <Clock className="w-3.5 h-3.5 text-orange-400 animate-spin-slow" />
        <span className="font-sans text-slate-300 font-semibold text-[11px]">Cohort Starts In:</span>
        <span className="font-bold text-orange-300">
          {timeLeft.days}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-[#0B1299] via-indigo-900 to-[#0B1299] rounded-2xl p-5 sm:p-6 text-white shadow-xl shadow-[#0B1299]/15 border border-indigo-700/50 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col text-center lg:text-left gap-1.5">
          <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Next AI Industry Readiness Cohort</span>
            <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-200 text-[10px]">
              Limited 50 Seats / Domain
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Transform Your Degree Into An AI Advantage
          </h3>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Live masterclasses, domain-adapted AI labs, and direct corporate capstones start soon. Lock in your seat before registration closes.
          </p>
        </div>

        {/* Timer Box Grid */}
        <div className="flex items-center gap-2 sm:gap-3 bg-black/25 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
          {[
            { label: 'DAYS', value: pad(timeLeft.days) },
            { label: 'HOURS', value: pad(timeLeft.hours) },
            { label: 'MINS', value: pad(timeLeft.minutes) },
            { label: 'SECS', value: pad(timeLeft.seconds) }
          ].map((item, idx) => (
            <React.Fragment key={item.label}>
              {idx > 0 && <span className="text-xl font-bold text-slate-500 pb-4">:</span>}
              <div className="flex flex-col items-center min-w-[50px] sm:min-w-[62px]">
                <div className="w-12 sm:w-15 h-12 sm:h-14 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center font-mono text-lg sm:text-2xl font-black text-white shadow-inner">
                  {item.value}
                </div>
                <span className="text-[9px] font-bold tracking-widest text-indigo-300 mt-1.5">
                  {item.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Action Button */}
        {onEnrollClick && (
          <button
            onClick={onEnrollClick}
            className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E65100] hover:bg-[#c84400] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#E65100]/30 hover:scale-105 transition-all duration-200 whitespace-nowrap"
          >
            <Users className="w-4 h-4 text-orange-200" />
            <span>Apply For Cohort Seat</span>
          </button>
        )}
      </div>
    </div>
  );
};
