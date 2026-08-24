import React, { useState } from 'react';
import {
  X,
  Code2,
  Database,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Search,
  Cpu,
  Layers,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<
    'tech-stack' | 'android-mvvm' | 'db-schema' | 'prompts' | 'ats-rules' | 'roadmap'
  >('tech-stack');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Full Architecture & Technical Specs</h2>
              <p className="text-xs text-slate-300">
                System Design, Google GenAI SDK, Google Search Grounding, Android MVVM & Room Schemas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Nav */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex flex-wrap gap-2 text-xs font-semibold">
          {[
            { id: 'tech-stack', label: 'Tech Stack & Rationale', icon: Cpu },
            { id: 'android-mvvm', label: 'Android MVVM Spec', icon: Smartphone },
            { id: 'db-schema', label: 'Database & Room Schemas', icon: Database },
            { id: 'prompts', label: 'Gemini Prompt Templates', icon: Sparkles },
            { id: 'ats-rules', label: 'ATS Parsing Rules', icon: ShieldCheck },
            { id: 'roadmap', label: 'Production Roadmap', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* TAB 1: TECH STACK */}
          {activeTab === 'tech-stack' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">1. Tech Stack Justification & Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-blue-900 text-xs uppercase">Frontend Architecture (Web & Mobile Ready)</h4>
                  <ul className="text-xs space-y-1.5 text-slate-700">
                    <li>• <strong>React 19 + TypeScript:</strong> Single-page application with strict type safety across all resume sections.</li>
                    <li>• <strong>Tailwind CSS:</strong> Utility-first styling calibrated strictly for ATS contrast ratios and clean printing.</li>
                    <li>• <strong>Motion:</strong> Smooth step-wizard transitions and responsive modal feedback.</li>
                    <li>• <strong>Client-side ATS Engine:</strong> Instant sub-millisecond calculation of 4 ATS pillars (Formatting, Keywords, Impact, Completeness).</li>
                    <li>• <strong>Web Speech API:</strong> Native voice dictation for summaries and achievements without third-party latency.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-indigo-900 text-xs uppercase">Backend & AI Infrastructure</h4>
                  <ul className="text-xs space-y-1.5 text-slate-700">
                    <li>• <strong>Node.js / Express Server:</strong> Secure server-side proxy isolating Gemini API keys from browser clients.</li>
                    <li>• <strong>@google/genai SDK (v2.4.0):</strong> Modern Google GenAI TypeScript SDK (new GoogleGenAI).</li>
                    <li>• <strong>gemini-3.7-flash:</strong> Ultra-fast, high-precision reasoning model for STAR bullet refinement, job tailoring, and JSON parsing.</li>
                    <li>• <strong>Google Search Grounding:</strong> `googleSearch: {}` enabled for live 2025/2026 industry demand and salary queries.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANDROID MVVM */}
          {activeTab === 'android-mvvm' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">2. Android Native MVVM Architecture Blueprint</h3>
              <p className="text-xs text-slate-600">
                Specification for a native Android companion application built with Kotlin, Jetpack Compose, Coroutines, and Room:
              </p>

              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 overflow-x-auto">
                <pre>{`// Android Clean Architecture Package Structure:
com.atsresume.ai/
├── data/
│   ├── local/
│   │   ├── ResumeDao.kt           // Room DAO with Flow reactive streams
│   │   ├── ResumeDatabase.kt      // Room DB instance (TypeConverters for JSON)
│   │   └── entity/
│   │       ├── ResumeEntity.kt
│   │       ├── ExperienceEntity.kt
│   │       └── SkillEntity.kt
│   ├── remote/
│   │   ├── GeminiApiService.kt    // Retrofit / OkHttp proxy to backend
│   │   └── dto/                   // Request / Response DTOs
│   └── repository/
│       └── ResumeRepositoryImpl.kt
├── domain/
│   ├── model/Resume.kt
│   ├── repository/ResumeRepository.kt
│   └── usecase/
│       ├── CalculateAtsScoreUseCase.kt
│       ├── EnhanceBulletPointUseCase.kt
│       └── TailorToJobPostingUseCase.kt
├── presentation/
│   ├── viewmodel/
│   │   ├── ResumeEditorViewModel.kt  // StateFlow<ResumeUiState>
│   │   └── AtsScoreViewModel.kt
│   └── ui/
│       ├── screens/EditorScreen.kt   // Jetpack Compose Single-column layout
│       └── components/STARBulletCard.kt`}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: DB SCHEMA */}
          {activeTab === 'db-schema' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">3. Relational & Local Database Schemas</h3>
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                <pre>{`-- PostgreSQL / SQLite / Room Normalized Schema
CREATE TABLE resumes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    target_role VARCHAR(150),
    target_company VARCHAR(150),
    template_id VARCHAR(50) DEFAULT 'ats-classic',
    font_family VARCHAR(50) DEFAULT 'Calibri',
    font_size VARCHAR(20) DEFAULT 'standard',
    accent_color VARCHAR(10) DEFAULT '#1e3a8a',
    ats_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE personal_info (
    resume_id VARCHAR(36) PRIMARY KEY REFERENCES resumes(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(150) NOT NULL,
    linkedin_url TEXT,
    github_url TEXT,
    summary TEXT
);

CREATE TABLE experiences (
    id VARCHAR(36) PRIMARY KEY,
    resume_id VARCHAR(36) REFERENCES resumes(id) ON DELETE CASCADE,
    company VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL,
    location VARCHAR(150),
    start_date VARCHAR(20),
    end_date VARCHAR(20),
    is_current BOOLEAN DEFAULT FALSE,
    bullets JSONB NOT NULL DEFAULT '[]',
    sort_order INTEGER DEFAULT 0
);`}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: PROMPT TEMPLATES */}
          {activeTab === 'prompts' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">4. Gemini AI System Prompts & Configurations</h3>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-900">STAR Bullet Point Enhancement Prompt</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `You are an elite Executive ATS Resume Writer. Convert draft statements into high-impact STAR framework achievements. Always start with strong action verbs (Architected, Spearheaded, Reduced). Return strict JSON.`,
                        'star-prompt'
                      )
                    }
                    className="text-xs font-semibold text-blue-600 flex items-center gap-1"
                  >
                    {copiedKey === 'star-prompt' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'star-prompt' ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                  "You are an elite Executive ATS Resume Writer and Fortune 500 Talent Acquisition Lead. Transform draft bullet points into quantifiable STAR/XYZ achievements (Accomplished [X], as measured by [Y], by doing [Z]). Eliminate passive language."
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: ATS RULES */}
          {activeTab === 'ats-rules' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">5. ATS Parsing Integrity & Safety Matrix</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-xs space-y-1.5">
                  <span className="font-bold text-emerald-900 block flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> ATS-Safe Practices (100% Compliant)
                  </span>
                  <p>• Single-column vertical reading order.</p>
                  <p>• Standard standard header tags (Experience, Education, Skills).</p>
                  <p>• Standard fonts (Calibri, Arial, Georgia, Roboto).</p>
                  <p>• Clean bullet formatting with round dots.</p>
                </div>

                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-xs space-y-1.5">
                  <span className="font-bold text-rose-900 block">❌ Forbidden ATS Pitfalls (Banned)</span>
                  <p>• Multi-column tables & floating textboxes.</p>
                  <p>• Embedded graphics, skill progress bars, or icons inside headers.</p>
                  <p>• Header/Footer metadata traps that get skipped by Workday/Taleo.</p>
                  <p>• Non-standard section names like 'My Odyssey' or 'Passions'.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">6. Production Roadmap & Deployment Plan</h3>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>Phase 1: Core ATS Builder & AI Engine (Current)</strong> - Full-stack React + Express + Gemini 3.7 Flash + Search Grounding + Local ATS Scorecard.
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>Phase 2: Cloud Sync & Multi-Version Vault</strong> - User profile accounts, multiple tailored resume variants per target company.
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>Phase 3: Android Native Release</strong> - Kotlin Jetpack Compose app with on-device SQLite caching & voice-first entry.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};
