import React from 'react';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { Education } from '../../types';

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ education, onChange }) => {
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: '',
    };
    onChange([...education, newEdu]);
  };

  const handleRemoveEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const handleUpdateEduField = (index: number, field: keyof Education, value: any) => {
    const updated = [...education];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Education & Academic Background</h3>
          <p className="text-xs text-slate-500">Degree, major, university, graduation dates, and honors</p>
        </div>
        <button
          type="button"
          onClick={handleAddEducation}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700">No education entries added yet</p>
          <button
            type="button"
            onClick={handleAddEducation}
            className="mt-3 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
          >
            + Add Academic Degree
          </button>
        </div>
      ) : (
        education.map((edu, idx) => (
          <div
            key={edu.id || idx}
            className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4 relative"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                Degree #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveEducation(idx)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution / University <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stanford University"
                  value={edu.institution}
                  onChange={(e) => handleUpdateEduField(idx, 'institution', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Degree <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bachelor of Science, Master of Science"
                  value={edu.degree}
                  onChange={(e) => handleUpdateEduField(idx, 'degree', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Field of Study / Major
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, Business Administration"
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleUpdateEduField(idx, 'fieldOfStudy', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location (City, State)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stanford, CA"
                  value={edu.location}
                  onChange={(e) => handleUpdateEduField(idx, 'location', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Graduation Year / Dates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 2018"
                    value={edu.startDate}
                    onChange={(e) => handleUpdateEduField(idx, 'startDate', e.target.value)}
                    className="w-full px-2.5 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="e.g. 2022"
                    value={edu.endDate}
                    onChange={(e) => handleUpdateEduField(idx, 'endDate', e.target.value)}
                    className="w-full px-2.5 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GPA / Honors (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="GPA: e.g. 3.8/4.0"
                    value={edu.gpa || ''}
                    onChange={(e) => handleUpdateEduField(idx, 'gpa', e.target.value)}
                    className="w-full px-2.5 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Honors: Magna Cum Laude"
                    value={edu.honors || ''}
                    onChange={(e) => handleUpdateEduField(idx, 'honors', e.target.value)}
                    className="w-full px-2.5 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
