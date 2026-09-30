import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  PlusCircle,
  Users,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  AlertTriangle,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
} from 'lucide-react';
import { employerService } from '@/api/employerService';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Modal from '@/components/common/Modal';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import SkillBadge from '@/components/common/SkillBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import EmployerHeader from './EmployerHeader';
import { JOB_CATEGORIES, JOB_TYPES, WORK_MODES, EXPERIENCE_LEVELS } from '@/utils/constants';
import { formatSalary, formatDate, timeAgo } from '@/utils/helpers';

export default function MyJobs() {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Edit Job Modal State
  const [editingJob, setEditingJob] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Job Modal State
  const [deletingJob, setDeletingJob] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      const data = await employerService.getMyJobs();
      setJobs(data);
    } catch (err) {
      toast?.error?.('Error', 'Failed to load your job listings.');
    } finally {
      setLoading(false);
    }
  }

  // Toggle active/inactive
  async function handleToggleStatus(job) {
    try {
      const updated = await employerService.toggleJobStatus(job.id);
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, isActive: updated.isActive } : j))
      );
      toast?.success?.(
        'Status Changed',
        `"${job.title}" is now ${updated.isActive ? 'Active' : 'Inactive'}.`
      );
    } catch (err) {
      toast?.error?.('Failed', 'Could not update job status.');
    }
  }

  // Open Edit Modal
  function handleOpenEdit(job) {
    setEditingJob({
      ...job,
      salaryMin: job.salaryMin || '',
      salaryMax: job.salaryMax || '',
      applicationDeadline: job.applicationDeadline
        ? job.applicationDeadline.split('T')[0]
        : '',
      skillsText: Array.isArray(job.skills) ? job.skills.join(', ') : '',
    });
    setEditModalOpen(true);
  }

  // Submit Edit Form
  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editingJob) return;

    try {
      setSavingEdit(true);
      const parsedSkills = editingJob.skillsText
        ? editingJob.skillsText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : editingJob.skills || [];

      const updates = {
        title: editingJob.title,
        category: editingJob.category,
        workMode: editingJob.workMode,
        jobType: editingJob.jobType,
        experienceLevel: editingJob.experienceLevel,
        location: editingJob.location,
        salaryMin: editingJob.salaryMin ? Number(editingJob.salaryMin) : null,
        salaryMax: editingJob.salaryMax ? Number(editingJob.salaryMax) : null,
        applicationDeadline: editingJob.applicationDeadline || null,
        description: editingJob.description,
        skills: parsedSkills,
      };

      const updated = await employerService.updateJob(editingJob.id, updates);

      setJobs((prev) =>
        prev.map((j) => (j.id === editingJob.id ? { ...j, ...updated } : j))
      );
      setEditModalOpen(false);
      setEditingJob(null);
      toast?.success?.('Job Updated', 'The job listing has been updated successfully.');
    } catch (err) {
      toast?.error?.('Error', 'Failed to update job details.');
    } finally {
      setSavingEdit(false);
    }
  }

  // Open Delete Confirmation
  function handleOpenDelete(job) {
    setDeletingJob(job);
    setDeleteModalOpen(true);
  }

  // Confirm Delete
  async function handleConfirmDelete() {
    if (!deletingJob) return;

    try {
      setDeleting(true);
      await employerService.deleteJob(deletingJob.id);
      setJobs((prev) => prev.filter((j) => j.id !== deletingJob.id));
      setDeleteModalOpen(false);
      setDeletingJob(null);
      toast?.success?.('Job Deleted', 'Job listing was successfully removed.');
    } catch (err) {
      toast?.error?.('Error', 'Failed to delete job listing.');
    } finally {
      setDeleting(false);
    }
  }

  // Filter and Search logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Query match
      const matchesQuery =
        !searchQuery.trim() ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Status match
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && job.isActive) ||
        (statusFilter === 'inactive' && !job.isActive);

      // Category match
      const matchesCategory =
        categoryFilter === 'all' || job.category === categoryFilter;

      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [jobs, searchQuery, statusFilter, categoryFilter]);

  // Total pages
  const totalPages = Math.ceil(filteredJobs.length / pageSize) || 1;

  // Paginated items
  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, page, pageSize]);

  // Stats calculation
  const totalCount = jobs.length;
  const activeCount = jobs.filter((j) => j.isActive).length;
  const inactiveCount = totalCount - activeCount;
  const totalApplications = jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D12] text-slate-100">
        <EmployerHeader
          title="My Job Postings"
          subtitle="Manage, edit, and track status for all your listed jobs"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-slate-400">Loading your job postings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 pb-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <EmployerHeader
        title="My Job Postings"
        subtitle="Manage and monitor performance across your active and archived job openings"
        action={
          <Link to="/employer/post-job">
            <Button
              variant="primary"
              size="md"
              icon={<PlusCircle className="w-4 h-4" />}
            >
              Post a New Job
            </Button>
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        {/* ─── Metric Pills Row ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#121620] rounded-xl border border-white/10 p-4 shadow-xl">
            <span className="text-xs font-medium text-slate-400">Total Listings</span>
            <p className="text-2xl font-bold text-white mt-1">{totalCount}</p>
          </div>
          <div className="bg-[#121620] rounded-xl border border-white/10 p-4 shadow-xl">
            <span className="text-xs font-medium text-emerald-400">Active Jobs</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</p>
          </div>
          <div className="bg-[#121620] rounded-xl border border-white/10 p-4 shadow-xl">
            <span className="text-xs font-medium text-slate-400">Inactive / Closed</span>
            <p className="text-2xl font-bold text-slate-300 mt-1">{inactiveCount}</p>
          </div>
          <div className="bg-[#121620] rounded-xl border border-white/10 p-4 shadow-xl">
            <span className="text-xs font-medium text-cyan-400">Total Applicants</span>
            <p className="text-2xl font-bold text-cyan-400 mt-1">{totalApplications}</p>
          </div>
        </div>

        {/* ─── Filter Bar ─── */}
        <div className="bg-[#121620] rounded-xl border border-white/10 p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="w-full md:w-80 relative">
            <Input
              placeholder="Search by title or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              icon={<Search className="w-4 h-4 text-slate-500" />}
            />
          </div>

          {/* Status & Category filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status pills */}
            <div className="inline-flex rounded-lg border border-white/10 p-1 bg-[#161C28]">
              {['all', 'active', 'inactive'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setStatusFilter(st);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                    statusFilter === st
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <div className="w-48">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-white/10 bg-[#161C28] px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="all" className="bg-[#161C28] text-white">All Categories</option>
                {JOB_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[#161C28] text-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ─── Jobs Table / Mobile Cards ─── */}
        {filteredJobs.length === 0 ? (
          <div className="bg-[#121620] rounded-xl border border-white/10 p-8 shadow-xl">
            <EmptyState
              icon={<Briefcase className="w-10 h-10 text-cyan-400" />}
              title="No jobs found"
              description="No job postings matched your current search filters. Try resetting the filters or create a new job."
              action={{
                label: 'Post a New Job',
                onClick: () => navigate('/employer/post-job'),
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
                    <th className="py-3.5 px-6">Job Title</th>
                    <th className="py-3.5 px-4">Location & Mode</th>
                    <th className="py-3.5 px-4">Compensation</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Applicants</th>
                    <th className="py-3.5 px-4">Posted Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {paginatedJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Job Title */}
                      <td className="py-4 px-6">
                        <div className="space-y-1 max-w-xs">
                          <Link
                            to={`/employer/applications?jobId=${job.id}`}
                            className="font-semibold text-white hover:text-cyan-400 transition-colors line-clamp-1"
                          >
                            {job.title}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="capitalize">{job.category}</span>
                            <span>•</span>
                            <span className="capitalize">{job.jobType?.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </td>

                      {/* Location & Mode */}
                      <td className="py-4 px-4 text-xs text-slate-300">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 font-medium text-white">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {job.location}
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded bg-[#161C28] text-slate-300 border border-white/10 uppercase text-[10px] font-semibold">
                            {job.workMode}
                          </span>
                        </div>
                      </td>

                      {/* Salary */}
                      <td className="py-4 px-4 text-xs font-medium text-slate-300">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(job)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            job.isActive ? 'bg-cyan-500' : 'bg-[#161C28] border border-white/10'
                          }`}
                          role="switch"
                          aria-checked={job.isActive}
                          title={job.isActive ? 'Click to deactivate' : 'Click to activate'}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              job.isActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <p className="text-[10px] text-slate-400 mt-1 capitalize">
                          {job.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </td>

                      {/* Applicants */}
                      <td className="py-4 px-4 text-center">
                        <Link
                          to={`/employer/applications?jobId=${job.id}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#161C28] text-cyan-300 hover:bg-[#161C28]/80 border border-white/10 transition-colors"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{job.applicationsCount || 0}</span>
                        </Link>
                      </td>

                      {/* Posted Date */}
                      <td className="py-4 px-4 text-xs text-slate-400">
                        <div>{formatDate(job.postedAt)}</div>
                        <div className="text-[11px] text-slate-500">{timeAgo(job.postedAt)}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/employer/applications?jobId=${job.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                            title="View candidate applications"
                          >
                            <Users className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(job)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-white/5 transition-colors"
                            title="Edit job listing"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(job)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete job listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards View */}
            <div className="block lg:hidden divide-y divide-white/10">
              {paginatedJobs.map((job) => (
                <div key={job.id} className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <Link
                        to={`/employer/applications?jobId=${job.id}`}
                        className="font-bold text-white text-base hover:text-cyan-400 block"
                      >
                        {job.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="capitalize">{job.category}</span>
                        <span>•</span>
                        <span className="capitalize">{job.jobType?.replace('_', ' ')}</span>
                        <span>•</span>
                        <span className="capitalize">{job.workMode}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(job)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        job.isActive ? 'bg-cyan-500' : 'bg-[#161C28] border border-white/10'
                      }`}
                      role="switch"
                      aria-checked={job.isActive}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          job.isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <span className="font-semibold text-white">
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>
                    <span className="text-slate-400">
                      Posted {timeAgo(job.postedAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <Link
                      to={`/employer/applications?jobId=${job.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-[#161C28] border border-white/10 px-3 py-1.5 rounded-lg"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{job.applicationsCount || 0} Applicants</span>
                    </Link>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(job)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-xs flex items-center gap-1 font-medium"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleOpenDelete(job)}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg text-xs flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
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
                  total={filteredJobs.length}
                  pageSize={pageSize}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Edit Job Modal ─── */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Job Posting"
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="outline"
              size="md"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSaveEdit}
              loading={savingEdit}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        {editingJob && (
          <form onSubmit={handleSaveEdit} className="space-y-4 text-left">
            <Input
              label="Job Title"
              value={editingJob.title}
              onChange={(e) =>
                setEditingJob((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category"
                value={editingJob.category}
                onChange={(e) =>
                  setEditingJob((prev) => ({ ...prev, category: e.target.value }))
                }
                options={JOB_CATEGORIES.map((c) => ({
                  value: c.value,
                  label: c.label,
                }))}
              />

              <Select
                label="Job Type"
                value={editingJob.jobType}
                onChange={(e) =>
                  setEditingJob((prev) => ({ ...prev, jobType: e.target.value }))
                }
                options={JOB_TYPES}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Work Mode"
                value={editingJob.workMode}
                onChange={(e) =>
                  setEditingJob((prev) => ({ ...prev, workMode: e.target.value }))
                }
                options={WORK_MODES}
              />

              <Select
                label="Experience Level"
                value={editingJob.experienceLevel}
                onChange={(e) =>
                  setEditingJob((prev) => ({
                    ...prev,
                    experienceLevel: e.target.value,
                  }))
                }
                options={EXPERIENCE_LEVELS}
              />
            </div>

            <Input
              label="Location"
              value={editingJob.location}
              onChange={(e) =>
                setEditingJob((prev) => ({ ...prev, location: e.target.value }))
              }
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Min Salary (₹)"
                type="number"
                value={editingJob.salaryMin}
                onChange={(e) =>
                  setEditingJob((prev) => ({ ...prev, salaryMin: e.target.value }))
                }
              />

              <Input
                label="Max Salary (₹)"
                type="number"
                value={editingJob.salaryMax}
                onChange={(e) =>
                  setEditingJob((prev) => ({ ...prev, salaryMax: e.target.value }))
                }
              />
            </div>

            <Input
              label="Application Deadline"
              type="date"
              value={editingJob.applicationDeadline}
              onChange={(e) =>
                setEditingJob((prev) => ({
                  ...prev,
                  applicationDeadline: e.target.value,
                }))
              }
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-300">
                Job Description
              </label>
              <textarea
                rows={4}
                value={editingJob.description}
                onChange={(e) =>
                  setEditingJob((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-[#161C28] p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <Input
              label="Skills (comma separated)"
              value={editingJob.skillsText}
              onChange={(e) =>
                setEditingJob((prev) => ({
                  ...prev,
                  skillsText: e.target.value,
                }))
              }
              hint="e.g. React.js, TypeScript, GraphQL, Node.js"
            />
          </form>
        )}
      </Modal>

      {/* ─── Delete Confirmation Modal ─── */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Job Posting"
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="outline"
              size="md"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleConfirmDelete}
              loading={deleting}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Confirm Delete
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-center sm:text-left">
          <div className="flex items-center gap-3 text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs text-amber-300 leading-relaxed font-medium">
              This action is permanent and cannot be undone.
            </p>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-white">
              "{deletingJob?.title}"
            </span>
            ? Candidates will no longer be able to discover or submit applications for this role.
          </p>
        </div>
      </Modal>
    </div>
  );
}
