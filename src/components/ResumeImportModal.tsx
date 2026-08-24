import React, { useState } from 'react';
import { X, UploadCloud, FileText, Sparkles, RefreshCw, Check, ArrowRight } from 'lucide-react';
import { ResumeData } from '../types';
import { SAMPLE_RESUMES } from '../data/sampleResumes';

interface ResumeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadResume: (resume: ResumeData) => void;
  onOpenLinkedInImport?: () => void;
}

export const ResumeImportModal: React.FC<ResumeImportModalProps> = ({
  isOpen,
  onClose,
  onLoadResume,
  onOpenLinkedInImport,
}) => {
  const [tab, setTab] = useState<'linkedin' | 'samples' | 'paste' | 'json'>('linkedin');
  const [rawText, setRawText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  if (!isOpen) return null;

  const handleParseText = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    try {
      const res = await fetch('/api/gemini/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText }),
      });
      const data = await res.json();
      if (data.personalInfo) {
        onLoadResume(data as ResumeData);
        onClose();
      }
    } catch (err) {
      console.error('Error parsing resume:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleLoadJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onLoadResume(parsed);
      onClose();
    } catch (err) {
      alert('Invalid JSON structure. Please check and try again.');
    }
  };

  const sampleList = [
    { key: 'software-lead', title: 'Senior Software Engineer / Lead', desc: '5+ yrs, React/Node/AWS, high impact metrics' },
    { key: 'product-manager', title: 'Senior Technical Product Manager', desc: 'SaaS metrics, roadmap, $2.4M ARR growth' },
    { key: 'data-scientist', title: 'Data Scientist / ML Engineer', desc: 'PyTorch, NLP, 99.4% accuracy fraud detection' },
    { key: 'marketing-manager', title: 'Growth Marketing Manager', desc: 'B2B SaaS, 45% CAC reduction, organic SEO' },
    { key: 'fresh-grad', title: 'Computer Science Graduate (Entry)', desc: 'Education & project focused, hackathons' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Load or Import Resume</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="px-6 pt-3 flex border-b border-slate-200 gap-4 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setTab('linkedin')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              tab === 'linkedin'
                ? 'border-[#0A66C2] text-[#0A66C2] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-4 h-4 rounded bg-[#0A66C2] text-white flex items-center justify-center text-[10px] font-bold">in</span>
            <span>Import from LinkedIn</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('samples')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer shrink-0 ${
              tab === 'samples'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Industry Samples
          </button>
          <button
            type="button"
            onClick={() => setTab('paste')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer shrink-0 ${
              tab === 'paste'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Paste Text (AI Parser)
          </button>
          <button
            type="button"
            onClick={() => setTab('json')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer shrink-0 ${
              tab === 'json'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Import JSON
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {tab === 'linkedin' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0A66C2]/10 via-blue-50 to-indigo-50 border border-[#0A66C2]/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    in
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      LinkedIn Profile to ATS Resume Converter
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Extract experiences, skills, education, and bio from your LinkedIn profile and auto-format into an ATS-optimized layout.
                    </p>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-blue-200/60 space-y-2 text-xs text-slate-700">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#0A66C2]" />
                    <span>How it optimizes your LinkedIn data:</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 pl-4 list-disc text-[11px]">
                    <li>Converts casual first-person paragraphs into strong STAR action verbs</li>
                    <li>Categorizes hard skills, frameworks, and domain expertise</li>
                    <li>Generates recruiter-friendly, high-scoring ATS summary</li>
                    <li>Standardizes date ranges and eliminates online profile clutter</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenLinkedInImport) onOpenLinkedInImport();
                  }}
                  className="w-full py-3 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Open LinkedIn Importer Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {tab === 'samples' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Choose an ATS-optimized industry template pre-filled with high-scoring content:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {sampleList.map((item) => (
                  <div
                    key={item.key}
                    onClick={() => {
                      const sample = SAMPLE_RESUMES[item.key];
                      if (sample) {
                        onLoadResume(sample);
                        onClose();
                      }
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Load Sample ➔
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'paste' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Paste your existing raw resume text. Gemini AI will parse, structure, and categorize it into the ATS data model automatically:
              </p>
              <textarea
                rows={8}
                placeholder="Paste your plain text resume here..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-white"
              />
              <button
                type="button"
                onClick={handleParseText}
                disabled={isParsing || !rawText.trim()}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isParsing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isParsing ? 'Parsing with Gemini AI...' : 'Parse & Populate Resume'}</span>
              </button>
            </div>
          )}

          {tab === 'json' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Paste your exported Resume JSON format below to restore full state:
              </p>
              <textarea
                rows={8}
                placeholder="{ personalInfo: { ... } }"
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full p-3 text-xs font-mono rounded-xl border border-slate-300 bg-white"
              />
              <button
                type="button"
                onClick={handleLoadJson}
                disabled={!jsonText.trim()}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                Import JSON Resume
              </button>
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
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

