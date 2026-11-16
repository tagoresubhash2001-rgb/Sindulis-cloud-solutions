import { EcosystemCardData } from '../types';

export const ACTIVE_PILLARS: EcosystemCardData[] = [
  {
    id: 'edulis',
    title: 'edulis',
    badge: 'LEARN',
    badgeType: 'orange',
    headline: 'AI-Powered Industry Readiness',
    description: 'Where Education Meets Industry Through AI. Domain-specific AI training for Pharmacy, Engineering, and Business students.',
    ctaText: 'Explore edulis →',
    category: 'active',
    accentColor: '#E65100',
    longDescription: 'edulis bridges the gap between academic curriculum and modern industry demands through domain-adapted artificial intelligence models, real-world practical simulations, and institutional integration.',
    features: [
      'Domain-adapted AI tutors for Pharmacy, Engineering & Business',
      'Real-world capstone project simulations',
      'Industry certification and skill-gap diagnostic dashboards',
      'Faculty analytics and institutional performance tracking'
    ],
    metrics: [
      { label: 'Active Learners', value: '25,000+' },
      { label: 'Domain Modules', value: '140+' },
      { label: 'Placement Boost', value: '88%' }
    ],
    targetAudience: 'Pharmacy, Engineering, and Business Students & Higher Ed Institutions'
  },
  {
    id: 'sinfoxmedia',
    title: 'Sinfox Media',
    badge: 'GROW',
    badgeType: 'obsidian',
    headline: 'Branding & AI Growth Partner',
    description: "We don't market businesses. We build brands people choose. High-ticket positioning, AI systems, and marketing scale.",
    ctaText: 'Explore Sinfox Media →',
    category: 'active',
    accentColor: '#111827',
    longDescription: 'Sinfox Media blends strategic narrative design with hyper-targeted AI growth infrastructure to turn growing enterprises into premium, undeniable market leaders.',
    features: [
      'High-Ticket Brand Positioning & Visual Identity',
      'AI-driven content velocity & omni-channel distribution',
      'Predictive customer acquisition and funnel automation',
      'Executive thought leadership and brand reputation control'
    ],
    metrics: [
      { label: 'Client Revenue Generated', value: '$45M+' },
      { label: 'Campaign ROI', value: '4.8x Avg' },
      { label: 'Global Brands Built', value: '80+' }
    ],
    targetAudience: 'High-growth B2B Founders, D2C Enterprises & Industry Leaders'
  },
  {
    id: 'techlis',
    title: 'Tech Lis',
    badge: 'BUILD',
    badgeType: 'navy',
    headline: 'AI-First Digital Transformation',
    description: 'AI-First Digital Transformation. Custom ERPs, enterprise software, AI agents, and workflow automation.',
    ctaText: 'Explore Tech Lis →',
    category: 'active',
    accentColor: '#0B1299',
    longDescription: 'Tech Lis architects custom, enterprise-grade software engines, intelligent autonomous agents, and scalable cloud infrastructures tailored to complex corporate workflows.',
    features: [
      'Custom ERP & CRM development with native AI logic',
      'Autonomous AI agent networks for workflow execution',
      'Legacy system modernization & cloud migration',
      'Bank-grade security, RBAC, and data governance'
    ],
    metrics: [
      { label: 'Uptime Reliability', value: '99.99%' },
      { label: 'Automated Hours Saved', value: '1.2M+' },
      { label: 'Enterprise Deployments', value: '120+' }
    ],
    targetAudience: 'Mid-Market to Enterprise Organizations & Scaling Tech Platforms'
  }
];

export const COMING_SOON_PILLARS: EcosystemCardData[] = [
  {
    id: 'listtalks',
    title: 'List Talks',
    headline: 'List Talks',
    badge: 'COMING SOON',
    badgeType: 'coming-soon',
    description: 'Inspiring media, builder stories, and digital transformation insights.',
    subtext: 'Stay Tuned',
    ctaText: 'Stay Tuned →',
    category: 'coming-soon',
    accentColor: '#64748B',
    longDescription: 'A flagship media network featuring unfiltered interviews with tech pioneers, founders, and AI innovators building tomorrow’s infrastructure.',
    targetAudience: 'Innovators, Developers, Founders, and Tech Enthusiasts'
  },
  {
    id: 'entrepreneurclub',
    title: 'Entrepreneur Club',
    headline: 'Entrepreneur Club',
    badge: 'COMING SOON',
    badgeType: 'coming-soon',
    description: 'A curated network for visionaries, founders, mentors, and startup leaders.',
    subtext: 'Join Waitlist',
    ctaText: 'Join Waitlist →',
    category: 'coming-soon',
    accentColor: '#64748B',
    longDescription: 'An exclusive peer-to-peer ecosystem providing capital access, peer mentorship, enterprise intros, and strategic masterminds.',
    targetAudience: 'Early to Growth Stage Founders, Angel Investors, & Strategic Advisors'
  },
  {
    id: 'internzy',
    title: 'Internzy',
    headline: 'Internzy',
    badge: 'INTERN',
    badgeType: 'coming-soon',
    description: 'Next-generation internship and experiential learning platform built for modern institutions and students.',
    subtext: 'Request Early Access',
    ctaText: 'Request Early Access →',
    category: 'coming-soon',
    accentColor: '#64748B',
    longDescription: 'A friction-free, AI-native internship and experiential learning platform bridging academic institutions with high-impact corporate internships.',
    targetAudience: 'Universities, Colleges, Academies, Students & Corporate Recruiter Units'
  }
];

export const ALL_ECOSYSTEM_CARDS: EcosystemCardData[] = [
  ...ACTIVE_PILLARS,
  ...COMING_SOON_PILLARS
];
