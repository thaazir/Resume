import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Mic, MicOff, Briefcase, Calendar, MapPin, ChevronDown, Check } from 'lucide-react';
import { WorkExperience } from '../../types';
import { ACTION_VERBS } from '../../utils/atsEngine';
import { AiBulletModal } from '../AiBulletModal';

interface ExperienceFormProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ experiences, onChange }) => {
  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    expIndex: number;
    bulletIndex: number;
    text: string;
    position: string;
    company: string;
  }>({
    isOpen: false,
    expIndex: 0,
    bulletIndex: 0,
    text: '',
    position: '',
    company: '',
  });

  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      bullets: [''],
    };
    onChange([...experiences, newExp]);
  };

  const handleRemoveExperience = (index: number) => {
    const updated = experiences.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleUpdateExpField = (index: number, field: keyof WorkExperience, value: any) => {
    const updated = [...experiences];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const handleAddBullet = (expIndex: number) => {
    const updated = [...experiences];
    updated[expIndex].bullets.push('');
    onChange(updated);
  };

  const handleUpdateBullet = (expIndex: number, bulletIndex: number, text: string) => {
    const updated = [...experiences];
    updated[expIndex].bullets[bulletIndex] = text;
    onChange(updated);
  };

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...experiences];
    updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    onChange(updated);
  };

  const openAiEnhancer = (expIndex: number, bulletIndex: number) => {
    const exp = experiences[expIndex];
    setActiveModal({
      isOpen: true,
      expIndex,
      bulletIndex,
      text: exp.bullets[bulletIndex] || '',
      position: exp.position,
      company: exp.company,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Work Experience History</h3>
          <p className="text-xs text-slate-500">List your professional roles in reverse chronological order</p>
        </div>
        <button
          type="button"
          id="add-experience-btn"
          onClick={handleAddExperience}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700">No work experience added yet</p>
          <p className="text-xs text-slate-500 mb-3">Add your previous or current jobs to showcase your achievements</p>
          <button
            type="button"
            onClick={handleAddExperience}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
          >
            + Add First Experience
          </button>
        </div>
      ) : (
        experiences.map((exp, expIdx) => (
          <div
            key={exp.id || expIdx}
            className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4 relative"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                Role #{expIdx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveExperience(expIdx)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                title="Remove experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Position / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  value={exp.position}
                  onChange={(e) => handleUpdateExpField(expIdx, 'position', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Organization <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={exp.company}
                  onChange={(e) => handleUpdateExpField(expIdx, 'company', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location (City, State / Remote)
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York, NY (Remote)"
                  value={exp.location}
                  onChange={(e) => handleUpdateExpField(expIdx, 'location', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2022-03"
                    value={exp.startDate}
                    onChange={(e) => handleUpdateExpField(expIdx, 'startDate', e.target.value)}
                    className="w-full px-2.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    disabled={exp.isCurrent}
                    placeholder={exp.isCurrent ? 'Present' : 'e.g. 2024-01'}
                    value={exp.isCurrent ? 'Present' : exp.endDate}
                    onChange={(e) => handleUpdateExpField(expIdx, 'endDate', e.target.value)}
                    className="w-full px-2.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`current-job-${expIdx}`}
                checked={exp.isCurrent}
                onChange={(e) => handleUpdateExpField(expIdx, 'isCurrent', e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <label htmlFor={`current-job-${expIdx}`} className="text-xs text-slate-700 select-none cursor-pointer">
                I currently work here
              </label>
            </div>

            {/* Bullet Points Section */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">
                  Key Achievements & Responsibilities (STAR / Quantifiable Bullets):
                </label>
                <button
                  type="button"
                  onClick={() => handleAddBullet(expIdx)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Bullet
                </button>
              </div>

              <div className="space-y-2.5">
                {exp.bullets.map((bullet, bulletIdx) => (
                  <div key={bulletIdx} className="flex items-start gap-2 group">
                    <span className="text-slate-400 mt-2 text-xs">•</span>
                    <textarea
                      rows={2}
                      placeholder="e.g. Spearheaded frontend performance overhaul, cutting load time by 35% across 2M+ monthly active users."
                      value={bullet}
                      onChange={(e) => handleUpdateBullet(expIdx, bulletIdx, e.target.value)}
                      className="flex-1 p-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white leading-relaxed"
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => openAiEnhancer(expIdx, bulletIdx)}
                        title="AI Enhance with STAR & Metrics"
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="hidden md:inline text-[10px] font-bold">AI Polish</span>
                      </button>
                      {exp.bullets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(expIdx, bulletIdx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}

      {/* AI Bullet Modal */}
      <AiBulletModal
        isOpen={activeModal.isOpen}
        onClose={() => setActiveModal({ ...activeModal, isOpen: false })}
        initialBullet={activeModal.text}
        position={activeModal.position}
        company={activeModal.company}
        onApplyBullet={(newText) => {
          handleUpdateBullet(activeModal.expIndex, activeModal.bulletIndex, newText);
        }}
      />
    </div>
  );
};
