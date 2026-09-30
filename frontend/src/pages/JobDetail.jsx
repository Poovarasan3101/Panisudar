import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  Share2,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  Users,
  FileText,
  Upload,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { jobService } from '@/api/jobService';
import { companyService } from '@/api/companyService';
import { applicationService } from '@/api/applicationService';
import { profileService } from '@/api/profileService';
import JobCard from '@/components/jobs/JobCard';
import BorderGlow from '@/components/common/BorderGlow';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { SkillBadge } from '@/components/common/SkillBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import {
  formatSalary,
  timeAgo,
  formatDate,
  getJobTypeLabel,
  getExperienceLabel,
  getAvatarColor,
  getInitials,
} from '@/utils/helpers';

export default function JobDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated, isEmployer } = useAuth();

  // State
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [seekerProfile, setSeekerProfile] = useState(null);

  // Apply Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submittingApply, setSubmittingApply] = useState(false);
  const [applyError, setApplyError] = useState(null);

  // Load Job and related data
  useEffect(() => {
    let mounted = true;

    async function loadJobData() {
      try {
        setLoading(true);
        setJob(null);
        setCompany(null);
        setSimilarJobs([]);
        setHasApplied(false);

        // Fetch job details
        const jobData = await jobService.getJobById(id);
        if (!mounted) return;
        setJob(jobData);

        // Check saved status
        const saved = profileService.isSaved(id);
        setIsSaved(saved);

        // Concurrent fetching for company, similar jobs, user profile, and user applications
        const promises = [
          jobData.category ? jobService.getSimilarJobs(id, jobData.category) : Promise.resolve([]),
          jobData.companyId ? companyService.getCompanyById(jobData.companyId).catch(() => null) : Promise.resolve(null),
        ];

        if (isAuthenticated) {
          promises.push(
            applicationService.getMyApplications().catch(() => []),
            profileService.getSeekerProfile().catch(() => null)
          );
        }

        const [similar, compData, myApps, seekerProf] = await Promise.all(promises);

        if (mounted) {
          setSimilarJobs(similar || []);
          if (compData) setCompany(compData);
          if (seekerProf) setSeekerProfile(seekerProf);
          if (myApps && Array.isArray(myApps)) {
            const applied = myApps.some((app) => app.jobId === id);
            setHasApplied(applied);
          }
          if (searchParams.get('apply') === 'true') {
            setApplyModalOpen(true);
          }
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadJobData();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      mounted = false;
    };
  }, [id, isAuthenticated, searchParams]);

  // Handle Save / Unsave
  const handleToggleSave = async () => {
    try {
      if (isSaved) {
        await profileService.unsaveJob(id);
        setIsSaved(false);
        toast.info('Job unsaved', 'Removed from your bookmarks');
      } else {
        await profileService.saveJob(id);
        setIsSaved(true);
        toast.success('Job saved', 'Added to your bookmarked jobs');
      }
    } catch (err) {
      toast.error('Bookmark error', err.message || 'Unable to update bookmark');
    }
  };

  // Handle Share
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: job ? `${job.title} at ${job.companyName}` : 'Job Opportunity',
          url,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was cancelled or unsupported
      }
    }
    navigator.clipboard.writeText(url);
    toast.success('Link copied', 'Job link copied to your clipboard!');
  };

  // Open Apply Modal or redirect if unauthenticated
  const handleOpenApplyModal = () => {
    if (!isAuthenticated) {
      toast.info('Login required', 'Please sign in to submit your job application.');
      navigate(`/login?redirect=/jobs/${id}`);
      return;
    }

    if (isEmployer) {
      toast.warning('Employer account', 'Recruiter accounts cannot apply for jobs. Please use a job seeker account.');
      return;
    }

    setApplyError(null);
    setApplyModalOpen(true);
  };

  // Submit Application
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplyError(null);
    setSubmittingApply(true);

    try {
      // If user uploaded a new resume file
      if (resumeFile) {
        await profileService.uploadResume(resumeFile);
      }

      await applicationService.applyForJob(id, coverLetter);
      setHasApplied(true);
      setApplyModalOpen(false);
      setCoverLetter('');
      setResumeFile(null);
      toast.success('Application submitted!', `Your application for "${job.title}" has been sent.`);
    } catch (err) {
      setApplyError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmittingApply(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm font-medium text-slate-500">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-10 border border-slate-200 text-center shadow-sm">
          <EmptyState
            icon={<Briefcase />}
            title="Job not found"
            description="The job posting you are looking for may have expired, been deactivated, or removed by the employer."
            action={{
              label: 'Browse Available Jobs',
              onClick: () => navigate('/jobs'),
            }}
          />
        </div>
      </div>
    );
  }

  const avatarBg = getAvatarColor(job.companyName);
  const initials = getInitials(job.companyName);

  const workModeBadge = {
    remote: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    hybrid: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
    onsite: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 pb-16 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─── Breadcrumb & Top Bar ───────────────────────────────── */}
      <div className="bg-[#10131A]/80 border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-[#161C28] hover:bg-[#1C2434] text-slate-300 text-xs sm:text-sm font-medium transition"
              title="Share job"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={handleToggleSave}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition ${
                isSaved
                  ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
                  : 'border-white/10 bg-[#161C28] hover:bg-[#1C2434] text-slate-300'
              }`}
              title={isSaved ? 'Unsave job' : 'Save job'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-cyan-400" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Job Hero Header ─────────────────────────────────────── */}
      <div className="bg-[#121620]/90 border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Company Logo / Avatar */}
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-white/10 object-contain p-1 shrink-0 bg-[#161C28] shadow-sm"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName)}&background=e0e7ff&color=4338ca&size=96`;
                }}
              />
            ) : (
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0 ${avatarBg}`}
              >
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-base sm:text-lg font-bold text-cyan-400 hover:text-cyan-300 transition">
                  {job.companyName}
                </span>
                {job.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {job.title}
              </h1>

              {/* Meta tags list */}
              <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-400">
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {job.location}
                  </span>
                )}
                {job.workMode && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-[#161C28] text-cyan-300 border border-cyan-500/30">
                    {job.workMode}
                  </span>
                )}
                {job.jobType && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    {getJobTypeLabel(job.jobType)}
                  </span>
                )}
                {job.postedAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Posted {timeAgo(job.postedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            {hasApplied ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Applied</span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleOpenApplyModal}
                className="w-full md:w-auto shadow-lg shadow-indigo-600/25"
              >
                Apply for this Position
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Details Layout ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left Content (2 cols on desktop) ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Highlights Banner */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-400 font-medium">Offered Salary</p>
                <p className="text-sm sm:text-base font-bold text-emerald-400 mt-1">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Experience Level</p>
                <p className="text-sm sm:text-base font-bold text-white mt-1">
                  {getExperienceLabel(job.experienceLevel)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Applicants</p>
                <p className="text-sm sm:text-base font-bold text-white mt-1">
                  {job.applicationsCount || 0} applied
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Apply Before</p>
                <p className="text-sm sm:text-base font-bold text-white mt-1">
                  {job.applicationDeadline ? formatDate(job.applicationDeadline) : 'Open'}
                </p>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-white/10">
                About the Role
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Key Responsibilities */}
            {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-white/10">
                  Key Responsibilities
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements & Qualifications */}
            {Array.isArray(job.requirements) && job.requirements.length > 0 && (
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-white/10">
                  Requirements & Experience
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>

                {job.qualifications && (
                  <div className="mt-6 pt-5 border-t border-white/10">
                    <h3 className="text-sm font-bold text-slate-200 mb-1">Educational Background</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{job.qualifications}</p>
                  </div>
                )}
              </div>
            )}

            {/* Required Skills */}
            {Array.isArray(job.skills) && job.skills.length > 0 && (
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-white/10">
                  Required Technologies & Skills
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {job.skills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} size="md" />
                  ))}
                </div>
              </div>
            )}

            {/* Benefits & Perks */}
            {Array.isArray(job.benefits) && job.benefits.length > 0 && (
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-white/10">
                  Perks & Benefits
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {job.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#161C28] border border-white/10 text-slate-200 text-sm font-medium"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Sidebar (1 col on desktop) ── */}
          <div className="space-y-6">
            {/* Quick Apply Card */}
            <BorderGlow
              edgeSensitivity={0}
              glowColor="40 80 80"
              backgroundColor="#120F17"
              borderRadius={34}
              glowRadius={60}
              glowIntensity={2.4}
              coneSpread={39}
              animated={false}
              colors={['#c084fc', '#f472b6', '#38bdf8']}
              className="sticky top-6"
            >
              <div className="p-6 rounded-[30px]">
                <h3 className="text-lg font-bold text-white mb-4">Job Summary</h3>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 pb-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Offered Salary:</span>
                    <span className="font-semibold text-emerald-400">
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Job Type:</span>
                    <span className="font-semibold text-white">{getJobTypeLabel(job.jobType)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Experience:</span>
                    <span className="font-semibold text-white">
                      {getExperienceLabel(job.experienceLevel)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Work Mode:</span>
                    <span className="font-semibold text-white capitalize">{job.workMode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-semibold text-white text-right">{job.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Posted on:</span>
                    <span className="font-semibold text-white">{formatDate(job.postedAt)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {hasApplied ? (
                    <div className="w-full py-3 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-bold text-sm text-center flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Application Sent</span>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      fullWidth
                      size="md"
                      onClick={handleOpenApplyModal}
                      className="font-bold py-3"
                    >
                      Apply Now
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={handleToggleSave}
                    className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-[#161C28] hover:bg-[#1C2434] text-slate-200 font-semibold text-sm transition flex items-center justify-center gap-2"
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                        <span>Remove from Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4 text-slate-400" />
                        <span>Save for Later</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Badge */}
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2.5 text-xs text-slate-400">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>Verified hiring employer. Direct application routing.</span>
                </div>
              </div>
            </BorderGlow>

            {/* Company Card */}
            <BorderGlow
              edgeSensitivity={0}
              glowColor="40 80 80"
              backgroundColor="#120F17"
              borderRadius={34}
              glowRadius={60}
              glowIntensity={2.4}
              coneSpread={39}
              animated={false}
              colors={['#c084fc', '#f472b6', '#38bdf8']}
            >
              <div className="p-6 rounded-[30px]">
                <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-white/10">
                  About the Company
                </h3>

                <div className="flex items-start gap-3.5 mb-4">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-12 h-12 rounded-xl border border-white/10 object-contain p-0.5 shrink-0 bg-[#161C28]"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName)}&background=e0e7ff&color=4338ca&size=64`;
                      }}
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 ${avatarBg}`}
                    >
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-white truncate">{job.companyName}</h4>
                    {company?.industry && (
                      <p className="text-xs text-cyan-400 font-semibold">{company.industry}</p>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 line-clamp-4 leading-relaxed mb-4">
                  {company?.about ||
                    `${job.companyName} is an industry-leading company focused on developing cutting-edge digital solutions and delivering impact.`}
                </p>

                <div className="space-y-2 text-xs text-slate-400 mb-6 border-t border-white/10 pt-3">
                  {company?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  {company?.size && (
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{company.size.replace('_', '–')} employees</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/jobs?search=${encodeURIComponent(job.companyName)}`}
                    className="flex-1 py-2 px-3 text-center rounded-xl bg-[#161C28] hover:bg-[#1C2434] text-cyan-400 text-xs font-semibold border border-white/10 transition"
                  >
                    View Company Jobs
                  </Link>
                  {company?.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl border border-white/10 bg-[#161C28] text-slate-400 hover:text-white hover:bg-[#1C2434] transition"
                      title="Visit Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </BorderGlow>
          </div>
        </div>

        {/* ─── Similar Jobs Section ──────────────────────────────── */}
        {similarJobs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Similar Opportunities
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Other open positions you might be interested in
                </p>
              </div>

              <Link
                to={`/jobs?category=${job.category || ''}`}
                className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
              >
                View all in {job.category || 'Category'}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarJobs.map((simJob) => (
                <JobCard key={simJob.id} job={simJob} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Apply Modal Dialog ─────────────────────────────────── */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Apply for Position"
        size="lg"
      >
        <form onSubmit={handleApplySubmit} className="space-y-6">
          {/* Header Recap */}
          <div className="p-4 rounded-xl bg-[#161C28] border border-white/10 flex items-center gap-3">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-12 h-12 rounded-xl border border-white/10 object-contain bg-[#121620]"
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white ${avatarBg}`}
              >
                {initials}
              </div>
            )}
            <div>
              <h4 className="font-bold text-white text-base">{job.title}</h4>
              <p className="text-xs text-slate-400">
                {job.companyName} • {job.location}
              </p>
            </div>
          </div>

          {applyError && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <span>{applyError}</span>
            </div>
          )}

          {/* User profile confirmation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                disabled
                value={user?.fullName || seekerProfile?.fullName || 'Job Seeker'}
                className="w-full bg-[#161C28] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-300 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="text"
                disabled
                value={user?.email || 'seeker@example.com'}
                className="w-full bg-[#161C28] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-300 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Resume Upload / Confirmation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Resume / CV <span className="text-rose-400">*</span>
            </label>

            {seekerProfile?.resume ? (
              <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {seekerProfile.resume.name || 'Current Profile Resume'}
                    </p>
                    <p className="text-xs text-slate-400">
                      Uploaded on {seekerProfile.resume.uploadedAt || 'recently'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            ) : null}

            <div className="mt-2">
              <label className="border-2 border-dashed border-white/15 hover:border-cyan-400/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-[#161C28]/60 hover:bg-[#161C28] text-center">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  {resumeFile ? resumeFile.name : 'Upload another or new resume'}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  PDF, DOC, or DOCX (Max 5MB)
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setResumeFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Cover Note / Pitch
              </label>
              <span className="text-xs text-slate-500">Optional</span>
            </div>
            <textarea
              rows={4}
              placeholder="Why are you a great fit for this position? Mention any relevant projects, accomplishments, or availability..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#161C28] p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/70 transition"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setApplyModalOpen(false)}
              disabled={submittingApply}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submittingApply}
              disabled={submittingApply}
            >
              Confirm & Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
