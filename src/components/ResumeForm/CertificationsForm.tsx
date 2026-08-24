import React from 'react';
import { Plus, Trash2, Award, Globe } from 'lucide-react';
import { Certification, LanguageItem } from '../../types';

interface CertificationsFormProps {
  certifications: Certification[];
  languages: LanguageItem[];
  onCertificationsChange: (certs: Certification[]) => void;
  onLanguagesChange: (langs: LanguageItem[]) => void;
}

export const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  languages,
  onCertificationsChange,
  onLanguagesChange,
}) => {
  const handleAddCert = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: '',
    };
    onCertificationsChange([...certifications, newCert]);
  };

  const handleRemoveCert = (index: number) => {
    onCertificationsChange(certifications.filter((_, i) => i !== index));
  };

  const handleUpdateCert = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    onCertificationsChange(updated);
  };

  const handleAddLanguage = () => {
    const newLang: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: '',
      proficiency: 'Professional',
    };
    onLanguagesChange([...languages, newLang]);
  };

  const handleRemoveLanguage = (index: number) => {
    onLanguagesChange(languages.filter((_, i) => i !== index));
  };

  const handleUpdateLanguage = (index: number, field: keyof LanguageItem, value: any) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    onLanguagesChange(updated);
  };

  return (
    <div className="space-y-8">
      {/* Certifications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Certifications & Licenses</h3>
            <p className="text-xs text-slate-500">Industry credentials (e.g. AWS, PMP, Scrum, Google Cloud)</p>
          </div>
          <button
            type="button"
            onClick={handleAddCert}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certification</span>
          </button>
        </div>

        {certifications.length === 0 ? (
          <div className="p-5 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-500">
            No certifications added yet. (Optional)
          </div>
        ) : (
          <div className="space-y-3">
            {certifications.map((cert, idx) => (
              <div
                key={cert.id || idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Certification Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AWS Solutions Architect"
                    value={cert.name}
                    onChange={(e) => handleUpdateCert(idx, 'name', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Amazon Web Services"
                    value={cert.issuer}
                    onChange={(e) => handleUpdateCert(idx, 'issuer', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      Issue Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2023-05"
                      value={cert.issueDate}
                      onChange={(e) => handleUpdateCert(idx, 'issueDate', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCert(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 mt-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Languages Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Languages</h3>
            <p className="text-xs text-slate-500">Spoken languages & fluency levels</p>
          </div>
          <button
            type="button"
            onClick={handleAddLanguage}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Language</span>
          </button>
        </div>

        {languages.length === 0 ? (
          <div className="p-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-500">
            No languages added.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languages.map((lang, idx) => (
              <div
                key={lang.id || idx}
                className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Language (e.g. English)"
                  value={lang.language}
                  onChange={(e) => handleUpdateLanguage(idx, 'language', e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
                <select
                  value={lang.proficiency}
                  onChange={(e) => handleUpdateLanguage(idx, 'proficiency', e.target.value)}
                  className="px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Professional">Professional</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveLanguage(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
