import React, { useState } from 'react';
import { X, Search, Sparkles, Globe, DollarSign, Award, Check, RefreshCw, ExternalLink, TrendingUp } from 'lucide-react';
import { GroundedJobInsight, ResumeData } from '../../types';

interface MarketSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  onAddKeywordsToResume: (keywords: string[]) => void;
}

export const MarketSearchModal: React.FC<MarketSearchModalProps> = ({
  isOpen,
  onClose,
  resume,
  onAddKeywordsToResume,
}) => {
  const [roleInput, setRoleInput] = useState(resume.targetRole || resume.personalInfo.jobTitle || 'Senior Full Stack Engineer');
  const [industryInput, setIndustryInput] = useState('Technology & SaaS');
  const [locationInput, setLocationInput] = useState(resume.personalInfo.location || 'United States / Remote');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<GroundedJobInsight | null>(null);

  if (!isOpen) return null;

  const handleSearchMarket = async () => {
    if (!roleInput.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/grounded-market-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: roleInput,
          industry: industryInput,
          location: locationInput,
        }),
      });
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      console.error('Failed to search market insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAllKeywords = () => {
    if (!insights || !insights.inDemandKeywords) return;
    onAddKeywordsToResume(insights.inDemandKeywords);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-emerald-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Live Google Search Industry Trends</h2>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase">
                  Search Grounded
                </span>
              </div>
              <p className="text-xs text-slate-500">Live 2025/2026 hiring demands, salary benchmarks & recruiter keywords</p>
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
          {/* Query Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="e.g. AI Prompt Engineer, React Dev"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Industry
              </label>
              <input
                type="text"
                value={industryInput}
                onChange={(e) => setIndustryInput(e.target.value)}
                placeholder="e.g. Fintech, Healthcare, Cloud"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="e.g. Remote, San Francisco, London"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          <button
            type="button"
            id="run-grounded-search-btn"
            onClick={handleSearchMarket}
            disabled={isLoading || !roleInput.trim()}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isLoading ? 'Searching Live Google Market Data...' : 'Fetch Live Market In-Demand Keywords'}</span>
          </button>

          {/* Results Display */}
          {insights && (
            <div className="space-y-5 pt-4 border-t border-slate-200 animate-in fade-in">
              {/* Trends Summary & Salary */}
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/60 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Market Landscape for {insights.role}
                  </span>
                  {insights.averageSalaryRange && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      {insights.averageSalaryRange}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-blue-100">
                  {insights.hiringTrendsSummary}
                </p>
              </div>

              {/* In Demand Keywords */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    High-Ranking ATS Keywords (2025/2026):
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyAllKeywords}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Add All to Resume
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {insights.inDemandKeywords?.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-800 border border-slate-200 text-xs font-medium text-slate-800 transition-colors"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hard & Soft Skills Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-800">Must-Have Hard Skills</span>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {insights.keyHardSkills?.map((s, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-800">Valued Soft Competencies</span>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {insights.keySoftSkills?.map((s, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Web Sources Grounding */}
              {insights.sources && insights.sources.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Google Search Reference Sources:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {insights.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
                      >
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span className="max-w-[200px] truncate">{src.title}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
