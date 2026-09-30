import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Briefcase,
  X,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { jobService } from '@/api/jobService';
import { profileService } from '@/api/profileService';
import JobCard from '@/components/jobs/JobCard';
import FilterSidebar from '@/components/jobs/FilterSidebar';
import FilterDrawer from '@/components/jobs/FilterDrawer';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/LoadingSpinner';
import { SORT_OPTIONS, JOB_CATEGORIES, JOB_TYPES, EXPERIENCE_LEVELS, WORK_MODES } from '@/utils/constants';
import { useToast } from '@/contexts/ToastContext';

const DEFAULT_FILTERS = {
  search: '',
  location: '',
  jobType: [],
  workMode: [],
  experienceLevel: '',
  category: '',
  datePosted: 'any',
  salaryMin: 0,
};

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  // Mobile drawer open state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Search inputs inside top bar
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [locationInput, setLocationInput] = useState(searchParams.get('location') || '');

  // Filter state
  const [filters, setFilters] = useState(() => {
    const jobTypeParam = searchParams.get('jobType');
    const workModeParam = searchParams.get('workMode');

    return {
      search: searchParams.get('search') || '',
      location: searchParams.get('location') || '',
      jobType: jobTypeParam ? jobTypeParam.split(',').filter(Boolean) : [],
      workMode: workModeParam ? workModeParam.split(',').filter(Boolean) : [],
      experienceLevel: searchParams.get('experienceLevel') || '',
      category: searchParams.get('category') || '',
      datePosted: searchParams.get('datePosted') || 'any',
      salaryMin: Number(searchParams.get('salaryMin')) || 0,
    };
  });

  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'recent');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  // Results state
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  // Synchronize URL search params whenever filters, sort, or page change
  const syncParamsToUrl = useCallback(
    (newFilters, newSort, newPage) => {
      const params = new URLSearchParams();
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.location) params.set('location', newFilters.location);
      if (newFilters.category) params.set('category', newFilters.category);
      if (newFilters.experienceLevel) params.set('experienceLevel', newFilters.experienceLevel);
      if (newFilters.datePosted && newFilters.datePosted !== 'any') {
        params.set('datePosted', newFilters.datePosted);
      }
      if (newFilters.salaryMin > 0) params.set('salaryMin', String(newFilters.salaryMin));
      if (Array.isArray(newFilters.jobType) && newFilters.jobType.length > 0) {
        params.set('jobType', newFilters.jobType.join(','));
      }
      if (Array.isArray(newFilters.workMode) && newFilters.workMode.length > 0) {
        params.set('workMode', newFilters.workMode.join(','));
      }
      if (newSort && newSort !== 'recent') params.set('sort', newSort);
      if (newPage > 1) params.set('page', String(newPage));

      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  // Initial load of saved jobs
  useEffect(() => {
    let mounted = true;
    profileService
      .getSavedJobs()
      .then((saved) => {
        if (mounted && Array.isArray(saved)) {
          setSavedJobIds(new Set(saved.map((item) => (typeof item === 'string' ? item : item.id))));
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch jobs when filters, sort, or page change
  useEffect(() => {
    let mounted = true;

    async function fetchJobs() {
      try {
        setLoading(true);
        const queryParams = {
          search: filters.search || undefined,
          location: filters.location || undefined,
          category: filters.category || undefined,
          experienceLevel: filters.experienceLevel || undefined,
          datePosted: filters.datePosted !== 'any' ? filters.datePosted : undefined,
          salaryMin: filters.salaryMin > 0 ? filters.salaryMin * 100000 : undefined, // Convert LPA to INR
          jobType: filters.jobType.length > 0 ? filters.jobType : undefined,
          workMode: filters.workMode.length > 0 ? filters.workMode : undefined,
          sort: sortOption,
          page: currentPage,
          pageSize: 9,
        };

        const response = await jobService.getJobs(queryParams);

        if (mounted) {
          setJobs(response.results || []);
          setTotalCount(response.count || 0);
          setTotalPages(response.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        if (mounted) {
          toast.error('Failed to load jobs', 'Please check your connection and try again.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchJobs();
    syncParamsToUrl(filters, sortOption, currentPage);

    // Scroll to top of list smoothly on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      mounted = false;
    };
  }, [filters, sortOption, currentPage, syncParamsToUrl, toast]);

  // Handle top search bar submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...filters,
      search: searchInput.trim(),
      location: locationInput.trim(),
    };
    setFilters(updated);
    setCurrentPage(1);
  };

  // Filter updates from FilterSidebar
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setSearchInput('');
    setLocationInput('');
    setCurrentPage(1);
    setSortOption('recent');
  };

  // Save / Bookmark handler
  const handleSaveJob = async (jobId) => {
    try {
      const isAlreadySaved = savedJobIds.has(jobId);
      if (isAlreadySaved) {
        await profileService.unsaveJob(jobId);
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        toast.info('Job unsaved', 'Removed from your bookmarks');
      } else {
        await profileService.saveJob(jobId);
        setSavedJobIds((prev) => new Set(prev).add(jobId));
        toast.success('Job saved', 'Added to your bookmarked jobs');
      }
    } catch (err) {
      toast.error('Bookmark error', err.message || 'Unable to update bookmark');
    }
  };

  // Calculate count of active filters (excluding default values)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.location) count++;
    if (filters.category) count++;
    if (filters.experienceLevel) count++;
    if (filters.datePosted && filters.datePosted !== 'any') count++;
    if (filters.salaryMin > 0) count++;
    if (Array.isArray(filters.jobType)) count += filters.jobType.length;
    if (Array.isArray(filters.workMode)) count += filters.workMode.length;
    return count;
  }, [filters]);

  // Labels for active filter chips
  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.search) {
      chips.push({
        id: 'search',
        label: `"${filters.search}"`,
        onRemove: () => {
          setFilters((prev) => ({ ...prev, search: '' }));
          setSearchInput('');
        },
      });
    }
    if (filters.location) {
      chips.push({
        id: 'location',
        label: filters.location,
        onRemove: () => {
          setFilters((prev) => ({ ...prev, location: '' }));
          setLocationInput('');
        },
      });
    }
    if (filters.category) {
      const catObj = JOB_CATEGORIES.find((c) => c.value === filters.category);
      chips.push({
        id: 'category',
        label: catObj ? catObj.label : filters.category,
        onRemove: () => setFilters((prev) => ({ ...prev, category: '' })),
      });
    }
    if (filters.experienceLevel) {
      const expObj = EXPERIENCE_LEVELS.find((e) => e.value === filters.experienceLevel);
      chips.push({
        id: 'exp',
        label: expObj ? expObj.label : filters.experienceLevel,
        onRemove: () => setFilters((prev) => ({ ...prev, experienceLevel: '' })),
      });
    }
    if (filters.salaryMin > 0) {
      chips.push({
        id: 'salary',
        label: `Min ₹${filters.salaryMin} LPA`,
        onRemove: () => setFilters((prev) => ({ ...prev, salaryMin: 0 })),
      });
    }
    if (Array.isArray(filters.jobType)) {
      filters.jobType.forEach((typeVal) => {
        const item = JOB_TYPES.find((t) => t.value === typeVal);
        chips.push({
          id: `jobType-${typeVal}`,
          label: item ? item.label : typeVal,
          onRemove: () =>
            setFilters((prev) => ({
              ...prev,
              jobType: prev.jobType.filter((t) => t !== typeVal),
            })),
        });
      });
    }
    if (Array.isArray(filters.workMode)) {
      filters.workMode.forEach((modeVal) => {
        const item = WORK_MODES.find((m) => m.value === modeVal);
        chips.push({
          id: `workMode-${modeVal}`,
          label: item ? item.label : modeVal,
          onRemove: () =>
            setFilters((prev) => ({
              ...prev,
              workMode: prev.workMode.filter((m) => m !== modeVal),
            })),
        });
      });
    }
    return chips;
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─── Top Header & Search Bar ─────────────────────────────── */}
      <div className="border-b border-white/10 bg-[#10131A]/70 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Explore Available Positions
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Find verified tech, design, marketing, and leadership jobs from top companies
            </p>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="bg-[#121620] border border-white/10 p-2.5 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2.5 text-slate-100 focus-within:border-cyan-500/50 transition-colors"
          >
            {/* Search Input */}
            <div className="flex-1 flex items-center px-3 border-b md:border-b-0 md:border-r border-white/10 py-1.5 md:py-0">
              <Search className="w-5 h-5 text-cyan-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Location Input */}
            <div className="flex-1 flex items-center px-3 py-1.5 md:py-0">
              <MapPin className="w-5 h-5 text-cyan-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="City, state, or 'Remote'..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/25 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* ─── Main Content Body ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ── Desktop Filter Sidebar ── */}
          <div className="hidden lg:block w-80 shrink-0 sticky top-6">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>

          {/* ── Right Content Area ── */}
          <div className="flex-1 w-full min-w-0">
            {/* Top Controls Bar */}
            <div className="bg-[#121620] p-4 rounded-2xl border border-white/10 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Results count & Mobile filter toggle */}
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#161C28] text-cyan-400 border border-white/10 font-semibold text-xs sm:text-sm hover:bg-[#1C2434] transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-black text-[11px] font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <p className="text-sm font-semibold text-slate-300">
                  {loading ? (
                    'Searching jobs...'
                  ) : (
                    <>
                      <span className="text-cyan-400 font-bold">{totalCount}</span> position
                      {totalCount !== 1 ? 's' : ''} available
                    </>
                  )}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
                </span>
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-xl border border-white/10 bg-[#161C28] py-1.5 px-3 text-xs sm:text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#161C28] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-[#121620] rounded-xl border border-white/10">
                <span className="text-xs font-semibold text-slate-400">Active filters:</span>
                {activeFilterChips.map((chip) => (
                  <span
                    key={chip.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161C28] text-cyan-300 text-xs font-medium border border-cyan-500/30"
                  >
                    <span>{chip.label}</span>
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      className="p-0.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition"
                      aria-label={`Remove filter ${chip.label}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 ml-auto inline-flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-white/5 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset all
                </button>
              </div>
            )}

            {/* Job Listings / Skeletons / Empty State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-8 shadow-sm">
                <EmptyState
                  icon={<Briefcase />}
                  title="No matching jobs found"
                  description="We couldn't find any job postings matching your current criteria. Try expanding your search terms or clearing specific filters."
                  action={{
                    label: 'Clear All Filters',
                    onClick: handleClearFilters,
                  }}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSave={handleSaveJob}
                      isSaved={savedJobIds.has(job.id)}
                    />
                  ))}
                </div>

                {/* Pagination component */}
                {totalPages > 1 && (
                  <div className="bg-[#121620] p-4 rounded-2xl border border-white/10 shadow-sm mt-8">
                    <Pagination
                      page={currentPage}
                      totalPages={totalPages}
                      onPageChange={(p) => setCurrentPage(p)}
                      total={totalCount}
                      pageSize={9}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />
    </div>
  );
}
