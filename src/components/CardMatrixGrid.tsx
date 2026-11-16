import React from 'react';
import { motion } from 'motion/react';
import { EcosystemCardData } from '../types';
import { Sparkles, Clock, GraduationCap, TrendingUp, Cpu, Radio, Users, BookOpen } from 'lucide-react';

interface CardMatrixGridProps {
  cards: EcosystemCardData[];
  onSelectCard: (card: EcosystemCardData) => void;
  activeTab: 'all' | 'active' | 'coming-soon';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

export const CardMatrixGrid: React.FC<CardMatrixGridProps> = ({
  cards,
  onSelectCard,
  activeTab
}) => {
  const filteredCards = cards.filter(card => {
    if (activeTab === 'active') return card.category === 'active';
    if (activeTab === 'coming-soon') return card.category === 'coming-soon';
    return true;
  });

  const getPillarIcon = (id: string) => {
    switch (id) {
      case 'edulis':
        return <GraduationCap className="w-5 h-5 text-[#E65100]" />;
      case 'sinfoxmedia':
        return <TrendingUp className="w-5 h-5 text-slate-900" />;
      case 'techlis':
      case 'sindulis':
        return <Cpu className="w-5 h-5 text-[#0B1299]" />;
      case 'listtalks':
        return <Radio className="w-5 h-5 text-slate-500" />;
      case 'entrepreneurclub':
        return <Users className="w-5 h-5 text-slate-500" />;
      case 'internzy':
      case 'edulms':
        return <BookOpen className="w-5 h-5 text-slate-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-slate-500" />;
    }
  };

  const getBadgeStyle = (badgeType: EcosystemCardData['badgeType']) => {
    switch (badgeType) {
      case 'orange':
        return 'bg-[#E65100]/10 text-[#E65100] border-[#E65100]/20 font-bold';
      case 'obsidian':
        return 'bg-[#111827] text-white border-transparent font-bold';
      case 'navy':
        return 'bg-[#0B1299]/10 text-[#0B1299] border-[#0B1299]/20 font-bold';
      case 'coming-soon':
        return 'bg-slate-200/80 text-slate-600 border-slate-300 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* 6-Card Matrix Grid Layout with Staggered Entrance Animation */}
      <motion.div
        key={activeTab}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {filteredCards.map((card) => {
          const isActive = card.category === 'active';

          return (
            <motion.div
              key={card.id}
              variants={cardVariants}
              onClick={() => onSelectCard(card)}
              className={`group relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-slate-300'
                  : 'bg-[#F1F5F9] border border-[#E2E8F0] shadow-none hover:bg-white hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5'
              }`}
              style={{
                borderLeftWidth: isActive ? '5px' : '1px',
                borderLeftColor: isActive ? card.accentColor : undefined
              }}
            >
              
              {/* Card Top Header */}
              <div className="space-y-4">
                
                <div className="flex items-center justify-between gap-3">
                  {/* Brand Title + Icon */}
                  <div className="flex items-center gap-2.5">
                    {['edulis', 'sinfoxmedia', 'techlis', 'internzy'].includes(card.id) ? (
                      <img
                        src={
                          card.id === 'sinfoxmedia'
                            ? '/assets/brands/sinfox/logo_dark.png'
                            : `/assets/brands/${card.id}/logo.png`
                        }
                        alt={card.title}
                        className="h-8 sm:h-9 w-auto object-contain"
                      />
                    ) : (
                      <>
                        <div className={`p-2 rounded-xl ${
                          isActive ? 'bg-slate-100 group-hover:scale-110 transition-transform' : 'bg-slate-200/80'
                        }`}>
                          {getPillarIcon(card.id)}
                        </div>
                        <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                          {card.title}
                        </h3>
                      </>
                    )}
                  </div>

                  {/* Badge */}
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider border ${getBadgeStyle(card.badgeType)}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Headline */}
                <div className="pt-1">
                  <h4 className="font-bold text-base sm:text-lg text-slate-800 tracking-tight leading-snug group-hover:text-[#0B1299] transition-colors">
                    {card.headline}
                  </h4>
                </div>

                {/* Description Text */}
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>

              {/* Card Footer / CTA */}
              <div className="pt-6 mt-6 border-t border-slate-100/80 flex items-center justify-between">
                
                {/* Subtext if available */}
                {card.subtext ? (
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {card.subtext}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Ecosystem Active
                  </span>
                )}

                {/* CTA Link Button */}
                <span className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'text-[#0B1299] group-hover:text-[#E65100] group-hover:translate-x-1'
                    : 'text-slate-600 group-hover:text-slate-900 group-hover:translate-x-1'
                }`}>
                  <span>{card.ctaText}</span>
                </span>

              </div>

            </motion.div>
          );
        })}
      </motion.div>

    </section>
  );
};
