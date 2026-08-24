import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  User,
  FileText,
  Briefcase,
  Cpu,
  GraduationCap,
  Award,
  Sliders,
  Eye,
  Edit3,
  Columns,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  FolderOpen,
  ArrowRight,
  ListOrdered,
  Layout,
  Palette,
  ChevronDown,
  Maximize2
} from 'lucide-react';
import { ResumeData, AtsAuditResult, TemplateId } from './types';
import { DEFAULT_RESUME } from './data/sampleResumes';
import { calculateAtsScore } from './utils/atsEngine';
import { exportToPdf, exportToPlainText, exportToJson, triggerConfetti } from './utils/exportUtils';
import { Navbar } from './components/Navbar';
import { ResumeDocument } from './components/ResumePreview/ResumeDocument';
import { PersonalInfoForm } from './components/ResumeForm/PersonalInfoForm';
import { SummaryForm } from './components/ResumeForm/SummaryForm';
import { ExperienceForm } from './components/ResumeForm/ExperienceForm';
import { SkillsForm } from './components/ResumeForm/SkillsForm';
import { EducationForm } from './components/ResumeForm/EducationForm';
import { ProjectsForm } from './components/ResumeForm/ProjectsForm';
import { CertificationsForm } from './components/ResumeForm/CertificationsForm';
import { TemplateSettingsForm, ALL_TEMPLATES } from './components/ResumeForm/TemplateSettingsForm';
import { StepWizard } from './components/Wizard/StepWizard';
import { AtsAuditorDrawer } from './components/AtsAuditor/AtsAuditorDrawer';
import { JobTailorModal } from './components/JobTailor/JobTailorModal';
import { MarketSearchModal } from './components/MarketSearch/MarketSearchModal';
import { CoverLetterModal } from './components/CoverLetter/CoverLetterModal';
import { InterviewModal } from './components/Interview/InterviewModal';
import { ResumeImportModal } from './components/ResumeImportModal';
import { LinkedInImportModal } from './components/LinkedInImport/LinkedInImportModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { TemplateGalleryModal } from './components/TemplateGalleryModal';
import { ExportModal } from './components/ExportModal';

type FormTab =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'skills'
  | 'education'
  | 'projects'
  | 'certifications'
  | 'settings';

export default function App() {
  // Detect screen size on initial load for optimal responsive defaults
  const isInitialMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;

  // Load initial resume from localStorage or default
  const [resume, setResume] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('ats_resume_data_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved resume:', e);
      }
    }
    return DEFAULT_RESUME;
  });

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('ats_resume_data_v1', JSON.stringify(resume));
  }, [resume]);

  // View Layout Modes: 'split' | 'editor' | 'preview'
  // On mobile devices, default to 'editor' for a clean full-width experience without layout clipping
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>(() =>
    isInitialMobile ? 'editor' : 'split'
  );

  // Editor mode: 'form' | 'wizard'
  const [editorStyle, setEditorStyle] = useState<'form' | 'wizard'>('form');
  const [activeFormTab, setActiveFormTab] = useState<FormTab>('personal');
  const [zoomScale, setZoomScale] = useState<number>(() => (isInitialMobile ? 0.48 : 0.95));

  // Modals state
  const [isAtsDrawerOpen, setIsAtsDrawerOpen] = useState(false);
  const [isJobTailorOpen, setIsJobTailorOpen] = useState(false);
  const [isMarketSearchOpen, setIsMarketSearchOpen] = useState(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isLinkedInImportOpen, setIsLinkedInImportOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Calculate ATS score in real-time
  const atsScorecard: AtsAuditResult = useMemo(() => {
    return calculateAtsScore(resume);
  }, [resume]);

  // Form Section Tabs definition
  const formTabs: { id: FormTab; label: string; icon: React.ElementType }[] = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: Award },
    { id: 'certifications', label: 'Certs & Langs', icon: Award },
    { id: 'settings', label: 'Formatting & Design', icon: Sliders },
  ];

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const fileName = `${(resume.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_ATS_Resume.pdf`;
      await exportToPdf('resume-document-root', fileName);
      triggerConfetti();
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const activeTemplateDef =
    ALL_TEMPLATES.find((t) => t.id === resume.settings?.template) || ALL_TEMPLATES[0];

  const handleApplyTemplateFromGallery = (
    templateId: TemplateId,
    accentColor?: string,
    fontFamily?: any
  ) => {
    setResume((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        template: templateId,
        accentColor: accentColor || prev.settings?.accentColor,
        fontFamily: fontFamily || prev.settings?.fontFamily,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans antialiased w-full max-w-full overflow-x-hidden">
      {/* Top Navigation Bar */}
      <Navbar
        resume={resume}
        onResumeChange={setResume}
        atsResult={atsScorecard}
        onOpenAtsDrawer={() => setIsAtsDrawerOpen(true)}
        onOpenJobTailor={() => setIsJobTailorOpen(true)}
        onOpenMarketSearch={() => setIsMarketSearchOpen(true)}
        onOpenCoverLetter={() => setIsCoverLetterOpen(true)}
        onOpenInterviewPrep={() => setIsInterviewOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenLinkedInImport={() => setIsLinkedInImportOpen(true)}
        onOpenArchitecture={() => setIsArchOpen(true)}
        onOpenTemplateGallery={() => setIsTemplateGalleryOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        editorMode={editorStyle}
        setEditorMode={setEditorStyle}
      />

      {/* Sub-Header Action Bar */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 sticky top-14 sm:top-16 z-30 shadow-2xs w-full max-w-full">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: View Mode Switchers */}
          <div className="flex items-center gap-1">
            {/* Desktop Mode Toggle (3 options) */}
            <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('editor')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'editor'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Form Only</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Full Preview</span>
              </button>
            </div>

            {/* Mobile / Tablet Segmented Control (2 options: Edit vs Preview) */}
            <div className="flex lg:hidden items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('editor')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'editor' || viewMode === 'split'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Form</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            {/* Editor Style Toggle (Tabs vs Wizard) */}
            {(viewMode === 'editor' || viewMode === 'split') && (
              <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs ml-1">
                <button
                  type="button"
                  onClick={() => setEditorStyle('form')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    editorStyle === 'form'
                      ? 'bg-white text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tabs
                </button>
                <button
                  type="button"
                  onClick={() => setEditorStyle('wizard')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                    editorStyle === 'wizard'
                      ? 'bg-white text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Wizard</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Format Selector & Export Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Format Picker Pill */}
            <button
              type="button"
              onClick={() => setIsTemplateGalleryOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 rounded-xl border border-slate-300 px-2.5 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
              title="Click to view output designs of all 12 formats"
            >
              <Layout className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate max-w-[100px] sm:max-w-[140px]">
                {activeTemplateDef.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {/* Quick PDF Export CTA */}
            <button
              type="button"
              id="export-pdf-btn"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shrink-0"
            >
              {isExportingPdf ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>
                <span className="hidden sm:inline">Export </span>ATS PDF
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        {/* VIEW MODE 1: DESKTOP SPLIT SCREEN (LG screens only) */}
        {viewMode === 'split' && (
          <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form / Wizard (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {editorStyle === 'wizard' ? (
                <StepWizard
                  resume={resume}
                  onChange={setResume}
                  onComplete={() => setIsAtsDrawerOpen(true)}
                  onOpenLinkedInImport={() => setIsLinkedInImportOpen(true)}
                  onOpenTemplateGallery={() => setIsTemplateGalleryOpen(true)}
                />
              ) : (
                <div className="space-y-4">
                  {/* Section Tabs Horizontal Bar */}
                  <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex gap-1 overflow-x-auto no-scrollbar w-full max-w-full">
                    {formTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeFormTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveFormTab(tab.id)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Form Card */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                    {activeFormTab === 'personal' && (
                      <PersonalInfoForm
                        data={resume.personalInfo}
                        onChange={(personalInfo) => setResume({ ...resume, personalInfo })}
                        onOpenLinkedInImport={() => setIsLinkedInImportOpen(true)}
                      />
                    )}
                    {activeFormTab === 'summary' && (
                      <SummaryForm
                        personalInfo={resume.personalInfo}
                        resume={resume}
                        onChange={(summary) =>
                          setResume({
                            ...resume,
                            personalInfo: { ...resume.personalInfo, summary },
                          })
                        }
                      />
                    )}
                    {activeFormTab === 'experience' && (
                      <ExperienceForm
                        experiences={resume.experiences}
                        onChange={(experiences) => setResume({ ...resume, experiences })}
                      />
                    )}
                    {activeFormTab === 'skills' && (
                      <SkillsForm
                        skills={resume.skills}
                        resume={resume}
                        onChange={(skills) => setResume({ ...resume, skills })}
                      />
                    )}
                    {activeFormTab === 'education' && (
                      <EducationForm
                        education={resume.education}
                        onChange={(education) => setResume({ ...resume, education })}
                      />
                    )}
                    {activeFormTab === 'projects' && (
                      <ProjectsForm
                        projects={resume.projects}
                        onChange={(projects) => setResume({ ...resume, projects })}
                      />
                    )}
                    {activeFormTab === 'certifications' && (
                      <CertificationsForm
                        certifications={resume.certifications}
                        languages={resume.languages}
                        onCertificationsChange={(certifications) =>
                          setResume({ ...resume, certifications })
                        }
                        onLanguagesChange={(languages) => setResume({ ...resume, languages })}
                      />
                    )}
                    {activeFormTab === 'settings' && (
                      <TemplateSettingsForm
                        settings={resume.settings}
                        onChange={(settings) => setResume({ ...resume, settings })}
                        onOpenGallery={() => setIsTemplateGalleryOpen(true)}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Document Preview (6 cols) */}
            <div className="lg:col-span-6 sticky top-28 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-semibold flex items-center gap-1.5 text-slate-700">
                  <Eye className="w-3.5 h-3.5 text-blue-600" /> Live Standard ATS A4 Layout
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setZoomScale(Math.max(0.6, zoomScale - 0.1))}
                      className="p-1 hover:text-slate-900 cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3 h-3" />
                    </button>
                    <span className="text-[11px] font-mono font-medium">
                      {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomScale(Math.min(1.2, zoomScale + 0.1))}
                      className="p-1 hover:text-slate-900 cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => setIsTemplateGalleryOpen(true)}
                    className="text-[11px] bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full font-bold transition-colors cursor-pointer"
                  >
                    Format: {activeTemplateDef.name.split(' ')[0]}
                  </button>
                </div>
              </div>

              <div
                className="overflow-x-auto p-4 bg-slate-300/60 rounded-2xl border border-slate-300 flex justify-center shadow-inner max-w-full"
                style={{ minHeight: '600px' }}
              >
                <div style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}>
                  <ResumeDocument resume={resume} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE 2: FORM / EDITOR ONLY (Mobile & Desktop) */}
        {(viewMode === 'editor' || (viewMode === 'split' && isInitialMobile)) && (
          <div className="max-w-4xl mx-auto w-full space-y-4">
            {editorStyle === 'wizard' ? (
              <StepWizard
                resume={resume}
                onChange={setResume}
                onComplete={() => setViewMode('preview')}
                onOpenLinkedInImport={() => setIsLinkedInImportOpen(true)}
                onOpenTemplateGallery={() => setIsTemplateGalleryOpen(true)}
              />
            ) : (
              <div className="space-y-4">
                {/* Section Tabs Horizontal Bar */}
                <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex gap-1 overflow-x-auto no-scrollbar w-full max-w-full">
                  {formTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeFormTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveFormTab(tab.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Form Body Card */}
                <div className="bg-white p-4 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
                  {activeFormTab === 'personal' && (
                    <PersonalInfoForm
                      data={resume.personalInfo}
                      onChange={(personalInfo) => setResume({ ...resume, personalInfo })}
                      onOpenLinkedInImport={() => setIsLinkedInImportOpen(true)}
                    />
                  )}
                  {activeFormTab === 'summary' && (
                    <SummaryForm
                      personalInfo={resume.personalInfo}
                      resume={resume}
                      onChange={(summary) =>
                        setResume({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, summary },
                        })
                      }
                    />
                  )}
                  {activeFormTab === 'experience' && (
                    <ExperienceForm
                      experiences={resume.experiences}
                      onChange={(experiences) => setResume({ ...resume, experiences })}
                    />
                  )}
                  {activeFormTab === 'skills' && (
                    <SkillsForm
                      skills={resume.skills}
                      resume={resume}
                      onChange={(skills) => setResume({ ...resume, skills })}
                    />
                  )}
                  {activeFormTab === 'education' && (
                    <EducationForm
                      education={resume.education}
                      onChange={(education) => setResume({ ...resume, education })}
                    />
                  )}
                  {activeFormTab === 'projects' && (
                    <ProjectsForm
                      projects={resume.projects}
                      onChange={(projects) => setResume({ ...resume, projects })}
                    />
                  )}
                  {activeFormTab === 'certifications' && (
                    <CertificationsForm
                      certifications={resume.certifications}
                      languages={resume.languages}
                      onCertificationsChange={(certifications) =>
                        setResume({ ...resume, certifications })
                      }
                      onLanguagesChange={(languages) => setResume({ ...resume, languages })}
                    />
                  )}
                  {activeFormTab === 'settings' && (
                    <TemplateSettingsForm
                      settings={resume.settings}
                      onChange={(settings) => setResume({ ...resume, settings })}
                      onOpenGallery={() => setIsTemplateGalleryOpen(true)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW MODE 3: FULL DOCUMENT PREVIEW */}
        {viewMode === 'preview' && (
          <div className="max-w-4xl mx-auto w-full space-y-4">
            {/* Preview Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-bold text-slate-900">Active Format:</span>
                <span>{activeTemplateDef.name}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                  {activeTemplateDef.badge}
                </span>
              </div>

              {/* Zoom & Switch Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setZoomScale(Math.max(0.35, zoomScale - 0.1))}
                    className="p-1 hover:text-slate-900 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-medium text-[11px] px-1">
                    {Math.round(zoomScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomScale(Math.min(1.3, zoomScale + 0.1))}
                    className="p-1 hover:text-slate-900 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTemplateGalleryOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Layout className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Change Format</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Document Canvas with Responsive Scaling */}
            <div
              className="p-3 sm:p-8 bg-slate-300/70 rounded-2xl border border-slate-300 flex justify-center shadow-inner overflow-x-auto w-full max-w-full"
              style={{ minHeight: '650px' }}
            >
              <div style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}>
                <ResumeDocument resume={resume} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-5 px-4 text-center text-xs text-slate-500 mt-auto w-full max-w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-800">ResuMate ATS Studio</span> — 100% ATS Verified & Keyword Optimized
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
            <button
              onClick={() => setIsTemplateGalleryOpen(true)}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              12 Output Formats
            </button>
            <button
              onClick={() => setIsArchOpen(true)}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              System Specs
            </button>
            <button
              onClick={() => setIsAtsDrawerOpen(true)}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              ATS Scanner Rules
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS & DRAWERS */}
      <AtsAuditorDrawer
        isOpen={isAtsDrawerOpen}
        onClose={() => setIsAtsDrawerOpen(false)}
        result={atsScorecard}
        resume={resume}
        onResumeUpdate={setResume}
      />

      <TemplateGalleryModal
        isOpen={isTemplateGalleryOpen}
        onClose={() => setIsTemplateGalleryOpen(false)}
        currentResume={resume}
        onApplyTemplate={handleApplyTemplateFromGallery}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        resume={resume}
        onExportPdf={handleExportPdf}
      />

      <JobTailorModal
        isOpen={isJobTailorOpen}
        onClose={() => setIsJobTailorOpen(false)}
        resume={resume}
        onResumeUpdate={setResume}
      />

      <MarketSearchModal
        isOpen={isMarketSearchOpen}
        onClose={() => setIsMarketSearchOpen(false)}
        resume={resume}
        onResumeUpdate={setResume}
      />

      <CoverLetterModal
        isOpen={isCoverLetterOpen}
        onClose={() => setIsCoverLetterOpen(false)}
        resume={resume}
      />

      <InterviewModal
        isOpen={isInterviewOpen}
        onClose={() => setIsInterviewOpen(false)}
        resume={resume}
      />

      <ResumeImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onResumeImport={setResume}
      />

      <LinkedInImportModal
        isOpen={isLinkedInImportOpen}
        onClose={() => setIsLinkedInImportOpen(false)}
        currentResume={resume}
        onResumeImport={setResume}
      />

      <ArchitectureModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />
    </div>
  );
}
