import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Download,
  Upload,
  Save,
  Eye,
  Edit3,
  Bot,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Languages as LangIcon,
  Layers,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { aiResumeService } from '@/api/aiResumeService';
import ClassicATSTemplate from '@/components/ai-resume/templates/ClassicATSTemplate';
import ModernProfessionalTemplate from '@/components/ai-resume/templates/ModernProfessionalTemplate';
import DeveloperTemplate from '@/components/ai-resume/templates/DeveloperTemplate';
import ResumeScoreCard from '@/components/ai-resume/ResumeScoreCard';
import ATSJobMatcher from '@/components/ai-resume/ATSJobMatcher';
import TailorResumePanel from '@/components/ai-resume/TailorResumePanel';
import AIChatDrawer from '@/components/ai-resume/AIChatDrawer';
import ResumeUploadModal from '@/components/ai-resume/ResumeUploadModal';

const INITIAL_RESUME = {
  title: 'My Professional Resume',
  template: 'classic_ats',
  personal_info: {
    full_name: 'Arjun Sharma',
    email: 'arjun.sharma@email.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, Karnataka, India',
    linkedin: 'linkedin.com/in/arjunsharma',
    github: 'github.com/arjunsharma',
    portfolio: 'arjunsharma.dev',
  },
  career_info: {
    target_role: 'Full Stack Developer',
    objective: 'Results-driven Full Stack Developer with 4+ years of experience engineering scalable web applications, RESTful microservices, and modern user experiences.',
    summary: 'Dedicated Software Engineer specializing in React, Node.js, and Python/Django ecosystems. Proven track record reducing page load times by 40% and deploying mission-critical cloud applications with 99.9% uptime.',
    skills: [
      'React.js',
      'JavaScript (ES6+)',
      'TypeScript',
      'Node.js',
      'Python',
      'Django REST Framework',
      'PostgreSQL',
      'Docker',
      'Tailwind CSS',
      'REST APIs',
      'Git',
      'CI/CD Pipelines',
    ],
  },
  education: [
    {
      degree: 'B.Tech in Computer Science and Engineering',
      institution: 'National Institute of Technology',
      location: 'Bangalore, India',
      start_date: '2018',
      end_date: '2022',
      grade: '8.8 CGPA',
    },
  ],
  experience: [
    {
      title: 'Senior Frontend Engineer',
      company: 'Panisudar Technologies',
      location: 'Bangalore, India',
      start_date: '2022',
      end_date: 'Present',
      is_current: true,
      description: '• Architected and developed a responsive client portal serving 50,000+ active monthly users.\n• Implemented automated CI/CD workflows and unit test suites, raising code coverage from 60% to 92%.\n• Optimized web asset bundles and caching strategies, improving Lighthouse performance score to 98.',
    },
  ],
  projects: [
    {
      title: 'AI Resume Assistant & Scoring Engine',
      tech_stack: 'React, Django REST Framework, Python NLP, Tailwind CSS',
      live_url: 'https://panisudar.com/ai-resume',
      github_url: 'https://github.com/arjunsharma/panisudar-resume-ai',
      description: '• Engineered a full-stack applicant tracking simulator with automated scoring across 10 rubrics.\n• Integrated multi-format text extraction for PDF and DOCX documents with sub-second response times.\n• Designed 3 responsive resume layouts featuring high-fidelity print styling and PDF exports.',
    },
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023',
      credential_url: 'https://aws.amazon.com/verification',
    },
  ],
  achievements: [
    { description: 'Winner of National Smart India Hackathon 2021 (Top team out of 1,200 participants).' },
    { description: 'Authored 10+ technical deep-dive articles on frontend performance with 80k+ reads.' },
  ],
  languages: [
    { name: 'English', proficiency: 'Fluent / Professional' },
    { name: 'Hindi', proficiency: 'Native' },
  ],
};

export default function AiResumePage() {
  const [resume, setResume] = useState(INITIAL_RESUME);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview' | 'ats' | 'tailor'
  const [activeSection, setActiveSection] = useState('personal'); // 'personal', 'career', 'education', 'experience', 'projects', 'certifications', 'achievements', 'languages'
  const [scoreData, setScoreData] = useState(null);
  const [isScoring, setIsScoring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [enhancingSection, setEnhancingSection] = useState(null);

  // Template ref for printing
  const printAreaRef = useRef(null);

  // Load existing resumes or initial score on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const userResumes = await aiResumeService.listResumes();
      if (userResumes && userResumes.length > 0) {
        setResume(userResumes[0]);
        calculateScore(userResumes[0]);
      } else {
        calculateScore(INITIAL_RESUME);
      }
    } catch {
      calculateScore(INITIAL_RESUME);
    }
  };

  const calculateScore = async (resumeDataToScore = resume) => {
    setIsScoring(true);
    try {
      const result = await aiResumeService.calculateScore(resumeDataToScore, resumeDataToScore.id);
      setScoreData(result);
    } catch (err) {
      console.error('Error calculating score:', err);
    } finally {
      setIsScoring(false);
    }
  };

  const handleSaveResume = async () => {
    setIsSaving(true);
    setSaveStatus('Saving...');
    try {
      let saved;
      if (resume.id) {
        saved = await aiResumeService.updateResume(resume.id, resume);
      } else {
        saved = await aiResumeService.createResume(resume);
      }
      setResume(saved);
      setSaveStatus('Saved successfully!');
      calculateScore(saved);
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('Failed to save');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Update top-level resume field
  const updateField = (key, val) => {
    setResume((prev) => ({ ...prev, [key]: val }));
  };

  // Update personal_info
  const updatePersonalInfo = (field, val) => {
    setResume((prev) => ({
      ...prev,
      personal_info: { ...prev.personal_info, [field]: val },
    }));
  };

  // Update career_info
  const updateCareerInfo = (field, val) => {
    setResume((prev) => ({
      ...prev,
      career_info: { ...prev.career_info, [field]: val },
    }));
  };

  // Skills handlers
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const current = resume.career_info?.skills || [];
    if (!current.includes(newSkill.trim())) {
      updateCareerInfo('skills', [...current, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const current = resume.career_info?.skills || [];
    updateCareerInfo('skills', current.filter((s) => s !== skillToRemove));
  };

  // Generic repeatable list helpers
  const addItem = (sectionKey, emptyItem) => {
    const list = Array.isArray(resume[sectionKey]) ? [...resume[sectionKey]] : [];
    updateField(sectionKey, [...list, emptyItem]);
  };

  const updateItem = (sectionKey, index, updatedItem) => {
    const list = [...(resume[sectionKey] || [])];
    list[index] = updatedItem;
    updateField(sectionKey, list);
  };

  const removeItem = (sectionKey, index) => {
    const list = [...(resume[sectionKey] || [])];
    list.splice(index, 1);
    updateField(sectionKey, list);
  };

  const moveItem = (sectionKey, index, direction) => {
    const list = [...(resume[sectionKey] || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    updateField(sectionKey, list);
  };

  // Inline AI Improvement actions
  const handleEnhanceContent = async (section, options = {}) => {
    setEnhancingSection(section);
    try {
      const payload = {
        section,
        target_role: resume.career_info?.target_role || 'Software Engineer',
        resume_data: resume,
        ...options,
      };
      const res = await aiResumeService.improveContent(payload);

      if (section === 'summary' && res.improved_text) {
        updateCareerInfo('summary', res.improved_text);
      } else if (section === 'objective' && res.improved_text) {
        updateCareerInfo('objective', res.improved_text);
      } else if (section === 'skills' && res.suggested_skills) {
        const current = resume.career_info?.skills || [];
        const merged = Array.from(new Set([...current, ...res.suggested_skills]));
        updateCareerInfo('skills', merged);
      } else if (section === 'project_description' && options.index !== undefined && res.improved_text) {
        const proj = resume.projects[options.index];
        updateItem('projects', options.index, { ...proj, description: res.improved_text });
      } else if (section === 'experience_bullets' && options.index !== undefined && res.improved_text) {
        const exp = resume.experience[options.index];
        updateItem('experience', options.index, { ...exp, description: res.improved_text });
      }
    } catch (err) {
      alert('AI enhancement encountered an error. Please try again.');
    } finally {
      setEnhancingSection(null);
    }
  };

  const handleUploadSuccess = (parsedData) => {
    if (parsedData.resume) {
      const raw = parsedData.resume;
      const normalized = {
        ...raw,
        personal_info: raw.personal_info || {
          full_name: raw.full_name || '',
          email: raw.email || '',
          phone: raw.phone || '',
          location: raw.location || '',
          linkedin: raw.linkedin || '',
          github: raw.github || '',
          portfolio: raw.portfolio || '',
        },
        career_info: raw.career_info || {
          target_role: raw.professional_title || raw.target_role || '',
          objective: raw.career_objective || raw.objective || '',
          summary: raw.professional_summary || raw.summary || '',
          skills: raw.skills || [],
        },
      };
      setResume(normalized);
      if (parsedData.score) {
        setScoreData(parsedData.score);
      } else {
        calculateScore(normalized);
      }
    }
  };

  const renderActiveTemplate = () => {
    const props = { resume };
    if (resume.template === 'modern_professional') {
      return <ModernProfessionalTemplate {...props} />;
    }
    if (resume.template === 'developer') {
      return <DeveloperTemplate {...props} />;
    }
    return <ClassicATSTemplate {...props} />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* ─── Top Command Bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">
                Panisudar Job Portal
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-semibold text-indigo-300">
                AI Studio 2.0
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              AI Resume Assistant
            </h1>
          </div>
        </div>

        {/* Center: Main View Tabs */}
        <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'editor'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Resume Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ats')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'ats'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            ATS & Job Matcher
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tailor')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'tailor'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Tailor for JD
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            Upload PDF/DOCX
          </button>

          <button
            type="button"
            onClick={handleSaveResume}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            {saveStatus || 'Save'}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-medium shadow-md shadow-cyan-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>

          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 hover:text-cyan-300 transition-all"
            title="Open AI Chat Assistant"
          >
            <Bot className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          </button>
        </div>
      </header>

      {/* ─── Main Content Layout ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ─── View 1: RESUME EDITOR ─────────────────────────────────────── */}
        {activeTab === 'editor' && (
          <>
            {/* Left Nav: Sections List */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1 shadow-lg">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Resume Sections
                </div>

                {[
                  { id: 'personal', label: 'Personal Information', icon: FileText },
                  { id: 'career', label: 'Career & Summary', icon: Sparkles },
                  { id: 'skills', label: 'Technical & Soft Skills', icon: Layers },
                  { id: 'education', label: 'Education History', icon: GraduationCap },
                  { id: 'experience', label: 'Work Experience', icon: Briefcase },
                  { id: 'projects', label: 'Key Projects', icon: FolderGit2 },
                  { id: 'certifications', label: 'Certifications', icon: Award },
                  { id: 'achievements', label: 'Honors & Achievements', icon: Award },
                  { id: 'languages', label: 'Languages', icon: LangIcon },
                ].map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveSection(sec.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        activeSection === sec.id
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-cyan-400" />
                        <span>{sec.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Template Picker Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Template
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'classic_ats', name: 'Classic ATS', desc: '100% Machine-Readable & Standardized' },
                    { id: 'modern_professional', name: 'Modern Professional', desc: 'Executive Slate & Sapphire Accent' },
                    { id: 'developer', name: 'Developer & Tech', desc: 'Clean Monospace Accents & Tags' },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => updateField('template', tpl.id)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                        resume.template === tpl.id
                          ? 'border-cyan-500/60 bg-cyan-950/20 text-white'
                          : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{tpl.name}</div>
                      <div className="text-[10px] text-slate-400">{tpl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle: Active Section Form */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Section 1: Personal Info */}
              {activeSection === 'personal' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white">Personal Information</h3>
                    <p className="text-xs text-slate-400">Essential contact details for recruiters and ATS</p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={resume.personal_info?.full_name || ''}
                        onChange={(e) => updatePersonalInfo('full_name', e.target.value)}
                        placeholder="e.g. Arjun Sharma"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 font-medium block mb-1">Email Address *</label>
                        <input
                          type="email"
                          value={resume.personal_info?.email || ''}
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                          placeholder="arjun@example.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-medium block mb-1">Phone Number *</label>
                        <input
                          type="text"
                          value={resume.personal_info?.phone || ''}
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Location *</label>
                      <input
                        type="text"
                        value={resume.personal_info?.location || ''}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        placeholder="City, State, Country"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-300 font-medium block mb-1">LinkedIn Profile</label>
                        <input
                          type="text"
                          value={resume.personal_info?.linkedin || ''}
                          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-medium block mb-1">GitHub / Code</label>
                        <input
                          type="text"
                          value={resume.personal_info?.github || ''}
                          onChange={(e) => updatePersonalInfo('github', e.target.value)}
                          placeholder="github.com/..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-medium block mb-1">Portfolio / Web</label>
                        <input
                          type="text"
                          value={resume.personal_info?.portfolio || ''}
                          onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                          placeholder="yourdomain.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: Career & Summary */}
              {activeSection === 'career' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white">Target Role & Executive Summary</h3>
                    <p className="text-xs text-slate-400">Positioning and career elevator pitch</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Target Job Title</label>
                      <input
                        type="text"
                        value={resume.career_info?.target_role || ''}
                        onChange={(e) => updateCareerInfo('target_role', e.target.value)}
                        placeholder="e.g. Senior Full Stack Engineer"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-300 font-medium">Career Objective</label>
                        <button
                          type="button"
                          onClick={() => handleEnhanceContent('objective')}
                          disabled={enhancingSection === 'objective'}
                          className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                          <Sparkles className="w-3 h-3" />
                          {enhancingSection === 'objective' ? 'Enhancing...' : 'AI Enhance'}
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={resume.career_info?.objective || ''}
                        onChange={(e) => updateCareerInfo('objective', e.target.value)}
                        placeholder="State your immediate career trajectory..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-300 font-medium">Professional Summary (ATS High-Impact)</label>
                        <button
                          type="button"
                          onClick={() => handleEnhanceContent('summary')}
                          disabled={enhancingSection === 'summary'}
                          className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                          <Sparkles className="w-3 h-3" />
                          {enhancingSection === 'summary' ? 'Enhancing...' : 'AI Enhance'}
                        </button>
                      </div>
                      <textarea
                        rows={5}
                        value={resume.career_info?.summary || ''}
                        onChange={(e) => updateCareerInfo('summary', e.target.value)}
                        placeholder="Summarize your years of experience, core technical stack, and biggest achievements..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: Skills */}
              {activeSection === 'skills' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Skills Matrix</h3>
                      <p className="text-xs text-slate-400">Critical for keyword matching & ATS parsers</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEnhanceContent('skills')}
                      disabled={enhancingSection === 'skills'}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium hover:bg-indigo-600/40 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      {enhancingSection === 'skills' ? 'Analyzing...' : 'Suggest Skills'}
                    </button>
                  </div>

                  {/* Add skill input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      placeholder="Add a skill (e.g. React.js, Python, AWS, Docker)..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                    >
                      Add
                    </button>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(resume.career_info?.skills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-slate-400 hover:text-rose-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {(resume.career_info?.skills || []).length === 0 && (
                      <div className="text-xs text-slate-500 italic">No skills added yet.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 4: Education */}
              {activeSection === 'education' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Education History</h3>
                      <p className="text-xs text-slate-400">Degrees, institutions, and dates</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addItem('education', {
                          degree: '',
                          institution: '',
                          location: '',
                          start_date: '',
                          end_date: '',
                          grade: '',
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Education
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(resume.education || []).map((edu, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-cyan-400">Education #{idx + 1}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveItem('education', idx, -1)}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem('education', idx, 1)}
                              disabled={idx === (resume.education || []).length - 1}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem('education', idx)}
                              className="p-1 text-slate-400 hover:text-rose-400 ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-slate-400 block mb-1">Degree / Major</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateItem('education', idx, { ...edu, degree: e.target.value })}
                              placeholder="B.Tech Computer Science"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">Institution / University</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateItem('education', idx, { ...edu, institution: e.target.value })}
                              placeholder="University Name"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-slate-400 block mb-1">Location</label>
                            <input
                              type="text"
                              value={edu.location}
                              onChange={(e) => updateItem('education', idx, { ...edu, location: e.target.value })}
                              placeholder="City, Country"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">Years (Start - End)</label>
                            <input
                              type="text"
                              value={`${edu.start_date || ''} - ${edu.end_date || ''}`}
                              onChange={(e) => {
                                const parts = e.target.value.split('-');
                                updateItem('education', idx, {
                                  ...edu,
                                  start_date: parts[0]?.trim() || '',
                                  end_date: parts[1]?.trim() || '',
                                });
                              }}
                              placeholder="2018 - 2022"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">Grade / GPA</label>
                            <input
                              type="text"
                              value={edu.grade}
                              onChange={(e) => updateItem('education', idx, { ...edu, grade: e.target.value })}
                              placeholder="8.5 CGPA / 3.8 GPA"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 5: Experience */}
              {activeSection === 'experience' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Work Experience</h3>
                      <p className="text-xs text-slate-400">Accomplishments with measurable impact</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addItem('experience', {
                          title: '',
                          company: '',
                          location: '',
                          start_date: '',
                          end_date: '',
                          is_current: false,
                          description: '• ',
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Position
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(resume.experience || []).map((exp, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-cyan-400">Role #{idx + 1}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveItem('experience', idx, -1)}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem('experience', idx, 1)}
                              disabled={idx === (resume.experience || []).length - 1}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem('experience', idx)}
                              className="p-1 text-slate-400 hover:text-rose-400 ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-slate-400 block mb-1">Job Title</label>
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => updateItem('experience', idx, { ...exp, title: e.target.value })}
                              placeholder="Senior Software Engineer"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateItem('experience', idx, { ...exp, company: e.target.value })}
                              placeholder="Company Name"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-slate-400 block mb-1">Location</label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => updateItem('experience', idx, { ...exp, location: e.target.value })}
                              placeholder="City, Country"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">Dates</label>
                            <input
                              type="text"
                              value={`${exp.start_date || ''} - ${exp.end_date || ''}`}
                              onChange={(e) => {
                                const parts = e.target.value.split('-');
                                updateItem('experience', idx, {
                                  ...exp,
                                  start_date: parts[0]?.trim() || '',
                                  end_date: parts[1]?.trim() || '',
                                });
                              }}
                              placeholder="2021 - Present"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                            />
                          </div>
                          <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                              <input
                                type="checkbox"
                                checked={exp.is_current || false}
                                onChange={(e) => updateItem('experience', idx, { ...exp, is_current: e.target.checked })}
                                className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
                              />
                              <span>Current Position</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-slate-400">Accomplishments & Bullet Points</label>
                            <button
                              type="button"
                              onClick={() =>
                                handleEnhanceContent('experience_bullets', {
                                  index: idx,
                                  company: exp.company,
                                  rawText: exp.description,
                                })
                              }
                              disabled={enhancingSection === 'experience_bullets'}
                              className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                            >
                              <Sparkles className="w-3 h-3" />
                              AI Polish Bullets
                            </button>
                          </div>
                          <textarea
                            rows={4}
                            value={exp.description || ''}
                            onChange={(e) => updateItem('experience', idx, { ...exp, description: e.target.value })}
                            placeholder="• Action verb + measurable metric (e.g., Improved latency by 35%...)"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 6: Projects */}
              {activeSection === 'projects' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Key Projects</h3>
                      <p className="text-xs text-slate-400">Personal or open-source high-impact work</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addItem('projects', {
                          title: '',
                          tech_stack: '',
                          live_url: '',
                          github_url: '',
                          description: '• ',
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Project
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(resume.projects || []).map((proj, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-cyan-400">Project #{idx + 1}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveItem('projects', idx, -1)}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem('projects', idx, 1)}
                              disabled={idx === (resume.projects || []).length - 1}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem('projects', idx)}
                              className="p-1 text-slate-400 hover:text-rose-400 ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-slate-400 block mb-1">Project Name</label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => updateItem('projects', idx, { ...proj, title: e.target.value })}
                              placeholder="e.g. Distributed Task Scheduler"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">Tech Stack</label>
                            <input
                              type="text"
                              value={proj.tech_stack}
                              onChange={(e) => updateItem('projects', idx, { ...proj, tech_stack: e.target.value })}
                              placeholder="React, Go, Redis, Docker"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-slate-400 block mb-1">Live Demo URL</label>
                            <input
                              type="text"
                              value={proj.live_url}
                              onChange={(e) => updateItem('projects', idx, { ...proj, live_url: e.target.value })}
                              placeholder="https://..."
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">GitHub / Code URL</label>
                            <input
                              type="text"
                              value={proj.github_url}
                              onChange={(e) => updateItem('projects', idx, { ...proj, github_url: e.target.value })}
                              placeholder="https://github.com/..."
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-slate-400">Description & Impact</label>
                            <button
                              type="button"
                              onClick={() =>
                                handleEnhanceContent('project_description', {
                                  index: idx,
                                  projectName: proj.title,
                                  techStack: proj.tech_stack,
                                  rawText: proj.description,
                                })
                              }
                              disabled={enhancingSection === 'project_description'}
                              className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                            >
                              <Sparkles className="w-3 h-3" />
                              AI Enhance Description
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={proj.description || ''}
                            onChange={(e) => updateItem('projects', idx, { ...proj, description: e.target.value })}
                            placeholder="• Highlight problem solved, architecture, and quantifiable outcomes"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 7: Certifications */}
              {activeSection === 'certifications' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Certifications & Licenses</h3>
                      <p className="text-xs text-slate-400">Recognized industry credentials</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addItem('certifications', {
                          name: '',
                          issuer: '',
                          date: '',
                          credential_url: '',
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Certificate
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(resume.certifications || []).map((cert, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-cyan-400">Credential #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeItem('certifications', idx)}
                            className="p-1 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateItem('certifications', idx, { ...cert, name: e.target.value })}
                            placeholder="Certificate Name"
                            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                          />
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateItem('certifications', idx, { ...cert, issuer: e.target.value })}
                            placeholder="Issuing Organization"
                            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 8: Achievements */}
              {activeSection === 'achievements' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Honors & Achievements</h3>
                      <p className="text-xs text-slate-400">Awards, hackathons, and published articles</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addItem('achievements', { description: '' })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Achievement
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(resume.achievements || []).map((ach, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <input
                          type="text"
                          value={ach.description}
                          onChange={(e) => updateItem('achievements', idx, { description: e.target.value })}
                          placeholder="e.g. Winner of Smart India Hackathon..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem('achievements', idx)}
                          className="p-2 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 9: Languages */}
              {activeSection === 'languages' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Languages</h3>
                      <p className="text-xs text-slate-400">Spoken and written proficiencies</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addItem('languages', { name: '', proficiency: 'Fluent' })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Language
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(resume.languages || []).map((lang, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <input
                          type="text"
                          value={lang.name}
                          onChange={(e) => updateItem('languages', idx, { ...lang, name: e.target.value })}
                          placeholder="Language (e.g. English, French)"
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                        />
                        <input
                          type="text"
                          value={lang.proficiency}
                          onChange={(e) => updateItem('languages', idx, { ...lang, proficiency: e.target.value })}
                          placeholder="Proficiency (e.g. Fluent, Native)"
                          className="w-36 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem('languages', idx)}
                          className="p-2 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Live Miniature Preview & Quick Score */}
            <div className="lg:col-span-4 space-y-5">
              <ResumeScoreCard
                scoreData={scoreData}
                loading={isScoring}
                onRefreshScore={() => calculateScore(resume)}
              />

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    Real-time Layout Preview
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Full Screen →
                  </button>
                </div>
                <div className="max-h-[500px] overflow-y-auto rounded-xl border border-slate-800 shadow-inner no-scrollbar">
                  <div className="scale-[0.8] origin-top transform-gpu -mb-28">
                    {renderActiveTemplate()}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ─── View 2: FULL LIVE PREVIEW ─────────────────────────────────── */}
        {activeTab === 'preview' && (
          <div className="lg:col-span-12 space-y-4">
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Template Mode:
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'classic_ats', label: 'Classic ATS' },
                    { id: 'modern_professional', label: 'Modern Professional' },
                    { id: 'developer', label: 'Developer' },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => updateField('template', tpl.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        resume.template === tpl.id
                          ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20"
                >
                  <Download className="w-4 h-4" />
                  Print / Save as PDF
                </button>
              </div>
            </div>

            <div className="flex justify-center bg-slate-950 py-8 px-2 overflow-x-auto">
              <div
                ref={printAreaRef}
                className="w-full max-w-[850px] shadow-2xl rounded-sm overflow-hidden"
              >
                {renderActiveTemplate()}
              </div>
            </div>
          </div>
        )}

        {/* ─── View 3: ATS & JOB MATCHER ─────────────────────────────────── */}
        {activeTab === 'ats' && (
          <div className="lg:col-span-12">
            <ATSJobMatcher resume={resume} />
          </div>
        )}

        {/* ─── View 4: TAILOR FOR JD ─────────────────────────────────────── */}
        {activeTab === 'tailor' && (
          <div className="lg:col-span-12">
            <TailorResumePanel
              resume={resume}
              onApplyChanges={(changes) => {
                setResume((prev) => ({
                  ...prev,
                  ...changes,
                }));
                // recalculate score after tailoring
                setTimeout(() => calculateScore({ ...resume, ...changes }), 500);
              }}
            />
          </div>
        )}
      </main>

      {/* ─── Floating AI Chat Trigger (when closed) ────────────────────── */}
      {!chatOpen && (
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="fixed bottom-20 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-2xl shadow-cyan-500/30 transition-all transform hover:scale-105"
        >
          <Bot className="w-5 h-5" />
          <span>Ask AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      )}

      {/* ─── AIChatDrawer Component ─────────────────────────────────────── */}
      <AIChatDrawer
        resume={resume}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      {/* ─── ResumeUploadModal Component ────────────────────────────────── */}
      <ResumeUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
