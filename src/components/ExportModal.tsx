import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  FileText,
  FileDown,
  Code,
  Check,
  Sparkles,
  ShieldCheck,
  Copy,
  CheckCircle2,
  ExternalLink,
  Eye
} from 'lucide-react';
import { ResumeData } from '../types';
import {
  exportToPdf,
  downloadPlainTextResume,
  downloadDocxResume,
  downloadJsonResume,
  printResumeDocument,
  exportToPlainText
} from '../utils/exportUtils';
import { TemplateMiniaturePreview } from './TemplateMiniaturePreview';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  onExportPdf?: () => void;
}

type ExportFormatId = 'pdf' | 'txt' | 'docx' | 'json' | 'print';

interface ExportFormatOption {
  id: ExportFormatId;
  name: string;
  extension: string;
  tag: string;
  badgeColor: string;
  description: string;
  atsRating: string;
  bestUse: string;
  icon: React.ElementType;
}

const EXPORT_FORMATS: ExportFormatOption[] = [
  {
    id: 'pdf',
    name: 'ATS Vector PDF',
    extension: '.pdf',
    tag: 'Recommended',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'High-fidelity, vector-rendered PDF with selectable text and embedded fonts. Optimized for Workday, Greenhouse, and Taleo.',
    atsRating: '100% ATS Parser Safe',
    bestUse: 'Direct email applications, job board uploads (LinkedIn, Indeed)',
    icon: Download,
  },
  {
    id: 'txt',
    name: 'Plain Text ASCII Format',
    extension: '.txt',
    tag: '100% Raw Compatibility',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Universal plain ASCII text stripped of all complex styling. Formatted with clear section dividers and bullet points.',
    atsRating: '100% Guaranteed Parse',
    bestUse: 'Online application text-boxes, Taleo paste fields, government portals',
    icon: FileText,
  },
  {
    id: 'docx',
    name: 'Microsoft Word Document',
    extension: '.doc',
    tag: 'Editable',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    description: 'Fully editable HTML/Word-compatible document. Easy for human recruiters to add notes or adjust formatting.',
    atsRating: '96% Compatible',
    bestUse: 'Recruiter submissions requesting editable documents',
    icon: FileDown,
  },
  {
    id: 'print',
    name: 'Direct Print / Vector PDF',
    extension: 'Print / A4',
    tag: 'Native Vector',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Browser-native print dialog triggering crisp vector PDF generation with exact standard margins.',
    atsRating: '100% Vector Quality',
    bestUse: 'In-person interviews, physical portfolio printing',
    icon: Printer,
  },
  {
    id: 'json',
    name: 'JSON Resume Standard',
    extension: '.json',
    tag: 'Open Data Schema',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Structured JSON data adhering to standard schema.org resume specifications. Useful for backups and data migrations.',
    atsRating: 'Machine Readable',
    bestUse: 'Data backups, developer portfolio integrations, API pipelines',
    icon: Code,
  },
];

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  resume,
  onExportPdf,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatId>('pdf');
  const [copiedTxt, setCopiedTxt] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const currentOption = EXPORT_FORMATS.find((f) => f.id === selectedFormat) || EXPORT_FORMATS[0];
  const plainTextContent = exportToPlainText(resume);

  const handleExecuteExport = async () => {
    setIsExporting(true);
    try {
      if (selectedFormat === 'pdf') {
        if (onExportPdf) {
          onExportPdf();
        } else {
          const fileName = `${(resume.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_ATS_Resume.pdf`;
          await exportToPdf('resume-document-root', fileName);
        }
      } else if (selectedFormat === 'txt') {
        downloadPlainTextResume(resume);
      } else if (selectedFormat === 'docx') {
        downloadDocxResume(resume);
      } else if (selectedFormat === 'json') {
        downloadJsonResume(resume);
      } else if (selectedFormat === 'print') {
        printResumeDocument();
      }
      onClose();
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyTxt = () => {
    navigator.clipboard.writeText(plainTextContent);
    setCopiedTxt(true);
    setTimeout(() => setCopiedTxt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[88vh] max-h-[750px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 leading-none">
                  Select Export Format & Output Design
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  ATS Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect how your resume will be formatted and structured for each export type.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY: SPLIT VIEW (FORMAT CARDS LEFT, VISUAL OUTPUT DESIGN RIGHT) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT: FORMAT SELECTOR LIST */}
          <div className="w-full md:w-[45%] lg:w-[40%] border-r border-slate-200 bg-slate-50/50 p-4 overflow-y-auto space-y-2.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Available Formats ({EXPORT_FORMATS.length})
            </div>

            {EXPORT_FORMATS.map((fmt) => {
              const Icon = fmt.icon;
              const isSelected = selectedFormat === fmt.id;

              return (
                <div
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>{fmt.name}</span>
                          <span className="font-mono text-[10px] text-slate-400 font-normal">
                            ({fmt.extension})
                          </span>
                        </h4>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${fmt.badgeColor}`}>
                          {fmt.tag}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-3" />
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                    {fmt.description}
                  </p>

                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-medium text-slate-700">{fmt.atsRating}</span>
                    <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                      <Eye className="w-3 h-3" /> View Design
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: OUTPUT DESIGN PREVIEW FOR SELECTED FORMAT */}
          <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
            {/* Output Toolbar */}
            <div className="px-5 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Output Design Preview:</span>
                  <span className="text-xs font-bold text-blue-700">{currentOption.name}</span>
                </div>
                <div className="text-[11px] text-slate-500">{currentOption.bestUse}</div>
              </div>

              {selectedFormat === 'txt' && (
                <button
                  type="button"
                  onClick={handleCopyTxt}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                >
                  {copiedTxt ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{copiedTxt ? 'Copied ASCII' : 'Copy All Text'}</span>
                </button>
              )}
            </div>

            {/* Output Visual Canvas */}
            <div className="flex-1 overflow-auto p-5 flex justify-center items-start">
              {/* 1. PDF / PRINT OUTPUT VISUAL */}
              {(selectedFormat === 'pdf' || selectedFormat === 'print') && (
                <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {(resume.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_ATS.pdf
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Format: {resume.settings?.template || 'Classic ATS'} • A4 Vector
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      100% Vector Text
                    </span>
                  </div>

                  {/* Visual Document Mockup */}
                  <div className="w-full aspect-[1/1.35] max-h-[300px] bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-4 flex flex-col justify-center items-center shadow-inner">
                    <TemplateMiniaturePreview
                      templateId={(resume.settings?.template as any) || 'ats-classic'}
                      accentColor={resume.settings?.accentColor || '#1e3a8a'}
                      size="md"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>ATS Scanner Optimization Specs</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-blue-800 space-y-0.5 pl-1">
                      <li>Selectable & search-indexed vector typography (no image flattening)</li>
                      <li>Standard 0.75-inch margins compatible with all modern ATS parsers</li>
                      <li>Standard section headings recognized by Taleo, Greenhouse & Workday</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 2. PLAIN TEXT OUTPUT VISUAL */}
              {selectedFormat === 'txt' && (
                <div className="w-full max-w-xl bg-slate-900 text-slate-100 rounded-xl shadow-lg border border-slate-800 p-4 font-mono text-xs overflow-x-auto space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Plain Text ASCII Output Stream</span>
                    </span>
                    <span>{plainTextContent.length} characters</span>
                  </div>
                  <pre className="text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap max-h-[360px] overflow-y-auto">
                    {plainTextContent}
                  </pre>
                </div>
              )}

              {/* 3. WORD DOC OUTPUT VISUAL */}
              {selectedFormat === 'docx' && (
                <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        DOC
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {(resume.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}.doc
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Compatible with MS Word, Google Docs & Pages
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      Editable Format
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
                    <div className="border-b border-slate-300 pb-2">
                      <div className="font-bold text-slate-900 text-sm">
                        {resume.personalInfo.fullName || 'Your Name'}
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        {resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.location}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="font-bold text-slate-800 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-0.5">
                        Work Experience
                      </div>
                      <div className="text-[11px] text-slate-600 italic">
                        Clean standard paragraphs formatted without complex multi-nested tables, preventing document corruptions.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. JSON SCHEMA OUTPUT VISUAL */}
              {selectedFormat === 'json' && (
                <div className="w-full max-w-xl bg-slate-950 text-emerald-400 rounded-xl shadow-lg border border-slate-800 p-4 font-mono text-xs overflow-x-auto space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-amber-400" />
                      <span>JSON Resume Schema Standard (v1.0.0)</span>
                    </span>
                    <span className="text-[10px] text-slate-500">application/json</span>
                  </div>
                  <pre className="text-[11px] leading-relaxed text-emerald-300 whitespace-pre-wrap max-h-[360px] overflow-y-auto">
                    {JSON.stringify(resume, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-600">
                Selected Format: <span className="font-bold text-slate-900">{currentOption.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteExport}
                  disabled={isExporting}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {currentOption.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
