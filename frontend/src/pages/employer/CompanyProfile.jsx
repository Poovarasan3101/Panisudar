import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  FileText,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Tag,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { profileService } from '@/api/profileService';
import { employerService } from '@/api/employerService';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import SkillBadge from '@/components/common/SkillBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import EmployerHeader from './EmployerHeader';
import { INDUSTRIES, COMPANY_SIZES } from '@/utils/constants';
import { formatSalary, timeAgo } from '@/utils/helpers';
import { validateUrl } from '@/utils/validators';

const SUGGESTED_BENEFITS = [
  'Competitive salary with meaningful ESOPs',
  'Comprehensive health insurance for parents & family',
  'Flexible hybrid & remote working options',
  'Annual learning & development allowance (₹50,000)',
  'Generous parental leave policy',
  'Free catered lunch and snacks at office',
  'Home office setup and internet allowance',
  'Performance-linked annual cash bonus',
  'Gym & wellness subscription coverage',
];

export default function CompanyProfile() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'

  const [profile, setProfile] = useState({
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    location: '',
    about: '',
    companyLogo: '',
    recruiterName: '',
    email: '',
    phone: '',
    benefits: [],
  });

  const [newBenefitInput, setNewBenefitInput] = useState('');
  const [activeJobs, setActiveJobs] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [fetchedProfile, myJobs] = await Promise.all([
        profileService.getEmployerProfile(),
        employerService.getMyJobs({ status: 'active' }),
      ]);
      if (fetchedProfile) {
        setProfile({
          ...fetchedProfile,
          benefits: fetchedProfile.benefits || [],
        });
      }
      setActiveJobs(myJobs || []);
    } catch (err) {
      toast?.error?.('Error', 'Failed to load company profile.');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  }

  // Add benefit
  function handleAddBenefit(benefitText) {
    const text = (benefitText || newBenefitInput).trim();
    if (!text) return;
    if (!profile.benefits.includes(text)) {
      setProfile((prev) => ({
        ...prev,
        benefits: [...prev.benefits, text],
      }));
    }
    setNewBenefitInput('');
  }

  // Remove benefit
  function handleRemoveBenefit(benefitText) {
    setProfile((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((b) => b !== benefitText),
    }));
  }

  // Logo upload simulation
  function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, companyLogo: url }));
      toast?.info?.('Logo Updated', 'Preview updated with selected image file.');
    }
  }

  // Validation
  function validate() {
    const errs = {};
    if (!profile.companyName?.trim()) errs.companyName = 'Company name is required';
    if (!profile.location?.trim()) errs.location = 'Location is required';
    if (profile.website && validateUrl(profile.website)) {
      errs.website = 'Enter a valid URL (e.g. https://company.com)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Save changes
  async function handleSave(e) {
    e.preventDefault();
    if (!validate()) {
      toast?.error?.('Validation Error', 'Please correct the highlighted fields.');
      return;
    }

    try {
      setSaving(true);
      await profileService.updateEmployerProfile(profile);
      toast?.success?.('Saved!', 'Company branding and profile updated successfully.');
    } catch (err) {
      toast?.error?.('Save Failed', 'Could not update company profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D12] text-slate-100 pb-20 relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <EmployerHeader
            title="Company Branding & Profile"
            subtitle="Customize your public presence and showcase company culture"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm text-slate-400">Loading company branding profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 pb-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <EmployerHeader
          title="Company Profile & Branding"
          subtitle="Manage public company identity, culture perks, and preview your applicant-facing page"
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 bg-[#121620] text-sm font-semibold text-slate-200 hover:bg-white/5 shadow-sm transition-colors"
              >
                <Eye className="w-4 h-4 text-slate-400" />
                <span>{activeTab === 'edit' ? 'Live Candidate Preview' : 'Back to Editing'}</span>
              </button>
              {activeTab === 'edit' && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSave}
                  loading={saving}
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              )}
            </div>
          }
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Toggle Mode Banner */}
          <div className="flex items-center justify-between bg-[#121620] rounded-xl border border-white/10 p-2 shadow-xl">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'edit'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Edit Profile & Perks
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Public Career Page Preview
              </button>
            </div>

            <span className="text-xs text-slate-400 hidden sm:inline px-3">
              {activeTab === 'edit'
                ? 'Make edits to your company information below'
                : 'Viewing page as candidates see it'}
            </span>
          </div>

          {/* ─── TAB 1: EDIT FORM ─── */}
          {activeTab === 'edit' ? (
            <form onSubmit={handleSave} className="space-y-8">
              {/* Logo & Basic Identifiers */}
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
                <div className="border-b border-white/10 pb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h2 className="text-lg font-bold text-white">Brand Identity & Logo</h2>
                    <p className="text-xs text-slate-400">Your logo appears across all active job postings</p>
                  </div>
                </div>

                {/* Logo Row */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    {profile.companyLogo ? (
                      <img
                        src={profile.companyLogo}
                        alt={profile.companyName}
                        className="w-24 h-24 rounded-2xl object-cover ring-2 ring-white/10 shadow-sm"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-2xl flex items-center justify-center shadow-sm">
                        {profile.companyName ? profile.companyName.slice(0, 2).toUpperCase() : 'CO'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <h3 className="text-sm font-semibold text-slate-200">Company Logo</h3>
                    <p className="text-xs text-slate-400">
                      PNG, JPG, or SVG. Square ratio (at least 200x200px) recommended.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-slate-200 hover:bg-white/5 bg-[#161C28] transition-colors">
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Upload New Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      {profile.companyLogo && (
                        <button
                          type="button"
                          onClick={() => setProfile((prev) => ({ ...prev, companyLogo: '' }))}
                          className="text-xs text-red-400 hover:underline px-2 py-1"
                        >
                          Reset to default
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <Input
                    label="Company Legal Name"
                    name="companyName"
                    value={profile.companyName}
                    onChange={handleChange}
                    error={errors.companyName}
                    placeholder="e.g. Razorpay Technologies"
                    required
                  />

                  <Input
                    label="Official Website URL"
                    name="website"
                    value={profile.website}
                    onChange={handleChange}
                    error={errors.website}
                    placeholder="https://company.com"
                    icon={<Globe className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <Select
                    label="Industry"
                    name="industry"
                    value={profile.industry}
                    onChange={handleChange}
                    placeholder="Select industry"
                    options={INDUSTRIES.map((ind) => ({ value: ind, label: ind }))}
                  />

                  <Select
                    label="Company Size"
                    name="companySize"
                    value={profile.companySize}
                    onChange={handleChange}
                    placeholder="Select company size"
                    options={COMPANY_SIZES}
                  />

                  <Input
                    label="Headquarters Location"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    error={errors.location}
                    placeholder="e.g. Bangalore, Karnataka"
                    icon={<MapPin className="w-4 h-4 text-slate-400" />}
                    required
                  />
                </div>
              </div>

              {/* About / Mission Statement */}
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
                <div className="border-b border-white/10 pb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h2 className="text-lg font-bold text-white">About the Company</h2>
                    <p className="text-xs text-slate-400">Describe company mission, product achievements, and engineering values</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <textarea
                    name="about"
                    rows={6}
                    value={profile.about}
                    onChange={handleChange}
                    placeholder="Write a compelling overview of your organization, culture, team milestones, and what makes working with your team rewarding..."
                    className="w-full rounded-lg border border-white/10 bg-[#161C28] p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 leading-relaxed"
                  />
                  <div className="flex justify-between text-xs text-slate-400 pt-1">
                    <span>Aim for at least 150 words for best candidate interest.</span>
                    <span>{profile.about?.length || 0} characters</span>
                  </div>
                </div>
              </div>

              {/* Company Benefits & Perks */}
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
                <div className="border-b border-white/10 pb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h2 className="text-lg font-bold text-white">Company Perks & Benefits</h2>
                    <p className="text-xs text-slate-400">These will be prominently highlighted on your company profile and job listings</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Active benefits */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Current Company Benefits ({profile.benefits.length})
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 bg-[#161C28] rounded-xl border border-white/10 min-h-[50px]">
                      {profile.benefits.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">No benefits listed yet.</span>
                      ) : (
                        profile.benefits.map((b) => (
                          <span
                            key={b}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                          >
                            <span>{b}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveBenefit(b)}
                              className="text-cyan-400 hover:text-cyan-200 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Add Custom Benefit */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a new custom perk (e.g. Annual company offsite abroad)"
                      value={newBenefitInput}
                      onChange={(e) => setNewBenefitInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddBenefit();
                        }
                      }}
                      className="flex-1 rounded-lg border border-white/10 bg-[#161C28] px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handleAddBenefit()}
                      icon={<Plus className="w-4 h-4" />}
                    >
                      Add Benefit
                    </Button>
                  </div>

                  {/* Suggested Perks */}
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Popular suggestions:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_BENEFITS.map((item) => {
                        const isSelected = profile.benefits.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              isSelected ? handleRemoveBenefit(item) : handleAddBenefit(item)
                            }
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                              isSelected
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-semibold'
                                : 'bg-[#161C28] text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white'
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

              {/* Recruiter / Contact Representative */}
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
                <div className="border-b border-white/10 pb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h2 className="text-lg font-bold text-white">Lead Recruiter Contact</h2>
                    <p className="text-xs text-slate-400">Contact details visible for internal communications and candidate inquiries</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <Input
                    label="Recruiter Name"
                    name="recruiterName"
                    value={profile.recruiterName}
                    onChange={handleChange}
                    placeholder="e.g. Priya Nair"
                  />

                  <Input
                    label="Official Email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="priya.nair@company.com"
                  />

                  <Input
                    label="Contact Phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Bottom Save Bar */}
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 flex items-center justify-between shadow-xl">
                <p className="text-xs text-slate-400">
                  Changes take effect immediately on public job postings.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  loading={saving}
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  Save Company Profile
                </Button>
              </div>
            </form>
          ) : (
            /* ─── TAB 2: PUBLIC CAREER PAGE PREVIEW ─── */
            <div className="space-y-8">
              {/* Hero Company Banner */}
              <div className="bg-[#121620] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                <div className="h-40 bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 relative border-b border-white/10" />

                <div className="px-6 sm:px-8 pb-8 pt-0 relative">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-4">
                    <div className="flex items-end gap-4">
                      {profile.companyLogo ? (
                        <img
                          src={profile.companyLogo}
                          alt={profile.companyName}
                          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#121620] bg-[#161C28] shadow-md"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-3xl flex items-center justify-center ring-4 ring-[#121620] shadow-md">
                          {profile.companyName ? profile.companyName.slice(0, 2).toUpperCase() : 'CO'}
                        </div>
                      )}
                      <div className="pt-2">
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-white">
                            {profile.companyName || 'Your Company Name'}
                          </h2>
                          <ShieldCheck className="w-5 h-5 text-cyan-400" />
                        </div>
                        <p className="text-xs text-slate-400">{profile.industry || 'Technology & Software'}</p>
                      </div>
                    </div>

                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      </a>
                    )}
                  </div>

                  {/* Company Metadata Pills */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-white/10 pt-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {profile.location || 'Location'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      {profile.companySize?.replace('_', '–') || '500+'} employees
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                      <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                      {activeJobs.length} Open Positions
                    </span>
                  </div>
                </div>
              </div>

              {/* About & Culture */}
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white">About {profile.companyName}</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {profile.about || 'Company overview not yet provided.'}
                </p>
              </div>

              {/* Benefits & Perks */}
              {profile.benefits && profile.benefits.length > 0 && (
                <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
                  <h3 className="text-base font-bold text-white">Employee Benefits & Perks</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                    {profile.benefits.map((b, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-[#161C28] border border-white/10"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                          ✓
                        </span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Job Openings List Preview */}
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Open Job Positions ({activeJobs.length})
                    </h3>
                    <p className="text-xs text-slate-400">Live positions advertised on your career page</p>
                  </div>
                  <Link
                    to="/employer/post-job"
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    + Post another job
                  </Link>
                </div>

                {activeJobs.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No active jobs currently published.
                  </p>
                ) : (
                  <div className="divide-y divide-white/10">
                    {activeJobs.map((job) => (
                      <div
                        key={job.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <h4 className="font-semibold text-white text-sm hover:text-cyan-400">
                            {job.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span>{job.location}</span>
                            <span>•</span>
                            <span className="capitalize">{job.workMode}</span>
                            <span>•</span>
                            <span className="font-medium text-emerald-400">
                              {formatSalary(job.salaryMin, job.salaryMax)}
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/employer/applications?jobId=${job.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg hover:bg-cyan-500/20 w-fit"
                        >
                          <span>{job.applicationsCount || 0} Applicants</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
