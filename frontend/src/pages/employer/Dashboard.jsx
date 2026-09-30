import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  Eye,
  MapPin,
  Building2,
  Calendar,
  Sparkles,
  Search,
} from 'lucide-react';
import { employerService } from '@/api/employerService';
import { applicationService } from '@/api/applicationService';
import { profileService } from '@/api/profileService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard';
import ApplicationStatusBadge from '@/components/common/ApplicationStatusBadge';
import SkillBadge from '@/components/common/SkillBadge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import EmptyState from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import EmployerHeader from './EmployerHeader';
import { formatSalary, timeAgo, formatDate, getInitials, getAvatarColor } from '@/utils/helpers';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalApps: 0,
    shortlisted: 0,
  });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [companyProfile, setCompanyProfile] = useState(null);

  // Quick review modal for applicant
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [fetchedJobs, fetchedApps, fetchedProfile] = await Promise.all([
        employerService.getMyJobs(),
        applicationService.getEmployerApplications(),
        profileService.getEmployerProfile(),
      ]);

      const statData = employerService.getDashboardStats();
      const totalApps = fetchedApps.length || statData.totalApps;
      const shortlistedCount = fetchedApps.filter(
        (a) => a.status === 'shortlisted' || a.status === 'interview'
      ).length || statData.shortlisted;

      setStats({
        total: fetchedJobs.length,
        active: fetchedJobs.filter((j) => j.isActive).length,
        totalApps,
        shortlisted: shortlistedCount,
      });

      setJobs(fetchedJobs);
      setApplications(fetchedApps);
      setCompanyProfile(fetchedProfile);
    } catch (err) {
      toast?.error?.('Error', 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }

  // Toggle job active status directly
  async function handleToggleStatus(jobId, e) {
    e.stopPropagation();
    try {
      const updated = await employerService.toggleJobStatus(jobId);
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, isActive: updated.isActive } : j))
      );
      setStats((prev) => ({
        ...prev,
        active: updated.isActive ? prev.active + 1 : prev.active - 1,
      }));
      toast?.success?.(
        'Status Updated',
        `Job is now ${updated.isActive ? 'Active' : 'Inactive'}`
      );
    } catch (err) {
      toast?.error?.('Failed', 'Could not toggle job status.');
    }
  }

  // Open candidate quick review
  function handleOpenQuickReview(app) {
    setSelectedApp(app);
    setReviewModalOpen(true);
  }

  // Update candidate application status
  async function handleUpdateStatus(newStatus) {
    if (!selectedApp) return;
    try {
      setUpdatingStatus(true);
      await applicationService.updateApplicationStatus(selectedApp.id, newStatus);
      
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? { ...a, status: newStatus } : a))
      );
      setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));

      toast?.success?.(
        'Status Updated',
        `Application moved to ${newStatus.replace('_', ' ')}`
      );
    } catch (err) {
      toast?.error?.('Failed', 'Could not update applicant status.');
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D12] text-slate-100">
        <EmployerHeader
          title="Employer Dashboard"
          subtitle="Overview of your recruitment activities and job applications"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-slate-400">Loading your recruitment metrics...</p>
        </div>
      </div>
    );
  }

  const recentJobs = jobs.slice(0, 4);
  const recentApplicants = applications.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 pb-16 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Shared Header & Tabs */}
      <EmployerHeader
        title={`Welcome back, ${companyProfile?.recruiterName || user?.fullName || 'Recruiter'}! 👋`}
        subtitle={`Managing recruitment for ${companyProfile?.companyName || 'your organization'}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Quick Highlights / Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-[#121620] border border-white/10 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Recruitment Center
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hire top tier talent faster
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              You currently have <span className="font-semibold text-white">{stats.active}</span> active job postings with{' '}
              <span className="font-semibold text-white">{stats.totalApps}</span> candidate applications. Review your top candidates or create a new job opening today.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/employer/post-job">
                <Button
                  variant="primary"
                  size="md"
                  icon={<PlusCircle className="w-4 h-4" />}
                >
                  Post a New Job
                </Button>
              </Link>
              <Link to="/employer/applications">
                <Button
                  variant="outline"
                  size="md"
                  icon={<Users className="w-4 h-4" />}
                >
                  View All Candidates
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative background circle */}
          <div className="absolute -right-12 -bottom-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* ─── 5 Recruitment Metric Stat Cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <DashboardStatCard
            title="Total Job Postings"
            value={stats.total}
            icon={Briefcase}
            iconBg="bg-blue-500/15"
            iconColor="text-blue-400"
            trend={`${stats.total} created`}
            trendUp={true}
            href="/employer/my-jobs"
          />

          <DashboardStatCard
            title="Active Jobs"
            value={stats.active}
            icon={CheckCircle2}
            iconBg="bg-emerald-500/15"
            iconColor="text-emerald-400"
            trend="Accepting applicants"
            trendUp={true}
            href="/employer/my-jobs?status=active"
          />

          <DashboardStatCard
            title="Closed Jobs"
            value={Math.max(0, stats.total - stats.active)}
            icon={Clock}
            iconBg="bg-slate-700/40"
            iconColor="text-slate-400"
            trend="Archived or filled"
            trendUp={false}
            href="/employer/my-jobs?status=inactive"
          />

          <DashboardStatCard
            title="Total Applications"
            value={stats.totalApps}
            icon={Users}
            iconBg="bg-indigo-500/15"
            iconColor="text-indigo-400"
            trend="+18% vs last month"
            trendUp={true}
            href="/employer/applications"
          />

          <DashboardStatCard
            title="Shortlisted / Review"
            value={stats.shortlisted}
            icon={Clock}
            iconBg="bg-purple-500/15"
            iconColor="text-purple-400"
            trend="Ready for interview"
            trendUp={true}
            href="/employer/applications?status=shortlisted"
          />
        </div>

        {/* ─── Main Content Grid: Recent Jobs + Recent Candidates ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Recent Job Postings (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Recent Job Postings</h2>
                <p className="text-xs text-slate-400">Track and manage your published positions</p>
              </div>
              <Link
                to="/employer/my-jobs"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                View all ({jobs.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentJobs.length === 0 ? (
              <div className="bg-[#121620] rounded-xl border border-white/10 p-6 shadow-xl">
                <EmptyState
                  icon={<Briefcase className="w-10 h-10 text-cyan-400" />}
                  title="No jobs posted yet"
                  description="Start reaching qualified candidates by creating your first job listing."
                  action={{
                    label: 'Post Your First Job',
                    onClick: () => navigate('/employer/post-job'),
                  }}
                />
              </div>
            ) : (
              <div className="bg-[#121620] rounded-xl border border-white/10 divide-y divide-white/10 shadow-xl overflow-hidden">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/employer/applications?jobId=${job.id}`}
                          className="font-semibold text-white hover:text-cyan-400 transition-colors text-base truncate block"
                        >
                          {job.title}
                        </Link>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            job.isActive
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-700/40 text-slate-400 border border-white/10'
                          }`}
                        >
                          {job.isActive ? 'Active' : 'Closed'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {job.location} ({job.workMode})
                        </span>
                        <span>•</span>
                        <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                        <span>•</span>
                        <span className="text-slate-500">
                          Posted {timeAgo(job.postedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        to={`/employer/applications?jobId=${job.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161C28] hover:bg-[#161C28]/80 text-cyan-300 border border-white/10 text-xs font-semibold transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicationsCount || 0} Applicants</span>
                      </Link>

                      <button
                        onClick={(e) => handleToggleStatus(job.id, e)}
                        title={job.isActive ? 'Deactivate job' : 'Activate job'}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                          job.isActive
                            ? 'border-white/10 text-slate-300 hover:bg-white/5'
                            : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                        }`}
                      >
                        {job.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="p-3 bg-[#161C28]/50 text-center border-t border-white/10">
                  <Link
                    to="/employer/my-jobs"
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    Manage all {jobs.length} jobs in My Jobs →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Recent Applicants (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Recent Applicants</h2>
                <p className="text-xs text-slate-400">Latest candidate submissions</p>
              </div>
              <Link
                to="/employer/applications"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                View all ({applications.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentApplicants.length === 0 ? (
              <div className="bg-[#121620] rounded-xl border border-white/10 p-6 shadow-xl">
                <EmptyState
                  icon={<Users className="w-10 h-10 text-cyan-400" />}
                  title="No applicants yet"
                  description="Applications will appear here once candidates apply to your openings."
                />
              </div>
            ) : (
              <div className="bg-[#121620] rounded-xl border border-white/10 divide-y divide-white/10 shadow-xl overflow-hidden">
                {recentApplicants.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => handleOpenQuickReview(app)}
                    className="p-4 hover:bg-white/[0.02] cursor-pointer transition-colors space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {app.applicantPhoto ? (
                          <img
                            src={app.applicantPhoto}
                            alt={app.applicantName}
                            className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                          />
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 ${getAvatarColor(
                              app.applicantName || 'Applicant'
                            )}`}
                          >
                            {getInitials(app.applicantName || 'Applicant')}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {app.applicantName || 'Anonymous Applicant'}
                          </p>
                          <p className="text-xs text-cyan-400 font-medium truncate">
                            {app.jobTitle}
                          </p>
                        </div>
                      </div>

                      <ApplicationStatusBadge status={app.status} />
                    </div>

                    {/* Skills snippet & applied time */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                        {app.skills?.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="bg-[#161C28] text-slate-300 border border-white/10 px-1.5 py-0.5 rounded text-[11px]"
                          >
                            {skill}
                          </span>
                        ))}
                        {app.skills?.length > 2 && (
                          <span className="text-slate-500 text-[11px]">
                            +{app.skills.length - 2}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 text-[11px] shrink-0">
                        {timeAgo(app.appliedAt)}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="p-3 bg-[#161C28]/50 text-center border-t border-white/10">
                  <Link
                    to="/employer/applications"
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    Open candidate pipeline →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Bottom Info Cards: Pipeline Summary & Company Checklist ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#121620] rounded-xl border border-white/10 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Company Profile
              </span>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                90% Complete
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#161C28] border border-white/10 text-cyan-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {companyProfile?.companyName || 'Your Company'}
                </p>
                <p className="text-xs text-slate-400">{companyProfile?.industry || 'Technology'}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enhance your employer branding with custom perks, banner, and mission statement.
            </p>
            <Link
              to="/employer/company-profile"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
            >
              Edit Company Profile <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-[#121620] rounded-xl border border-white/10 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Application Pipeline
              </span>
              <span className="text-xs text-cyan-400 font-medium">Stage Health</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Under Review</span>
                <span className="font-semibold text-white">
                  {applications.filter((a) => a.status === 'under_review').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Shortlisted</span>
                <span className="font-semibold text-indigo-400">
                  {applications.filter((a) => a.status === 'shortlisted').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Interview Scheduled</span>
                <span className="font-semibold text-purple-400">
                  {applications.filter((a) => a.status === 'interview').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Selected / Hired</span>
                <span className="font-semibold text-emerald-400">
                  {applications.filter((a) => a.status === 'selected').length}
                </span>
              </div>
            </div>
            <Link
              to="/employer/applications"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 pt-1"
            >
              Manage Applications <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-[#121620] rounded-xl border border-white/10 p-5 shadow-xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quick Resources
            </span>
            <p className="text-sm font-bold text-white">Recruiter Best Practices</p>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                Response time within 48h increases accept rates by 35%
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                Adding clear salary ranges doubles qualified applications
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                List 4–6 core technical skills for best algorithmic matching
              </li>
            </ul>
            <Link
              to="/employer/post-job"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 pt-1"
            >
              Post optimized listing <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Candidate Quick Review Modal ─── */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Candidate Quick Review"
        size="md"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus('rejected')}
                loading={updatingStatus}
                className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300"
              >
                Reject
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus('interview')}
                loading={updatingStatus}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                Interview
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUpdateStatus('shortlisted')}
                loading={updatingStatus}
              >
                Shortlist Candidate
              </Button>
            </div>
          </div>
        }
      >
        {selectedApp && (
          <div className="space-y-5 text-left">
            {/* Header info */}
            <div className="flex items-start gap-4">
              {selectedApp.applicantPhoto ? (
                <img
                  src={selectedApp.applicantPhoto}
                  alt={selectedApp.applicantName}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10"
                />
              ) : (
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-base ${getAvatarColor(
                    selectedApp.applicantName || 'Applicant'
                  )}`}
                >
                  {getInitials(selectedApp.applicantName || 'Applicant')}
                </div>
              )}
              <div className="space-y-1 flex-1">
                <h3 className="text-base font-bold text-white">
                  {selectedApp.applicantName || 'Anonymous Candidate'}
                </h3>
                <p className="text-sm font-medium text-cyan-400">
                  Applied for: {selectedApp.jobTitle}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{selectedApp.location || 'India'}</span>
                  <span>•</span>
                  <span>{selectedApp.experience || '3 years exp'}</span>
                </div>
              </div>
              <ApplicationStatusBadge status={selectedApp.status} />
            </div>

            {/* Application metadata */}
            <div className="bg-[#161C28] p-3.5 rounded-xl border border-white/10 space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="font-medium text-slate-400">Applied on:</span>
                <span>{formatDate(selectedApp.appliedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-400">Application ID:</span>
                <span className="font-mono text-cyan-300">{selectedApp.id}</span>
              </div>
            </div>

            {/* Skills */}
            {selectedApp.skills && selectedApp.skills.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Top Skills
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.skills.map((s) => (
                    <SkillBadge key={s} skill={s} size="sm" />
                  ))}
                </div>
              </div>
            )}

            {/* Cover letter or note */}
            {selectedApp.coverLetter && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Cover Note
                </label>
                <p className="text-xs text-slate-300 bg-[#161C28] p-3 rounded-lg border border-white/10 whitespace-pre-line leading-relaxed">
                  {selectedApp.coverLetter}
                </p>
              </div>
            )}

            <div className="pt-2 text-center">
              <Link
                to="/employer/applications"
                onClick={() => setReviewModalOpen(false)}
                className="text-xs font-medium text-cyan-400 hover:underline"
              >
                Go to full applications dashboard for detailed profile & resume →
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
