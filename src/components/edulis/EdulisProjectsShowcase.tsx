import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  BarChart3,
  CheckCircle,
  Play,
  Sparkles,
  Layers,
  Database,
  Bot,
  ExternalLink
} from 'lucide-react';

interface ProjectDemo {
  id: string;
  title: string;
  domain: string;
  student: string;
  college: string;
  impactMetric: string;
  description: string;
  codeSnippet: string;
  architecture: string[];
}

export const EdulisProjectsShowcase: React.FC = () => {
  const projects: ProjectDemo[] = [
    {
      id: 'proj1',
      title: 'Pharma AI: Real-Time Drug Interaction Agent',
      domain: 'Pharmacy & Clinical R&D',
      student: 'Aarav Sharma (M.Pharm)',
      college: 'Institute of Chemical Tech',
      impactMetric: '12,000+ FDA Formulations Analyzed in 1.2s',
      description: 'RAG pipeline with Med-PaLM that scans multi-drug prescriptions to alert clinicians about adverse liver toxicity triggers.',
      codeSnippet: `def audit_drug_contraindication(drug_a, drug_b):
    vector_query = f"{drug_a} + {drug_b} hepatic metabolism interaction"
    docs = chroma_db.query(vector_query, k=3)
    response = med_ai_agent.analyze(docs)
    return {"risk_level": response.risk, "toxicity_score": response.score}`,
      architecture: ['ChromaDB Vector Store', 'Med-PaLM 2 Fine-Tune', 'FastAPI Backend', 'React Dashboard']
    },
    {
      id: 'proj2',
      title: 'Engineering: Edge IoT Turbine Anomaly Predictor',
      domain: 'Mechanical & Smart Systems',
      student: 'Neha Verma (B.Tech)',
      college: 'IIT Madras',
      impactMetric: '72 Hours Advance Breakdown Forecasting',
      description: 'Edge-deployed neural network reading 1,000Hz sensor streams to detect micro-vibrations and predict thermal runaway.',
      codeSnippet: `void loop() {
  float vibration = analogRead(VIB_SENSOR_PIN);
  float temp = readThermalCouple();
  int anomaly_flag = tf_lite_model.predict(vibration, temp);
  if (anomaly_flag > THRESHOLD) trigger_safety_shutdown();
}`,
      architecture: ['TensorFlow Lite ESP32', 'MQTT Broker', 'Grafana AI Alerting', 'C++ Edge Code']
    },
    {
      id: 'proj3',
      title: 'Legal AI: M&A Contract Liability Clause Auditor',
      domain: 'Law & Corporate Governance',
      student: 'Rohan Gupta (LL.M)',
      college: 'National Law School',
      impactMetric: '82% Reduction in Due Diligence Review Time',
      description: 'Automated legal scanner highlighting non-standard indemnity, IP transfer risk, and regulatory penalty clauses.',
      codeSnippet: `async function scanContractRisk(pdfBuffer) {
  const extractedText = await pdfParser.extract(pdfBuffer);
  const clauses = await legalBert.segmentClauses(extractedText);
  return clauses.filter(c => c.riskScore > 0.75);
}`,
      architecture: ['Legal-BERT Transformer', 'LangChain Agent', 'Pinecone Vector DB', 'Next.js UI']
    }
  ];

  const [activeProjId, setActiveProjId] = useState<string>(projects[0].id);

  const activeProject = projects.find((p) => p.id === activeProjId) || projects[0];

  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0B1299]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#E65100]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Proof of Craft</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Live Student AI Portfolio Showcase
          </h2>
          <p className="mt-3 text-base text-slate-300">
            EduLis students do not just submit papers. They build and deploy functional, production-ready AI solutions solving real corporate challenges.
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {projects.map((p) => {
            const isActive = p.id === activeProjId;
            return (
              <button
                key={p.id}
                onClick={() => setActiveProjId(p.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  isActive
                    ? 'bg-[#E65100] text-white border-[#E65100] shadow-lg shadow-[#E65100]/30'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {p.domain}
              </button>
            );
          })}
        </div>

        {/* Glassmorphic Live Dashboard Preview */}
        <div className="bg-slate-950/80 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Info Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-orange-400 bg-orange-950/80 border border-orange-500/30 px-2.5 py-1 rounded-full">
                  {activeProject.domain}
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Deployed Live
                </span>
              </div>

              <h3 className="text-2xl font-black text-white mb-2 leading-tight">
                {activeProject.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {activeProject.description}
              </p>

              {/* Student Bio */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <div className="text-slate-400 font-medium">Built By Student:</div>
                <div className="font-bold text-white text-sm">{activeProject.student}</div>
                <div className="text-slate-400">{activeProject.college}</div>
              </div>
            </div>

            {/* Impact Metric Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/30 text-emerald-200">
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">
                Measured Industry Impact
              </div>
              <div className="text-lg font-black text-white">
                ⚡ {activeProject.impactMetric}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-orange-400" />
                <span>Architecture Components</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeProject.architecture.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Code & Terminal Screen */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
            {/* Terminal Top Bar */}
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">
                  edulis-agent-core.py
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-orange-400" />
                <span>Python 3.11 • PyTorch</span>
              </div>
            </div>

            {/* Code Block */}
            <div className="p-4 sm:p-6 font-mono text-xs text-emerald-300 bg-slate-950/90 overflow-x-auto flex-1">
              <pre className="leading-relaxed">
                <code>{activeProject.codeSnippet}</code>
              </pre>
            </div>

            {/* Execution Status Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Agent Pipeline: ACTIVE & VALIDATED</span>
              </span>
              <span className="font-mono text-[11px] text-orange-400">
                Latency: 24ms
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
