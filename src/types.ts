export type EcosystemCategory = 'active' | 'coming-soon';

export interface EcosystemCardData {
  id: string;
  title: string;
  badge: string;
  badgeType: 'orange' | 'obsidian' | 'navy' | 'coming-soon';
  headline: string;
  description: string;
  ctaText: string;
  category: EcosystemCategory;
  accentColor: string; // Hex color for left border highlight
  subtext?: string;
  longDescription?: string;
  features?: string[];
  metrics?: { label: string; value: string }[];
  targetAudience?: string;
  iconName?: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  email?: string;
  name?: string;
  role?: string;
  accessibleServices?: string[];
}

export type AppView = 'sindulis-portal' | 'edulis' | 'sinfox' | 'techlis';
export type EdulisPage = 'home' | 'about' | 'services' | 'contact';
export type SinfoxPage = 'home' | 'about' | 'services' | 'contact';
export type TechlisPage = 'home' | 'about' | 'services' | 'contact';

export interface DomainTrack {
  id: string;
  name: string;
  iconName: string;
  tagline: string;
  description: string;
  targetStudents: string;
  aiTools: string[];
  curriculumModules: string[];
  sampleProject: {
    title: string;
    description: string;
    techStack: string[];
  };
  image: string;
  placementStats: string;
}

export interface EdulisProgram {
  id: string;
  title: string;
  badge: string;
  duration: string;
  level: string;
  shortDesc: string;
  longDesc: string;
  keyHighlights: string[];
  syllabus: { week: string; topic: string; details: string }[];
  price: string;
  targetRole: string;
  image: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  domain: string;
  image: string;
  bio: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export type ModalType = 
  | { type: 'pillar-detail'; card: EcosystemCardData }
  | { type: 'waitlist'; card: EcosystemCardData }
  | { type: 'login' }
  | { type: 'enroll'; programId?: string; domainId?: string }
  | { type: 'program-detail'; program: EdulisProgram }
  | { type: 'sinfox-quote'; defaultService?: string }
  | { type: 'techlis-quote'; defaultService?: string }
  | null;

