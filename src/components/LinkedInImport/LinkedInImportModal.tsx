import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  FileText,
  Briefcase,
  GraduationCap,
  Cpu,
  Award,
  Globe,
  Layers,
  ChevronDown,
  ChevronUp,
  Copy,
  Info,
  Check,
  Zap,
  BookOpen
} from 'lucide-react';
import { ResumeData } from '../../types';
import { SAMPLE_LINKEDIN_PROFILES, SampleLinkedInProfile } from '../../data/sampleLinkedInProfiles';
import { parseLinkedInTextClient } from '../../utils/linkedinParser';
import { triggerConfetti } from '../../utils/exportUtils';

interface LinkedInImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (resume: ResumeData) => void;
  currentResume: ResumeData;
}

export const LinkedInImportModal: React.FC<LinkedInImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
  currentResume,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'samples' | 'guide'>('paste');
  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState<string>('');
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [showBulletsPreview, setShowBulletsPreview] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectSample = (sample: SampleLinkedInProfile) => {
    setSelectedSampleId(sample.id);
    setRawText(sample.rawText);
    setActiveTab('paste');
    setErrorMessage(null);
  };

  const handleParse = async () => {
    if (!rawText.trim()) {
      setErrorMessage('Please paste your LinkedIn profile text or select a sample profile.');
      return;
    }

    setIsParsing(true);
    setErrorMessage(null);
    setParsingStep('Analyzing LinkedIn profile structure & identity...');

    try {
      // Step simulation for realistic feedback
      setTimeout(() => {
        setParsingStep('Converting narrative experiences into ATS STAR action bullets...');
      }, 700);

      setTimeout(() => {
        setParsingStep('Categorizing technical competencies & ATS keyword density...');
      }, 1400);

      const response = await fetch('/api/gemini/parse-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedInText: rawText }),
      });

      if (!response.ok) {
        throw new Error('API server returned error, running fallback parser.');
      }

      const data = await response.json();

      if (data && data.personalInfo && data.personalInfo.fullName) {
        // Construct full ResumeData
        const completeResume: ResumeData = {
          id: `resume-linkedin-${Date.now()}`,
          title: `${data.personalInfo.fullName || 'LinkedIn'} ATS Resume`,
          updatedAt: new Date().toISOString(),
          personalInfo: {
            ...currentResume.personalInfo,
            ...data.personalInfo,
            showPhoto: currentResume.personalInfo?.showPhoto ?? false,
          },
          experiences: data.experiences && data.experiences.length > 0 ? data.experiences : currentResume.experiences,
          education: data.education && data.education.length > 0 ? data.education : currentResume.education,
          skills: data.skills && data.skills.length > 0 ? data.skills : currentResume.skills,
          projects: data.projects && data.projects.length > 0 ? data.projects : currentResume.projects,
          certifications: data.certifications && data.certifications.length > 0 ? data.certifications : currentResume.certifications,
          languages: data.languages && data.languages.length > 0 ? data.languages : currentResume.languages,
          settings: currentResume.settings || {
            template: 'ats-classic',
            fontFamily: 'Arial',
            fontSize: 'standard',
            accentColor: '#0A66C2',
            spacing: 'normal',
            showSeparators: true,
            sectionOrder: ['summary', 'experience', 'skills', 'education', 'projects', 'certifications', 'languages'],
          },
        };
        setParsedData(completeResume);
      } else {
        throw new Error('Invalid schema from AI, fallback parser activated.');
      }
    } catch (err: any) {
      console.warn('Using client-side fallback LinkedIn parser:', err);
      // Run reliable local regex/heuristic parser
      const fallbackResult = parseLinkedInTextClient(rawText);
      setParsedData(fallbackResult);
    } finally {
      setIsParsing(false);
      setParsingStep('');
    }
  };

  const handleApplyImport = () => {
    if (!parsedData) return;

    let finalResume: ResumeData;

    if (importMode === 'replace') {
      finalResume = {
        ...parsedData,
        id: `resume-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Merge mode: combine experiences, skills, education
      finalResume = {
        ...currentResume,
        personalInfo: {
          ...currentResume.personalInfo,
          ...parsedData.personalInfo,
          summary: parsedData.personalInfo.summary || currentResume.personalInfo.summary,
        },
        experiences: [...(parsedData.experiences || []), ...currentResume.experiences],
        education: parsedData.education?.length ? parsedData.education : currentResume.education,
        skills: parsedData.skills?.length ? parsedData.skills : currentResume.skills,
        certifications: [...(parsedData.certifications || []), ...currentResume.certifications],
        languages: parsedData.languages?.length ? parsedData.languages : currentResume.languages,
        updatedAt: new Date().toISOString(),
      };
    }

    onImportComplete(finalResume);
    triggerConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-[#0A66C2]/10 via-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center shadow-sm font-bold text-lg">
              in
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Import from LinkedIn
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0A66C2]/10 text-[#0A66C2]">
                  <Sparkles className="w-3 h-3" /> ATS Auto-Formatter
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Parse your online LinkedIn profile text and transform it into a 100% ATS-compliant resume
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        {!parsedData && (
          <div className="px-6 pt-3 flex border-b border-slate-200 gap-6 text-xs font-semibold bg-slate-50">
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`pb-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'paste'
                  ? 'border-[#0A66C2] text-[#0A66C2]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Profile Text</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('samples')}
              className={`pb-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'samples'
                  ? 'border-[#0A66C2] text-[#0A66C2]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Sample Profiles</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`pb-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'border-[#0A66C2] text-[#0A66C2]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>How to Export from LinkedIn</span>
            </button>
          </div>
        )}

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* STATE 1: Parsing In-Progress View */}
          {isParsing && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-[#0A66C2]/20 border-t-[#0A66C2] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center font-bold text-[#0A66C2] text-sm">
                  in
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Transforming LinkedIn Data</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md animate-pulse">
                  {parsingStep || 'Structuring work history and generating high-impact STAR action bullets...'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span>Removing LinkedIn conversational fluff & optimizing for ATS keywords</span>
              </div>
            </div>
          )}

          {/* STATE 2: Review & Confirm Parsed Data */}
          {!isParsing && parsedData && (
            <div className="space-y-5 animate-in fade-in">
              {/* Top Banner Alert */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <h4 className="font-bold text-emerald-900">
                    Successfully Parsed & Converted to ATS Format!
                  </h4>
                  <p className="text-emerald-700 mt-0.5">
                    We extracted candidate details, converted narrative paragraphs into quantifiable STAR action bullets, and structured skills into ATS-friendly categories.
                  </p>
                </div>
              </div>

              {/* Parsed Overview Summary Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {parsedData.personalInfo.fullName}
                    </h3>
                    <p className="text-xs text-[#0A66C2] font-semibold">
                      {parsedData.personalInfo.jobTitle}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500 space-y-0.5">
                    <div>{parsedData.personalInfo.email}</div>
                    <div>{parsedData.personalInfo.location}</div>
                  </div>
                </div>

                {/* Extracted Stats Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                    <div className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1">
                      <Briefcase className="w-3 h-3 text-[#0A66C2]" /> Experience
                    </div>
                    <div className="text-base font-extrabold text-slate-800 mt-0.5">
                      {parsedData.experiences.length} Roles
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                    <div className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1">
                      <Cpu className="w-3 h-3 text-indigo-600" /> Skills
                    </div>
                    <div className="text-base font-extrabold text-slate-800 mt-0.5">
                      {parsedData.skills.reduce((acc, cat) => acc + cat.skills.length, 0)} Total
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                    <div className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1">
                      <GraduationCap className="w-3 h-3 text-teal-600" /> Education
                    </div>
                    <div className="text-base font-extrabold text-slate-800 mt-0.5">
                      {parsedData.education.length} Entries
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                    <div className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1">
                      <Award className="w-3 h-3 text-amber-600" /> Certs & Lang
                    </div>
                    <div className="text-base font-extrabold text-slate-800 mt-0.5">
                      {(parsedData.certifications?.length || 0) + (parsedData.languages?.length || 0)} Items
                    </div>
                  </div>
                </div>

                {/* Professional Summary Preview */}
                {parsedData.personalInfo.summary && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">
                      ATS Optimized Professional Summary:
                    </span>
                    <p className="text-slate-600 leading-relaxed italic">
                      "{parsedData.personalInfo.summary}"
                    </p>
                  </div>
                )}

                {/* Expandable Bullet Points Preview */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowBulletsPreview(!showBulletsPreview)}
                    className="text-xs font-bold text-[#0A66C2] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>
                      {showBulletsPreview ? 'Hide Experience Bullets Preview' : 'Show Converted STAR Bullets Preview'}
                    </span>
                    {showBulletsPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showBulletsPreview && (
                    <div className="mt-2 space-y-2 max-h-56 overflow-y-auto pr-1">
                      {parsedData.experiences.map((exp, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{exp.position} — <span className="text-[#0A66C2]">{exp.company}</span></span>
                            <span className="text-[11px] font-normal text-slate-500 font-mono">
                              {exp.startDate} - {exp.endDate}
                            </span>
                          </div>
                          <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                            {exp.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Import Mode Options */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Select Import Action:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                      importMode === 'replace'
                        ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Replace Entire Resume (Recommended)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Overwrites current resume with fresh, clean LinkedIn ATS data.
                      </div>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                      importMode === 'merge'
                        ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Merge & Append
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Combines LinkedIn roles and skills with your existing entries.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: Tab 1 - Paste Text */}
          {!isParsing && !parsedData && activeTab === 'paste' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Paste your LinkedIn profile text below (from direct page copy or LinkedIn "Save to PDF" export):
                </p>
                <button
                  type="button"
                  onClick={() => setRawText('')}
                  className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Clear Text
                </button>
              </div>

              <textarea
                rows={10}
                placeholder="Example:
Alex Rivera
Lead Full Stack Engineer at TechCorp
San Francisco, California
Contact: alex@example.com, linkedin.com/in/alexrivera

Experience:
TechCorp
Senior Software Engineer
2021 - Present
• Led development of scalable microservices in Node and Go...
"
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full p-3.5 text-xs rounded-xl border border-slate-300 bg-white font-mono leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent placeholder:text-slate-400"
              />

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Quick Sample Selector helper row */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Don't have your LinkedIn open? Try a pre-loaded profile:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_LINKEDIN_PROFILES.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded border transition-colors ${
                        selectedSampleId === sample.id
                          ? 'bg-[#0A66C2] text-white border-[#0A66C2]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {sample.badge}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: Tab 2 - Samples Gallery */}
          {!isParsing && !parsedData && activeTab === 'samples' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Select an authentic LinkedIn profile sample to test the AI parser and ATS converter instantly:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {SAMPLE_LINKEDIN_PROFILES.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#0A66C2] hover:bg-blue-50/40 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-[#0A66C2]">
                          {sample.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#0A66C2]">
                          {sample.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {sample.rawText.slice(0, 140)}...
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#0A66C2] opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                      Load & Parse ➔
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STATE 3: Tab 3 - How-To Guide */}
          {!isParsing && !parsedData && activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Method 1: Direct Copy & Paste (Fastest)
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
                  <li>Open your LinkedIn profile in your browser (e.g. <code className="bg-slate-200 px-1 py-0.5 rounded">linkedin.com/in/yourname</code>).</li>
                  <li>Press <kbd className="bg-white border border-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px]">Ctrl + A</kbd> (or <kbd className="bg-white border border-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px]">Cmd + A</kbd>) to select your profile text, or highlight your About, Experience, and Education sections.</li>
                  <li>Copy (<kbd className="bg-white border border-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px]">Ctrl + C</kbd>) and paste into the text box.</li>
                  <li>Our parser automatically removes web elements, connection icons, and conversational noise!</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Method 2: LinkedIn "Save to PDF" Export (Cleanest)
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
                  <li>Go to your profile on LinkedIn.</li>
                  <li>Click the <strong>"More"</strong> button next to "Open to" and "Add profile section".</li>
                  <li>Select <strong>"Save to PDF"</strong>.</li>
                  <li>Open the downloaded PDF, select all text (<kbd className="bg-white border border-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px]">Ctrl + A</kbd>), and paste it here.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            {parsedData && (
              <button
                type="button"
                onClick={() => {
                  setParsedData(null);
                  setActiveTab('paste');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                <span>Back to Raw Input</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition-colors"
            >
              Cancel
            </button>

            {!parsedData ? (
              <button
                type="button"
                onClick={handleParse}
                disabled={isParsing || !rawText.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold shadow-xs flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isParsing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Parsing LinkedIn...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Parse & Convert to ATS</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyImport}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Apply to Resume</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
