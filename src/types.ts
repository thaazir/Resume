export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  summary: string;
  photoUrl?: string;
  showPhoto?: boolean;
  photoShape?: 'circle' | 'rounded' | 'square';
  photoPosition?: 'left' | 'right' | 'center';
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  relevantCoursework?: string[];
}

export interface SkillCategory {
  id: string;
  name: string; // e.g. "Languages & Frameworks", "Core Competencies", "Tools & Platforms", "Soft Skills"
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface CustomSection {
  id: string;
  title: string;
  items: { id: string; title: string; subtitle?: string; date?: string; description: string }[];
}

export type TemplateId =
  | 'ats-classic'
  | 'ats-modern'
  | 'ats-executive'
  | 'modern-accent'
  | 'tech-compact'
  | 'nordic-clean'
  | 'left-sidebar'
  | 'ivy-league'
  | 'creative-studio'
  | 'compact-dense'
  | 'metro-slate'
  | 'swiss-grid';

export interface ResumeSettings {
  template: TemplateId;
  fontFamily: 'Arial' | 'Calibri' | 'Times New Roman' | 'Roboto' | 'Georgia' | 'Inter';
  fontSize: 'compact' | 'standard' | 'spacious';
  accentColor: string;
  spacing: 'tight' | 'normal' | 'relaxed';
  showSeparators: boolean;
  sectionOrder: string[];
  showPhoto?: boolean;
  photoShape?: 'circle' | 'rounded' | 'square';
}

export interface ResumeData {
  id: string;
  title: string;
  updatedAt: string;
  targetRole?: string;
  targetCompany?: string;
  personalInfo: PersonalInfo;
  experiences: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  languages: LanguageItem[];
  customSections?: CustomSection[];
  settings: ResumeSettings;
}

export interface AtsAuditPillar {
  name: string;
  score: number; // 0-100
  weight: number;
  status: 'passed' | 'warning' | 'critical';
  details: string[];
}

export type AtsPillarScore = AtsAuditPillar;

export interface AtsAuditResult {
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  pillars: {
    formatting: AtsAuditPillar;
    keywords: AtsAuditPillar;
    impact: AtsAuditPillar;
    completeness: AtsAuditPillar;
  };
  criticalIssues: string[];
  warnings: string[];
  passedChecks: string[];
  suggestedFixes: {
    id: string;
    section: 'summary' | 'experience' | 'skills' | 'contact' | 'formatting';
    title: string;
    description: string;
    actionable: boolean;
    autoFixType?: string;
  }[];
}

export interface KeywordMatchAnalysis {
  matchPercentage: number;
  matchedKeywords: { keyword: string; count: number; category: string }[];
  missingKeywords: { keyword: string; importance: 'high' | 'medium' | 'low'; category: string }[];
  jobTitleMatch: boolean;
  topRecommendations: string[];
}

export interface GroundedJobInsight {
  role: string;
  industry: string;
  inDemandKeywords: string[];
  keyHardSkills: string[];
  keySoftSkills: string[];
  certificationsValued: string[];
  averageSalaryRange?: string;
  hiringTrendsSummary: string;
  sources?: { title: string; uri: string }[];
}

export interface CoverLetterData {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  jobTitle: string;
  bodyParagraphs: string[];
  closing: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'behavioral' | 'technical' | 'situational' | 'resume-specific';
  whyAsked: string;
  starTip: string;
  sampleAnswerFramework: string;
}
