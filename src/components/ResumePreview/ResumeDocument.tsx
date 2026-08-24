import React from 'react';
import { ResumeData, TemplateId } from '../../types';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
  Calendar,
  Building,
  GraduationCap,
  Award,
  Languages as LangIcon,
  Code
} from 'lucide-react';

interface ResumeDocumentProps {
  resume: ResumeData;
  scale?: number;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({ resume, scale = 1 }) => {
  const { personalInfo, experiences, education, skills, projects, certifications, languages, settings } = resume;

  const template: TemplateId = (settings?.template as TemplateId) || 'ats-classic';
  const accentColor = settings?.accentColor || '#1e3a8a';
  const fontFamily = settings?.fontFamily || 'Calibri';
  const fontSize = settings?.fontSize || 'standard';

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'Times New Roman':
        return 'font-serif';
      case 'Georgia':
        return 'font-serif';
      case 'Arial':
        return 'font-sans';
      case 'Roboto':
        return 'font-sans';
      case 'Inter':
        return 'font-sans';
      case 'Calibri':
      default:
        return 'font-sans';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'compact':
        return 'text-[9pt] leading-[1.3]';
      case 'spacious':
        return 'text-[11pt] leading-[1.55]';
      default:
        return 'text-[10pt] leading-[1.4]';
    }
  };

  const photoVisible = Boolean(personalInfo.photoUrl && personalInfo.showPhoto !== false);
  const photoShape = personalInfo.photoShape || settings?.photoShape || 'circle';

  const getPhotoShapeClass = () => {
    if (photoShape === 'square') return 'rounded-none';
    if (photoShape === 'rounded') return 'rounded-xl';
    return 'rounded-full';
  };

  // Render Profile Photo element
  const renderPhoto = (customSize: string = 'w-24 h-24') => {
    if (!photoVisible) return null;
    return (
      <div className="shrink-0 flex items-center justify-center">
        <img
          src={personalInfo.photoUrl}
          alt={personalInfo.fullName || 'Profile Headshot'}
          className={`${customSize} object-cover border-2 shadow-xs ${getPhotoShapeClass()}`}
          style={{ borderColor: accentColor }}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  };

  // --- SPECIAL TEMPLATE 1: LEFT SIDEBAR (2-COLUMN SPLIT) ---
  if (template === 'left-sidebar') {
    return (
      <div
        id="resume-document-root"
        className={`bg-white text-slate-900 shadow-lg mx-auto w-full max-w-[820px] min-h-[1050px] transition-all print:p-0 print:shadow-none print:max-w-none print:min-h-0 flex flex-col sm:flex-row ${getFontFamilyClass()} ${getFontSizeClass()}`}
      >
        {/* LEFT SIDEBAR */}
        <aside className="w-full sm:w-[34%] bg-slate-50 border-r border-slate-200 p-6 sm:p-7 space-y-6 shrink-0 print:bg-slate-50">
          {/* Photo */}
          {photoVisible && (
            <div className="flex justify-center mb-4">
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className={`w-28 h-28 object-cover border-3 shadow-sm ${getPhotoShapeClass()}`}
                style={{ borderColor: accentColor }}
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Contact Details */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Contact
            </h3>
            <div className="space-y-2 text-xs text-slate-700">
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${personalInfo.email}`} className="hover:underline break-all">
                    {personalInfo.email}
                  </a>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedIn && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="break-all">{personalInfo.linkedIn}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="break-all">{personalInfo.github}</span>
                </div>
              )}
              {personalInfo.portfolio && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="break-all">{personalInfo.portfolio}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h3
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Skills & Tech
              </h3>
              <div className="space-y-3 text-xs">
                {skills.map((cat) => (
                  <div key={cat.id}>
                    <div className="font-semibold text-slate-900 mb-1">{cat.name}</div>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-slate-200 text-slate-800 text-[10px] px-1.5 py-0.5 rounded font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education in Sidebar */}
          {education && education.length > 0 && (
            <div>
              <h3
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Education
              </h3>
              <div className="space-y-3 text-xs">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    {edu.fieldOfStudy && <div className="text-slate-700">{edu.fieldOfStudy}</div>}
                    <div className="text-slate-600 font-medium">{edu.institution}</div>
                    <div className="text-[10px] text-slate-500">{edu.startDate} – {edu.endDate}</div>
                    {edu.gpa && <div className="text-[10px] text-slate-700">GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h3
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Languages
              </h3>
              <div className="space-y-1 text-xs text-slate-700">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-medium text-slate-900">{l.language}</span>
                    <span className="text-slate-500 text-[11px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="w-full sm:w-[66%] p-7 sm:p-9 space-y-6">
          {/* Header */}
          <header className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 uppercase mb-1">
              {personalInfo.fullName || 'YOUR FULL NAME'}
            </h1>
            {personalInfo.jobTitle && (
              <div className="text-sm font-semibold tracking-wide" style={{ color: accentColor }}>
                {personalInfo.jobTitle}
              </div>
            )}
          </header>

          {/* Summary */}
          {personalInfo.summary && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Profile Summary
              </h2>
              <p className="text-slate-800 text-justify leading-relaxed text-xs">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {experiences && experiences.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Work Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                      <div>
                        <span className="font-bold text-slate-900">{exp.position}</span>
                        <span className="text-slate-700 font-medium"> — {exp.company}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 mb-1.5">{exp.location}</div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc ml-4 space-y-1 text-slate-800 text-xs">
                        {exp.bullets.map((b, idx) => (
                          <li key={idx} className="pl-0.5 leading-relaxed">
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Key Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">{proj.title}</span>
                      {proj.link && (
                        <span className="text-[11px] font-mono text-blue-700">{proj.link}</span>
                      )}
                    </div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="text-[10px] text-slate-600 mb-1">
                        Tech: {proj.technologies.join(', ')}
                      </div>
                    )}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc ml-4 space-y-0.5 text-slate-800 text-xs">
                        {proj.bullets.map((b, idx) => (
                          <li key={idx} className="pl-0.5 leading-relaxed">
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Certifications
              </h2>
              <div className="space-y-1.5 text-xs">
                {certifications.map((c) => (
                  <div key={c.id} className="flex justify-between items-baseline">
                    <span className="font-semibold text-slate-900">{c.name} — {c.issuer}</span>
                    <span className="text-[11px] text-slate-500">{c.issueDate}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    );
  }

  // --- SPECIAL TEMPLATE 2: METRO SLATE (DARK TOP BANNER) ---
  if (template === 'metro-slate') {
    return (
      <div
        id="resume-document-root"
        className={`bg-white text-slate-900 shadow-lg mx-auto w-full max-w-[800px] min-h-[1050px] transition-all print:p-0 print:shadow-none print:max-w-none print:min-h-0 ${getFontFamilyClass()} ${getFontSizeClass()}`}
      >
        {/* DARK HEADER BANNER */}
        <header className="bg-slate-900 text-white p-7 sm:p-9 flex flex-col sm:flex-row items-center justify-between gap-5 print:bg-slate-900">
          <div className="space-y-2 text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              {personalInfo.fullName || 'YOUR FULL NAME'}
            </h1>
            {personalInfo.jobTitle && (
              <div className="text-sm sm:text-base font-medium text-blue-300">
                {personalInfo.jobTitle}
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-slate-300 pt-1">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.email && <span>• {personalInfo.email}</span>}
              {personalInfo.linkedIn && <span>• {personalInfo.linkedIn}</span>}
              {personalInfo.github && <span>• {personalInfo.github}</span>}
            </div>
          </div>

          {photoVisible && (
            <div className="shrink-0">
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className={`w-24 h-24 object-cover border-3 border-white/80 shadow-md ${getPhotoShapeClass()}`}
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </header>

        {/* BODY CONTENT */}
        <div className="p-7 sm:p-9 space-y-5">
          {/* Summary */}
          {personalInfo.summary && (
            <section>
              <SectionHeader title="Professional Summary" template={template} accentColor={accentColor} />
              <p className="text-slate-800 text-justify mt-1.5 leading-relaxed">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <section>
              <SectionHeader title="Technical Skills & Competencies" template={template} accentColor={accentColor} />
              <div className="mt-2 space-y-1.5">
                {skills.map((cat) => (
                  <div key={cat.id} className="text-slate-800">
                    <span className="font-semibold text-slate-900">{cat.name}: </span>
                    <span>{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Work Experience */}
          {experiences && experiences.length > 0 && (
            <section>
              <SectionHeader title="Work Experience" template={template} accentColor={accentColor} />
              <div className="mt-2 space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                      <div>
                        <span className="font-bold text-slate-900">{exp.position}</span>
                        <span className="text-slate-700"> — {exp.company}</span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'} | {exp.location}
                      </div>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc ml-5 mt-1.5 space-y-1 text-slate-800">
                        {exp.bullets.map((b, idx) => (
                          <li key={idx} className="pl-0.5 leading-relaxed">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <SectionHeader title="Education" template={template} accentColor={accentColor} />
              <div className="mt-2 space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                      <div>
                        <span className="font-bold text-slate-900">{edu.degree}</span>
                        {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                        <div className="text-slate-700">{edu.institution}</div>
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        {edu.startDate} – {edu.endDate} | {edu.location}
                      </div>
                    </div>
                    {edu.gpa && <div className="text-xs text-slate-600">GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <SectionHeader title="Key Projects" template={template} accentColor={accentColor} />
              <div className="mt-2 space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">{proj.title}</span>
                      {proj.link && <span className="text-xs font-mono text-blue-700">{proj.link}</span>}
                    </div>
                    {proj.technologies && (
                      <div className="text-xs text-slate-600">Tech: {proj.technologies.join(', ')}</div>
                    )}
                    {proj.bullets && (
                      <ul className="list-disc ml-5 mt-1 space-y-0.5 text-slate-800">
                        {proj.bullets.map((b, idx) => (
                          <li key={idx} className="pl-0.5">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications & Languages */}
          {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {certifications && certifications.length > 0 && (
                <div>
                  <SectionHeader title="Certifications" template={template} accentColor={accentColor} />
                  <div className="mt-1.5 space-y-1 text-xs">
                    {certifications.map((c) => (
                      <div key={c.id} className="font-semibold text-slate-900">
                        {c.name} <span className="text-slate-500 font-normal">({c.issueDate})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {languages && languages.length > 0 && (
                <div>
                  <SectionHeader title="Languages" template={template} accentColor={accentColor} />
                  <div className="mt-1.5 text-xs text-slate-800">
                    {languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- STANDARD SINGLE-COLUMN TEMPLATES (ATS Classic, Modern, Executive, Tech, Nordic, Ivy, Creative, Dense, Swiss) ---
  return (
    <div
      id="resume-document-root"
      className={`bg-white text-slate-900 shadow-lg mx-auto w-full max-w-[800px] min-h-[1050px] transition-all print:p-0 print:shadow-none print:max-w-none print:min-h-0 ${
        template === 'compact-dense' ? 'p-6 sm:p-8' : 'p-8 sm:p-12'
      } ${
        template === 'creative-studio' ? 'border-l-8' : ''
      } ${getFontFamilyClass()} ${getFontSizeClass()}`}
      style={{
        borderLeftColor: template === 'creative-studio' ? accentColor : undefined,
      }}
    >
      {/* 1. HEADER / CONTACT INFORMATION */}
      <header
        className={`mb-5 ${
          template === 'ats-modern' || template === 'tech-compact' || template === 'swiss-grid'
            ? 'flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-left'
            : 'text-center'
        }`}
      >
        <div className={template === 'ats-modern' || template === 'tech-compact' || template === 'swiss-grid' ? 'flex-1' : ''}>
          <h1
            className={`font-bold tracking-tight text-slate-950 uppercase mb-1 ${
              template === 'swiss-grid'
                ? 'text-3xl sm:text-4xl font-black'
                : template === 'ats-executive'
                ? 'text-2xl sm:text-3xl font-black tracking-wider'
                : template === 'ivy-league'
                ? 'text-2xl sm:text-3xl font-serif'
                : 'text-2xl sm:text-3xl'
            }`}
            style={{
              color: template === 'modern-accent' || template === 'creative-studio' ? accentColor : undefined,
            }}
          >
            {personalInfo.fullName || 'YOUR FULL NAME'}
          </h1>

          {personalInfo.jobTitle && (
            <div
              className={`font-semibold mb-2 tracking-wide ${
                template === 'tech-compact'
                  ? 'text-xs sm:text-sm font-mono text-blue-700'
                  : 'text-sm sm:text-base text-slate-700'
              }`}
              style={{
                color: template === 'modern-accent' ? accentColor : undefined,
              }}
            >
              {personalInfo.jobTitle}
            </div>
          )}

          {/* Contact Bar */}
          <div
            className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-600 ${
              template === 'ats-modern' || template === 'tech-compact' || template === 'swiss-grid'
                ? 'justify-start'
                : 'justify-center'
            }`}
          >
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.location && personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.email && <span>•</span>}
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="text-slate-800 hover:underline">
                {personalInfo.email}
              </a>
            )}
            {personalInfo.linkedIn && (
              <>
                <span>•</span>
                <span className="text-slate-800">{personalInfo.linkedIn}</span>
              </>
            )}
            {personalInfo.github && (
              <>
                <span>•</span>
                <span className="text-slate-800">{personalInfo.github}</span>
              </>
            )}
            {personalInfo.portfolio && (
              <>
                <span>•</span>
                <span className="text-slate-800">{personalInfo.portfolio}</span>
              </>
            )}
          </div>
        </div>

        {/* Photo in single column templates */}
        {photoVisible && (
          <div className="shrink-0">
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className={`w-20 h-20 sm:w-24 sm:h-24 object-cover border-2 shadow-xs ${getPhotoShapeClass()}`}
              style={{ borderColor: accentColor }}
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </header>

      {/* 2. PROFESSIONAL SUMMARY */}
      {personalInfo.summary && (
        <section className={template === 'compact-dense' ? 'mb-3.5' : 'mb-5'}>
          <SectionHeader title="Professional Summary" template={template} accentColor={accentColor} />
          <p className="text-slate-800 text-justify mt-1.5 leading-relaxed">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* 3. CORE COMPETENCIES / SKILLS */}
      {skills && skills.length > 0 && (
        <section className={template === 'compact-dense' ? 'mb-3.5' : 'mb-5'}>
          <SectionHeader title="Technical Skills & Competencies" template={template} accentColor={accentColor} />
          <div className="mt-2 space-y-1.5">
            {skills.map((cat) => {
              if (!cat.skills || cat.skills.length === 0) return null;
              return (
                <div key={cat.id} className="text-slate-800">
                  <span className="font-semibold text-slate-900">{cat.name}: </span>
                  {template === 'tech-compact' ? (
                    <span className="inline-flex flex-wrap gap-1 ml-1">
                      {cat.skills.map((s, idx) => (
                        <span key={idx} className="bg-slate-100 px-1.5 py-0.2 rounded text-[11px] font-mono text-slate-800 border border-slate-200">
                          {s}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span>{cat.skills.join(', ')}</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. WORK EXPERIENCE */}
      {experiences && experiences.length > 0 && (
        <section className={template === 'compact-dense' ? 'mb-3.5' : 'mb-5'}>
          <SectionHeader title="Work Experience" template={template} accentColor={accentColor} />
          <div className={`mt-2 ${template === 'compact-dense' ? 'space-y-2.5' : 'space-y-4'}`}>
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{exp.position}</span>
                    <span className="text-slate-700"> — {exp.company}</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'} | {exp.location}
                  </div>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className={`list-disc ml-5 mt-1.5 text-slate-800 ${template === 'compact-dense' ? 'space-y-0.5' : 'space-y-1'}`}>
                    {exp.bullets.map((bullet, idx) => {
                      if (!bullet.trim()) return null;
                      return (
                        <li key={idx} className="pl-0.5 leading-relaxed">
                          {bullet}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. EDUCATION */}
      {education && education.length > 0 && (
        <section className={template === 'compact-dense' ? 'mb-3.5' : 'mb-5'}>
          <SectionHeader title="Education" template={template} accentColor={accentColor} />
          <div className="mt-2 space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree}</span>
                    {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                    <div className="text-slate-700">{edu.institution}</div>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {edu.startDate} – {edu.endDate} | {edu.location}
                  </div>
                </div>
                {(edu.gpa || edu.honors || (edu.relevantCoursework && edu.relevantCoursework.length > 0)) && (
                  <div className="text-xs text-slate-700 mt-0.5">
                    {edu.gpa && <span className="mr-3 font-medium">GPA: {edu.gpa}</span>}
                    {edu.honors && <span className="mr-3 italic">{edu.honors}</span>}
                    {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                      <div>Relevant Coursework: {edu.relevantCoursework.join(', ')}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. KEY PROJECTS */}
      {projects && projects.length > 0 && (
        <section className={template === 'compact-dense' ? 'mb-3.5' : 'mb-5'}>
          <SectionHeader title="Key Projects" template={template} accentColor={accentColor} />
          <div className="mt-2 space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{proj.title}</span>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="text-xs text-slate-600 ml-2 font-mono">
                        [{proj.technologies.join(', ')}]
                      </span>
                    )}
                  </div>
                  {proj.link && (
                    <span className="text-xs text-blue-700 font-mono">{proj.link}</span>
                  )}
                </div>
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc ml-5 mt-1 space-y-0.5 text-slate-800">
                    {proj.bullets.map((b, idx) => (
                      <li key={idx} className="pl-0.5 leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. CERTIFICATIONS */}
      {certifications && certifications.length > 0 && (
        <section className={template === 'compact-dense' ? 'mb-3.5' : 'mb-5'}>
          <SectionHeader title="Certifications & Credentials" template={template} accentColor={accentColor} />
          <div className="mt-2 space-y-1.5">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline text-slate-800">
                <div>
                  <span className="font-semibold text-slate-900">{cert.name}</span>
                  <span className="text-slate-600"> — {cert.issuer}</span>
                </div>
                <div className="text-xs text-slate-600">{cert.issueDate}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. LANGUAGES */}
      {languages && languages.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Languages" template={template} accentColor={accentColor} />
          <div className="mt-1.5 text-slate-800">
            {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
          </div>
        </section>
      )}
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; template: TemplateId; accentColor: string }> = ({
  title,
  template,
  accentColor,
}) => {
  if (template === 'ats-modern') {
    return (
      <div className="border-b border-slate-200 pb-1 mt-4 mb-2">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
          {title}
        </h2>
      </div>
    );
  }

  if (template === 'ats-executive') {
    return (
      <div className="border-b-2 border-slate-900 pb-1 mt-4 mb-2">
        <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-950">
          {title}
        </h2>
      </div>
    );
  }

  if (template === 'modern-accent') {
    return (
      <div className="border-b-2 pb-1 mt-4 mb-2" style={{ borderColor: accentColor }}>
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: accentColor }}>
          {title}
        </h2>
      </div>
    );
  }

  if (template === 'tech-compact') {
    return (
      <div className="border-b border-slate-300 pb-1 mt-4 mb-2 flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 font-mono">
          // {title}
        </h2>
      </div>
    );
  }

  if (template === 'nordic-clean') {
    return (
      <div className="border-b border-slate-200 pb-1 mt-4 mb-2">
        <h2 className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-slate-700">
          {title}
        </h2>
      </div>
    );
  }

  if (template === 'ivy-league') {
    return (
      <div className="border-y-2 border-slate-800 py-1 mt-4 mb-2 text-center">
        <h2 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-widest text-slate-900">
          {title}
        </h2>
      </div>
    );
  }

  if (template === 'creative-studio') {
    return (
      <div className="border-b-2 pb-1 mt-4 mb-2" style={{ borderColor: accentColor }}>
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
          {title}
        </h2>
      </div>
    );
  }

  if (template === 'swiss-grid') {
    return (
      <div className="border-b-3 border-slate-950 pb-1 mt-4 mb-2">
        <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950">
          {title}
        </h2>
      </div>
    );
  }

  if (template === 'compact-dense') {
    return (
      <div className="border-b border-slate-700 pb-0.5 mt-3 mb-1.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          {title}
        </h2>
      </div>
    );
  }

  // Classic ATS Standard (Universal compatibility)
  return (
    <div className="border-b border-slate-800 pb-0.5 mt-4 mb-2">
      <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
        {title}
      </h2>
    </div>
  );
};
