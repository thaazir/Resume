import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Search,
  Briefcase,
  Layers,
  HelpCircle,
  Download,
  Printer,
  Smartphone,
  Monitor,
  RotateCcw,
  BookOpen,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  Layout,
  Eye,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { ResumeData, AtsAuditResult, TemplateId } from '../types';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { ALL_TEMPLATES } from './ResumeForm/TemplateSettingsForm';
import {
  downloadPlainTextResume,
  downloadDocxResume,
  downloadJsonResume,
  printResumeDocument
} from '../utils/exportUtils';

interface NavbarProps {
  resume: ResumeData;
  onResumeChange?: (resume: ResumeData) => void;
  atsResult?: AtsAuditResult;
  onOpenAtsDrawer: () => void;
  onOpenJobTailor: () => void;
  onOpenMarketSearch: () => void;
  onOpenCoverLetter: () => void;
  onOpenInterviewPrep: () => void;
  onOpenImport: () => void;
  onOpenLinkedInImport?: () => void;
  onOpenArchitecture: () => void;
  onOpenTemplateGallery?: () => void;
  onOpenExportModal?: () => void;
  previewMode?: 'mobile' | 'desktop';
  setPreviewMode?: (mode: 'mobile' | 'desktop') => void;
  editorMode?: 'form' | 'wizard';
  setEditorMode?: (mode: 'form' | 'wizard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  resume,
  onResumeChange,
  atsResult,
  onOpenAtsDrawer,
  onOpenJobTailor,
  onOpenMarketSearch,
  onOpenCoverLetter,
  onOpenInterviewPrep,
  onOpenImport,
  onOpenLinkedInImport,
  onOpenArchitecture,
  onOpenTemplateGallery,
  onOpenExportModal,
  editorMode = 'form',
  setEditorMode,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const score = atsResult?.overallScore ?? 75;
  const grade = atsResult?.grade ?? 'B';

  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (s >= 70) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  const loadSample = (key: string) => {
    const sample = SAMPLE_RESUMES[key];
    if (sample && onResumeChange) {
      onResumeChange({
        ...sample,
        id: `resume-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      });
      setIsMobileMenuOpen(false);
    }
  };

  const activeTemplate =
    ALL_TEMPLATES.find((t) => t.id === resume.settings?.template) || ALL_TEMPLATES[0];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-none whitespace-nowrap">
                ResuMate <span className="text-blue-600 font-extrabold">ATS</span>
              </h1>
              <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                <Sparkles className="w-2.5 h-2.5 text-blue-600" /> AI Grounded
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 mt-0.5 truncate max-w-[260px] lg:max-w-none">
              100% ATS-Safe Resume Builder & Tailoring
            </p>
          </div>
        </div>

        {/* Center: ATS Score & Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* ATS Score Badge - Always visible & responsive */}
          <button
            id="ats-score-pill-btn"
            onClick={onOpenAtsDrawer}
            title="Click to view ATS breakdown & auto-fix score"
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-xs font-semibold transition-all hover:shadow-xs cursor-pointer shrink-0 ${getScoreColor(
              score
            )}`}
          >
            <span className="flex h-2 w-2 relative shrink-0">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  score >= 85 ? 'bg-emerald-400' : score >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              />
            </span>
            <span className="font-bold">
              <span className="hidden sm:inline">ATS Score: </span>
              {score}/100
            </span>
            <span className="hidden lg:inline text-[10px] px-1 py-0.2 rounded bg-white/80 font-mono">
              Grade {grade}
            </span>
          </button>

          {/* Format Gallery Button (Tablet & Desktop) */}
          {onOpenTemplateGallery && (
            <button
              id="templates-gallery-nav-btn"
              onClick={onOpenTemplateGallery}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer shrink-0"
              title="Inspect output designs & switch templates"
            >
              <Layout className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Design Formats</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                {activeTemplate.name.split(' ')[0]}
              </span>
            </button>
          )}

          {/* Quick Tailor Button (Desktop) */}
          <button
            id="job-tailor-nav-btn"
            onClick={onOpenJobTailor}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer shrink-0"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Tailor to Job</span>
          </button>

          {/* Market Trends (Desktop) */}
          <button
            id="market-search-nav-btn"
            onClick={onOpenMarketSearch}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Market Trends</span>
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* LinkedIn Import Button (Desktop) */}
          {onOpenLinkedInImport && (
            <button
              id="linkedin-import-btn"
              onClick={onOpenLinkedInImport}
              title="Import profile from LinkedIn"
              className="hidden lg:flex p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-[#0A66C2] text-white hover:bg-[#004182] shadow-xs items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <span className="w-3.5 h-3.5 rounded-xs bg-white text-[#0A66C2] flex items-center justify-center font-bold text-[9px] leading-none">
                in
              </span>
              <span>LinkedIn</span>
            </button>
          )}

          {/* Desktop AI Tools Menu */}
          <div className="relative group hidden md:block">
            <button
              id="extra-tools-btn"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden lg:inline">AI Tools</span>
            </button>
            <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1">
              <button
                onClick={onOpenCoverLetter}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-purple-600" />
                <div>
                  <div className="font-medium">AI Cover Letter</div>
                  <div className="text-[10px] text-slate-400">Tailored to job posting</div>
                </div>
              </button>
              <button
                onClick={onOpenInterviewPrep}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="font-medium">Interview Predictor</div>
                  <div className="text-[10px] text-slate-400">STAR questions & coaching</div>
                </div>
              </button>
              <button
                onClick={onOpenMarketSearch}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
              >
                <Search className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-medium">Google Market Trends</div>
                  <div className="text-[10px] text-slate-400">Live 2026 keyword radar</div>
                </div>
              </button>
              <div className="h-px bg-slate-100 my-1" />
              <button
                onClick={onOpenArchitecture}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-medium">System Architecture & Specs</div>
                  <div className="text-[10px] text-slate-400">Tech stack & ATS rules</div>
                </div>
              </button>
            </div>
          </div>

          {/* Desktop Samples Dropdown */}
          <div className="relative group hidden md:block">
            <button
              id="samples-dropdown-btn"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden xl:inline">Samples</span>
            </button>
            <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Load Template Profile
              </div>
              <button
                onClick={() => loadSample('software_engineer')}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Senior Software Engineer
              </button>
              <button
                onClick={() => loadSample('product_manager')}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-teal-500" />
                Lead Product Manager
              </button>
              <button
                onClick={() => loadSample('fresh_graduate')}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                CS Graduate / Entry Level
              </button>
            </div>
          </div>

          {/* Primary Export Button */}
          <button
            id="export-main-btn"
            onClick={onOpenExportModal || (() => {})}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Actions Sheet */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
          {/* Quick Tools Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onOpenJobTailor();
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-2 font-semibold text-left"
            >
              <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Tailor to Job</span>
            </button>

            {onOpenTemplateGallery && (
              <button
                onClick={() => {
                  onOpenTemplateGallery();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 flex items-center gap-2 font-semibold text-left"
              >
                <Layout className="w-4 h-4 text-blue-600 shrink-0" />
                <span>12 Formats</span>
              </button>
            )}

            {onOpenLinkedInImport && (
              <button
                onClick={() => {
                  onOpenLinkedInImport();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-blue-50 text-[#0A66C2] border border-blue-200 flex items-center gap-2 font-semibold text-left"
              >
                <span className="w-4 h-4 rounded-xs bg-[#0A66C2] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  in
                </span>
                <span>LinkedIn Import</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenMarketSearch();
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-2 font-semibold text-left"
            >
              <Search className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Market Trends</span>
            </button>

            <button
              onClick={() => {
                onOpenCoverLetter();
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-2 font-semibold text-left"
            >
              <FileText className="w-4 h-4 text-purple-600 shrink-0" />
              <span>AI Cover Letter</span>
            </button>

            <button
              onClick={() => {
                onOpenInterviewPrep();
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-2 font-semibold text-left"
            >
              <HelpCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Interview Prep</span>
            </button>
          </div>

          {/* Sample Profiles Quick Load */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Load Sample Template
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <button
                onClick={() => loadSample('software_engineer')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-between"
              >
                <span>Senior Software Engineer</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => loadSample('product_manager')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-between"
              >
                <span>Lead Product Manager</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => loadSample('fresh_graduate')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-between"
              >
                <span>CS Graduate / Entry Level</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* System Specs & Import */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <button
              onClick={() => {
                onOpenImport();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 py-1 hover:text-blue-600 font-medium"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Resume</span>
            </button>
            <button
              onClick={() => {
                onOpenArchitecture();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 py-1 hover:text-blue-600 font-medium"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>System Specs</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
