import React, { useState } from 'react';
import { X, Sparkles, Check, RefreshCw, ArrowRight, Zap, Target, Award } from 'lucide-react';

interface AiBulletModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBullet: string;
  position?: string;
  company?: string;
  onApplyBullet: (newBullet: string) => void;
}

export const AiBulletModal: React.FC<AiBulletModalProps> = ({
  isOpen,
  onClose,
  initialBullet,
  position,
  company,
  onApplyBullet,
}) => {
  const [bulletText, setBulletText] = useState(initialBullet);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    original: string;
    actionVerbUsed?: string;
    metricType?: string;
    variations: { type: string; text: string; explanation: string }[];
    suggestedKeywords?: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleEnhance = async () => {
    if (!bulletText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/enhance-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: bulletText,
          position,
          company,
        }),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Failed to enhance bullet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Bullet Point Enhancer</h2>
              <p className="text-xs text-slate-500">Transform weak statements into high-impact STAR metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Current Bullet Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Draft / Raw Bullet Statement:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={bulletText}
                onChange={(e) => setBulletText(e.target.value)}
                placeholder="e.g. Managed the team and built new features"
                className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
              />
              <button
                type="button"
                id="modal-enhance-bullet-btn"
                onClick={handleEnhance}
                disabled={isLoading || !bulletText.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>Enhance</span>
              </button>
            </div>
          </div>

          {/* Enhancement Results */}
          {results && results.variations && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  AI Enhanced Variations (STAR & XYZ Framework):
                </span>
                {results.actionVerbUsed && (
                  <span className="text-[11px] font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Power Verb: {results.actionVerbUsed}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {results.variations.map((v, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-300 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-600" />
                        {v.type}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onApplyBullet(v.text);
                          onClose();
                        }}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </button>
                    </div>

                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                      {v.text}
                    </p>

                    {v.explanation && (
                      <p className="text-[11px] text-slate-500 italic">
                        💡 {v.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {results.suggestedKeywords && results.suggestedKeywords.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-600 mr-2">
                    Industry Keywords:
                  </span>
                  <div className="inline-flex flex-wrap gap-1.5 mt-1">
                    {results.suggestedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono"
                      >
                        +{kw}
                      </span>
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
