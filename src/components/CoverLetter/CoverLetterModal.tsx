import React, { useState } from 'react';
import { X, FileText, Sparkles, Copy, Check, Download, RefreshCw, Printer } from 'lucide-react';
import { ResumeData, CoverLetterData } from '../../types';

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
}

export const CoverLetterModal: React.FC<CoverLetterModalProps> = ({ isOpen, onClose, resume }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState(resume.targetCompany || 'Target Employer');
  const [recipientName, setRecipientName] = useState('Hiring Manager');
  const [tone, setTone] = useState('Professional & Impactful');
  const [isLoading, setIsLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState<CoverLetterData | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          jobDescription,
          companyName,
          recipientName,
          tone,
        }),
      });
      const data = await res.json();
      setCoverLetter(data);
    } catch (err) {
      console.error('Error generating cover letter:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetter) return;
    const text = [
      `Date: ${new Date().toLocaleDateString()}`,
      `To: ${coverLetter.recipientName}, ${coverLetter.recipientTitle}`,
      `Company: ${coverLetter.companyName}`,
      '',
      `Dear ${coverLetter.recipientName || 'Hiring Team'},`,
      '',
      ...coverLetter.bodyParagraphs,
      '',
      `${coverLetter.closing || 'Sincerely'},`,
      resume.personalInfo.fullName,
      resume.personalInfo.email,
      resume.personalInfo.phone,
    ].join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Tailored Cover Letter Generator</h2>
              <p className="text-xs text-slate-500">Auto-align candidate achievements with company requirements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recipient Name / Title
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Hiring Manager"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Writing Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white"
              >
                <option value="Professional & Results-Driven">Professional & Results-Driven</option>
                <option value="Executive & Visionary">Executive & Visionary</option>
                <option value="Passionate & Enthusiastic">Passionate & Enthusiastic</option>
                <option value="Technical & Analytical">Technical & Analytical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Job Posting (Optional, helps tailor context)
            </label>
            <textarea
              rows={3}
              placeholder="Paste job posting details..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isLoading ? 'Generating Tailored Letter...' : 'Generate Matching Cover Letter'}</span>
          </button>

          {/* Rendered Letter */}
          {coverLetter && (
            <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Generated Letter:
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
                </button>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm leading-relaxed text-slate-800 space-y-3 font-sans shadow-xs">
                <div className="text-slate-500 text-xs mb-3">
                  Dear {coverLetter.recipientName || 'Hiring Team'},
                </div>
                {coverLetter.bodyParagraphs?.map((para, i) => (
                  <p key={i} className="text-justify leading-relaxed">
                    {para}
                  </p>
                ))}
                <div className="pt-2 text-slate-700">
                  <div>{coverLetter.closing || 'Sincerely'},</div>
                  <div className="font-bold text-slate-900 mt-1">{resume.personalInfo.fullName}</div>
                  <div className="text-xs text-slate-500">{resume.personalInfo.email} | {resume.personalInfo.phone}</div>
                </div>
              </div>
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
