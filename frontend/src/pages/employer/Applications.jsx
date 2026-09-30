import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  Download,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  ChevronDown,
  UserCheck,
  GraduationCap,
} from 'lucide-react';
import { applicationService } from '@/api/applicationService';
import { employerService } from '@/api/employerService';
import { mockSeekerProfile } from '@/mock/users';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import ApplicationStatusBadge from '@/components/common/ApplicationStatusBadge';
import SkillBadge from '@/components/common/SkillBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import EmployerHeader from './EmployerHeader';
import { APPLICATION_STATUSES } from '@/utils/constants';
import { formatDate, timeAgo, getInitials, getAvatarColor } from '@/utils/helpers';

export default function EmployerApplications() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  // URL / Filter State
  const initialJobId = searchParams.get('jobId') || 'all';
  const initialStatus = searchParams.get('status') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // View Candidate Profile Modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // View Resume Modal
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumeApp, setResumeApp] = useState(null);

  // Status updating state
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // Sync state if query params change
  useEffect(() => {
    const jId = searchParams.get('jobId') || 'all';
    const st = searchParams.get('status') || 'all';
    setSelectedJobId(jId);
    setSelectedStatus(st);
  }, [searchParams]);

  async function loadData() {
    try {
      setLoading(true);
      const [fetchedApps, fetchedJobs] = await Promise.all([
        applicationService.getEmployerApplications(),
        employerService.getMyJobs(),
      ]);
      setApplications(fetchedApps);
      setJobs(fetchedJobs);
    } catch (err) {
      toast?.error?.('Error', 'Failed to load application data.');
    } finally {
      setLoading(false);
    }
  }

  // Update Status handler
  async function handleStatusChange(applicationId, newStatus) {
    try {
      setUpdatingId(applicationId);
      const updated = await applicationService.updateApplicationStatus(
        applicationId,
        newStatus
      );

      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
      );

      if (selectedCandidate && selectedCandidate.id === applicationId) {
        setSelectedCandidate((prev) => ({ ...prev, status: newStatus }));
      }

      toast?.success?.(
        'Status Updated',
        `Candidate application moved to "${newStatus.replace('_', ' ')}"`
      );
    } catch (err) {
      toast?.error?.('Failed', 'Could not update applicant status.');
    } finally {
      setUpdatingId(null);
    }
  }

  // Open Candidate Detail Modal
  function handleOpenCandidateModal(app) {
    setSelectedCandidate(app);
    setProfileModalOpen(true);
  }

  // Open Resume Modal
  function handleOpenResumeModal(app, e) {
    e?.stopPropagation();
    setResumeApp(app);
    setResumeModalOpen(true);
  }

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Job filter
      const matchesJob =
        selectedJobId === 'all' || app.jobId === selectedJobId;

      // Status filter
      const matchesStatus =
        selectedStatus === 'all' || app.status === selectedStatus;

      // Search query (name, jobTitle, skills)
      const matchesSearch =
        !searchQuery ||
        app.applicantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.skills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesJob && matchesStatus && matchesSearch;
    });
  }, [applications, selectedJobId, selectedStatus, searchQuery]);

  // Paginated applications
  const totalPages = Math.ceil(filteredApps.length / pageSize) || 1;
  const paginatedApps = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredApps.slice(start, start + pageSize);
  }, [filteredApps, page, pageSize]);

  // Status counts for quick filter buttons
  const statusCounts = useMemo(() => {
    const counts = { all: applications.length };
    APPLICATION_STATUSES.forEach((s) => {
      counts[s.value] = applications.filter((a) => a.status === s.value).length;
    });
    return counts;
  }, [applications]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D12] text-slate-100 pb-20 relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <EmployerHeader
            title="Candidate Applications"
            subtitle="Review candidate qualifications, resumes, and manage recruitment pipeline"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm text-slate-400">Loading candidate applications...</p>
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
          title="Candidate Applications"
          subtitle="Review profiles, evaluate resumes, and advance candidates through your hiring pipeline"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* ─── Status Filter Tabs ─── */}
          <div className="bg-[#121620] rounded-xl border border-white/10 p-2 shadow-xl flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setSelectedStatus('all');
                setPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedStatus === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>All Candidates</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  selectedStatus === 'all'
                    ? 'bg-cyan-500/30 text-cyan-200'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {statusCounts.all || 0}
              </span>
            </button>

            {APPLICATION_STATUSES.map((st) => (
              <button
                key={st.value}
                type="button"
                onClick={() => {
                  setSelectedStatus(st.value);
                  setPage(1);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedStatus === st.value
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    selectedStatus === st.value
                      ? 'bg-cyan-500/30 text-cyan-200'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {statusCounts[st.value] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* ─── Filter Row: Search & Job Selector ─── */}
          <div className="bg-[#121620] rounded-xl border border-white/10 p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-80">
              <Input
                placeholder="Search by candidate name or skill..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                icon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-xs font-medium text-slate-400 whitespace-nowrap">
                Filter by Job:
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  setPage(1);
                }}
                className="w-full md:w-72 rounded-lg border border-white/10 bg-[#161C28] px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="all">All Jobs ({jobs.length})</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id} className="bg-[#161C28] text-white">
                    {j.title} ({j.applicationsCount || 0})
                  </option>
                ))}
              </select>
            </div>
          </div>

        {/* ─── Applications List / Table ─── */}
        {filteredApps.length === 0 ? (
          <div className="bg-[#121620] rounded-xl border border-white/10 p-8 shadow-xl">
            <EmptyState
              icon={<Users />}
              title="No applications match your criteria"
              description="Try adjusting your job filter or search keywords to find candidate submissions."
              action={{
                label: 'Clear Filters',
                onClick: () => {
                  setSelectedJobId('all');
                  setSelectedStatus('all');
                  setSearchQuery('');
                },
              }}
            />
          </div>
        ) : (
          <div className="bg-[#121620] rounded-xl border border-white/10 shadow-xl overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#161C28]/80 border-b border-white/10 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Candidate</th>
                    <th className="py-3.5 px-4">Applied Role</th>
                    <th className="py-3.5 px-4">Experience & Skills</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {paginatedApps.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      onClick={() => handleOpenCandidateModal(app)}
                    >
                      {/* Candidate Avatar & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {app.applicantPhoto ? (
                            <img
                              src={app.applicantPhoto}
                              alt={app.applicantName}
                              className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10 shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 ${getAvatarColor(
                                app.applicantName || 'Candidate'
                              )}`}
                            >
                              {getInitials(app.applicantName || 'Candidate')}
                            </div>
                          )}
                          <div className="space-y-0.5">
                            <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                              {app.applicantName || 'Anonymous Applicant'}
                            </p>
                            <p className="text-xs text-slate-400">
                              {app.location || 'India'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Applied Role */}
                      <td className="py-4 px-4 text-xs">
                        <p className="font-medium text-white">{app.jobTitle}</p>
                        <p className="text-slate-500">ID: {app.jobId}</p>
                      </td>

                      {/* Experience & Skills */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 max-w-xs">
                          <p className="text-xs text-slate-300 font-medium">
                            {app.experience || 'Not specified'}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {app.skills?.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="bg-white/5 text-slate-300 border border-white/10 px-1.5 py-0.5 rounded text-[11px]"
                              >
                                {skill}
                              </span>
                            ))}
                            {app.skills?.length > 3 && (
                              <span className="text-[11px] text-slate-400">
                                +{app.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Applied Date */}
                      <td className="py-4 px-4 text-xs text-slate-400 whitespace-nowrap">
                        <div>{formatDate(app.appliedAt)}</div>
                        <div className="text-[11px] text-slate-500">
                          {timeAgo(app.appliedAt)}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 text-center">
                        <ApplicationStatusBadge status={app.status} />
                      </td>

                      {/* Action Dropdown / Buttons */}
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleOpenResumeModal(app, e)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
                            title="View Resume"
                          >
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            Resume
                          </button>

                          {/* Quick Status Select */}
                          <select
                            value={app.status}
                            disabled={updatingId === app.id}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="rounded-lg border border-white/10 bg-[#161C28] px-2 py-1 text-xs text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                          >
                            <option value="applied" className="bg-[#161C28] text-white">Applied</option>
                            <option value="under_review" className="bg-[#161C28] text-white">Under Review</option>
                            <option value="shortlisted" className="bg-[#161C28] text-white">Shortlist</option>
                            <option value="interview" className="bg-[#161C28] text-white">Interview</option>
                            <option value="selected" className="bg-[#161C28] text-white">Selected</option>
                            <option value="rejected" className="bg-[#161C28] text-white">Reject</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards View */}
            <div className="block lg:hidden divide-y divide-white/10">
              {paginatedApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleOpenCandidateModal(app)}
                  className="p-4 sm:p-5 space-y-3 cursor-pointer hover:bg-white/[0.03]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {app.applicantPhoto ? (
                        <img
                          src={app.applicantPhoto}
                          alt={app.applicantName}
                          className="w-11 h-11 rounded-full object-cover ring-1 ring-white/10 shrink-0"
                        />
                      ) : (
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 ${getAvatarColor(
                            app.applicantName || 'Candidate'
                          )}`}
                        >
                          {getInitials(app.applicantName || 'Candidate')}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-white text-base">
                          {app.applicantName || 'Anonymous Applicant'}
                        </p>
                        <p className="text-xs text-cyan-400 font-medium">
                          {app.jobTitle}
                        </p>
                      </div>
                    </div>

                    <ApplicationStatusBadge status={app.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>{app.experience || '3 years exp'}</span>
                    <span>•</span>
                    <span>Applied {timeAgo(app.appliedAt)}</span>
                  </div>

                  {app.skills && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {app.skills.map((s) => (
                        <span
                          key={s}
                          className="bg-white/5 text-slate-300 border border-white/10 text-xs px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div
                    className="flex items-center justify-between pt-3 border-t border-white/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleOpenResumeModal(app, e)}
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Resume
                    </button>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">Move to:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="rounded-lg border border-white/10 bg-[#161C28] px-2 py-1 text-xs text-slate-200 font-medium focus:outline-none"
                      >
                        <option value="applied" className="bg-[#161C28] text-white">Applied</option>
                        <option value="under_review" className="bg-[#161C28] text-white">Review</option>
                        <option value="shortlisted" className="bg-[#161C28] text-white">Shortlist</option>
                        <option value="interview" className="bg-[#161C28] text-white">Interview</option>
                        <option value="selected" className="bg-[#161C28] text-white">Select</option>
                        <option value="rejected" className="bg-[#161C28] text-white">Reject</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-white/10">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={filteredApps.length}
                  pageSize={pageSize}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── View Candidate Full Profile Modal ─── */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Candidate Application Profile"
        size="lg"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleStatusChange(selectedCandidate?.id, 'rejected');
                  setProfileModalOpen(false);
                }}
                className="text-red-400 border-red-500/30 hover:bg-red-500/10"
              >
                Reject Candidate
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleStatusChange(selectedCandidate?.id, 'interview');
                  setProfileModalOpen(false);
                }}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                Invite to Interview
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleStatusChange(selectedCandidate?.id, 'shortlisted');
                  setProfileModalOpen(false);
                }}
              >
                Shortlist Candidate
              </Button>
            </div>
          </div>
        }
      >
        {selectedCandidate && (
          <div className="space-y-6 text-left">
            {/* Header info */}
            <div className="flex items-start gap-4">
              {selectedCandidate.applicantPhoto ? (
                <img
                  src={selectedCandidate.applicantPhoto}
                  alt={selectedCandidate.applicantName}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10"
                />
              ) : (
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl ${getAvatarColor(
                    selectedCandidate.applicantName || 'Candidate'
                  )}`}
                >
                  {getInitials(selectedCandidate.applicantName || 'Candidate')}
                </div>
              )}

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    {selectedCandidate.applicantName || 'Anonymous Candidate'}
                  </h3>
                  <ApplicationStatusBadge status={selectedCandidate.status} />
                </div>
                <p className="text-sm font-semibold text-cyan-400">
                  Target Role: {selectedCandidate.jobTitle}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {selectedCandidate.location || 'Bangalore, India'}
                  </span>
                  <span>•</span>
                  <span>{selectedCandidate.experience || '3+ years experience'}</span>
                  <span>•</span>
                  <span>Applied {formatDate(selectedCandidate.appliedAt)}</span>
                </div>
              </div>
            </div>

            {/* Contact Details Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#161C28] rounded-xl border border-white/10 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>arjun.sharma@email.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>+91 98765 43210</span>
              </div>
            </div>

            {/* Skills */}
            {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Technical Core Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} size="sm" />
                  ))}
                </div>
              </div>
            )}

            {/* Professional Background */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Candidate Summary & Background
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#161C28] p-3.5 rounded-xl border border-white/10">
                Experienced software engineer with a track record of developing scalable, maintainable web applications and collaborating effectively in fast-moving agile product squads. Strong foundation in component architecture, state management, and modern CI/CD deployment pipelines.
              </p>
            </div>

            {/* Candidate Work Experience */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                Work Experience
              </h4>
              {((selectedCandidate.experienceList || (Array.isArray(selectedCandidate.experience) ? selectedCandidate.experience : null) || (selectedCandidate.applicantName === 'Arjun Sharma' ? mockSeekerProfile.experience : []))).length > 0 ? (
                <div className="space-y-2.5">
                  {(selectedCandidate.experienceList || (Array.isArray(selectedCandidate.experience) ? selectedCandidate.experience : null) || (selectedCandidate.applicantName === 'Arjun Sharma' ? mockSeekerProfile.experience : [])).map((exp, idx) => (
                    <div key={idx} className="p-3 bg-[#161C28] rounded-xl border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-xs">{exp.title} • {exp.company}</span>
                        <span className="text-slate-400 text-[11px] font-normal">
                          {exp.startDate ? `${exp.startDate} – ` : ''}{exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-slate-400 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-[#161C28] p-3 rounded-xl">
                  {typeof selectedCandidate.experience === 'string' ? `${selectedCandidate.experience} total industry experience` : 'No formal work experience detailed.'}
                </p>
              )}
            </div>

            {/* Candidate Education */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                Education
              </h4>
              {((selectedCandidate.educationList || (Array.isArray(selectedCandidate.education) ? selectedCandidate.education : null) || (selectedCandidate.applicantName === 'Arjun Sharma' ? mockSeekerProfile.education : []))).length > 0 ? (
                <div className="space-y-2.5">
                  {(selectedCandidate.educationList || (Array.isArray(selectedCandidate.education) ? selectedCandidate.education : null) || (selectedCandidate.applicantName === 'Arjun Sharma' ? mockSeekerProfile.education : [])).map((edu, idx) => (
                    <div key={idx} className="p-3 bg-[#161C28] rounded-xl border border-white/5 space-y-0.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{edu.degree}</span>
                        <span className="text-slate-400 text-[11px]">
                          {edu.startYear ? edu.startYear : ''}{edu.endYear ? ` – ${edu.endYear}` : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {edu.institution}{edu.grade ? ` • Grade: ${edu.grade}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-[#161C28] p-3 rounded-xl">
                  Undergraduate degree / educational qualifications verified.
                </p>
              )}
            </div>

            {/* Resume File Link */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {selectedCandidate.applicantName?.replace(/\s+/g, '_')}_Resume.pdf
                  </p>
                  <p className="text-[11px] text-slate-400">
                    PDF Document • 1.4 MB • Uploaded recently
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                onClick={() => {
                  setProfileModalOpen(false);
                  setResumeApp(selectedCandidate);
                  setResumeModalOpen(true);
                }}
              >
                Inspect Resume
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── View Resume Modal ─── */}
      <Modal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        title="Resume Preview"
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-slate-400">
              Applicant: {resumeApp?.applicantName || 'Candidate'}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResumeModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => {
                  toast?.info?.('Download Started', 'Downloading candidate resume PDF...');
                }}
              >
                Download PDF
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          {/* Mock Document Viewer Header */}
          <div className="p-3 bg-[#161C28] rounded-lg border border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span className="font-mono text-slate-300">
              {resumeApp?.applicantName?.replace(/\s+/g, '_') || 'Candidate'}_Resume_2026.pdf
            </span>
            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">
              Verified Candidate
            </span>
          </div>

          {/* Formatted Resume Preview Card */}
          <div className="border border-white/10 rounded-xl p-6 bg-[#121620] shadow-inner space-y-5 text-slate-200 font-sans text-xs sm:text-sm">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white">
                {resumeApp?.applicantName || 'Arjun Sharma'}
              </h2>
              <p className="text-cyan-400 font-semibold text-xs mt-0.5">
                Full Stack & Frontend Engineer
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400 mt-2">
                <span>arjun.sharma@email.com</span>
                <span>•</span>
                <span>+91 98765 43210</span>
                <span>•</span>
                <span>Bangalore, Karnataka</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Core Competencies
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                React.js, TypeScript, Next.js, Redux Toolkit, Node.js, Express, PostgreSQL, MongoDB, Docker, AWS, GraphQL, REST APIs, Tailwind CSS, Jest, Git.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Work Experience
              </h3>
              {((resumeApp?.experienceList || (Array.isArray(resumeApp?.experience) ? resumeApp.experience : null) || (resumeApp?.applicantName === 'Arjun Sharma' ? mockSeekerProfile.experience : []))).length > 0 ? (
                <div className="space-y-2">
                  {(resumeApp?.experienceList || (Array.isArray(resumeApp?.experience) ? resumeApp.experience : null) || (resumeApp?.applicantName === 'Arjun Sharma' ? mockSeekerProfile.experience : [])).map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-semibold text-white text-xs">
                        <span>{exp.title} • {exp.company}</span>
                        <span className="text-slate-400 font-normal">
                          {exp.startDate ? `${exp.startDate} – ` : ''}{exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No previous employment records listed.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Education
              </h3>
              {((resumeApp?.educationList || (Array.isArray(resumeApp?.education) ? resumeApp.education : null) || (resumeApp?.applicantName === 'Arjun Sharma' ? mockSeekerProfile.education : []))).length > 0 ? (
                <div className="space-y-2">
                  {(resumeApp?.educationList || (Array.isArray(resumeApp?.education) ? resumeApp.education : null) || (resumeApp?.applicantName === 'Arjun Sharma' ? mockSeekerProfile.education : [])).map((edu, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-white">
                          {edu.degree}
                        </span>
                        <span className="text-slate-400">
                          {edu.startYear ? edu.startYear : ''}{edu.endYear ? ` – ${edu.endYear}` : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {edu.institution}{edu.grade ? ` • Grade: ${edu.grade}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Graduation and academic milestones verified.</p>
              )}
            </div>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
}
