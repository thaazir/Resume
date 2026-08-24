import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Camera,
  UploadCloud,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { PersonalInfo } from '../../types';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (info: PersonalInfo) => void;
  onOpenLinkedInImport?: () => void;
}

const PRESET_AVATARS = [
  {
    name: 'Professional 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces&q=80',
  },
  {
    name: 'Professional 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces&q=80',
  },
  {
    name: 'Professional 3',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&crop=faces&q=80',
  },
  {
    name: 'Professional 4',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=faces&q=80',
  },
];

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  data,
  onChange,
  onOpenLinkedInImport,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof PersonalInfo, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPEG, WebP).');
      return;
    }
    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target?.result as string;
      onChange({
        ...data,
        photoUrl: base64Url,
        showPhoto: data.showPhoto !== false, // default to true if not set to false
        photoShape: data.photoShape || 'circle',
        photoPosition: data.photoPosition || 'right',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSelectPreset = (url: string) => {
    onChange({
      ...data,
      photoUrl: url,
      showPhoto: true,
      photoShape: data.photoShape || 'circle',
      photoPosition: data.photoPosition || 'right',
    });
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange({
      ...data,
      photoUrl: urlInput.trim(),
      showPhoto: true,
      photoShape: data.photoShape || 'circle',
      photoPosition: data.photoPosition || 'right',
    });
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemovePhoto = () => {
    onChange({
      ...data,
      photoUrl: '',
      showPhoto: false,
    });
  };

  const hasPhoto = Boolean(data.photoUrl);
  const isPhotoVisible = data.showPhoto !== false && hasPhoto;

  return (
    <div className="space-y-6">
      {/* QUICK IMPORT FROM LINKEDIN BANNER */}
      {onOpenLinkedInImport && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#0A66C2]/10 via-blue-50 to-indigo-50/50 border border-[#0A66C2]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm shrink-0">
              in
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">Have an active LinkedIn Profile?</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#0A66C2]/15 text-[#0A66C2]">Fast Track</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Auto-import work history, education, and skills into ATS format with AI formatting.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenLinkedInImport}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition-colors shrink-0 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Import from LinkedIn</span>
          </button>
        </div>
      )}

      {/* PHOTO UPLOAD CARD */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Profile Photo / Avatar (Optional)</h3>
              <p className="text-[11px] text-slate-500">Supports PNG, JPG, WebP. Displayed cleanly across templates.</p>
            </div>
          </div>

          {hasPhoto && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleChange('showPhoto', !data.showPhoto)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  isPhotoVisible
                    ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                    : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                }`}
                title={isPhotoVisible ? 'Hide photo from resume' : 'Show photo on resume'}
              >
                {isPhotoVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {isPhotoVisible ? 'Photo Visible' : 'Photo Hidden'}
              </button>

              <button
                type="button"
                onClick={handleRemovePhoto}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer transition-colors"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Upload Zone & Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Preview / Avatar display */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200">
            {hasPhoto ? (
              <div className="relative group">
                <img
                  src={data.photoUrl}
                  alt="Resume Profile"
                  className={`w-24 h-24 object-cover border-2 border-slate-300 shadow-xs ${
                    data.photoShape === 'square'
                      ? 'rounded-none'
                      : data.photoShape === 'rounded'
                      ? 'rounded-2xl'
                      : 'rounded-full'
                  }`}
                />
                {!isPhotoVisible && (
                  <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    Hidden
                  </div>
                )}
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                <User className="w-8 h-8 stroke-1" />
                <span className="text-[10px] mt-1 font-medium">No Photo</span>
              </div>
            )}

            {hasPhoto && (
              <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-600">
                <span className="font-semibold">Shape:</span>
                <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50">
                  {(['circle', 'rounded', 'square'] as const).map((shape) => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => handleChange('photoShape', shape)}
                      className={`px-1.5 py-0.5 text-[10px] font-medium capitalize rounded transition-colors ${
                        (data.photoShape || 'circle') === shape
                          ? 'bg-white text-blue-700 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Upload Dropzone */}
          <div className="sm:col-span-8 space-y-3">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/80 scale-[0.99]'
                  : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <UploadCloud className="w-6 h-6 text-blue-600 mb-1" />
              <div className="text-xs font-bold text-slate-800">
                Click or drag & drop headshot image here
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, or WebP (Max 5MB)</p>
            </div>

            {/* Presets & Link Option */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium">Try Sample Headshot:</span>
                <div className="flex items-center gap-1">
                  {PRESET_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(avatar.url)}
                      className="w-6 h-6 rounded-full overflow-hidden border border-slate-300 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
                      title={avatar.name}
                    >
                      <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {!showUrlInput ? (
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    Paste Image URL
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <input
                      type="url"
                      placeholder="https://.../photo.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="text-xs px-2 py-1 border border-slate-300 rounded bg-white w-40"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 px-1"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ATS Tip Banner */}
        <div className="flex items-start gap-2 p-2.5 bg-blue-50/60 rounded-lg border border-blue-200/70 text-[11px] text-slate-700">
          <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>ATS Tip on Photos:</strong> In the US, UK, and Canada, photos are typically omitted to support blind recruitment. For European (e.g., Germany, France), Asian, Latin American, or creative/executive portfolios, professional headshots are standard. You can toggle the photo visibility on/off anytime without losing your upload.
          </div>
        </div>
      </div>

      {/* CORE CONTACT FIELDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-full-name"
              type="text"
              placeholder="e.g. Jane Doe"
              value={data.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Target Job Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="input-job-title"
            type="text"
            placeholder="e.g. Senior Software Engineer"
            value={data.jobTitle || ''}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-email"
              type="email"
              placeholder="jane.doe@example.com"
              value={data.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={data.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Location (City, State / Country) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-location"
              type="text"
              placeholder="San Francisco, CA or Remote"
              value={data.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            LinkedIn Profile
          </label>
          <div className="relative">
            <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-linkedin"
              type="text"
              placeholder="linkedin.com/in/janedoe"
              value={data.linkedIn || ''}
              onChange={(e) => handleChange('linkedIn', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            GitHub or Portfolio
          </label>
          <div className="relative">
            <Github className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-github"
              type="text"
              placeholder="github.com/janedoe or portfolio.com"
              value={data.github || data.portfolio || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
