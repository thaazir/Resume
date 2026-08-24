import React from 'react';
import { TemplateId } from '../types';

interface TemplateMiniaturePreviewProps {
  templateId: TemplateId;
  accentColor?: string;
  fontFamily?: string;
  hasPhoto?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

/**
 * Visual Miniature Blueprint of Resume Formats & Templates
 * Shows exact structural layout (Header, Divider Style, Columns, Spacing, Accent Placement)
 */
export const TemplateMiniaturePreview: React.FC<TemplateMiniaturePreviewProps> = ({
  templateId,
  accentColor = '#1e3a8a',
  fontFamily = 'Calibri',
  hasPhoto = false,
  className = '',
  size = 'md',
  showLabels = false,
}) => {
  // Dimensions according to size prop
  const sizeStyles = {
    xs: 'w-20 h-28 p-1.5 text-[4px]',
    sm: 'w-28 h-36 p-2 text-[5px]',
    md: 'w-full aspect-[1/1.35] min-h-[140px] p-3 text-[6px]',
    lg: 'w-full aspect-[1/1.35] min-h-[220px] p-4 text-[7px]',
  }[size];

  // Render specific layout blueprints based on TemplateId
  const renderLayout = () => {
    switch (templateId) {
      // 1. LEFT SIDEBAR (2-Column Split)
      case 'left-sidebar':
        return (
          <div className="w-full h-full flex bg-white rounded-xs overflow-hidden border border-slate-200 shadow-2xs font-sans">
            {/* Sidebar (35%) */}
            <div className="w-[35%] bg-slate-100 p-1.5 flex flex-col gap-1 border-r border-slate-200">
              {/* Photo Avatar */}
              <div
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mx-auto border"
                style={{ borderColor: accentColor, backgroundColor: `${accentColor}20` }}
              />
              {/* Contact Lines */}
              <div className="space-y-0.5 mt-0.5">
                <div className="h-0.5 w-6 rounded-full" style={{ backgroundColor: accentColor }} />
                <div className="h-0.5 w-full bg-slate-300 rounded-full" />
                <div className="h-0.5 w-4/5 bg-slate-300 rounded-full" />
              </div>
              {/* Skills Tags */}
              <div className="space-y-0.5 mt-1">
                <div className="h-0.5 w-5 rounded-full" style={{ backgroundColor: accentColor }} />
                <div className="flex flex-wrap gap-0.5">
                  <div className="h-1 w-2.5 bg-white border border-slate-300 rounded-xs" />
                  <div className="h-1 w-3 bg-white border border-slate-300 rounded-xs" />
                  <div className="h-1 w-2 bg-white border border-slate-300 rounded-xs" />
                </div>
              </div>
              {/* Education */}
              <div className="space-y-0.5 mt-1">
                <div className="h-0.5 w-5 rounded-full" style={{ backgroundColor: accentColor }} />
                <div className="h-0.5 w-full bg-slate-400 rounded-full" />
                <div className="h-0.5 w-3/4 bg-slate-300 rounded-full" />
              </div>
            </div>

            {/* Main Area (65%) */}
            <div className="w-[65%] p-2 flex flex-col gap-1.5">
              {/* Header */}
              <div className="space-y-0.5 border-b border-slate-200 pb-1">
                <div className="h-1.5 w-16 bg-slate-900 rounded-xs font-bold" />
                <div className="h-1 w-10 rounded-xs" style={{ backgroundColor: accentColor }} />
              </div>
              {/* Experience */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 border-b pb-0.5" style={{ borderColor: `${accentColor}40` }}>
                  <div className="h-1 w-8 rounded-xs font-bold" style={{ backgroundColor: accentColor }} />
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between">
                    <div className="h-1 w-10 bg-slate-800 rounded-xs" />
                    <div className="h-0.5 w-4 bg-slate-400 rounded-xs" />
                  </div>
                  <div className="h-0.5 w-full bg-slate-300 rounded-full" />
                  <div className="h-0.5 w-5/6 bg-slate-300 rounded-full" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <div className="flex justify-between">
                    <div className="h-1 w-8 bg-slate-800 rounded-xs" />
                    <div className="h-0.5 w-4 bg-slate-400 rounded-xs" />
                  </div>
                  <div className="h-0.5 w-full bg-slate-300 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        );

      // 2. METRO SLATE (Dark Header Band)
      case 'metro-slate':
        return (
          <div className="w-full h-full flex flex-col bg-white rounded-xs overflow-hidden border border-slate-200 shadow-2xs">
            {/* Dark Top Band */}
            <div className="bg-slate-900 text-white p-1.5 flex items-center justify-between gap-1">
              <div className="space-y-0.5 flex-1">
                <div className="h-1.5 w-14 bg-white rounded-xs" />
                <div className="h-1 w-8 bg-blue-300 rounded-xs" />
                <div className="flex gap-0.5">
                  <div className="h-0.5 w-5 bg-slate-400 rounded-full" />
                  <div className="h-0.5 w-4 bg-slate-400 rounded-full" />
                </div>
              </div>
              <div className="w-3.5 h-3.5 rounded-xs border border-white/60 bg-slate-800 shrink-0" />
            </div>

            {/* Content Body */}
            <div className="p-2 space-y-1.5 flex-1">
              {/* Section 1 */}
              <div className="space-y-0.5">
                <div className="h-1 w-10 border-b border-slate-800 font-bold" style={{ color: accentColor }} />
                <div className="h-0.5 w-full bg-slate-300 rounded-full" />
                <div className="h-0.5 w-4/5 bg-slate-300 rounded-full" />
              </div>
              {/* Experience */}
              <div className="space-y-0.5 pt-1">
                <div className="h-1 w-12 border-b border-slate-800 font-bold" />
                <div className="flex justify-between">
                  <div className="h-1 w-11 bg-slate-800 rounded-xs" />
                  <div className="h-0.5 w-5 bg-slate-400 rounded-xs" />
                </div>
                <div className="h-0.5 w-full bg-slate-300 rounded-full" />
                <div className="h-0.5 w-5/6 bg-slate-300 rounded-full" />
              </div>
              {/* Skills */}
              <div className="space-y-0.5 pt-0.5">
                <div className="h-1 w-8 border-b border-slate-800 font-bold" />
                <div className="h-0.5 w-full bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        );

      // 3. IVY LEAGUE (Academic Serif Double-Rules)
      case 'ivy-league':
        return (
          <div className="w-full h-full flex flex-col bg-white rounded-xs p-2.5 space-y-1.5 border border-slate-200 shadow-2xs font-serif">
            {/* Centered Academic Header */}
            <div className="text-center space-y-0.5 pb-1">
              <div className="h-2 w-20 bg-slate-900 mx-auto rounded-xs" />
              <div className="h-0.5 w-16 bg-slate-500 mx-auto rounded-full" />
            </div>
            {/* Double Rule Divider */}
            <div className="border-y border-slate-800 py-0.5 text-center">
              <div className="h-1 w-12 bg-slate-900 mx-auto rounded-xs" />
            </div>
            {/* Education / Experience */}
            <div className="space-y-0.5">
              <div className="flex justify-between">
                <div className="h-1 w-14 bg-slate-800 rounded-xs" />
                <div className="h-0.5 w-5 bg-slate-500 rounded-xs" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
              <div className="h-0.5 w-4/5 bg-slate-300 rounded-full" />
            </div>
            {/* Double Rule Section 2 */}
            <div className="border-y border-slate-800 py-0.5 text-center mt-1">
              <div className="h-1 w-14 bg-slate-900 mx-auto rounded-xs" />
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between">
                <div className="h-1 w-12 bg-slate-800 rounded-xs" />
                <div className="h-0.5 w-4 bg-slate-500 rounded-xs" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
            </div>
          </div>
        );

      // 4. CREATIVE STUDIO (Left Color Rail)
      case 'creative-studio':
        return (
          <div
            className="w-full h-full flex flex-col bg-white rounded-xs p-2.5 pl-3 space-y-1.5 border border-slate-200 border-l-4 shadow-2xs"
            style={{ borderLeftColor: accentColor }}
          >
            {/* Header */}
            <div className="space-y-0.5">
              <div className="h-2 w-16 rounded-xs" style={{ backgroundColor: accentColor }} />
              <div className="h-1 w-10 bg-slate-700 rounded-xs" />
              <div className="h-0.5 w-14 bg-slate-400 rounded-full" />
            </div>
            {/* Section 1 */}
            <div className="space-y-0.5 pt-0.5">
              <div className="h-1 w-12 border-b-2 pb-0.5 font-bold" style={{ borderColor: accentColor }}>
                <div className="h-1 w-8 bg-slate-900 rounded-xs" />
              </div>
              <div className="flex justify-between">
                <div className="h-1 w-10 bg-slate-800 rounded-xs" />
                <div className="h-0.5 w-4 bg-slate-400 rounded-xs" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
              <div className="h-0.5 w-5/6 bg-slate-300 rounded-full" />
            </div>
            {/* Section 2 */}
            <div className="space-y-0.5 pt-0.5">
              <div className="h-1 w-10 border-b-2 pb-0.5 font-bold" style={{ borderColor: accentColor }}>
                <div className="h-1 w-6 bg-slate-900 rounded-xs" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
            </div>
          </div>
        );

      // 5. TECH COMPACT (Silicon Tech Pro with Code Slashes)
      case 'tech-compact':
        return (
          <div className="w-full h-full flex flex-col bg-white rounded-xs p-2 space-y-1.5 border border-slate-200 shadow-2xs font-mono">
            {/* Top Bar with Tags */}
            <div className="flex justify-between items-start border-b border-slate-300 pb-1">
              <div className="space-y-0.5">
                <div className="h-1.5 w-14 bg-slate-900 rounded-xs" />
                <div className="h-0.5 w-10 text-[5px]" style={{ color: accentColor }}>
                  <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: accentColor }} />
                </div>
              </div>
              <div className="h-1 w-6 bg-blue-100 border border-blue-300 rounded-xs" />
            </div>
            {/* // EXPERIENCE */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-0.5 border-b border-slate-300 pb-0.5">
                <span className="text-slate-400 text-[6px] font-bold">//</span>
                <div className="h-1 w-10 bg-slate-800 rounded-xs" />
              </div>
              <div className="flex justify-between">
                <div className="h-1 w-12 bg-slate-900 rounded-xs" />
                <div className="h-0.5 w-5 bg-slate-400 rounded-xs" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
              <div className="h-0.5 w-4/5 bg-slate-300 rounded-full" />
            </div>
            {/* // TECH STACK */}
            <div className="space-y-0.5 pt-0.5">
              <div className="flex items-center gap-0.5 border-b border-slate-300 pb-0.5">
                <span className="text-slate-400 text-[6px] font-bold">//</span>
                <div className="h-1 w-8 bg-slate-800 rounded-xs" />
              </div>
              <div className="flex flex-wrap gap-0.5">
                <div className="h-1.5 w-3 bg-slate-100 border border-slate-300 rounded-xs" />
                <div className="h-1.5 w-4 bg-slate-100 border border-slate-300 rounded-xs" />
                <div className="h-1.5 w-3.5 bg-slate-100 border border-slate-300 rounded-xs" />
              </div>
            </div>
          </div>
        );

      // 6. EXECUTIVE HIGH-IMPACT
      case 'ats-executive':
        return (
          <div className="w-full h-full flex flex-col bg-white rounded-xs p-2.5 space-y-1.5 border border-slate-200 shadow-2xs">
            {/* Bold Centered Header */}
            <div className="text-center space-y-0.5 pb-1 border-b-2 border-slate-900">
              <div className="h-2 w-20 bg-slate-950 mx-auto rounded-xs font-black" />
              <div className="h-1 w-12 mx-auto rounded-xs" style={{ backgroundColor: accentColor }} />
              <div className="h-0.5 w-16 bg-slate-400 mx-auto rounded-full" />
            </div>
            {/* Bold Heavy Section Headers */}
            <div className="space-y-0.5">
              <div className="border-b-2 border-slate-950 pb-0.5 flex justify-between items-center">
                <div className="h-1.5 w-14 bg-slate-950 rounded-xs font-black" />
              </div>
              <div className="flex justify-between">
                <div className="h-1 w-12 bg-slate-900 rounded-xs" />
                <div className="h-0.5 w-5 bg-slate-600 rounded-xs" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
              <div className="h-0.5 w-5/6 bg-slate-300 rounded-full" />
            </div>
            <div className="space-y-0.5 pt-0.5">
              <div className="border-b-2 border-slate-950 pb-0.5">
                <div className="h-1.5 w-10 bg-slate-950 rounded-xs font-black" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
            </div>
          </div>
        );

      // 7. MODERN ACCENT
      case 'modern-accent':
        return (
          <div className="w-full h-full flex flex-col bg-white rounded-xs p-2.5 space-y-1.5 border border-slate-200 shadow-2xs">
            {/* Colored Name Header */}
            <div className="text-center space-y-0.5 pb-1">
              <div className="h-2 w-18 mx-auto rounded-xs font-bold" style={{ backgroundColor: accentColor }} />
              <div className="h-1 w-10 bg-slate-700 mx-auto rounded-xs" />
              <div className="h-0.5 w-14 bg-slate-400 mx-auto rounded-full" />
            </div>
            {/* Accent-Colored Rule */}
            <div className="space-y-0.5">
              <div className="border-b-2 pb-0.5" style={{ borderColor: accentColor }}>
                <div className="h-1.5 w-12 rounded-xs font-bold" style={{ backgroundColor: accentColor }} />
              </div>
              <div className="flex justify-between">
                <div className="h-1 w-12 bg-slate-800 rounded-xs" />
                <div className="h-0.5 w-4 bg-slate-500 rounded-xs" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
              <div className="h-0.5 w-4/5 bg-slate-300 rounded-full" />
            </div>
            <div className="space-y-0.5 pt-0.5">
              <div className="border-b-2 pb-0.5" style={{ borderColor: accentColor }}>
                <div className="h-1.5 w-8 rounded-xs font-bold" style={{ backgroundColor: accentColor }} />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
            </div>
          </div>
        );

      // 8. NORDIC CLEAN (Airy Minimalist)
      case 'nordic-clean':
        return (
          <div className="w-full h-full flex flex-col bg-white rounded-xs p-3 space-y-2 border border-slate-200 shadow-2xs">
            {/* Minimal Airy Header */}
            <div className="text-center space-y-1 pb-1">
              <div className="h-1.5 w-16 bg-slate-800 mx-auto rounded-xs tracking-widest" />
              <div className="h-0.5 w-8 bg-slate-400 mx-auto rounded-full" />
            </div>
            {/* Subtle Divider */}
            <div className="space-y-1">
              <div className="border-b border-slate-200 pb-0.5">
                <div className="h-1 w-10 bg-slate-600 mx-auto rounded-xs tracking-wider" />
              </div>
              <div className="h-0.5 w-full bg-slate-200 rounded-full" />
              <div className="h-0.5 w-4/5 bg-slate-200 rounded-full" />
            </div>
            <div className="space-y-1 pt-0.5">
              <div className="border-b border-slate-200 pb-0.5">
                <div className="h-1 w-8 bg-slate-600 mx-auto rounded-xs tracking-wider" />
              </div>
              <div className="h-0.5 w-full bg-slate-200 rounded-full" />
            </div>
          </div>
        );

      // 9. SWISS GRID (Modernist Typographic Lines)
      case 'swiss-grid':
        return (
          <div className="w-full h-full flex flex-col bg-white rounded-xs p-2 space-y-1.5 border border-slate-200 shadow-2xs">
            {/* Heavy Header */}
            <div className="space-y-0.5 border-b-2 border-slate-950 pb-1">
              <div className="h-2.5 w-18 bg-slate-950 rounded-xs font-black" />
              <div className="h-1 w-10 bg-slate-700 rounded-xs" />
            </div>
            {/* Section 1 */}
            <div className="space-y-0.5">
              <div className="border-b-2 border-slate-950 pb-0.5">
                <div className="h-1.5 w-12 bg-slate-950 rounded-xs font-black" />
              </div>
              <div className="flex justify-between">
                <div className="h-1 w-11 bg-slate-800 rounded-xs" />
                <div className="h-0.5 w-4 bg-slate-500 rounded-xs" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
            </div>
            {/* Section 2 */}
            <div className="space-y-0.5 pt-0.5">
              <div className="border-b-2 border-slate-950 pb-0.5">
                <div className="h-1.5 w-9 bg-slate-950 rounded-xs font-black" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
            </div>
          </div>
        );

      // 10. COMPACT DENSE (1-Page High Density)
      case 'compact-dense':
        return (
          <div className="w-full h-full flex flex-col bg-white rounded-xs p-1.5 space-y-1 border border-slate-200 shadow-2xs">
            {/* Tight Header */}
            <div className="text-center space-y-0.5 pb-0.5 border-b border-slate-700">
              <div className="h-1.5 w-16 bg-slate-900 mx-auto rounded-xs font-bold" />
              <div className="h-0.5 w-14 bg-slate-500 mx-auto rounded-full" />
            </div>
            {/* Tight Micro-Sections */}
            <div className="space-y-0.5">
              <div className="border-b border-slate-700 pb-0.2">
                <div className="h-1 w-10 bg-slate-800 rounded-xs font-bold" />
              </div>
              <div className="flex justify-between">
                <div className="h-1 w-11 bg-slate-800 rounded-xs" />
                <div className="h-0.5 w-4 bg-slate-400 rounded-xs" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
            </div>
            <div className="space-y-0.5">
              <div className="border-b border-slate-700 pb-0.2">
                <div className="h-1 w-8 bg-slate-800 rounded-xs font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-0.5">
                <div className="h-0.5 bg-slate-300 rounded-full" />
                <div className="h-0.5 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        );

      // 11. MODERN MINIMALIST (Crisp Hairline)
      case 'ats-modern':
        return (
          <div className="w-full h-full flex flex-col bg-white rounded-xs p-2.5 space-y-1.5 border border-slate-200 shadow-2xs">
            {/* Left Header */}
            <div className="space-y-0.5 pb-1 border-b border-slate-200">
              <div className="h-2 w-16 bg-slate-900 rounded-xs font-bold" />
              <div className="h-1 w-9 rounded-xs" style={{ backgroundColor: accentColor }} />
              <div className="h-0.5 w-12 bg-slate-400 rounded-full" />
            </div>
            {/* Hairline Divider Section */}
            <div className="space-y-0.5">
              <div className="border-b border-slate-200 pb-0.5">
                <div className="h-1 w-12 bg-slate-800 rounded-xs font-bold" />
              </div>
              <div className="flex justify-between">
                <div className="h-1 w-10 bg-slate-800 rounded-xs" />
                <div className="h-0.5 w-4 bg-slate-400 rounded-xs" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
              <div className="h-0.5 w-5/6 bg-slate-300 rounded-full" />
            </div>
            <div className="space-y-0.5 pt-0.5">
              <div className="border-b border-slate-200 pb-0.5">
                <div className="h-1 w-8 bg-slate-800 rounded-xs font-bold" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
            </div>
          </div>
        );

      // 12. CLASSIC ATS STANDARD (Default 100% ATS Safe)
      case 'ats-classic':
      default:
        return (
          <div className="w-full h-full flex flex-col bg-white rounded-xs p-2.5 space-y-1.5 border border-slate-200 shadow-2xs">
            {/* Centered Traditional Header */}
            <div className="text-center space-y-0.5 pb-1">
              <div className="h-2 w-20 bg-slate-900 mx-auto rounded-xs font-bold" />
              <div className="h-1 w-10 bg-slate-600 mx-auto rounded-xs" />
              <div className="h-0.5 w-16 bg-slate-400 mx-auto rounded-full" />
            </div>
            {/* Solid Horizontal Rule */}
            <div className="space-y-0.5">
              <div className="border-b border-slate-800 pb-0.5">
                <div className="h-1.5 w-12 bg-slate-900 rounded-xs font-bold" />
              </div>
              <div className="flex justify-between">
                <div className="h-1 w-11 bg-slate-800 rounded-xs" />
                <div className="h-0.5 w-5 bg-slate-500 rounded-xs" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
              <div className="h-0.5 w-5/6 bg-slate-300 rounded-full" />
            </div>
            <div className="space-y-0.5 pt-0.5">
              <div className="border-b border-slate-800 pb-0.5">
                <div className="h-1.5 w-8 bg-slate-900 rounded-xs font-bold" />
              </div>
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`relative ${sizeStyles} ${className}`}>
      {renderLayout()}
      {showLabels && (
        <div className="absolute bottom-1 right-1 bg-slate-900/80 text-white px-1 py-0.2 rounded text-[7px] font-mono backdrop-blur-xs">
          {templateId}
        </div>
      )}
    </div>
  );
};
