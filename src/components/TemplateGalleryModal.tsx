import React, { useState } from 'react';
import {
  X,
  Check,
  Layout,
  ShieldCheck,
  Sparkles,
  Zap,
  Award,
  GraduationCap,
  Columns,
  Layers,
  Palette,
  Type,
  Search,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Info
} from 'lucide-react';
import { ResumeData, TemplateId } from '../types';
import { ALL_TEMPLATES, TemplateDefinition } from './ResumeForm/TemplateSettingsForm';
import { TemplateMiniaturePreview } from './TemplateMiniaturePreview';
import { ResumeDocument } from './ResumePreview/ResumeDocument';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResume: ResumeData;
  onApplyTemplate: (templateId: TemplateId, accentColor?: string, fontFamily?: any) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  currentResume,
  onApplyTemplate,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(
    (currentResume.settings?.template as TemplateId) || 'ats-classic'
  );
  const [previewAccentColor, setPreviewAccentColor] = useState<string>(
    currentResume.settings?.accentColor || '#1e3a8a'
  );
  const [previewFontFamily, setPreviewFontFamily] = useState<string>(
    currentResume.settings?.fontFamily || 'Calibri'
  );
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'ats' | 'modern' | 'executive' | 'creative'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewZoom, setPreviewZoom] = useState<number>(0.85);
  const [previewMode, setPreviewMode] = useState<'live' | 'blueprint'>('live');

  if (!isOpen) return null;

  const currentTemplateDef =
    ALL_TEMPLATES.find((t) => t.id === selectedTemplateId) || ALL_TEMPLATES[0];

  const filteredTemplates = ALL_TEMPLATES.filter((tpl) => {
    const matchesCat = categoryFilter === 'all' || tpl.category === categoryFilter;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.bestFor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const sampleColors = [
    { label: 'Navy Blue', value: '#1e3a8a' },
    { label: 'Deep Indigo', value: '#4338ca' },
    { label: 'Emerald Teal', value: '#0f766e' },
    { label: 'Slate Charcoal', value: '#334155' },
    { label: 'Burgundy Crimson', value: '#881337' },
    { label: 'Royal Sapphire', value: '#2563eb' },
    { label: 'Forest Pine', value: '#166534' },
    { label: 'Warm Bronze', value: '#78350f' },
  ];

  // Temporary resume object with preview settings applied
  const previewResume: ResumeData = {
    ...currentResume,
    settings: {
      ...currentResume.settings,
      template: selectedTemplateId,
      accentColor: previewAccentColor,
      fontFamily: previewFontFamily as any,
    },
  };

  const handleApply = () => {
    onApplyTemplate(selectedTemplateId, previewAccentColor, previewFontFamily);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl h-[92vh] max-h-[850px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* MODAL HEADER */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                  Format & Layout Design Gallery
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  12 Formats Available
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect visual output designs in real time before selecting your layout.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApply}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-3" />
              <span>Apply {currentTemplateDef.name}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Close Gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY (SPLIT VIEW: SELECTOR ON LEFT, LIVE OUTPUT PREVIEW ON RIGHT) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT PANE: FORMAT SELECTOR & CARDS */}
          <div className="w-full md:w-[48%] lg:w-[42%] border-r border-slate-200 flex flex-col bg-slate-50/50">
            {/* Search & Filters */}
            <div className="p-3.5 border-b border-slate-200 bg-white space-y-2.5 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search 12 formats by name, category, or industry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs scrollbar-none">
                {[
                  { id: 'all', label: 'All (12)' },
                  { id: 'ats', label: 'ATS Classic' },
                  { id: 'modern', label: 'Modern' },
                  { id: 'executive', label: 'Executive' },
                  { id: 'creative', label: 'Split/Creative' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryFilter(c.id as any)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      categoryFilter === c.id
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Cards List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filteredTemplates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                const isCurrentlyActive = currentResume.settings?.template === tpl.id;

                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    {/* Visual Blueprint Miniature */}
                    <div className="w-20 shrink-0 bg-white rounded-lg border border-slate-200 p-1 shadow-2xs">
                      <TemplateMiniaturePreview
                        templateId={tpl.id}
                        accentColor={previewAccentColor}
                        size="xs"
                      />
                    </div>

                    {/* Card Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {tpl.name}
                          </h4>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-3" />
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1 mb-1.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {tpl.badge}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">
                            ATS {tpl.atsScore}
                          </span>
                          {isCurrentlyActive && (
                            <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-slate-200 text-slate-700">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight mb-1">
                          {tpl.description}
                        </p>
                      </div>

                      <div className="text-[10px] text-slate-500 truncate pt-1 border-t border-slate-100">
                        <span className="font-semibold text-slate-700">Best for:</span> {tpl.bestFor}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Styling Controls (Accent Color & Font) */}
            <div className="p-3 border-t border-slate-200 bg-white shrink-0 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Preview Accent Color:</span>
                <div className="flex items-center gap-1.5">
                  {sampleColors.slice(0, 6).map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setPreviewAccentColor(c.value)}
                      className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
                        previewAccentColor === c.value
                          ? 'ring-2 ring-blue-600 ring-offset-1 scale-110'
                          : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: LIVE REAL-TIME OUTPUT DESIGN PREVIEW */}
          <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
            {/* Live Preview Toolbar */}
            <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <EyeIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Output Design:</span>
                  <span className="text-blue-700 font-extrabold">{currentTemplateDef.name}</span>
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  ({currentTemplateDef.badge} • ATS {currentTemplateDef.atsScore})
                </span>
              </div>

              {/* Zoom & Blueprint Toggle */}
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('live')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                      previewMode === 'live'
                        ? 'bg-white text-blue-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Live Resume Output
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('blueprint')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                      previewMode === 'blueprint'
                        ? 'bg-white text-blue-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Layout Structure
                  </button>
                </div>

                <div className="flex items-center bg-slate-100 rounded-lg px-1 py-0.5 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPreviewZoom((z) => Math.max(0.6, z - 0.1))}
                    className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-slate-600 px-1">
                    {Math.round(previewZoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewZoom((z) => Math.min(1.2, z + 0.1))}
                    className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Stage */}
            <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
              {previewMode === 'live' ? (
                <div
                  style={{
                    transform: `scale(${previewZoom})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="shadow-xl rounded-lg overflow-hidden bg-white mb-8"
                >
                  <ResumeDocument resume={previewResume} />
                </div>
              ) : (
                /* Structural Blueprint View */
                <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4 my-auto">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                      <Layout className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{currentTemplateDef.name}</h3>
                      <p className="text-xs text-slate-500">Structural Layout Blueprint</p>
                    </div>
                  </div>

                  <div className="w-48 mx-auto aspect-[1/1.35] bg-white rounded-lg border-2 border-slate-300 p-2 shadow-xs">
                    <TemplateMiniaturePreview
                      templateId={selectedTemplateId}
                      accentColor={previewAccentColor}
                      size="md"
                    />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Layout Architecture:</span>
                        <span className="font-bold text-slate-900">
                          {selectedTemplateId === 'left-sidebar' ? '2-Column Split Pane' : '1-Column Universal Flow'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">ATS Parser Rating:</span>
                        <span className="font-bold text-emerald-700">{currentTemplateDef.atsScore} Safe</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Header Style:</span>
                        <span className="font-semibold text-slate-850">
                          {selectedTemplateId === 'metro-slate'
                            ? 'Dark Full-Width Header'
                            : selectedTemplateId === 'ivy-league'
                            ? 'Centered Serif Double-Rule'
                            : selectedTemplateId === 'ats-executive'
                            ? 'Bold Executive Bar'
                            : 'Clean Hairline Divider'}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                      💡 {currentTemplateDef.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Footer */}
            <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-600">
                Selected: <span className="font-bold text-slate-900">{currentTemplateDef.name}</span>
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
                  onClick={handleApply}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 stroke-3" />
                  <span>Apply This Format</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
