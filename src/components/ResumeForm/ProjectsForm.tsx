import React from 'react';
import { Plus, Trash2, FolderGit2, Link as LinkIcon } from 'lucide-react';
import { Project } from '../../types';

interface ProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ projects, onChange }) => {
  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: '',
      technologies: [],
      link: '',
      bullets: [''],
    };
    onChange([...projects, newProj]);
  };

  const handleRemoveProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const handleUpdateProj = (index: number, field: keyof Project, value: any) => {
    const updated = [...projects];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const handleAddBullet = (projIndex: number) => {
    const updated = [...projects];
    updated[projIndex].bullets.push('');
    onChange(updated);
  };

  const handleUpdateBullet = (projIndex: number, bulletIndex: number, text: string) => {
    const updated = [...projects];
    updated[projIndex].bullets[bulletIndex] = text;
    onChange(updated);
  };

  const handleRemoveBullet = (projIndex: number, bulletIndex: number) => {
    const updated = [...projects];
    updated[projIndex].bullets = updated[projIndex].bullets.filter((_, i) => i !== bulletIndex);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Featured Projects</h3>
          <p className="text-xs text-slate-500">Highlight technical applications, client work, or open source repositories</p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700">No projects added yet</p>
          <p className="text-xs text-slate-500 mb-3">Adding 1–2 strong projects is highly recommended for technical & fresh grad roles</p>
          <button
            type="button"
            onClick={handleAddProject}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
          >
            + Add Project
          </button>
        </div>
      ) : (
        projects.map((proj, idx) => (
          <div
            key={proj.id || idx}
            className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                Project #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveProject(idx)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Analytics Platform"
                  value={proj.title}
                  onChange={(e) => handleUpdateProj(idx, 'title', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Repository / Demo Link
                </label>
                <input
                  type="text"
                  placeholder="e.g. github.com/username/project"
                  value={proj.link || ''}
                  onChange={(e) => handleUpdateProj(idx, 'link', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technologies Used (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, PostgreSQL, Docker, AWS"
                  value={proj.technologies ? proj.technologies.join(', ') : ''}
                  onChange={(e) =>
                    handleUpdateProj(
                      idx,
                      'technologies',
                      e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                    )
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Bullets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Project Highlights / Bullets:
                </label>
                <button
                  type="button"
                  onClick={() => handleAddBullet(idx)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Bullet
                </button>
              </div>
              <div className="space-y-2">
                {proj.bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">•</span>
                    <input
                      type="text"
                      placeholder="e.g. Built high-speed caching layer cutting response time from 300ms to 40ms."
                      value={b}
                      onChange={(e) => handleUpdateBullet(idx, bIdx, e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white"
                    />
                    {proj.bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(idx, bIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
