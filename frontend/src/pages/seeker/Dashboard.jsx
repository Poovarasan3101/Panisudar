import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  BookmarkCheck,
  Calendar,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  MapPin,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  FileText,
  UserCheck,
  GraduationCap,
} from 'lucide-react';

import { profileService } from '@/api/profileService';
import { applicationService } from '@/api/applicationService';
import { jobService } from '@/api/jobService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard';
import JobCard from '@/components/jobs/JobCard';
import ApplicationStatusBadge from '@/components/common/ApplicationStatusBadge';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { calcProfileCompletion, formatDate, timeAgo, getMediaUrl } from '@/utils/helpers';

export default function SeekerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [profileData, appsData, savedIds, jobsData] = await Promise.all([
        profileService.getSeekerProfile().catch(() => null),
        applicationService.getMyApplications().catch(() => []),
        Promise.resolve(profileService.getSavedJobIds()),
        jobService.getFeaturedJobs().catch(() => []),
      ]);

      setProfile(profileData);
      setApplications(appsData || []);
      setSavedJobIds(savedIds || []);
      setRecommendedJobs((jobsData || []).slice(0, 4));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      toast.error('Error', 'Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Save / Unsave job
  const handleToggleSave = async (jobId) => {
    const isCurrentlySaved = savedJobIds.includes(jobId);
    try {
      if (isCurrentlySaved) {
        await profileService.unsaveJob(jobId);
        setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
        toast.info('Job Removed', 'Job removed from your saved list.');
      } else {
        await profileService.saveJob(jobId);
        setSavedJobIds((prev) => [...prev, jobId]);
        toast.success('Job Saved', 'Job saved to your bookmarks.');
      }
    } catch (err) {
      toast.error('Error', 'Failed to update saved jobs.');
    }
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  const completion = profile ? calcProfileCompletion(profile) : 75;
  const interviewApplications = applications.filter((app) => app.status === 'interview');
  const shortlistedApplications = applications.filter((app) => app.status === 'shortlisted');
  const activeInterviewsCount = interviewApplications.length;
  const recentApplications = applications.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 py-8 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* ─── Hero Welcome Banner ────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-[#121620] border border-white/10 text-white p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={
                    getMediaUrl(profile?.photo || user?.photo) ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profile?.fullName || user?.fullName || 'User'
                    )}&background=6366f1&color=fff&size=80`
                  }
                  alt={profile?.fullName || user?.fullName || 'Profile'}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md bg-[#161C28]"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profile?.fullName || user?.fullName || 'User'
                    )}&background=6366f1&color=fff&size=80`;
                  }}
                />
                <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-[#121620]">
                  <span className="sr-only">Active</span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Welcome back, {profile?.fullName || user?.fullName || 'Job Seeker'}! 👋
                  </h1>
                </div>
                <p className="text-slate-400 text-sm sm:text-base mt-1 flex items-center gap-2">
                  <span className="text-cyan-400 font-medium">{profile?.title || 'Open to Opportunities'}</span>
                  {profile?.location && (
                    <>
                      <span className="opacity-50">•</span>
                      <span className="inline-flex items-center text-xs opacity-90 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        {profile.location}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/jobs">
                <Button
                  variant="primary"
                  className="shadow-lg shadow-indigo-600/25"
                  icon={<Search className="w-4 h-4" />}
                >
                  Explore Jobs
                </Button>
              </Link>
              <Link to="/job-seeker/profile">
                <Button
                  variant="outline"
                  icon={<UserCheck className="w-4 h-4" />}
                >
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-cyan-500/5 pointer-events-none blur-2xl" />
          <div className="absolute top-0 right-1/4 w-40 h-40 rounded-full bg-indigo-500/10 pointer-events-none blur-xl" />
        </div>

        {/* ─── Metric Stat Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <DashboardStatCard
            title="Total Applications"
            value={applications.length}
            icon={Briefcase}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            trend={`${applications.length} submitted`}
            trendUp={true}
            href="/job-seeker/applications"
          />
          <DashboardStatCard
            title="Saved Jobs"
            value={savedJobIds.length}
            icon={BookmarkCheck}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            trend="Ready to apply"
            trendUp={true}
            href="/job-seeker/saved-jobs"
          />
          <DashboardStatCard
            title="Active Interviews"
            value={activeInterviewsCount}
            icon={Calendar}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            trend={activeInterviewsCount > 0 ? 'Upcoming sessions' : 'None scheduled'}
            trendUp={activeInterviewsCount > 0}
            href="/job-seeker/applications"
          />
          <DashboardStatCard
            title="Profile Strength"
            value={`${completion}%`}
            icon={Award}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            trend={completion >= 80 ? 'All-star profile' : 'Complete details'}
            trendUp={completion >= 80}
            href="/job-seeker/profile"
          />
        </div>

        {/* ─── Main Grid Layout ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 cols): Recent Applications & Recommended Jobs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Applications Section */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    Recent Applications
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Track the real-time status of your submissions
                  </p>
                </div>
                <Link
                  to="/job-seeker/applications"
                  className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  View All ({applications.length})
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {recentApplications.length === 0 ? (
                <EmptyState
                  icon={<Briefcase />}
                  title="No applications yet"
                  description="Start browsing and applying for jobs matching your experience."
                  action={{
                    label: 'Browse Jobs',
                    onClick: () => navigate('/jobs'),
                  }}
                />
              ) : (
                <div className="divide-y divide-white/10">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#161C28]/80 p-2.5 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={
                            app.companyLogo ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              app.companyName
                            )}&background=4f46e5&color=fff&size=48`
                          }
                          alt={app.companyName}
                          className="w-11 h-11 rounded-xl object-contain border border-white/10 bg-[#161C28] p-1 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/jobs/${app.jobId}`}
                            className="font-semibold text-sm sm:text-base text-white hover:text-cyan-400 truncate block transition-colors"
                          >
                            {app.jobTitle}
                          </Link>
                          <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="font-medium text-slate-300">{app.companyName}</span>
                            <span>•</span>
                            <span>{app.location}</span>
                            <span>•</span>
                            <span>Applied {timeAgo(app.appliedAt)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                        <ApplicationStatusBadge status={app.status} />
                        <Link
                          to="/job-seeker/applications"
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-white/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Jobs Section */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Recommended Jobs
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Curated opportunities based on your skills and preferences
                  </p>
                </div>
                <Link
                  to="/jobs"
                  className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  Explore All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {recommendedJobs.length === 0 ? (
                <EmptyState
                  icon={<Sparkles />}
                  title="No recommendations right now"
                  description="Update your skills in profile to see personalized recommendations."
                  action={{
                    label: 'Update Profile',
                    onClick: () => navigate('/job-seeker/profile'),
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedJobIds.includes(job.id)}
                      onSave={handleToggleSave}
                      compact={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1 col): Profile Widget, Interview Alert, Quick Search */}
          <div className="space-y-6">
            {/* Profile Completion Card */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Profile Completion
                </h3>
                <span className="text-sm font-bold text-cyan-400">{completion}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#161C28] border border-white/10 rounded-full h-2.5 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {completion === 100
                  ? 'Outstanding! Your profile is 100% complete. Recruiters are 3x more likely to reach out.'
                  : 'Complete your profile to increase your visibility to top verified recruiters.'}
              </p>

              {/* Checklist */}
              <div className="space-y-2 mb-5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Personal details & contact info</span>
                </div>
                <div className="flex items-center gap-2">
                  {profile?.resume ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  )}
                  <span>Resume uploaded</span>
                </div>
                <div className="flex items-center gap-2">
                  {(profile?.skills?.length || 0) > 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  )}
                  <span>Key skills added ({profile?.skills?.length || 0})</span>
                </div>
                <div className="flex items-center gap-2">
                  {(profile?.experience?.length || 0) > 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  )}
                  <span>Work Experience ({profile?.experience?.length || 0})</span>
                </div>
                <div className="flex items-center gap-2">
                  {(profile?.education?.length || 0) > 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  )}
                  <span>Education details ({profile?.education?.length || 0})</span>
                </div>
              </div>

              <Link to="/job-seeker/profile" className="block">
                <Button variant="outline" size="sm" fullWidth>
                  Complete Your Profile
                </Button>
              </Link>
            </div>

            {/* Resume & Documents Quick Card */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Your Active Resume
                </h3>
                <Link
                  to="/job-seeker/profile"
                  className="text-xs text-cyan-400 font-semibold hover:underline"
                >
                  Manage
                </Link>
              </div>

              {profile?.resume ? (
                <div className="p-3 bg-[#161C28] rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {profile.resume.name || 'Resume_2026.pdf'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Updated {profile.resume.uploadedAt || 'recently'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 font-semibold">
                    Attached
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-amber-950/30 rounded-xl border border-amber-500/30 text-center">
                  <p className="text-xs text-amber-300 font-medium mb-2">No active resume uploaded yet</p>
                  <Link to="/job-seeker/profile">
                    <Button variant="outline" size="sm" fullWidth className="text-xs">
                      Upload Resume
                    </Button>
                  </Link>
                </div>
              )}

              {/* Skills preview tags */}
              {profile?.skills && profile.skills.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Highlighted Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.slice(0, 6).map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-md bg-[#161C28] text-cyan-300 border border-cyan-500/30 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 6 && (
                      <span className="text-[11px] text-slate-400 self-center">
                        +{profile.skills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Experience & Education Highlights Card */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-cyan-400" />
                  Experience & Education
                </h3>
                <Link
                  to="/job-seeker/profile"
                  className="text-xs text-cyan-400 font-semibold hover:underline"
                >
                  Manage
                </Link>
              </div>

              {/* Work Experience Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Work Experience
                  </span>
                  <Link
                    to="/job-seeker/profile"
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5"
                  >
                    + Add
                  </Link>
                </div>

                {profile?.experience && profile.experience.length > 0 ? (
                  <div className="space-y-2.5">
                    {profile.experience.slice(0, 3).map((exp, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[#161C28] rounded-xl border border-white/5 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white truncate">{exp.title}</p>
                          {exp.isCurrent && (
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-cyan-400 font-medium">{exp.company}</p>
                        <p className="text-[10px] text-slate-400">
                          {exp.startDate ? `${exp.startDate} – ` : ''}
                          {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                        </p>
                      </div>
                    ))}
                    {profile.experience.length > 3 && (
                      <Link
                        to="/job-seeker/profile"
                        className="text-[11px] text-slate-400 hover:text-cyan-300 block text-center pt-1"
                      >
                        +{profile.experience.length - 3} more experiences in profile
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-[#161C28]/60 rounded-xl border border-dashed border-white/10 text-center">
                    <p className="text-xs text-slate-400 mb-1.5">No work experience added</p>
                    <Link
                      to="/job-seeker/profile"
                      className="text-xs text-cyan-400 hover:underline font-semibold"
                    >
                      + Add your experience
                    </Link>
                  </div>
                )}
              </div>

              {/* Education Preview */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                    Education
                  </span>
                  <Link
                    to="/job-seeker/profile"
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5"
                  >
                    + Add
                  </Link>
                </div>

                {profile?.education && profile.education.length > 0 ? (
                  <div className="space-y-2.5">
                    {profile.education.slice(0, 2).map((edu, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[#161C28] rounded-xl border border-white/5 space-y-1"
                      >
                        <p className="text-xs font-bold text-white truncate">{edu.degree}</p>
                        <p className="text-[11px] text-slate-300 truncate">{edu.institution}</p>
                        <p className="text-[10px] text-slate-400">
                          {edu.startYear ? edu.startYear : ''}
                          {edu.endYear ? ` – ${edu.endYear}` : ''}
                          {edu.grade ? ` • Grade: ${edu.grade}` : ''}
                        </p>
                      </div>
                    ))}
                    {profile.education.length > 2 && (
                      <Link
                        to="/job-seeker/profile"
                        className="text-[11px] text-slate-400 hover:text-cyan-300 block text-center pt-1"
                      >
                        +{profile.education.length - 2} more education records
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-[#161C28]/60 rounded-xl border border-dashed border-white/10 text-center">
                    <p className="text-xs text-slate-400 mb-1.5">No education records added</p>
                    <Link
                      to="/job-seeker/profile"
                      className="text-xs text-cyan-400 hover:underline font-semibold"
                    >
                      + Add your degree
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Interview Card (if any scheduled) */}
            {interviewApplications.length > 0 && (
              <div className="bg-[#121620] border border-purple-500/30 rounded-2xl p-6 shadow-xl">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-purple-950/60 text-purple-400 border border-purple-500/30 rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-purple-950/80 text-purple-300 border border-purple-500/30 rounded-full">
                    Upcoming
                  </span>
                </div>

                <h4 className="mt-3 font-bold text-white text-sm sm:text-base">
                  Interview: {interviewApplications[0].jobTitle}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  with <span className="font-semibold text-white">{interviewApplications[0].companyName}</span>
                </p>

                <div className="mt-4 p-3 bg-[#161C28] rounded-xl border border-white/10 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sept 25, 2026 • 11:00 AM IST</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Google Meet (Check your email invitation)</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Link to="/job-seeker/applications">
                    <Button variant="primary" size="sm" fullWidth className="bg-purple-600 hover:bg-purple-500 border-none">
                      View Application Details
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Job Search Widget */}
            <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6">
              <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                Quick Job Search
              </h3>
              <form onSubmit={handleQuickSearch} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Role, skill, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm rounded-xl border border-white/10 bg-[#161C28] px-3.5 py-2.5 pl-9 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                </div>
                <Button type="submit" variant="primary" size="sm" fullWidth>
                  Search Listings
                </Button>
              </form>

              {/* Popular tags */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Popular Categories
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Remote', param: 'workMode=remote' },
                    { label: 'Full Time', param: 'jobType=full_time' },
                    { label: 'Software', param: 'category=software_dev' },
                    { label: 'Bangalore', param: 'location=Bangalore' },
                  ].map((chip) => (
                    <Link
                      key={chip.label}
                      to={`/jobs?${chip.param}`}
                      className="px-2.5 py-1 text-xs rounded-xl bg-[#161C28] border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 font-medium transition-colors"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
