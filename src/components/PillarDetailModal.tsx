import React, { useState } from 'react';
import { EcosystemCardData } from '../types';
import { X, CheckCircle2, ArrowRight, ExternalLink, Sparkles, Building2, ShieldCheck, Zap } from 'lucide-react';

interface PillarDetailModalProps {
  card: EcosystemCardData;
  onClose: () => void;
  onOpenLogin: () => void;
  onShowToast: (msg: string) => void;
}

export const PillarDetailModal: React.FC<PillarDetailModalProps> = ({
  card,
  onClose,
  onOpenLogin,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'architecture'>('overview');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Top Banner Header */}
        <div 
          className="p-6 sm:p-8 text-white relative flex items-start justify-between"
          style={{
            background: card.id === 'edulis' 
              ? 'linear-gradient(135deg, #0B1299 0%, #1e1b4b 50%, #E65100 100%)'
              : card.id === 'sinfoxmedia'
              ? 'linear-gradient(135deg, #111827 0%, #374151 100%)'
              : 'linear-gradient(135deg, #0B1299 0%, #1e293b 100%)'
          }}
        >
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-extrabold uppercase tracking-widest text-white border border-white/20">
              <span>{card.badge}</span>
              <span>•</span>
              <span className="text-[#E65100] font-black">Ecosystem Active</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {card.title}
            </h2>

            <p className="text-base sm:text-lg font-medium text-slate-200 leading-snug">
              {card.headline}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold text-slate-500">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-[#0B1299] border-b-2 border-[#0B1299] font-bold'
                  : 'hover:text-slate-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`pb-3 transition-all cursor-pointer ${
                activeTab === 'features'
                  ? 'text-[#0B1299] border-b-2 border-[#0B1299] font-bold'
                  : 'hover:text-slate-800'
              }`}
            >
              Key Capabilities
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`pb-3 transition-all cursor-pointer ${
                activeTab === 'architecture'
                  ? 'text-[#0B1299] border-b-2 border-[#0B1299] font-bold'
                  : 'hover:text-slate-800'
              }`}
            >
              Impact Metrics
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ecosystem Focus
                </h4>
                <p className="text-slate-800 text-base leading-relaxed">
                  {card.longDescription || card.description}
                </p>
              </div>

              {card.targetAudience && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-[#0B1299] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Primary Target Segment
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {card.targetAudience}
                    </span>
                  </div>
                </div>
              )}

              {card.features && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Core Platform Pillars
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {card.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-slate-800 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Key Capabilities */}
          {activeTab === 'features' && card.features && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                Functional Deep Dive
              </h4>
              <div className="space-y-3">
                {card.features.map((feature, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#E65100]" />
                        <h5 className="font-bold text-slate-900 text-sm">{feature}</h5>
                      </div>
                      <p className="text-xs text-slate-500">
                        Integrated directly with Sindulis Cloud Single Sign-On and enterprise telemetry.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#0B1299] bg-[#EEF2FF] px-2.5 py-1 rounded-md shrink-0">
                      V2.4 Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Impact Metrics */}
          {activeTab === 'architecture' && card.metrics && (
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-slate-900">
                Verified Performance Metrics
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {card.metrics.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 text-center space-y-1">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1299]">
                      {m.value}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-[#0B1299]/20 flex items-center justify-between text-xs sm:text-sm text-[#0B1299] font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#0B1299]" />
                  <span>ISO-27001 & SOC2 Compliant Cloud Pipeline</span>
                </div>
                <span className="font-bold">Real-time Sync</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Controls */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            Requires active Sindulis Cloud SSO authorization
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onShowToast(`Copied direct link for ${card.title} to clipboard!`);
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Share Pillar Link
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1299] hover:bg-[#E65100] text-white font-bold text-xs sm:text-sm transition-colors shadow-md shadow-[#0B1299]/20 cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
