import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  BookmarkCheck,
  Search,
  Trash2,
  ExternalLink,
  MapPin,
  Briefcase,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';

import { profileService } from '@/api/profileService';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatSalary, timeAgo, getJobTypeLabel } from '@/utils/helpers';

export default function SavedJobs() {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    async function fetchSavedJobs() {
      try {
        setLoading(true);
        const data = await profileService.getSavedJobs();
        setSavedJobs(data || []);
      } catch (err) {
        console.error('Failed to load saved jobs:', err);
        toast.error('Error', 'Unable to retrieve your bookmarked jobs.');
      } finally {
        setLoading(false);
      }
    }
    fetchSavedJobs();
  }, [toast]);

  const handleUnsave = async (jobId, title) => {
    try {
      await profileService.unsaveJob(jobId);
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.info('Removed', `"${title}" has been removed from your saved list.`);
    } catch (err) {
      toast.error('Error', 'Failed to remove job from saved list.');
    }
  };

  const filteredJobs = useMemo(() => {
    let result = [...savedJobs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title?.toLowerCase().includes(q) ||
          job.companyName?.toLowerCase().includes(q) ||
          job.location?.toLowerCase().includes(q) ||
          job.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'salary_high') {
      result.sort((a, b) => (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: postedAt or original order
      result.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0));
    }

    return result;
  }, [savedJobs, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading your saved jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 py-8 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        {/* ─── Page Header ──────────────────────────────────────────────── */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-cyan-400">
                <BookmarkCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white">Saved Jobs</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              You have <span className="font-semibold text-cyan-400">{savedJobs.length}</span>{' '}
              bookmarked job{savedJobs.length === 1 ? '' : 's'} to review or apply for later
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/jobs">
              <Button variant="primary" icon={<Briefcase className="w-4 h-4" />}>
                Browse More Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* ─── Search and Sort Bar ───────────────────────────────────────── */}
        {savedJobs.length > 0 && (
          <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search within saved jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm rounded-xl border border-white/10 bg-[#161C28] px-3.5 py-2 pl-9 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs sm:text-sm rounded-xl border border-white/10 bg-[#161C28] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
              >
                <option value="recent" className="bg-[#161C28] text-white">Recently Posted</option>
                <option value="salary_high" className="bg-[#161C28] text-white">Highest Salary</option>
                <option value="title" className="bg-[#161C28] text-white">Job Title (A-Z)</option>
              </select>
            </div>
          </div>
        )}

        {/* ─── Saved Jobs List / Empty State ────────────────────────────── */}
        {savedJobs.length === 0 ? (
          <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-8">
            <EmptyState
              icon={<Bookmark className="w-10 h-10 text-cyan-400" />}
              title="No saved jobs yet"
              description="Keep track of roles you're interested in by clicking the bookmark icon on any job card."
              action={{
                label: 'Explore Available Jobs',
                onClick: () => navigate('/jobs'),
              }}
            />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-8 text-center">
            <p className="text-slate-400 text-sm">No saved jobs match your search "{searchQuery}".</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-5 sm:p-6 hover:border-cyan-500/40 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  <img
                    src={
                      job.companyLogo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        job.companyName
                      )}&background=4f46e5&color=fff&size=64`
                    }
                    alt={job.companyName}
                    className="w-14 h-14 rounded-2xl object-contain border border-white/10 bg-[#161C28] p-1.5 flex-shrink-0 shadow-sm"
                  />

                  {/* Job Details */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-base sm:text-lg font-bold text-white hover:text-cyan-400 transition-colors"
                      >
                        {job.title}
                      </Link>
                      {job.workMode && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#161C28] text-cyan-300 border border-cyan-500/30 capitalize">
                          {job.workMode}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-medium text-slate-300">{job.companyName}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                        {getJobTypeLabel(job.jobType)}
                      </span>
                      <span className="font-semibold text-emerald-400">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {timeAgo(job.postedAt)}
                      </span>
                    </div>

                    {/* Skill Tags */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {job.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-0.5 rounded-md bg-[#161C28] border border-white/10 text-xs text-slate-300 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side CTAs */}
                <div className="flex items-center sm:self-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-white/10 flex-shrink-0 justify-end">
                  <button
                    type="button"
                    onClick={() => handleUnsave(job.id, job.title)}
                    className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-950/30 transition-colors"
                    title="Remove from saved jobs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link to={`/jobs/${job.id}`}>
                    <Button variant="primary" size="md">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
