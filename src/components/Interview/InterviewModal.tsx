import React, { useState } from 'react';
import { X, HelpCircle, Sparkles, RefreshCw, CheckCircle, Lightbulb, ChevronRight } from 'lucide-react';
import { ResumeData, InterviewQuestion } from '../../types';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({ isOpen, onClose, resume }) => {
  const [targetRole, setTargetRole] = useState(resume.targetRole || resume.personalInfo.jobTitle || '');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePredict = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/predict-interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          targetRole,
          jobDescription,
        }),
      });
      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
        if (data.questions.length > 0) {
          setExpandedId(data.questions[0].id);
        }
      }
    } catch (err) {
      console.error('Error predicting questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Interview Question Predictor</h2>
              <p className="text-xs text-slate-500">Predicted recruiter & hiring manager questions grounded on your resume</p>
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
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interview Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Context / Posting (Optional)
              </label>
              <input
                type="text"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste keywords or job snippet..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handlePredict}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isLoading ? 'Analyzing Resume & Predicting Questions...' : 'Predict 5 Key Interview Questions'}</span>
          </button>

          {/* Questions Accordion */}
          {questions.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-200 animate-in fade-in">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Predicted Questions & STAR Coaching:
              </span>
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const isExpanded = expandedId === q.id || (expandedId === null && idx === 0);
                  return (
                    <div
                      key={q.id || idx}
                      className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : q.id)}
                        className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                              {q.category}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              Question #{idx + 1}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800">{q.question}</p>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-slate-400 mt-1 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="p-4 pt-0 border-t border-slate-100 bg-amber-50/30 space-y-3 text-xs">
                          <div className="p-3 bg-white rounded-lg border border-amber-100 text-slate-700">
                            <strong className="text-amber-900 block mb-0.5">🎯 Why Interviewers Ask This:</strong>
                            {q.whyAsked}
                          </div>

                          <div className="p-3 bg-white rounded-lg border border-amber-100 text-slate-700">
                            <strong className="text-blue-900 block mb-0.5 flex items-center gap-1">
                              <Lightbulb className="w-3.5 h-3.5 text-blue-600" /> STAR Answering Framework:
                            </strong>
                            {q.starTip}
                          </div>

                          {q.sampleAnswerFramework && (
                            <div className="p-3 bg-white rounded-lg border border-emerald-100 text-slate-700">
                              <strong className="text-emerald-900 block mb-0.5">💡 Key Proof Points to Mention:</strong>
                              <p className="italic">{q.sampleAnswerFramework}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
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
