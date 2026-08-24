import React, { useState } from 'react';
import { X, Briefcase, Sparkles, Check, ArrowRight, RefreshCw, AlertCircle, CheckCircle2, Wand2 } from 'lucide-react';
import { ResumeData } from '../../types';

interface JobTailorModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  onApplyTailoring: (tailoredResume: Partial<ResumeData>) => void;
}

export const JobTailorModal: React.FC<JobTailorModalProps> = ({
  isOpen,
  onClose,
  resume,
  onApplyTailoring,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [targetCompany, setTargetCompany] = useState(resume.targetCompany || '');
  const [targetRole, setTargetRole] = useState(resume.targetRole || '');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    matchPercentage: number;
    jobTitleIdentified?: string;
    matchedKeywords: { keyword: string; count: number; category: string }[];
    missingKeywords: { keyword: string; importance: 'high' | 'medium' | 'low'; category: string }[];
    tailoredSummary?: string;
    bulletImprovements?: {
      original: string;
      tailored: string;
      keywordIntegrated: string;
      reason: string;
    }[];
    topAdvice?: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/tailor-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          jobDescription,
          targetCompany,
          targetRole,
        }),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Tailoring error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAllChanges = () => {
    if (!results) return;
    const partial: Partial<ResumeData> = {};

    if (results.tailoredSummary) {
      partial.personalInfo = {
        ...resume.personalInfo,
        summary: results.tailoredSummary,
      };
    }

    if (results.bulletImprovements && results.bulletImprovements.length > 0) {
      const updatedExperiences = resume.experiences.map((exp) => {
        const newBullets = exp.bullets.map((b) => {
          const match = results.bulletImprovements?.find((bi) => bi.original === b || b.includes(bi.original.slice(0, 30)));
          return match ? match.tailored : b;
        });
        return { ...exp, bullets: newBullets };
      });
      partial.experiences = updatedExperiences;
    }

    onApplyTailoring(partial);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Tailor Resume to Job Description</h2>
              <p className="text-xs text-slate-500">Extract exact ATS keywords & optimize resume content per job listing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Inputs */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Company (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google, Stripe, UnitedHealth"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Role Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Staff Full Stack Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Paste Target Job Description / Posting:
              </label>
              <textarea
                rows={5}
                placeholder="Paste the full job posting requirements, responsibilities, and qualifications here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white leading-relaxed"
              />
            </div>

            <button
              type="button"
              id="analyze-job-desc-btn"
              onClick={handleAnalyze}
              disabled={isLoading || !jobDescription.trim()}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isLoading ? 'Scanning Job Description with AI...' : 'Scan & Extract ATS Keywords'}</span>
            </button>
          </div>

          {/* Tailoring Results */}
          {results && (
            <div className="space-y-6 pt-4 border-t border-slate-200 animate-in fade-in">
              {/* Match Score Bar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">Target Job ATS Match</span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {results.matchPercentage}% Keyword Alignment
                  </div>
                </div>
                <div className="w-32 sm:w-48">
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        results.matchPercentage >= 75
                          ? 'bg-emerald-500'
                          : results.matchPercentage >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${results.matchPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Keywords Matched vs Missing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Matched */}
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Matched Keywords ({results.matchedKeywords?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {results.matchedKeywords?.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium"
                      >
                        ✓ {kw.keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                  <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    Missing Key Terms ({results.missingKeywords?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {results.missingKeywords?.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-medium"
                      >
                        + {kw.keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tailored Summary */}
              {results.tailoredSummary && (
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                      Suggested Tailored Summary
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-indigo-100">
                    {results.tailoredSummary}
                  </p>
                </div>
              )}

              {/* Bullet Improvements */}
              {results.bulletImprovements && results.bulletImprovements.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Targeted Bullet Enhancements:
                  </span>
                  <div className="space-y-2.5">
                    {results.bulletImprovements.map((bi, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2"
                      >
                        <div className="text-[11px] text-slate-400 line-through">
                          {bi.original}
                        </div>
                        <div className="text-xs font-semibold text-emerald-800 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                          {bi.tailored}
                        </div>
                        <div className="text-[10px] text-indigo-700">
                          ★ Integrated target keyword: <strong>{bi.keywordIntegrated}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
          >
            Cancel
          </button>
          {results && (
            <button
              type="button"
              id="apply-tailored-changes-btn"
              onClick={handleApplyAllChanges}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Tailored Content</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
