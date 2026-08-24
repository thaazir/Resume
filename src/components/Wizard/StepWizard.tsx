import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  User,
  FileText,
  Briefcase,
  Cpu,
  GraduationCap,
  Award,
  Sliders
} from 'lucide-react';
import { ResumeData } from '../../types';
import { PersonalInfoForm } from '../ResumeForm/PersonalInfoForm';
import { SummaryForm } from '../ResumeForm/SummaryForm';
import { ExperienceForm } from '../ResumeForm/ExperienceForm';
import { SkillsForm } from '../ResumeForm/SkillsForm';
import { EducationForm } from '../ResumeForm/EducationForm';
import { ProjectsForm } from '../ResumeForm/ProjectsForm';
import { CertificationsForm } from '../ResumeForm/CertificationsForm';
import { TemplateSettingsForm } from '../ResumeForm/TemplateSettingsForm';

interface StepWizardProps {
  resume: ResumeData;
  onChange: (resume: ResumeData) => void;
  onComplete: () => void;
  onOpenLinkedInImport?: () => void;
  onOpenTemplateGallery?: () => void;
}

export const StepWizard: React.FC<StepWizardProps> = ({
  resume,
  onChange,
  onComplete,
  onOpenLinkedInImport,
  onOpenTemplateGallery,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'contact', title: 'Personal Info', icon: User },
    { id: 'summary', title: 'Summary', icon: FileText },
    { id: 'experience', title: 'Work History', icon: Briefcase },
    { id: 'skills', title: 'Skills & Keywords', icon: Cpu },
    { id: 'education', title: 'Education', icon: GraduationCap },
    { id: 'projects', title: 'Projects & Certs', icon: Award },
    { id: 'formatting', title: 'Template & Design', icon: Sliders },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Wizard Step Tracker */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs overflow-x-auto no-scrollbar w-full max-w-full">
        <div className="flex items-center justify-between min-w-[520px] px-1">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(idx)}
                  className={`flex flex-col items-center gap-1 group cursor-pointer transition-all ${
                    isCurrent ? 'scale-105' : ''
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[11px] font-medium whitespace-nowrap ${
                      isCurrent ? 'text-blue-700 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </button>

                {idx < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-12 h-0.5 mx-1 transition-colors ${
                      idx < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Step Content Form Container */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        {currentStep === 0 && (
          <PersonalInfoForm
            data={resume.personalInfo}
            onChange={(personalInfo) => onChange({ ...resume, personalInfo })}
            onOpenLinkedInImport={onOpenLinkedInImport}
          />
        )}
        {currentStep === 1 && (
          <SummaryForm
            personalInfo={resume.personalInfo}
            resume={resume}
            onChange={(summary) =>
              onChange({
                ...resume,
                personalInfo: { ...resume.personalInfo, summary },
              })
            }
          />
        )}
        {currentStep === 2 && (
          <ExperienceForm
            experiences={resume.experiences}
            onChange={(experiences) => onChange({ ...resume, experiences })}
          />
        )}
        {currentStep === 3 && (
          <SkillsForm
            skills={resume.skills}
            resume={resume}
            onChange={(skills) => onChange({ ...resume, skills })}
          />
        )}
        {currentStep === 4 && (
          <EducationForm
            education={resume.education}
            onChange={(education) => onChange({ ...resume, education })}
          />
        )}
        {currentStep === 5 && (
          <div className="space-y-6">
            <ProjectsForm
              projects={resume.projects}
              onChange={(projects) => onChange({ ...resume, projects })}
            />
            <hr className="border-slate-200" />
            <CertificationsForm
              certifications={resume.certifications}
              languages={resume.languages}
              onCertificationsChange={(certifications) =>
                onChange({ ...resume, certifications })
              }
              onLanguagesChange={(languages) => onChange({ ...resume, languages })}
            />
          </div>
        )}
        {currentStep === 6 && (
          <TemplateSettingsForm
            settings={resume.settings}
            onChange={(settings) => onChange({ ...resume, settings })}
            onOpenGallery={onOpenTemplateGallery}
          />
        )}

        {/* Step Navigation Actions */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <div className="text-xs text-slate-500 font-medium">
            Step {currentStep + 1} of {steps.length}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>{currentStep === steps.length - 1 ? 'Finish & Audit' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
