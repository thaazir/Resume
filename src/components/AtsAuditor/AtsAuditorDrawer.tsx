import React, { useState, useMemo } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Zap,
  RefreshCw,
  Wand2
} from 'lucide-react';
import { AtsAuditResult, AtsPillarScore, ResumeData } from '../../types';
import { calculateAtsScore } from '../../utils/atsEngine';

interface AtsAuditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  localAudit?: AtsAuditResult;
  resume: ResumeData;
  onResumeUpdate: (resume: ResumeData) => void;
}

export const AtsAuditorDrawer: React.FC<AtsAuditorDrawerProps> = ({
  isOpen,
  onClose,
  localAudit,
  resume,
  onResumeUpdate,
}) => {
  const [deepAudit, setDeepAudit] = useState<AtsAuditResult | null>(null);
  const [isDeepAuditing, setIsDeepAuditing] = useState(false);

  const fallbackAudit = useMemo(() => calculateAtsScore(resume), [resume]);

  if (!isOpen) return null;

  const currentAudit = deepAudit || localAudit || fallbackAudit;

  const handleRunDeepAudit = async () => {
    setIsDeepAuditing(true);
    try {
      const res = await fetch('/api/gemini/ats-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume }),
      });
      const data = await res.json();
      if (data.overallScore) {
        setDeepAudit(data);
      }
    } catch (err) {
      console.error('Deep ATS audit error:', err);
    } finally {
      setIsDeepAuditing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">ATS Compatibility Scorecard</h2>
              <p className="text-xs text-slate-500">Applicant Tracking System Parsing & Quality Matrix</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Score Hero Card */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Overall ATS Compatibility
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {currentAudit.overallScore}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ 100</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getScoreColor(
                      currentAudit.overallScore
                    )}`}
                  >
                    Grade {currentAudit.grade}
                  </span>
                </div>
              </div>

              <button
                type="button"
                id="run-deep-ats-audit-btn"
                onClick={handleRunDeepAudit}
                disabled={isDeepAuditing}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isDeepAuditing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{deepAudit ? 'Re-Audit with AI' : 'Run Deep AI Audit'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
              {currentAudit.summary}
            </p>
          </div>

          {/* 4 Pillars Breakdown */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              4-Pillar ATS Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.entries(currentAudit.pillars) as [string, AtsPillarScore][]).map(([key, pillar]) => (
                <div key={key} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{pillar.name}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        pillar.score >= 80
                          ? 'bg-emerald-50 text-emerald-700'
                          : pillar.score >= 60
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {pillar.score}%
                    </span>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pillar.score >= 80 ? 'bg-emerald-500' : pillar.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pillar.score}%` }}
                    />
                  </div>

                  <ul className="text-[11px] text-slate-500 space-y-1 pt-1">
                    {pillar.details?.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-tight">
                        <span className="text-slate-400">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Auto-Fixes */}
          {currentAudit.suggestedFixes && currentAudit.suggestedFixes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-blue-600" />
                <span>Recommended Optimizations</span>
              </h3>
              <div className="space-y-2.5">
                {currentAudit.suggestedFixes.map((fix) => (
                  <div
                    key={fix.id}
                    className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900">{fix.title}</span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {fix.section}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{fix.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Passed Checks */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Passed ATS Verification Checks ({currentAudit.passedChecks.length})
            </h3>
            <div className="space-y-1.5">
              {currentAudit.passedChecks.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/70 px-3 py-1.5 rounded-lg border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings / Issues */}
          {currentAudit.warnings.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Potential Warnings ({currentAudit.warnings.length})
              </h3>
              <div className="space-y-1.5">
                {currentAudit.warnings.map((w, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50/70 px-3 py-1.5 rounded-lg border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
          >
            Close Scorecard
          </button>
        </div>
      </div>
    </div>
  );
};
