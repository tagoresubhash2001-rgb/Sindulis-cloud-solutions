import { DomainTrack, EdulisProgram, Mentor, FAQItem } from '../types';

export const DOMAIN_TRACKS: DomainTrack[] = [
  {
    id: 'pharmacy',
    name: 'AI for Pharmacy',
    iconName: 'Pill',
    tagline: 'Computational Drug Discovery & Med-AI Diagnostics',
    description: 'Master AI-driven molecular docking, clinical trial prediction, pharmacovigilance automation, and LLM-powered drug interaction checkers.',
    targetStudents: 'B.Pharm, M.Pharm, PharmD & Clinical Research Scholars',
    aiTools: ['Bio-Python', 'ChemDraw AI', 'AlphaFold APIs', 'MedLM Tutors', 'RAG Drug Databases'],
    curriculumModules: [
      'Molecular Docking & Predictive QSAR Modeling',
      'AI-Powered Clinical Trial Optimization',
      'Automated Adverse Event Detection (Pharmacovigilance)',
      'Regulatory Compliance AI Assistants'
    ],
    sampleProject: {
      title: 'AI Multi-Drug Interaction & Contraindication Risk Engine',
      description: 'Built a real-time clinical decision support system analyzing 12,000+ FDA-approved formulations for contraindications using RAG pipelines.',
      techStack: ['Python', 'Med-PaLM 2', 'ChromaDB', 'React Dashboard']
    },
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
    placementStats: '92% Placed in Pharma R&D & Med-Tech AI Labs'
  },
  {
    id: 'healthcare',
    name: 'AI for Healthcare',
    iconName: 'Stethoscope',
    tagline: 'Medical Imaging, Diagnostics & EHR Intelligence',
    description: 'Transform patient outcomes with computer vision for X-ray/MRI analysis, predictive sepsis alerts, and clinical documentation AI.',
    targetStudents: 'MBBS, Nursing, Health Informatics, & Bio-Medical Engineers',
    aiTools: ['DICOM AI Viewers', 'MONAI Framework', 'Medical NLP', 'TensorFlow Bio'],
    curriculumModules: [
      'Deep Learning for Radiographic Image Classification',
      'EHR Summarization & Automated SOAP Note Generators',
      'Predictive Patient Mortality & ICU Triage Models',
      'HIPAA-Compliant Federated Learning Systems'
    ],
    sampleProject: {
      title: 'Automated Diagnostic Assistant for Chest Radiographs',
      description: 'Engineered a multi-modal vision model identifying early-stage lung pathologies with 96.4% sensitivity.',
      techStack: ['PyTorch', 'MONAI', 'FastAPI', 'DICOM Web']
    },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    placementStats: '89% Placed in Digital Health & Hospital Systems'
  },
  {
    id: 'engineering',
    name: 'AI for Engineering',
    iconName: 'Cpu',
    tagline: 'Smart Systems, Predictive Maintenance & Edge AI',
    description: 'Architect autonomous robotics, IoT anomaly detection engines, generative CAD design, and industrial AI agents.',
    targetStudents: 'Computer Science, Mechanical, Electrical, Civil & Robotics Majors',
    aiTools: ['TensorFlow Edge', 'OpenCV', 'ROS2 AI', 'Autodesk Generative AI', 'LangChain'],
    curriculumModules: [
      'Generative Design & Finite Element Analysis AI',
      'Industrial IoT Anomaly & Predictive Failure Engines',
      'Autonomous Mobile Robotics (AMR) Navigation',
      'Custom LLM Fine-Tuning on Engineering Standard Operating Procedures'
    ],
    sampleProject: {
      title: 'Predictive Turbine Vibration & Thermal Failure Forecaster',
      description: 'Deployed an edge-device ML model forecasting mechanical degradation 72 hours prior to breakdown.',
      techStack: ['TensorFlow Lite', 'MQTT', 'Grafana AI', 'C++']
    },
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    placementStats: '95% Placed in Core Engineering & Smart Manufacturing'
  },
  {
    id: 'business',
    name: 'AI for Business & MBA',
    iconName: 'TrendingUp',
    tagline: 'Predictive Financial Modeling & Autonomous Strategy',
    description: 'Equip future business leaders with AI-driven marketing attribution, churn prediction models, AI board decks, and supply chain twin simulations.',
    targetStudents: 'MBA, BBA, Finance, Marketing & Strategy Majors',
    aiTools: ['DataRobot', 'Tableau AI Copilot', 'Pandas AI', 'Financial LLMs', 'HubSpot AI'],
    curriculumModules: [
      'Predictive Customer Lifetime Value (CLV) & Churn Forecasts',
      'Automated Financial Statement Auditing & Fraud Detection',
      'AI Omnichannel Campaign Optimization & Sentiment Intelligence',
      'Executive Strategy Simulations with AI Competitive Agents'
    ],
    sampleProject: {
      title: 'Enterprise Dynamic Pricing & Demand Elasticity Simulator',
      description: 'Constructed a dynamic pricing engine responding to competitor price shifts and local demand triggers.',
      techStack: ['Python Data Stack', 'Streamlit', 'Scikit-Learn', 'PowerBI']
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    placementStats: '91% Placed in Management Consultancies & FinTech'
  },
  {
    id: 'commerce',
    name: 'AI for Finance & Commerce',
    iconName: 'DollarSign',
    tagline: 'Algorithmic Trading, Fraud Defense & Tax Automation',
    description: 'Build automated portfolio rebalancers, algorithmic sentiment bots, real-time AML fraud detection, and automated audit trails.',
    targetStudents: 'B.Com, M.Com, CA, CFA & Financial Analytics Students',
    aiTools: ['QuantConnect', 'Python Finance API', 'FinGPT', 'Excel AI Copilot'],
    curriculumModules: [
      'Quantitative Trading Strategies & Sentiment Sentiment Analysis',
      'Real-Time Anti-Money Laundering (AML) Anomaly Detectors',
      'Automated Tax Regulation & Audit Variance Scanners',
      'Portfolio Optimization using Monte Carlo AI Simulations'
    ],
    sampleProject: {
      title: 'Autonomous Earnings Call Sentiment & Risk Scraper',
      description: 'Scraped S&P 500 earnings transcripts to generate real-time investor risk scores and market signals.',
      techStack: ['FinBERT', 'BeautifulSoup', 'Plotly', 'PostgreSQL']
    },
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    placementStats: '88% Placed in Investment Banking & Fintech'
  },
  {
    id: 'law',
    name: 'AI for Law & Governance',
    iconName: 'Scale',
    tagline: 'Legal Contract Intelligence & Regulatory Risk AI',
    description: 'Accelerate legal research, contract clause audit automation, precedent retrieval, and IP infringement detection.',
    targetStudents: 'LLB, LLM, Corporate Governance & Compliance Specialists',
    aiTools: ['Harvey AI Frameworks', 'Legal-BERT', 'Pinecone Vector DB', 'Drafting AI'],
    curriculumModules: [
      'Contract Clause Extraction & Risk Categorization',
      'Legal Precedent Semantic Retrieval Systems',
      'IP & Patent Prior-Art Infringement Auditing',
      'AI Ethics, Policy & Global Regulatory Governance Frameworks'
    ],
    sampleProject: {
      title: 'Enterprise NDA & M&A Due-Diligence Audit Agent',
      description: 'Reduced legal contract review time by 80% by automatically flagging non-standard liability clauses.',
      techStack: ['Legal-BERT', 'LangChain', 'Next.js', 'Vector DB']
    },
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    placementStats: '86% Placed in Tier-1 Law Firms & In-House Legal'
  }
];

export const EDULIS_PROGRAMS: EdulisProgram[] = [
  {
    id: 'foundation',
    title: 'AI Foundation & Prompt Engineering Mastery',
    badge: 'CORE FOUNDATION',
    duration: '4 Weeks (Live Online)',
    level: 'Beginner to Intermediate',
    shortDesc: 'Master Generative AI, LLM prompting, ethical AI deployment, and foundational Python automation for any career.',
    longDesc: 'The definitive starting point for students of all disciplines. Learn to harness cutting-edge Generative AI models, design enterprise-grade prompts, automate daily workflows, and build custom AI assistants without deep software background.',
    keyHighlights: [
      'Hands-on training with GPT-4o, Gemini 1.5 Pro & Claude 3.5 Sonnet',
      'Mastering Chain-of-Thought, ReAct, and Few-Shot Prompting',
      'Building custom GPTs and RAG-based personal knowledge bases',
      'Ethical AI, Bias Mitigation, and Data Security Best Practices',
      'Verified EduLis AI Foundation Industry Certificate'
    ],
    syllabus: [
      { week: 'Week 1', topic: 'Generative AI Architecture & LLM Foundations', details: 'Tokenization, transformers, temperature parameters, and selecting the right AI model for specific domain tasks.' },
      { week: 'Week 2', topic: 'Advanced Prompt Engineering & System Design', details: 'Structured outputs (JSON/Markdown), prompt chaining, guardrails, and role-based agent design.' },
      { week: 'Week 3', topic: 'Personal Automation & Python AI Scripting', details: 'Using Python for data processing, web scraping, and API integrations with zero prior coding stress.' },
      { week: 'Week 4', topic: 'Capstone Project & Portfolio Launch', details: 'Build and deploy a functional custom AI Copilot for your specific academic or professional domain.' }
    ],
    price: '$299 / Student Track',
    targetRole: 'Students across all disciplines preparing for AI-integrated workplaces',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'domain-pro',
    title: 'Domain-Adapted AI Professional Track',
    badge: 'INDUSTRY SPECIALIZED',
    duration: '12 Weeks (Hybrid + Labs)',
    level: 'Intermediate to Advanced',
    shortDesc: 'Deep-dive domain specialization for Pharmacy, Engineering, Healthcare, Business, or Law with specialized models.',
    longDesc: 'Transform your core academic degree into an unstoppable industry advantage. Choose your domain track (Pharmacy, Engineering, Business, Healthcare, or Law) and train directly on industry datasets, specialized tools, and real corporate tasks.',
    keyHighlights: [
      'Domain-adapted AI curriculum tailored to your exact major',
      'Training on proprietary industry software & open-source ML stacks',
      'Direct mentorship from Senior AI Directors in your domain',
      '2 Sponsored Capstone Projects with partner enterprises',
      'Dual Industry Certification (EduLis + Industry Partner)'
    ],
    syllabus: [
      { week: 'Weeks 1-3', topic: 'Domain Dataset Processing & Specialized AI Tools', details: 'Handling domain-specific data structures (ChemDraw, DICOM, CAD, Financial Transcripts, or Legal Briefs).' },
      { week: 'Weeks 4-6', topic: 'Model Selection & Fine-Tuning Frameworks', details: 'Adapting foundation models with Retrieval-Augmented Generation (RAG) and vector databases.' },
      { week: 'Weeks 7-9', topic: 'Building Autonomous Domain Agents', details: 'Designing multi-step AI agents that execute complex workflow tasks with human-in-the-loop validation.' },
      { week: 'Weeks 10-12', topic: 'Enterprise Capstone & Deployment', details: 'Deploying a live production-grade solution presented directly to corporate recruiters.' }
    ],
    price: '$799 / Domain Specialization',
    targetRole: 'Senior Undergrads, Postgrads, & Working Professionals seeking rapid promotion',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'accelerator',
    title: 'AI Career Accelerator & Placement Launchpad',
    badge: 'CAREER GUARANTEE TRACK',
    duration: '6 Weeks (Intensive)',
    level: 'Career Readiness',
    shortDesc: 'End-to-end career transformation: AI-optimized LinkedIn, portfolio builder, mock AI interviews, and placement intro.',
    longDesc: 'Technical skills are only half the battle. Our Career Accelerator guarantees you stand out to top recruiters. Build a high-converting digital presence, showcase live AI capstones, and master technical & AI behavioral interviews.',
    keyHighlights: [
      '1-on-1 AI Portfolio review with Silicon Valley & Global hiring leads',
      'AI-optimized resume & ATS keyword optimization',
      'Live AI Mock Interviews with real-time speech and response feedback',
      'Direct referral pipeline to 120+ partner corporate hiring managers',
      'Lifetime access to EduLis Alumni Network & Masterclasses'
    ],
    syllabus: [
      { week: 'Week 1', topic: 'Personal Brand & AI Portfolio Positioning', details: 'Crafting a compelling GitHub/HuggingFace & interactive web portfolio showcasing your projects.' },
      { week: 'Week 2', topic: 'ATS Resume Architecture & LinkedIn Optimization', details: 'Formatting your profile for recruiter visibility and high-match AI algorithm ranking.' },
      { week: 'Weeks 3-4', topic: 'Domain Technical & AI Case Study Preparation', details: 'Cracking domain-specific technical assessments, system design, and AI logic evaluations.' },
      { week: 'Weeks 5-6', topic: 'Mock Interviews & Direct Placement Drives', details: 'Simulated 1-on-1 interviews with industry experts and direct intro to partner recruitment drives.' }
    ],
    price: '$499 / Career Module',
    targetRole: 'Final year students & job seekers aiming for high-tier compensation packages',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80'
  }
];

export const MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Dr. Aris Thorne',
    role: 'Principal Bio-AI Researcher',
    company: 'Ex-Novartis AI Lab',
    domain: 'Pharmacy & Healthcare AI',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Pioneered computational drug screening pipelines; mentored over 1,500 PharmD and biotech students globally.'
  },
  {
    id: 'm2',
    name: 'Elena Rostova',
    role: 'Head of Industrial AI Systems',
    company: 'Siemens Mobility & Robotics',
    domain: 'Engineering & Smart Systems',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    bio: '14+ years building autonomous factory robotics and edge AI predictive maintenance platforms.'
  },
  {
    id: 'm3',
    name: 'Marcus Vance',
    role: 'Partner & FinTech Director',
    company: 'Apex Capital Ventures',
    domain: 'Business, Finance & MBA',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Advises global Fortune 500s on AI transformation and algorithmic risk modeling.'
  },
  {
    id: 'm4',
    name: 'Sarah Lin, Esq.',
    role: 'Legal Tech & AI Policy Lead',
    company: 'Global IP & Tech Counsel',
    domain: 'Law & Governance',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    bio: 'Specialist in AI copyright governance, legal contract automation, and ethical AI deployment.'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq1',
    question: 'Do I need prior coding or computer science experience to join EduLis?',
    answer: 'No! EduLis is specifically designed for non-technical as well as technical students. Our AI Foundation module starts from zero and teaches you how to leverage AI tools, natural language prompt engineering, and low-code AI workflows relevant to your specific major (e.g., Pharmacy, Business, Healthcare, or Law).',
    category: 'Eligibility'
  },
  {
    id: 'faq2',
    question: 'How is EduLis different from traditional online course platforms?',
    answer: 'Traditional platforms offer static video lectures. EduLis is an AI-powered Career Acceleration platform. We combine domain-adapted AI tutors, live industry capstone projects with real enterprise datasets, 1-on-1 industry mentorship, and direct placement pipelines through Sindulis Cloud partners.',
    category: 'Methodology'
  },
  {
    id: 'faq3',
    question: 'What is the format of the AI Industry Readiness Cohort?',
    answer: 'The cohort operates in a flexible hybrid format: live weekend interactive masterclasses, weekly self-paced lab assignments with AI tutor feedback, and 1-on-1 mentor check-ins. All live sessions are recorded and available in your student portal.',
    category: 'Cohort'
  },
  {
    id: 'faq4',
    question: 'How does EduLis help me land high-paying job offers?',
    answer: 'You will graduate with a verified digital portfolio containing live AI capstones built for real business problems. Our Career Accelerator module then optimizes your resume for ATS systems, prepares you via AI mock interviews, and introduces you directly to hiring managers at 120+ partner firms.',
    category: 'Placements'
  },
  {
    id: 'faq5',
    question: 'Can universities or colleges partner with EduLis for campus integration?',
    answer: 'Yes! We partner with higher education institutions to integrate EduLis AI domain modules into existing academic curricula, providing faculty training, diagnostic dashboards, and campus-wide AI lab access.',
    category: 'Institutional'
  }
];

export const CAREER_OUTCOMES_METRICS = [
  { label: 'Average Salary Hike', value: '88%' },
  { label: 'Industry Placement Rate', value: '94.2%' },
  { label: 'Corporate Hiring Partners', value: '120+' },
  { label: 'Active Learners Worldwide', value: '25,000+' }
];
