import React, { useState } from 'react';
import { Sparkles, Mic, MicOff, Check, RefreshCw, Wand2 } from 'lucide-react';
import { PersonalInfo, ResumeData } from '../../types';
import { useSpeechToText } from '../../utils/useSpeechToText';

interface SummaryFormProps {
  personalInfo: PersonalInfo;
  resume: ResumeData;
  onChange: (summary: string) => void;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({ personalInfo, resume, onChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<{ title: string; summary: string }[]>([]);
  const [selectedTone, setSelectedTone] = useState<'Impact & Results' | 'Executive' | 'Technical' | 'Career Pivot'>('Impact & Results');

  const { isListening, toggleListening, isSupported } = useSpeechToText((text) => {
    onChange((personalInfo.summary ? personalInfo.summary + ' ' : '') + text);
  });

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfo,
          experiences: resume.experiences,
          skills: resume.skills,
          targetRole: resume.targetRole || personalInfo.jobTitle,
          tone: selectedTone,
        }),
      });
      const data = await res.json();
      if (data.options && Array.isArray(data.options)) {
        setGeneratedOptions(data.options);
      }
    } catch (err) {
      console.error('Failed to generate summary:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const wordCount = personalInfo.summary ? personalInfo.summary.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Professional Summary / Career Objective
          </label>
          <span className="text-[11px] text-slate-500">
            Recommended: 40–90 words with high-impact keywords and metrics.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isSupported && (
            <button
              type="button"
              id="summary-mic-btn"
              onClick={toggleListening}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                isListening
                  ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
              title={isListening ? 'Stop recording voice' : 'Dictate with Voice-to-Text'}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
            </button>
          )}

          <button
            type="button"
            id="ai-generate-summary-btn"
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>AI Generate Summary</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          id="textarea-summary"
          rows={4}
          placeholder="e.g. Results-oriented Software Engineer with 5+ years of experience designing scalable microservices. Proven track record driving 30% latency reductions and scaling systems to 10M+ users. Proficient in React, Node.js, and AWS."
          value={personalInfo.summary || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white leading-relaxed"
        />
        <div className="flex justify-between items-center text-[11px] text-slate-500 px-1 mt-1">
          <div className="flex items-center gap-2">
            <span>Word count: <strong className={wordCount > 100 ? 'text-amber-600' : 'text-slate-700'}>{wordCount}</strong></span>
            {wordCount >= 30 && wordCount <= 90 && (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> Optimal ATS Length
              </span>
            )}
          </div>
          <span className="text-slate-400">Avoid 1st person pronouns ("I", "my") for higher ATS score</span>
        </div>
      </div>

      {/* AI Generated Options Showcase */}
      {generatedOptions.length > 0 && (
        <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <Wand2 className="w-4 h-4 text-blue-600" />
              <span>AI Tailored Summary Variations</span>
            </div>
            <span className="text-[11px] text-blue-600 font-medium">Click to apply to resume</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {generatedOptions.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => onChange(opt.summary)}
                className="p-3 bg-white hover:bg-blue-50/50 border border-blue-100 hover:border-blue-300 rounded-lg text-xs text-slate-800 cursor-pointer transition-all shadow-xs group"
              >
                <div className="font-semibold text-blue-800 mb-1 flex items-center justify-between">
                  <span>{opt.title}</span>
                  <span className="text-[10px] text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    Apply ➔
                  </span>
                </div>
                <p className="leading-relaxed text-slate-700">{opt.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
