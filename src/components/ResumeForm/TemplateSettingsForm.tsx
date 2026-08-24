import React, { useState } from 'react';
import {
  Layout,
  Type,
  Palette,
  ShieldCheck,
  Sparkles,
  Check,
  Search,
  Filter,
  Layers,
  Award,
  Zap,
  Columns,
  GraduationCap,
  Eye,
  Maximize2
} from 'lucide-react';
import { ResumeSettings, TemplateId } from '../../types';
import { TemplateMiniaturePreview } from '../TemplateMiniaturePreview';

interface TemplateSettingsFormProps {
  settings: ResumeSettings;
  onChange: (settings: ResumeSettings) => void;
  onOpenGallery?: () => void;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  category: 'ats' | 'modern' | 'executive' | 'creative';
  description: string;
  atsScore: string;
  bestFor: string;
  badge: string;
  layoutType: string;
  icon: React.ElementType;
}

export const ALL_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'ats-classic',
    name: 'Classic ATS Standard',
    category: 'ats',
    description: 'Universal single-column layout with timeless horizontal rules. 100% compatible with Taleo, Workday, Greenhouse, and Lever.',
    atsScore: '100%',
    bestFor: 'All industries, traditional corporations, banking & government',
    badge: '100% ATS Safe',
    layoutType: '1-Col Classic',
    icon: ShieldCheck,
  },
  {
    id: 'ats-modern',
    name: 'Modern Minimalist',
    category: 'modern',
    description: 'Clean hairline section dividers with crisp modern sans typography and balanced negative space.',
    atsScore: '98%',
    bestFor: 'Tech startups, software engineering, marketing, product',
    badge: 'ATS Optimized',
    layoutType: '1-Col Minimal',
    icon: Zap,
  },
  {
    id: 'ats-executive',
    name: 'Executive High-Impact',
    category: 'executive',
    description: 'Bold structural headers and uppercase branding emphasizing leadership, revenue growth, and career progression.',
    atsScore: '97%',
    bestFor: 'Directors, VPs, C-Suite, senior managers & partners',
    badge: 'Executive',
    layoutType: '1-Col Bold Band',
    icon: Award,
  },
  {
    id: 'modern-accent',
    name: 'Corporate Accent',
    category: 'modern',
    description: 'Sophisticated brand-tinted section headers and colored accent lines while maintaining a strict single-column flow.',
    atsScore: '96%',
    bestFor: 'Corporate consulting, finance, sales & operations',
    badge: 'Popular',
    layoutType: '1-Col Accent Bar',
    icon: Palette,
  },
  {
    id: 'tech-compact',
    name: 'Silicon Tech Pro',
    category: 'modern',
    description: 'Engineered for developers and data professionals with tech tag highlights, GitHub links, and dense metric bullets.',
    atsScore: '95%',
    bestFor: 'Full-stack engineers, DevOps, Data Scientists, AI/ML',
    badge: 'Tech Favorite',
    layoutType: '1-Col Monospace Slashes',
    icon: Zap,
  },
  {
    id: 'nordic-clean',
    name: 'Nordic Elegance',
    category: 'modern',
    description: 'Scandinavian minimalist layout with understated typography, generous breathing room, and soft muted borders.',
    atsScore: '96%',
    bestFor: 'UX/UI designers, product managers, architects & consultants',
    badge: 'Clean Design',
    layoutType: '1-Col Airy Minimal',
    icon: Sparkles,
  },
  {
    id: 'left-sidebar',
    name: 'Modern Split Column',
    category: 'creative',
    description: 'Distinctive 2-column format with a dedicated sidebar for headshot photo, skills, and education alongside a primary career track.',
    atsScore: '92%',
    bestFor: 'European & international applications, design & media roles',
    badge: 'Photo & Skills Sidebar',
    layoutType: '2-Col Split Pane',
    icon: Columns,
  },
  {
    id: 'ivy-league',
    name: 'Ivy Academic & Law',
    category: 'executive',
    description: 'Prestigious serif academic structure with centered double-rule headings and Latin honors formatting.',
    atsScore: '98%',
    bestFor: 'Academia, law, medical, research institutions & publishing',
    badge: 'Academic Standard',
    layoutType: '1-Col Serif Double-Rule',
    icon: GraduationCap,
  },
  {
    id: 'creative-studio',
    name: 'Creative Studio',
    category: 'creative',
    description: 'Contemporary aesthetic with a vertical left color bar, badge accents, and standout role titles.',
    atsScore: '91%',
    bestFor: 'Creative directors, brand strategists, agency & freelancing',
    badge: 'Creative',
    layoutType: '1-Col Left Color Rail',
    icon: Sparkles,
  },
  {
    id: 'compact-dense',
    name: 'Dense Single-Pager',
    category: 'ats',
    description: 'High-density micro-padding engineered to fit extensive 7–12+ year careers into 1 compact, perfectly formatted page.',
    atsScore: '99%',
    bestFor: 'Experienced candidates needing maximum content per page',
    badge: '1-Page Fit',
    layoutType: '1-Col Ultra-Dense',
    icon: Layers,
  },
  {
    id: 'metro-slate',
    name: 'Metro Slate Header',
    category: 'modern',
    description: 'Striking dark header top band framing your name and contact info with high contrast and clean white body copy.',
    atsScore: '94%',
    bestFor: 'Modern tech companies, global enterprises & creative tech',
    badge: 'Dark Header Band',
    layoutType: 'Dark Top Banner + 1-Col',
    icon: Layout,
  },
  {
    id: 'swiss-grid',
    name: 'Swiss International',
    category: 'modern',
    description: 'Bold modernist typographic grid inspired by classic Swiss design with high-contrast section divisions.',
    atsScore: '95%',
    bestFor: 'Product designers, architects, marketing leaders & founders',
    badge: 'Modernist Grid',
    layoutType: '1-Col Modernist Grid',
    icon: Layout,
  },
];

export const TemplateSettingsForm: React.FC<TemplateSettingsFormProps> = ({
  settings,
  onChange,
  onOpenGallery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ats' | 'modern' | 'executive' | 'creative'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fonts = ['Calibri', 'Arial', 'Times New Roman', 'Roboto', 'Georgia', 'Inter'];
  const colors = [
    { label: 'Navy Blue', value: '#1e3a8a' },
    { label: 'Deep Indigo', value: '#4338ca' },
    { label: 'Emerald Teal', value: '#0f766e' },
    { label: 'Slate Charcoal', value: '#334155' },
    { label: 'Burgundy Crimson', value: '#881337' },
    { label: 'Royal Sapphire', value: '#2563eb' },
    { label: 'Forest Pine', value: '#166534' },
    { label: 'Warm Bronze', value: '#78350f' },
  ];

  const filteredTemplates = ALL_TEMPLATES.filter((tpl) => {
    const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.layoutType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeTemplateDef =
    ALL_TEMPLATES.find((t) => t.id === settings.template) || ALL_TEMPLATES[0];

  return (
    <div className="space-y-6">
      {/* HEADER & GALLERY LAUNCHER */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border border-blue-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Visual Format & Layout Designs
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-100 text-blue-700">
                12 Formats
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Current Active Format: <span className="font-bold text-slate-900">{activeTemplateDef.name}</span> ({activeTemplateDef.layoutType})
            </p>
          </div>
        </div>

        {onOpenGallery && (
          <button
            type="button"
            onClick={onOpenGallery}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Open Full Gallery Modal</span>
          </button>
        )}
      </div>

      {/* FILTER & SEARCH */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div className="text-xs font-semibold text-slate-700">
            Choose layout blueprint (Output visual shown on card):
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search formats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-full sm:w-48"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          {[
            { id: 'all', label: `All (${ALL_TEMPLATES.length})` },
            { id: 'ats', label: '100% ATS Classic' },
            { id: 'modern', label: 'Modern & Tech' },
            { id: 'executive', label: 'Executive & Academic' },
            { id: 'creative', label: 'Split & Creative' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1 rounded-md font-medium transition-all text-xs cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* TEMPLATE GRID WITH VISUAL MINIATURE OUTPUT DIAGRAMS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[500px] overflow-y-auto pr-1">
        {filteredTemplates.map((tpl) => {
          const Icon = tpl.icon;
          const isSelected = settings.template === tpl.id;

          return (
            <div
              key={tpl.id}
              onClick={() => onChange({ ...settings, template: tpl.id })}
              className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/50'
              }`}
            >
              {/* TOP HEADER & BADGES */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">{tpl.name}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">{tpl.layoutType}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-3" />
                      </div>
                    )}
                  </div>
                </div>

                {/* VISUAL OUTPUT DESIGN MINIATURE MOCKUP */}
                <div className="my-2 bg-slate-100 rounded-lg p-1.5 border border-slate-200 flex items-center justify-center">
                  <div className="w-full max-w-[170px] shadow-2xs">
                    <TemplateMiniaturePreview
                      templateId={tpl.id}
                      accentColor={settings.accentColor || '#1e3a8a'}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                    {tpl.badge}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">ATS: {tpl.atsScore}</span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mb-2">
                  {tpl.description}
                </p>
              </div>

              {/* FOOTER */}
              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-700">Best for:</span> {tpl.bestFor}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TYPOGRAPHY & SPACING */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            ATS-Approved Font Family
          </label>
          <select
            value={settings.fontFamily}
            onChange={(e) => onChange({ ...settings, fontFamily: e.target.value as any })}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            {fonts.map((f) => (
              <option key={f} value={f}>
                {f} (Standard ATS)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Font Scaling & Density
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['compact', 'standard', 'spacious'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => onChange({ ...settings, fontSize: sz })}
                className={`py-2 px-2 text-xs font-medium rounded-lg border capitalize transition-all cursor-pointer ${
                  settings.fontSize === sz
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ACCENT COLORS */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold text-slate-700">
            Accent Color (Engineered for WCAG AA Contrast)
          </label>
          <span className="text-[11px] font-mono text-slate-500 uppercase">{settings.accentColor}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {colors.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange({ ...settings, accentColor: c.value })}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                settings.accentColor === c.value
                  ? 'scale-115 ring-3 ring-blue-600 ring-offset-2 shadow-xs'
                  : 'hover:scale-105 opacity-90 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.label}
            >
              {settings.accentColor === c.value && <Check className="w-4 h-4 text-white stroke-3" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
