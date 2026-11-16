import React, { useState } from 'react';
import { DOMAIN_TRACKS } from '../../data/edulisData';
import { DomainTrack } from '../../types';
import {
  Pill,
  Stethoscope,
  Cpu,
  TrendingUp,
  DollarSign,
  Scale,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
  Terminal,
  Building2,
  BrainCircuit
} from 'lucide-react';

interface Props {
  onSelectDomainForEnrollment: (domainId: string) => void;
}

export const EdulisDomainMatrix: React.FC<Props> = ({ onSelectDomainForEnrollment }) => {
  const [activeDomainId, setActiveDomainId] = useState<string>('pharmacy');

  const selectedTrack: DomainTrack =
    DOMAIN_TRACKS.find((d) => d.id === activeDomainId) || DOMAIN_TRACKS[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pill':
        return <Pill className="w-5 h-5" />;
      case 'Stethoscope':
        return <Stethoscope className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'DollarSign':
        return <DollarSign className="w-5 h-5" />;
      case 'Scale':
        return <Scale className="w-5 h-5" />;
      default:
        return <BrainCircuit className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1299]/10 border border-[#0B1299]/20 text-[#0B1299] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E65100]" />
            <span>Domain-Specific AI Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            AI Training Tailored To Your Exact Degree
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Generic AI courses teach generic coding. EduLis adapts Generative AI models and machine learning pipelines directly to your industry discipline.
          </p>
        </div>

        {/* Domain Navigation Tabs */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {DOMAIN_TRACKS.map((track) => {
            const isActive = activeDomainId === track.id;
            return (
              <button
                key={track.id}
                onClick={() => setActiveDomainId(track.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#0B1299] text-white border-[#0B1299] shadow-lg shadow-[#0B1299]/20 scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
                }`}
              >
                <span className={isActive ? 'text-orange-300' : 'text-[#0B1299]'}>
                  {getIcon(track.iconName)}
                </span>
                <span>{track.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Domain Detail Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Visual Banner & Overview */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full flex flex-col justify-between p-6 sm:p-8 text-white overflow-hidden">
            {/* Background Image with Overlay */}
            <img
              src={selectedTrack.image}
              alt={selectedTrack.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950/40" />

            {/* Content Header */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/30">
                {getIcon(selectedTrack.iconName)}
                <span>{selectedTrack.id.toUpperCase()} AI LAB</span>
              </span>

              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                {selectedTrack.placementStats}
              </span>
            </div>

            {/* Bottom Info */}
            <div className="relative z-10 mt-20 lg:mt-auto space-y-3">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block">
                Target Discipline
              </span>
              <p className="text-sm font-semibold text-slate-200 bg-black/40 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
                🎓 {selectedTrack.targetStudents}
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {selectedTrack.tagline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedTrack.description}
              </p>
            </div>
          </div>

          {/* Right Curriculum & Live Project Breakdown */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6 bg-white">
            {/* AI Tools & Technologies */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1299] uppercase tracking-wider mb-2">
                <Terminal className="w-4 h-4 text-[#E65100]" />
                <span>AI Stack & Tools Taught</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTrack.aiTools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E65100]" />
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Curriculum Modules */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1299] uppercase tracking-wider mb-3">
                <Layers className="w-4 h-4 text-[#E65100]" />
                <span>Core Domain Modules</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedTrack.curriculumModules.map((module, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0B1299] shrink-0 mt-0.5" />
                    <span>{module}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Student Capstone Project */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0B1299] text-white border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider bg-orange-950/60 border border-orange-500/30 px-2 py-0.5 rounded">
                  Sample Capstone Outcome
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
                  {selectedTrack.sampleProject.techStack.join(' • ')}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                🚀 {selectedTrack.sampleProject.title}
              </h4>
              <p className="text-xs text-slate-300">
                {selectedTrack.sampleProject.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
                Cohort Seats for <span className="font-bold text-slate-900">{selectedTrack.name}</span> filling fast.
              </div>
              <button
                onClick={() => onSelectDomainForEnrollment(selectedTrack.id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E65100] hover:bg-[#c84400] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-[#E65100]/20 hover:scale-105 transition-all"
              >
                <span>Enroll In {selectedTrack.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
