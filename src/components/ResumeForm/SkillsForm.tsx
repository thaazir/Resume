import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, X, RefreshCw, Layers } from 'lucide-react';
import { SkillCategory, ResumeData } from '../../types';

interface SkillsFormProps {
  skills: SkillCategory[];
  resume: ResumeData;
  onChange: (skills: SkillCategory[]) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ skills, resume, onChange }) => {
  const [newSkillInput, setNewSkillInput] = useState<{ [catId: string]: string }>({});
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ name: string; skills: string[] }[]>([]);

  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      name: 'New Skill Category',
      skills: [],
    };
    onChange([...skills, newCat]);
  };

  const handleRemoveCategory = (catId: string) => {
    onChange(skills.filter((c) => c.id !== catId));
  };

  const handleCategoryNameChange = (catId: string, name: string) => {
    onChange(
      skills.map((c) => (c.id === catId ? { ...c, name } : c))
    );
  };

  const handleAddSkillToCat = (catId: string, skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    onChange(
      skills.map((c) => {
        if (c.id === catId) {
          if (!c.skills.includes(trimmed)) {
            return { ...c, skills: [...c.skills, trimmed] };
          }
        }
        return c;
      })
    );
    setNewSkillInput({ ...newSkillInput, [catId]: '' });
  };

  const handleRemoveSkill = (catId: string, skillToRemove: string) => {
    onChange(
      skills.map((c) => {
        if (c.id === catId) {
          return { ...c, skills: c.skills.filter((s) => s !== skillToRemove) };
        }
        return c;
      })
    );
  };

  const handleFetchAiSkillSuggestions = async () => {
    setIsSuggesting(true);
    try {
      const res = await fetch('/api/gemini/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: resume.targetRole || resume.personalInfo.jobTitle,
          currentSkills: skills,
        }),
      });
      const data = await res.json();
      if (data.categories) {
        setAiSuggestions(data.categories);
      }
    } catch (err) {
      console.error('Failed to get skill suggestions:', err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const addSuggestedCategory = (cat: { name: string; skills: string[] }) => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      name: cat.name,
      skills: [...cat.skills],
    };
    onChange([...skills, newCat]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Categorized Skills & Keywords</h3>
          <p className="text-xs text-slate-500">Group skills into distinct categories for maximum ATS scanning density</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFetchAiSkillSuggestions}
            disabled={isSuggesting}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSuggesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>AI Suggest Skills</span>
          </button>
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* AI Suggestions Drawer if triggered */}
      {aiSuggestions.length > 0 && (
        <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Recommended In-Demand Skills for {resume.targetRole || resume.personalInfo.jobTitle || 'Your Role'}
            </span>
            <button
              onClick={() => setAiSuggestions([])}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Dismiss
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {aiSuggestions.map((cat, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-indigo-100 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                  <button
                    type="button"
                    onClick={() => addSuggestedCategory(cat)}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                  >
                    + Add Group
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Categories List */}
      <div className="space-y-4">
        {skills.map((cat) => (
          <div
            key={cat.id}
            className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                value={cat.name}
                onChange={(e) => handleCategoryNameChange(cat.id, e.target.value)}
                className="text-xs font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-hidden px-1 py-0.5 flex-1"
                placeholder="Category Name (e.g. Technical Skills)"
              />
              <button
                type="button"
                onClick={() => handleRemoveCategory(cat.id)}
                className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                title="Remove category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-2 items-center">
              {cat.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(cat.id, skill)}
                    className="text-blue-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {/* Add Single Skill Input */}
              <div className="inline-flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Type skill & press Enter"
                  value={newSkillInput[cat.id] || ''}
                  onChange={(e) =>
                    setNewSkillInput({ ...newSkillInput, [cat.id]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkillToCat(cat.id, newSkillInput[cat.id] || '');
                    }
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg border border-slate-300 focus:ring-1 focus:ring-blue-500 w-44 bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkillToCat(cat.id, newSkillInput[cat.id] || '')}
                  className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
