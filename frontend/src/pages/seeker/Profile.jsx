import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  FileText,
  Upload,
  Download,
  Trash2,
  Plus,
  Edit2,
  CheckCircle2,
  ExternalLink,
  Globe,
  Camera,
  Languages,
  DollarSign,
  Compass,
  X,
  Save,
  Check,
} from 'lucide-react';

function Github({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function Linkedin({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

import { profileService } from '@/api/profileService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Modal from '@/components/common/Modal';
import SkillBadge from '@/components/common/SkillBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { calcProfileCompletion, formatSalary } from '@/utils/helpers';
import { JOB_TYPES } from '@/utils/constants';

const POPULAR_SKILLS = [
  'React.js',
  'Node.js',
  'TypeScript',
  'Next.js',
  'Python',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'AWS',
  'Tailwind CSS',
  'GraphQL',
  'Redis',
  'Git',
];

export default function SeekerProfile() {
  const { user, updateUserPhoto, updateUser } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Main profile state
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    title: '',
    location: '',
    about: '',
    photo: '',
    resume: null,
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    preferredRole: '',
    preferredLocation: '',
    expectedSalaryMin: '',
    expectedSalaryMax: '',
    preferredJobType: 'full_time',
    languages: [],
    github: '',
    linkedin: '',
    portfolio: '',
    careerObjective: '',
    achievements: [],
  });

  // Modal states for Experience
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [expForm, setExpForm] = useState({
    index: null,
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
  });

  // Modal states for Education
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [eduForm, setEduForm] = useState({
    index: null,
    degree: '',
    institution: '',
    startYear: '',
    endYear: '',
    grade: '',
  });

  // Modal states for Projects
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    index: null,
    name: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
  });

  // Modal states for Certifications
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certForm, setCertForm] = useState({
    index: null,
    name: '',
    issuer: '',
    date: '',
    credentialUrl: '',
  });

  // Skill input
  const [newSkill, setNewSkill] = useState('');
  // Language input
  const [newLang, setNewLang] = useState('');
  // Achievement input
  const [newAchievement, setNewAchievement] = useState('');

  const photoInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  // Load profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await profileService.getSeekerProfile();
        if (data) {
          setProfile({
            ...data,
            fullName: data.fullName || user?.fullName || '',
            email: data.email || user?.email || '',
            skills: Array.isArray(data.skills) ? data.skills : [],
            education: Array.isArray(data.education) ? data.education : [],
            experience: Array.isArray(data.experience) ? data.experience : [],
            projects: Array.isArray(data.projects) ? data.projects : [],
            certifications: Array.isArray(data.certifications) ? data.certifications : [],
            languages: Array.isArray(data.languages) ? data.languages : [],
            achievements: Array.isArray(data.achievements) ? data.achievements : [],
          });
        } else if (user) {
          setProfile((prev) => ({
            ...prev,
            fullName: user.fullName || '',
            email: user.email || '',
          }));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        toast.error('Error', 'Unable to load profile data.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [toast, user]);

  // Save full profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      // Clean and sanitize payload
      const payload = {
        fullName: profile.fullName?.trim() || '',
        phone: profile.phone || '',
        title: profile.title || '',
        location: profile.location || '',
        about: profile.about || '',
        skills: profile.skills || [],
        education: profile.education || [],
        experience: profile.experience || [],
        projects: profile.projects || [],
        certifications: profile.certifications || [],
        preferredRole: profile.preferredRole || '',
        preferredLocation: profile.preferredLocation || '',
        expectedSalaryMin:
          profile.expectedSalaryMin !== '' && profile.expectedSalaryMin != null
            ? Number(profile.expectedSalaryMin)
            : null,
        expectedSalaryMax:
          profile.expectedSalaryMax !== '' && profile.expectedSalaryMax != null
            ? Number(profile.expectedSalaryMax)
            : null,
        preferredJobType: profile.preferredJobType || 'full_time',
        languages: profile.languages || [],
        github: profile.github || '',
        linkedin: profile.linkedin || '',
        portfolio: profile.portfolio || '',
        careerObjective: profile.careerObjective || '',
        achievements: profile.achievements || [],
      };

      const updated = await profileService.updateSeekerProfile(payload);
      if (updated) {
        setProfile((prev) => ({
          ...prev,
          ...updated,
          fullName: updated.fullName || payload.fullName,
          expectedSalaryMin:
            updated.expectedSalaryMin != null ? String(updated.expectedSalaryMin) : '',
          expectedSalaryMax:
            updated.expectedSalaryMax != null ? String(updated.expectedSalaryMax) : '',
        }));
      }
      if (updateUser && payload.fullName) {
        updateUser({ fullName: payload.fullName });
      }
      toast.success('Profile Saved', 'Your profile details have been successfully updated.');
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorData = err.response?.data;
      let errorMsg = 'Could not save profile changes. Please try again.';
      if (errorData && typeof errorData === 'object') {
        const fieldErrors = Object.entries(errorData)
          .map(([field, msgs]) => {
            const fieldName = field.replace(/_/g, ' ');
            const msgText = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
            return `${fieldName}: ${msgText}`;
          })
          .join(' | ');
        if (fieldErrors) {
          errorMsg = fieldErrors;
        }
      }
      toast.error('Save Failed', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  // Photo upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await profileService.uploadPhoto(file);
      const photoUrl = res.url || res.photo;
      setProfile((prev) => ({ ...prev, photo: photoUrl }));
      if (updateUserPhoto && photoUrl) {
        updateUserPhoto(photoUrl);
      }
      toast.success('Photo Updated', 'Your profile photo has been updated.');
    } catch (err) {
      console.error('Photo upload error:', err);
      const errorData = err.response?.data;
      const errorMsg = errorData?.photo
        ? (Array.isArray(errorData.photo) ? errorData.photo.join(', ') : String(errorData.photo))
        : 'Failed to upload profile photo.';
      toast.error('Upload Error', errorMsg);
    }
  };

  // Resume upload
  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await profileService.uploadResume(file);
      setProfile((prev) => ({ ...prev, resume: res }));
      toast.success('Resume Uploaded', `${file.name} has been uploaded successfully.`);
    } catch (err) {
      console.error('Resume upload error:', err);
      const errorData = err.response?.data;
      const errorMsg = errorData?.resume
        ? (Array.isArray(errorData.resume) ? errorData.resume.join(', ') : String(errorData.resume))
        : 'Failed to upload resume document.';
      toast.error('Upload Error', errorMsg);
    }
  };

  // Resume remove
  const handleRemoveResume = async () => {
    try {
      await profileService.updateSeekerProfile({ resume: null, resume_name: '' });
      setProfile((prev) => ({ ...prev, resume: null }));
      toast.info('Resume Removed', 'Your resume file was removed.');
    } catch {
      setProfile((prev) => ({ ...prev, resume: null }));
      toast.info('Resume Removed', 'Your resume file was removed.');
    }
  };

  // Skills
  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkill).trim();
    if (!trimmed) return;
    if (profile.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.warning('Duplicate', 'This skill is already in your list.');
      return;
    }
    setProfile((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Experience handlers
  const openAddExpModal = () => {
    setExpForm({
      index: null,
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    });
    setExpModalOpen(true);
  };

  const openEditExpModal = (exp, idx) => {
    setExpForm({
      index: idx,
      title: exp.title || '',
      company: exp.company || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      isCurrent: Boolean(exp.isCurrent),
      description: exp.description || '',
    });
    setExpModalOpen(true);
  };

  const handleSaveExp = async () => {
    const title = String(expForm.title || '').trim();
    const company = String(expForm.company || '').trim();
    if (!title || !company) {
      toast.error('Validation Error', 'Title and Company are required.');
      return;
    }
    const updated = [...(Array.isArray(profile.experience) ? profile.experience : [])];
    const item = {
      title,
      company,
      startDate: expForm.startDate || '',
      endDate: expForm.isCurrent ? null : (expForm.endDate || ''),
      isCurrent: Boolean(expForm.isCurrent),
      description: String(expForm.description || '').trim(),
    };

    if (expForm.index !== null) {
      updated[expForm.index] = item;
    } else {
      updated.unshift(item);
    }

    setProfile((prev) => ({ ...prev, experience: updated }));
    setExpModalOpen(false);

    try {
      await profileService.updateSeekerProfile({ experience: updated });
      toast.success('Experience Saved', 'Work experience has been saved to your profile.');
    } catch (err) {
      console.warn('Auto-save experience error:', err);
      toast.info('Experience Updated', 'Updated in editor. Click "Save All Changes" to confirm.');
    }
  };

  const handleDeleteExp = async (idx) => {
    const updated = profile.experience.filter((_, i) => i !== idx);
    setProfile((prev) => ({ ...prev, experience: updated }));
    try {
      await profileService.updateSeekerProfile({ experience: updated });
      toast.info('Removed', 'Experience entry deleted.');
    } catch (err) {
      console.warn('Delete experience auto-save error:', err);
      toast.info('Removed', 'Entry removed. Click "Save All Changes" to confirm.');
    }
  };

  // Education handlers
  const openAddEduModal = () => {
    setEduForm({
      index: null,
      degree: '',
      institution: '',
      startYear: '',
      endYear: '',
      grade: '',
    });
    setEduModalOpen(true);
  };

  const openEditEduModal = (edu, idx) => {
    setEduForm({
      index: idx,
      degree: edu.degree || '',
      institution: edu.institution || '',
      startYear: edu.startYear != null ? String(edu.startYear) : '',
      endYear: edu.endYear != null ? String(edu.endYear) : '',
      grade: edu.grade != null ? String(edu.grade) : '',
    });
    setEduModalOpen(true);
  };

  const handleSaveEdu = async () => {
    const degree = String(eduForm.degree || '').trim();
    const institution = String(eduForm.institution || '').trim();
    if (!degree || !institution) {
      toast.error('Validation Error', 'Degree and Institution are required.');
      return;
    }
    const updated = [...(Array.isArray(profile.education) ? profile.education : [])];
    const item = {
      degree,
      institution,
      startYear: String(eduForm.startYear || '').trim(),
      endYear: String(eduForm.endYear || '').trim(),
      grade: String(eduForm.grade || '').trim(),
    };

    if (eduForm.index !== null) {
      updated[eduForm.index] = item;
    } else {
      updated.push(item);
    }

    setProfile((prev) => ({ ...prev, education: updated }));
    setEduModalOpen(false);

    try {
      await profileService.updateSeekerProfile({ education: updated });
      toast.success('Education Saved', 'Education details have been saved to your profile.');
    } catch (err) {
      console.warn('Auto-save education error:', err);
      toast.info('Education Updated', 'Updated in editor. Click "Save All Changes" to confirm.');
    }
  };

  const handleDeleteEdu = async (idx) => {
    const updated = profile.education.filter((_, i) => i !== idx);
    setProfile((prev) => ({ ...prev, education: updated }));
    try {
      await profileService.updateSeekerProfile({ education: updated });
      toast.info('Removed', 'Education entry deleted.');
    } catch (err) {
      console.warn('Delete education auto-save error:', err);
      toast.info('Removed', 'Entry removed. Click "Save All Changes" to confirm.');
    }
  };

  // Project handlers
  const openAddProjectModal = () => {
    setProjectForm({
      index: null,
      name: '',
      description: '',
      technologies: '',
      githubUrl: '',
      liveUrl: '',
    });
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (proj, idx) => {
    setProjectForm({
      index: idx,
      name: proj.name || '',
      description: proj.description || '',
      technologies: Array.isArray(proj.technologies)
        ? proj.technologies.join(', ')
        : proj.technologies || '',
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
    });
    setProjectModalOpen(true);
  };

  const handleSaveProject = async () => {
    const name = String(projectForm.name || '').trim();
    const description = String(projectForm.description || '').trim();
    if (!name || !description) {
      toast.error('Validation Error', 'Project name and description are required.');
      return;
    }
    const updated = [...(Array.isArray(profile.projects) ? profile.projects : [])];
    const techArray = projectForm.technologies
      ? String(projectForm.technologies)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const item = {
      name,
      description,
      technologies: techArray,
      githubUrl: String(projectForm.githubUrl || '').trim() || null,
      liveUrl: String(projectForm.liveUrl || '').trim() || null,
    };

    if (projectForm.index !== null) {
      updated[projectForm.index] = item;
    } else {
      updated.push(item);
    }

    setProfile((prev) => ({ ...prev, projects: updated }));
    setProjectModalOpen(false);
    try {
      await profileService.updateSeekerProfile({ projects: updated });
      toast.success('Project Saved', 'Project details saved to your profile.');
    } catch (err) {
      console.warn('Auto-save project error:', err);
      toast.info('Project Updated', 'Updated in editor. Click "Save All Changes" to confirm.');
    }
  };

  const handleDeleteProject = async (idx) => {
    const updated = profile.projects.filter((_, i) => i !== idx);
    setProfile((prev) => ({ ...prev, projects: updated }));
    try {
      await profileService.updateSeekerProfile({ projects: updated });
      toast.info('Removed', 'Project entry deleted.');
    } catch (err) {
      console.warn('Delete project auto-save error:', err);
    }
  };

  // Certifications handlers
  const openAddCertModal = () => {
    setCertForm({
      index: null,
      name: '',
      issuer: '',
      date: '',
      credentialUrl: '',
    });
    setCertModalOpen(true);
  };

  const openEditCertModal = (cert, idx) => {
    setCertForm({
      index: idx,
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      credentialUrl: cert.credentialUrl || '',
    });
    setCertModalOpen(true);
  };

  const handleSaveCert = async () => {
    const name = String(certForm.name || '').trim();
    const issuer = String(certForm.issuer || '').trim();
    if (!name || !issuer) {
      toast.error('Validation Error', 'Certification name and issuer are required.');
      return;
    }
    const updated = [...(Array.isArray(profile.certifications) ? profile.certifications : [])];
    const item = {
      name,
      issuer,
      date: certForm.date || '',
      credentialUrl: String(certForm.credentialUrl || '').trim() || null,
    };

    if (certForm.index !== null) {
      updated[certForm.index] = item;
    } else {
      updated.push(item);
    }

    setProfile((prev) => ({ ...prev, certifications: updated }));
    setCertModalOpen(false);
    try {
      await profileService.updateSeekerProfile({ certifications: updated });
      toast.success('Certification Saved', 'Certification saved to your profile.');
    } catch (err) {
      console.warn('Auto-save certification error:', err);
      toast.info('Certification Updated', 'Updated in editor. Click "Save All Changes" to confirm.');
    }
  };

  const handleDeleteCert = async (idx) => {
    const updated = profile.certifications.filter((_, i) => i !== idx);
    setProfile((prev) => ({ ...prev, certifications: updated }));
    try {
      await profileService.updateSeekerProfile({ certifications: updated });
      toast.info('Removed', 'Certification entry deleted.');
    } catch (err) {
      console.warn('Delete certification auto-save error:', err);
    }
  };

  // Languages & Achievements helpers
  const handleAddLanguage = () => {
    const lang = newLang.trim();
    if (!lang) return;
    if (profile.languages.includes(lang)) {
      toast.warning('Duplicate', 'Language already added.');
      return;
    }
    setProfile((prev) => ({ ...prev, languages: [...prev.languages, lang] }));
    setNewLang('');
  };

  const handleRemoveLanguage = (lang) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }));
  };

  const handleAddAchievement = () => {
    const item = newAchievement.trim();
    if (!item) return;
    setProfile((prev) => ({
      ...prev,
      achievements: [...prev.achievements, item],
    }));
    setNewAchievement('');
  };

  const handleRemoveAchievement = (idx) => {
    setProfile((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== idx),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D12] flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-slate-400 font-medium">Loading your profile editor...</p>
      </div>
    );
  }

  const completion = calcProfileCompletion(profile);

  const TABS = [
    { id: 'personal', label: 'Personal & Bio', icon: User },
    { id: 'resume_skills', label: 'Resume & Skills', icon: FileText },
    { id: 'experience_edu', label: 'Experience & Education', icon: Briefcase },
    { id: 'projects_certs', label: 'Projects & Certifications', icon: FolderGit2 },
    { id: 'preferences_links', label: 'Preferences & Links', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 py-8 relative overflow-hidden">
      {/* Ambient glowing background blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* ─── Profile Header Banner ─────────────────────────────────────── */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Photo preview with upload button */}
              <div className="relative group">
                <img
                  src={
                    profile.photo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profile.fullName || user?.fullName || 'User'
                    )}&background=4f46e5&color=fff&size=120`
                  }
                  alt={profile.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/10 shadow-md group-hover:opacity-90 transition-all"
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg transition-transform hover:scale-105"
                  title="Upload New Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {/* Title & Info */}
              <div className="text-center sm:text-left space-y-1.5">
                <h1 className="text-2xl font-bold text-white">
                  {profile.fullName || user?.fullName || 'Arjun Sharma'}
                </h1>
                <p className="text-cyan-400 font-medium text-sm sm:text-base">
                  {profile.title || 'Full Stack Developer'}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-500" />
                    {profile.email || user?.email}
                  </span>
                  {profile.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-slate-500" />
                      {profile.phone}
                    </span>
                  )}
                  {profile.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      {profile.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Completion & Global Save */}
            <div className="flex flex-col items-center sm:items-end gap-3 w-full md:w-auto">
              <div className="w-full sm:w-48 bg-[#161C28] rounded-full h-2.5 overflow-hidden border border-white/5">
                <div
                  className="bg-cyan-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <p className="text-xs font-semibold text-slate-400">
                Profile Strength: <span className="text-cyan-400 font-bold">{completion}%</span>
              </p>

              <Button
                variant="primary"
                onClick={handleSaveProfile}
                loading={saving}
                icon={<Save className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-sm"
              >
                Save All Changes
              </Button>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="mt-8 border-t border-white/10 pt-4 flex overflow-x-auto gap-2 no-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 shadow-sm border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── TAB 1: Personal Details & Bio ────────────────────────────── */}
        {activeTab === 'personal' && (
          <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Personal Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Keep your core contact information up to date
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="e.g. Arjun Sharma"
                required
              />
              <Input
                label="Professional Headline"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                placeholder="e.g. Senior Frontend Developer | React, TypeScript"
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="name@example.com"
                required
              />
              <Input
                label="Phone Number"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
              />
              <div className="sm:col-span-2">
                <Input
                  label="Location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="e.g. Bengaluru, Karnataka, India"
                />
              </div>
            </div>

            {/* About / Bio */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-sm font-medium text-slate-300">
                Professional Summary / Bio
              </label>
              <textarea
                rows={5}
                value={profile.about}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                placeholder="Briefly describe your career background, expertise, key achievements, and what sets you apart..."
                className="w-full rounded-xl border border-white/10 bg-[#161C28] p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all leading-relaxed"
              />
              <p className="text-xs text-slate-500">
                Tip: Highlight your years of experience, core technical stack, and impactful project outcomes.
              </p>
            </div>
          </div>
        )}

        {/* ─── TAB 2: Resume & Skills ───────────────────────────────────── */}
        {activeTab === 'resume_skills' && (
          <div className="space-y-8">
            {/* Resume Section */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Resume Document
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Upload your latest resume (PDF, DOCX, up to 10MB)
                </p>
              </div>

              {profile.resume ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#161C28] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#121620] border border-white/10 text-cyan-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm sm:text-base">
                        {profile.resume.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Uploaded on {profile.resume.uploadedAt || 'Recently'} • PDF Document
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <a
                      href={profile.resume.url || '#'}
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info('Download', `Downloading ${profile.resume.name}...`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-[#121620] border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                    <button
                      type="button"
                      onClick={() => resumeInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#121620] border border-white/15 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Remove resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => resumeInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-cyan-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-[#161C28]/40 hover:bg-[#161C28]/70"
                >
                  <div className="mx-auto w-12 h-12 rounded-xl bg-[#121620] border border-white/10 flex items-center justify-center text-cyan-400 mb-3 shadow-sm">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200">
                    Click to upload or drag & drop your resume
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
                </div>
              )}

              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="hidden"
              />
            </div>

            {/* Skills Section */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-cyan-400" />
                  Skills & Proficiencies
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Highlight key technologies that match job listings
                </p>
              </div>

              {/* Add skill input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a skill (e.g. Next.js, Docker, Kubernetes)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 rounded-xl border border-white/10 bg-[#161C28] px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                />
                <Button variant="primary" onClick={() => handleAddSkill()} icon={<Plus className="w-4 h-4" />}>
                  Add
                </Button>
              </div>

              {/* Active skills list */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Your Skills ({profile.skills.length})
                </label>
                {profile.skills.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No skills added yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <SkillBadge
                        key={skill}
                        skill={skill}
                        onRemove={() => handleRemoveSkill(skill)}
                        size="md"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested Skills */}
              <div className="pt-4 border-t border-white/10">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Popular Suggestions
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SKILLS.filter(
                    (s) => !profile.skills.some((my) => my.toLowerCase() === s.toLowerCase())
                  ).map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[#161C28] text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300 border border-white/10 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-slate-500" />
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: Experience & Education ────────────────────────────── */}
        {activeTab === 'experience_edu' && (
          <div className="space-y-8">
            {/* Experience Section */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-cyan-400" />
                    Work Experience
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Your previous roles and employment history
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openAddExpModal}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Experience
                </Button>
              </div>

              {profile.experience.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No experience entries added yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-white/10 bg-[#161C28]/50 hover:bg-[#161C28] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-white text-base">{exp.title}</h4>
                          <p className="text-sm font-medium text-cyan-400">{exp.company}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {exp.startDate ? `${exp.startDate} – ` : ''}
                            {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                            {exp.isCurrent && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                Current
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => openEditExpModal(exp, idx)}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExp(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education Section */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-cyan-400" />
                    Education
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Degrees, colleges, and academic milestones
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openAddEduModal}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Education
                </Button>
              </div>

              {profile.education.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No education details added yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-white/10 bg-[#161C28]/50 hover:bg-[#161C28] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-white text-base">{edu.degree}</h4>
                          <p className="text-sm font-medium text-slate-300">{edu.institution}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {edu.startYear ? edu.startYear : ''}
                            {edu.endYear ? ` – ${edu.endYear}` : ''}
                            {edu.grade ? ` • Grade: ${edu.grade}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => openEditEduModal(edu, idx)}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEdu(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 4: Projects & Certifications ─────────────────────────── */}
        {activeTab === 'projects_certs' && (
          <div className="space-y-8">
            {/* Projects Section */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-cyan-400" />
                    Key Projects
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Showcase open source, portfolio, and hackathon accomplishments
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openAddProjectModal}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Project
                </Button>
              </div>

              {profile.projects.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No projects added yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-white/10 bg-[#161C28]/50 hover:bg-[#161C28] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-white text-base">{proj.name}</h4>
                          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                            {proj.description}
                          </p>

                          {/* Tech stack */}
                          {proj.technologies && proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {proj.technologies.map((t) => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 rounded-md bg-[#121620] border border-white/10 text-xs font-medium text-cyan-300"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Links */}
                          <div className="flex items-center gap-4 mt-3 text-xs">
                            {proj.githubUrl && (
                              <a
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-cyan-400 hover:underline font-semibold"
                              >
                                <Github className="w-3.5 h-3.5" />
                                Code Repository
                              </a>
                            )}
                            {proj.liveUrl && (
                              <a
                                href={proj.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => openEditProjectModal(proj, idx)}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certifications Section */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyan-400" />
                    Licenses & Certifications
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Credentials from recognized bodies (AWS, Meta, Google, etc.)
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openAddCertModal}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Certification
                </Button>
              </div>

              {profile.certifications.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No certifications listed yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-white/10 bg-[#161C28]/50 hover:bg-[#161C28] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-white text-base">{cert.name}</h4>
                          <p className="text-sm font-medium text-cyan-400">{cert.issuer}</p>
                          <p className="text-xs text-slate-400 mt-1">Issued: {cert.date || 'N/A'}</p>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline mt-2 font-medium"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Verify Credential
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => openEditCertModal(cert, idx)}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCert(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 5: Preferences & Additional Info ─────────────────────── */}
        {activeTab === 'preferences_links' && (
          <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 space-y-8">
            {/* Preferred Role & Salary */}
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                <Compass className="w-5 h-5 text-cyan-400" />
                Job Preferences
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-5">
                Set your target role and salary expectations
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Target Job Title"
                  value={profile.preferredRole}
                  onChange={(e) => setProfile({ ...profile, preferredRole: e.target.value })}
                  placeholder="e.g. Lead Frontend Engineer"
                />
                <Input
                  label="Preferred Location"
                  value={profile.preferredLocation}
                  onChange={(e) => setProfile({ ...profile, preferredLocation: e.target.value })}
                  placeholder="e.g. Bengaluru / Remote"
                />
                <Select
                  label="Job Type"
                  value={profile.preferredJobType}
                  onChange={(e) => setProfile({ ...profile, preferredJobType: e.target.value })}
                  options={JOB_TYPES}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Expected Min (₹/yr)"
                    type="number"
                    value={profile.expectedSalaryMin || ''}
                    onChange={(e) =>
                      setProfile({ ...profile, expectedSalaryMin: Number(e.target.value) })
                    }
                    placeholder="1200000"
                  />
                  <Input
                    label="Expected Max (₹/yr)"
                    type="number"
                    value={profile.expectedSalaryMax || ''}
                    onChange={(e) =>
                      setProfile({ ...profile, expectedSalaryMax: Number(e.target.value) })
                    }
                    placeholder="2000000"
                  />
                </div>
              </div>
            </div>

            {/* Social / Portfolio Links */}
            <div className="pt-6 border-t border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                <Globe className="w-5 h-5 text-cyan-400" />
                Online Profiles & Links
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-5">
                Provide links to your code repositories, LinkedIn, and personal portfolio
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Input
                  label="GitHub Profile URL"
                  icon={<Github className="w-4 h-4" />}
                  value={profile.github}
                  onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  placeholder="https://github.com/..."
                />
                <Input
                  label="LinkedIn Profile URL"
                  icon={<Linkedin className="w-4 h-4" />}
                  value={profile.linkedin}
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
                <Input
                  label="Personal Portfolio"
                  icon={<Globe className="w-4 h-4" />}
                  value={profile.portfolio}
                  onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                  placeholder="https://yourname.dev"
                />
              </div>
            </div>

            {/* Languages */}
            <div className="pt-6 border-t border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                <Languages className="w-5 h-5 text-cyan-400" />
                Languages Known
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-4">
                Languages you can communicate or write in comfortably
              </p>

              <div className="flex gap-2 max-w-md mb-3">
                <input
                  type="text"
                  placeholder="Add language (e.g. English, Hindi, German)..."
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLanguage();
                    }
                  }}
                  className="flex-1 rounded-xl border border-white/10 bg-[#161C28] px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                />
                <Button variant="outline" size="sm" onClick={handleAddLanguage}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161C28] text-slate-200 border border-white/10 text-xs font-semibold"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(lang)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Career Objective & Achievements */}
            <div className="pt-6 border-t border-white/10 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Career Objective
                </label>
                <textarea
                  rows={3}
                  value={profile.careerObjective}
                  onChange={(e) => setProfile({ ...profile, careerObjective: e.target.value })}
                  placeholder="Your long-term career aspirations and target domains..."
                  className="w-full rounded-xl border border-white/10 bg-[#161C28] p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Key Achievements & Awards
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="e.g. Winner at Smart India Hackathon 2021..."
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAchievement();
                      }
                    }}
                    className="flex-1 rounded-xl border border-white/10 bg-[#161C28] px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddAchievement}>
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {profile.achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#161C28]/60 border border-white/10 rounded-xl flex items-start justify-between gap-3 text-xs sm:text-sm text-slate-300"
                    >
                      <span>🏆 {ach}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievement(idx)}
                        className="text-slate-400 hover:text-rose-400 flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Bottom Floating Save Bar ─────────────────────────────────── */}
        <div className="sticky bottom-6 z-20 bg-[#121620]/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/15 flex items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-400 font-medium hidden sm:block">
            Make sure to save your changes before leaving this page.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              variant="primary"
              onClick={handleSaveProfile}
              loading={saving}
              icon={<Save className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Save All Changes
            </Button>
          </div>
        </div>

        {/* ─── Experience Modal ─────────────────────────────────────────── */}
        <Modal
          isOpen={expModalOpen}
          onClose={() => setExpModalOpen(false)}
          title={expForm.index !== null ? 'Edit Experience' : 'Add Experience'}
          size="lg"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setExpModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveExp}>
                Save Experience
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Job Title"
              value={expForm.title}
              onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
              placeholder="e.g. Software Engineer"
              required
            />
            <Input
              label="Company Name"
              value={expForm.company}
              onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
              placeholder="e.g. Freshworks Inc."
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="month"
                value={expForm.startDate}
                onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                required
              />
              <Input
                label="End Date"
                type="month"
                disabled={expForm.isCurrent}
                value={expForm.endDate}
                onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={expForm.isCurrent}
                onChange={(e) => setExpForm({ ...expForm, isCurrent: e.target.checked })}
                className="rounded text-cyan-500 focus:ring-cyan-500/50 bg-[#161C28] border-white/20"
              />
              I currently work in this role
            </label>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Role Description / Achievements
              </label>
              <textarea
                rows={4}
                value={expForm.description}
                onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                placeholder="Key responsibilities, technologies used, and outcomes achieved..."
                className="w-full rounded-xl border border-white/10 bg-[#161C28] p-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>
        </Modal>

        {/* ─── Education Modal ──────────────────────────────────────────── */}
        <Modal
          isOpen={eduModalOpen}
          onClose={() => setEduModalOpen(false)}
          title={eduForm.index !== null ? 'Edit Education' : 'Add Education'}
          size="md"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEduModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveEdu}>
                Save Education
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Degree / Certificate"
              value={eduForm.degree}
              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              placeholder="e.g. B.Tech in Computer Science"
              required
            />
            <Input
              label="Institution / University"
              value={eduForm.institution}
              onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
              placeholder="e.g. NIT Surathkal"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Year"
                value={eduForm.startYear}
                onChange={(e) => setEduForm({ ...eduForm, startYear: e.target.value })}
                placeholder="2018"
              />
              <Input
                label="End Year"
                value={eduForm.endYear}
                onChange={(e) => setEduForm({ ...eduForm, endYear: e.target.value })}
                placeholder="2022"
              />
            </div>
            <Input
              label="Grade / CGPA"
              value={eduForm.grade}
              onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
              placeholder="e.g. 8.4 CGPA or 85%"
            />
          </div>
        </Modal>

        {/* ─── Project Modal ────────────────────────────────────────────── */}
        <Modal
          isOpen={projectModalOpen}
          onClose={() => setProjectModalOpen(false)}
          title={projectForm.index !== null ? 'Edit Project' : 'Add Project'}
          size="lg"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setProjectModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveProject}>
                Save Project
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Project Title"
              value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              placeholder="e.g. DevConnect – Networking App"
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Project Description
              </label>
              <textarea
                rows={3}
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Explain what the project solves, technical architecture, and results..."
                className="w-full rounded-xl border border-white/10 bg-[#161C28] p-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50"
                required
              />
            </div>
            <Input
              label="Technologies (comma separated)"
              value={projectForm.technologies}
              onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
              placeholder="React.js, Node.js, Socket.io, MongoDB"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="GitHub URL"
                value={projectForm.githubUrl}
                onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
              />
              <Input
                label="Live Demo URL"
                value={projectForm.liveUrl}
                onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        </Modal>

        {/* ─── Certification Modal ──────────────────────────────────────── */}
        <Modal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          title={certForm.index !== null ? 'Edit Certification' : 'Add Certification'}
          size="md"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setCertModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveCert}>
                Save Certification
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Certification Name"
              value={certForm.name}
              onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
              placeholder="e.g. AWS Solutions Architect Associate"
              required
            />
            <Input
              label="Issuing Organization"
              value={certForm.issuer}
              onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
              placeholder="e.g. Amazon Web Services"
              required
            />
            <Input
              label="Issue Date"
              type="month"
              value={certForm.date}
              onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
            />
            <Input
              label="Credential URL"
              value={certForm.credentialUrl}
              onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
              placeholder="https://credly.com/..."
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}
