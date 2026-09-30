import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  DollarSign,
  Calendar,
  FileText,
  ListPlus,
  Plus,
  Trash2,
  CheckCircle,
  Eye,
  Sparkles,
  HelpCircle,
  Building2,
  MapPin,
  Tag,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { employerService } from '@/api/employerService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Modal from '@/components/common/Modal';
import SkillBadge from '@/components/common/SkillBadge';
import EmployerHeader from './EmployerHeader';
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  WORK_MODES,
  EXPERIENCE_LEVELS,
} from '@/utils/constants';
import { formatSalary } from '@/utils/helpers';
import { validateJobForm } from '@/utils/validators';

const POPULAR_SKILLS = [
  'React.js',
  'Node.js',
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'Docker',
  'AWS',
  'PostgreSQL',
  'MongoDB',
  'GraphQL',
  'Figma',
  'Tailwind CSS',
  'Next.js',
  'Kubernetes',
];

const PRESET_BENEFITS = [
  'Competitive salary with ESOPs / Equity',
  'Comprehensive health & dental insurance for family',
  'Flexible hybrid or remote work culture',
  'Annual learning & development allowance (₹50,000)',
  'Generous paid time off & parental leave',
  'Free catered meals and snacks at office',
  'Home office setup reimbursement',
  'Gym & wellness membership subsidy',
];

export default function PostJob() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saveDraftLoading, setSaveDraftLoading] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    workMode: 'hybrid',
    jobType: 'full_time',
    experienceLevel: '2_5',
    location: 'Bengaluru, Karnataka',
    salaryMin: '',
    salaryMax: '',
    applicationDeadline: '',
    description: '',
    qualifications: '',
  });

  // Dynamic lists
  const [responsibilities, setResponsibilities] = useState([
    'Design and develop high-quality, reusable components and robust application services.',
    'Collaborate closely with product managers, UX designers, and peer engineers.',
  ]);
  const [requirements, setRequirements] = useState([
    '3+ years of professional software engineering experience.',
    'Solid background with modern web development stacks and state management.',
  ]);

  // Skill tags
  const [skills, setSkills] = useState(['React.js', 'TypeScript', 'Node.js']);
  const [skillInput, setSkillInput] = useState('');

  // Benefits tags
  const [benefits, setBenefits] = useState([
    'Competitive salary with ESOPs / Equity',
    'Comprehensive health & dental insurance for family',
    'Flexible hybrid or remote work culture',
  ]);
  const [benefitInput, setBenefitInput] = useState('');

  // Field errors
  const [errors, setErrors] = useState({});

  // Form field change handler
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  }

  // Responsibility Handlers
  function handleAddResponsibility() {
    setResponsibilities((prev) => [...prev, '']);
  }
  function handleUpdateResponsibility(index, val) {
    setResponsibilities((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  }
  function handleRemoveResponsibility(index) {
    setResponsibilities((prev) => prev.filter((_, i) => i !== index));
  }

  // Requirement Handlers
  function handleAddRequirement() {
    setRequirements((prev) => [...prev, '']);
  }
  function handleUpdateRequirement(index, val) {
    setRequirements((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  }
  function handleRemoveRequirement(index) {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
  }

  // Skills handlers
  function handleAddSkill(skillToAdd) {
    const cleaned = (skillToAdd || skillInput).trim();
    if (!cleaned) return;
    if (!skills.includes(cleaned)) {
      setSkills((prev) => [...prev, cleaned]);
    }
    setSkillInput('');
  }

  function handleSkillKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  }

  function handleRemoveSkill(skillToRemove) {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  }

  // Benefits handlers
  function handleAddBenefit(benefitToAdd) {
    const cleaned = (benefitToAdd || benefitInput).trim();
    if (!cleaned) return;
    if (!benefits.includes(cleaned)) {
      setBenefits((prev) => [...prev, cleaned]);
    }
    setBenefitInput('');
  }

  function handleRemoveBenefit(benefitToRemove) {
    setBenefits((prev) => prev.filter((b) => b !== benefitToRemove));
  }

  function togglePresetBenefit(item) {
    if (benefits.includes(item)) {
      setBenefits((prev) => prev.filter((b) => b !== item));
    } else {
      setBenefits((prev) => [...prev, item]);
    }
  }

  // Form Validation
  function validate() {
    const formErrors = validateJobForm(formData);
    
    // Additional checks
    if (!skills.length) {
      formErrors.skills = 'Please add at least 1 required skill';
    }
    const cleanResponsibilities = responsibilities.filter((r) => r.trim());
    if (cleanResponsibilities.length === 0) {
      formErrors.responsibilities = 'Add at least one key responsibility';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }

  // Save / Publish
  async function handleSubmit(isPublish = true) {
    if (isPublish && !validate()) {
      toast?.error?.('Validation Error', 'Please complete all required fields correctly.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      if (isPublish) setLoading(true);
      else setSaveDraftLoading(true);

      const jobPayload = {
        title: formData.title,
        category: formData.category,
        workMode: formData.workMode,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        location: formData.location,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
        applicationDeadline: formData.applicationDeadline || null,
        description: formData.description,
        qualifications: formData.qualifications || null,
        responsibilities: responsibilities.filter((r) => r.trim()),
        requirements: requirements.filter((r) => r.trim()),
        skills,
        benefits,
        isActive: isPublish,
      };

      const created = await employerService.createJob(jobPayload);

      toast?.success?.(
        isPublish ? 'Job Published!' : 'Draft Saved',
        `"${created.title}" has been successfully ${isPublish ? 'published' : 'saved as draft'}.`
      );

      navigate('/employer/my-jobs');
    } catch (err) {
      toast?.error?.('Error', 'Failed to submit job. Please check all fields.');
    } finally {
      setLoading(false);
      setSaveDraftLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 pb-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <EmployerHeader
        title="Post a New Job"
        subtitle="Create an attractive job listing to connect with qualified professionals"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setPreviewModalOpen(true)}
              icon={<Eye className="w-4 h-4" />}
            >
              Preview
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => handleSubmit(false)}
              loading={saveDraftLoading}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleSubmit(true)}
              loading={loading}
              icon={<CheckCircle className="w-4 h-4" />}
            >
              Publish Job
            </Button>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Progress / Step Overview Tip */}
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-300 leading-relaxed">
            <span className="font-semibold text-white">Recruiter Pro-Tip:</span> Listings with detailed responsibilities, clear compensation figures, and 4–8 relevant skills get up to 3x more qualified candidate applications.
          </div>
        </div>

        {/* ─── SECTION 1: Basic Role Information ─── */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-white/10 pb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white">1. Basic Information</h2>
              <p className="text-xs text-slate-400">Define the core role title and workplace configuration</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Job Title */}
            <Input
              label="Job Title"
              name="title"
              placeholder="e.g. Senior Frontend Engineer (React & TypeScript)"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
            />

            {/* Category & Job Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Select
                label="Job Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                placeholder="Select category"
                required
                options={JOB_CATEGORIES.map((c) => ({
                  value: c.value,
                  label: c.label,
                }))}
              />

              <Select
                label="Employment Type"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                error={errors.jobType}
                required
                options={JOB_TYPES}
              />
            </div>

            {/* Work Mode & Experience Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Select
                label="Work Mode"
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                options={WORK_MODES}
                required
              />

              <Select
                label="Experience Level"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                error={errors.experienceLevel}
                options={EXPERIENCE_LEVELS}
                required
              />
            </div>

            {/* Location */}
            <Input
              label="Location / Office City"
              name="location"
              placeholder="e.g. Bengaluru, Karnataka or Remote - India"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              icon={<MapPin className="w-4 h-4 text-slate-500" />}
              required
            />
          </div>
        </div>

        {/* ─── SECTION 2: Compensation & Timeline ─── */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-white/10 pb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white">2. Compensation & Timeline</h2>
              <p className="text-xs text-slate-400">Provide salary transparency and specify the candidate application window</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Minimum Annual Salary (₹ INR)"
                name="salaryMin"
                type="number"
                placeholder="e.g. 1500000"
                value={formData.salaryMin}
                onChange={handleChange}
                error={errors.salaryMin}
                hint="e.g. 15,00,000 (15 Lakhs)"
              />

              <Input
                label="Maximum Annual Salary (₹ INR)"
                name="salaryMax"
                type="number"
                placeholder="e.g. 2500000"
                value={formData.salaryMax}
                onChange={handleChange}
                error={errors.salaryMax}
                hint="e.g. 25,00,000 (25 Lakhs)"
              />
            </div>

            <div className="max-w-xs">
              <Input
                label="Application Deadline"
                name="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={handleChange}
                error={errors.applicationDeadline}
                required
                icon={<Calendar className="w-4 h-4 text-slate-500" />}
              />
            </div>
          </div>
        </div>

        {/* ─── SECTION 3: Job Description & Qualifications ─── */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-white/10 pb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white">3. Job Description & Responsibilities</h2>
              <p className="text-xs text-slate-400">Explain the mission, everyday impact, and educational background</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Description Textarea */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-300">
                Job Overview & Summary <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a compelling overview of what the candidate will be doing, team culture, and the problems they will solve..."
                className={`w-full rounded-xl border bg-[#161C28] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                  errors.description ? 'border-rose-400' : 'border-white/10'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-400 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Responsibilities list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-300">
                  Key Responsibilities
                </label>
                <button
                  type="button"
                  onClick={handleAddResponsibility}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add item
                </button>
              </div>

              {errors.responsibilities && (
                <p className="text-xs text-rose-400">{errors.responsibilities}</p>
              )}

              <div className="space-y-2.5">
                {responsibilities.map((resp, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 w-5 text-right">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => handleUpdateResponsibility(idx, e.target.value)}
                      placeholder={`Responsibility #${idx + 1}`}
                      className="flex-1 rounded-xl border border-white/10 bg-[#161C28] px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(idx)}
                      disabled={responsibilities.length <= 1}
                      className="p-2 text-slate-500 hover:text-rose-400 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                      title="Remove responsibility"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-300">
                  Required Qualifications & Experience
                </label>
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add requirement
                </button>
              </div>

              <div className="space-y-2.5">
                {requirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 w-5 text-right">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleUpdateRequirement(idx, e.target.value)}
                      placeholder={`Requirement #${idx + 1}`}
                      className="flex-1 rounded-xl border border-white/10 bg-[#161C28] px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(idx)}
                      disabled={requirements.length <= 1}
                      className="p-2 text-slate-500 hover:text-rose-400 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                      title="Remove requirement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Qualification */}
            <Input
              label="Preferred Degree / Education"
              name="qualifications"
              placeholder="e.g. B.Tech / M.Tech in Computer Science, or equivalent practical experience"
              value={formData.qualifications}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ─── SECTION 4: Skills & Matching Tags ─── */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-white/10 pb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white">4. Required Skills & Tags</h2>
              <p className="text-xs text-slate-400">Skills are used to automatically match high-fit applicants</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Tag input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a skill and press Enter (e.g. Docker, GraphQL)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="flex-1 rounded-xl border border-white/10 bg-[#161C28] px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <Button
                variant="outline"
                size="md"
                onClick={() => handleAddSkill()}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Skill
              </Button>
            </div>

            {errors.skills && (
              <p className="text-xs text-rose-400">{errors.skills}</p>
            )}

            {/* Current Active Skills */}
            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-[#161C28] rounded-xl border border-white/10">
              {skills.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No skills added yet.</span>
              ) : (
                skills.map((skill) => (
                  <SkillBadge
                    key={skill}
                    skill={skill}
                    onRemove={handleRemoveSkill}
                    size="md"
                  />
                ))
              )}
            </div>

            {/* Popular skills suggestions */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Click to add popular skills:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SKILLS.map((item) => {
                  const isSelected = skills.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => (isSelected ? handleRemoveSkill(item) : handleAddSkill(item))}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-[#161C28] text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-cyan-300'
                      }`}
                    >
                      {isSelected ? `✓ ${item}` : `+ ${item}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ─── SECTION 5: Benefits & Perks ─── */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-white/10 pb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white">5. Benefits & Perks</h2>
              <p className="text-xs text-slate-400">Highlight company perks that make this role stand out</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Preset benefit checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_BENEFITS.map((item) => {
                const checked = benefits.includes(item);
                return (
                  <div
                    key={item}
                    onClick={() => togglePresetBenefit(item)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                      checked
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 font-medium'
                        : 'border-white/10 bg-[#161C28] text-slate-300 hover:bg-[#161C28]/80'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-cyan-500 focus:ring-cyan-500/50 bg-[#121620] border-white/20"
                    />
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>

            {/* Custom benefit input */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom perk (e.g. Annual company retreat in Goa)"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBenefit();
                  }
                }}
                className="flex-1 rounded-xl border border-white/10 bg-[#161C28] px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <Button
                variant="outline"
                size="md"
                onClick={() => handleAddBenefit()}
                icon={<Plus className="w-4 h-4" />}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* ─── Bottom Action Bar ─── */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="text-xs text-slate-400">
            By publishing, you agree to our fair employment policies and recruitment standards.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleSubmit(false)}
              loading={saveDraftLoading}
            >
              Save as Draft
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleSubmit(true)}
              loading={loading}
              icon={<CheckCircle className="w-4 h-4" />}
            >
              Publish Job Listing
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Preview Modal ─── */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="Job Posting Preview"
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="outline"
              size="md"
              onClick={() => setPreviewModalOpen(false)}
            >
              Back to Editing
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setPreviewModalOpen(false);
                handleSubmit(true);
              }}
              icon={<CheckCircle className="w-4 h-4" />}
            >
              Confirm & Publish
            </Button>
          </div>
        }
      >
        <div className="space-y-6 text-left">
          {/* Header */}
          <div className="border-b border-white/10 pb-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 capitalize">
                {formData.workMode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#161C28] text-slate-300 border border-white/10 capitalize">
                {formData.jobType?.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {formData.title || 'Untitled Position'}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {formData.location || 'Location not specified'}
              </span>
              <span>•</span>
              <span className="font-semibold text-emerald-400">
                {formatSalary(formData.salaryMin, formData.salaryMax)}
              </span>
              {formData.applicationDeadline && (
                <>
                  <span>•</span>
                  <span>Deadline: {formData.applicationDeadline}</span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About the Role
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {formData.description || 'No description provided yet.'}
            </p>
          </div>

          {/* Responsibilities */}
          {responsibilities.filter((r) => r.trim()).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Responsibilities
              </h4>
              <ul className="list-disc list-inside text-sm text-slate-300 space-y-1.5">
                {responsibilities
                  .filter((r) => r.trim())
                  .map((r, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {r}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Required Technical Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <SkillBadge key={s} skill={s} size="sm" />
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {benefits.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Benefits & Perks
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {benefits.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
