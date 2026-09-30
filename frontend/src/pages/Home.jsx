import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  ArrowRight,
  Briefcase,
  Building2,
  Users,
  ShieldCheck,
  Zap,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Code2,
  Globe,
  Palette,
  Cpu,
  Megaphone,
  DollarSign,
  Headphones,
} from 'lucide-react';
import { jobService } from '@/api/jobService';
import { profileService } from '@/api/profileService';
import companyService from '@/api/companyService';
import JobCard from '@/components/jobs/JobCard';
import { SkeletonCard } from '@/components/common/LoadingSpinner';
import LogoLoop from '@/components/common/LogoLoop';
import CountUp from '@/components/common/CountUp';
import BorderGlow from '@/components/common/BorderGlow';
import ElectricBorder from '@/components/common/ElectricBorder';
import { JOB_CATEGORIES } from '@/utils/constants';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { getMediaUrl } from '@/utils/helpers';

// Map icon string to Lucide component and custom theme colors
const categoryMeta = {
  software_dev: { icon: Code2, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  web_dev: { icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  ui_ux: { icon: Palette, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  data_science: { icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  marketing: { icon: Megaphone, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  finance: { icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  hr: { icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  security_devops: { icon: ShieldCheck, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  customer_support: { icon: Headphones, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
};

const categoryJobCounts = {
  software_dev: '142+ jobs',
  web_dev: '98+ jobs',
  ui_ux: '64+ jobs',
  data_science: '85+ jobs',
  marketing: '53+ jobs',
  finance: '47+ jobs',
  hr: '39+ jobs',
  security_devops: '58+ jobs',
  customer_support: '31+ jobs',
};

const popularSearches = [
  'Remote',
  'React.js',
  'Node.js',
  'Frontend',
  'Backend',
  'Product Manager',
  'Data Scientist',
  'UI/UX Designer',
];

export default function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, isEmployer } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const [jobs, savedIds, companies] = await Promise.all([
          jobService.getFeaturedJobs(),
          profileService.getSavedJobs().catch(() => []),
          companyService.getCompanies().catch(() => []),
        ]);

        if (isMounted) {
          setFeaturedJobs(jobs || []);
          setFeaturedCompanies(companies || []);
          const idSet = new Set(
            Array.isArray(savedIds)
              ? savedIds.map((item) => (typeof item === 'string' ? item : item.id))
              : []
          );
          setSavedJobIds(idSet);
        }
      } catch (err) {
        console.error('Home page load failed:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (locationQuery.trim()) params.set('location', locationQuery.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleSaveJob = async (jobId) => {
    try {
      if (savedJobIds.has(jobId)) {
        await profileService.unsaveJob(jobId);
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        toast.info('Job unsaved', 'Removed from your bookmarked jobs');
      } else {
        await profileService.saveJob(jobId);
        setSavedJobIds((prev) => new Set(prev).add(jobId));
        toast.success('Job saved', 'Added to your bookmarked jobs');
      }
    } catch (err) {
      toast.error('Action failed', err.message || 'Unable to update bookmark');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        {/* Ambient Blurred Light Blobs */}
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md shadow-inner shadow-cyan-500/10">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            Over 10,000+ verified career opportunities on Panisudar
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
            Find the right job or <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              build world-class teams.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-normal">
            Welcome to <span className="text-white font-semibold">Panisudar</span> — the premier career platform matching ambitious professionals with high-growth tech companies and industry leaders.
          </p>

          {/* Quick Dual Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            <ElectricBorder
              color="#38bdf8"
              speed={3}
              chaos={0.02}
              thickness={2}
              borderRadius={12}
              style={{ borderRadius: 12 }}
            >
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Explore All Jobs</span>
              </Link>
            </ElectricBorder>

            <ElectricBorder
              color="#818cf8"
              speed={3}
              chaos={0.02}
              thickness={2}
              borderRadius={12}
              style={{ borderRadius: 12 }}
            >
              <Link
                to="/employer/post-job"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-sm backdrop-blur-md hover:-translate-y-0.5 transition-all"
              >
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Post a Job as Employer</span>
              </Link>
            </ElectricBorder>
          </div>

          {/* Glass Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-[#121620]/90 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-white/10 flex flex-col md:flex-row gap-2.5 max-w-4xl mx-auto text-slate-100 transition-all hover:border-cyan-500/40"
          >
            {/* Title / Keywords */}
            <div className="relative flex-1 flex items-center px-3 border-b md:border-b-0 md:border-r border-white/10 py-2.5 md:py-0">
              <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills, or company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Job title or keywords"
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Location */}
            <div className="relative flex-1 flex items-center px-3 py-2.5 md:py-0">
              <MapPin className="w-5 h-5 text-indigo-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="City, state, or 'Remote'"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                aria-label="Location"
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <ElectricBorder
              color="#38bdf8"
              speed={3}
              chaos={0.02}
              thickness={2}
              borderRadius={12}
              style={{ borderRadius: 12 }}
            >
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold rounded-xl text-sm sm:text-base shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Search Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </ElectricBorder>
          </form>

          {/* Popular Searches */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-400">
            <span className="font-medium text-slate-300">Trending Searches:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(term)}`)}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-cyan-300 transition-colors duration-150"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Trust Highlights Banner */}
        <div className="max-w-5xl mx-auto mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <BorderGlow
            edgeSensitivity={0}
            glowColor="40 80 80"
            backgroundColor="#120F17"
            borderRadius={24}
            glowRadius={60}
            glowIntensity={2.4}
            coneSpread={39}
            animated={false}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
          >
            <div className="p-4 rounded-[20px] backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-cyan-400">
                <CountUp from={0} to={10000} separator="," duration={2.5} />+
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">Active Job Listings</p>
            </div>
          </BorderGlow>
          <BorderGlow
            edgeSensitivity={0}
            glowColor="40 80 80"
            backgroundColor="#120F17"
            borderRadius={24}
            glowRadius={60}
            glowIntensity={2.4}
            coneSpread={39}
            animated={false}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
          >
            <div className="p-4 rounded-[20px] backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-indigo-400">
                <CountUp from={0} to={800} duration={2} />+
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">Verified Employers</p>
            </div>
          </BorderGlow>
          <BorderGlow
            edgeSensitivity={0}
            glowColor="40 80 80"
            backgroundColor="#120F17"
            borderRadius={24}
            glowRadius={60}
            glowIntensity={2.4}
            coneSpread={39}
            animated={false}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
          >
            <div className="p-4 rounded-[20px] backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-pink-400">
                <CountUp from={0} to={50000} separator="," duration={2.5} />+
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">Successful Matches</p>
            </div>
          </BorderGlow>
          <BorderGlow
            edgeSensitivity={0}
            glowColor="40 80 80"
            backgroundColor="#120F17"
            borderRadius={24}
            glowRadius={60}
            glowIntensity={2.4}
            coneSpread={39}
            animated={false}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
          >
            <div className="p-4 rounded-[20px] backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                <CountUp from={0} to={100} duration={1.5} />% Free
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">For All Job Seekers</p>
            </div>
          </BorderGlow>
        </div>
      </section>

      {/* ─── Top Hiring Companies with Brand Logos (LogoLoop) ─────── */}
      <section className="bg-[#10131A] border-b border-white/5 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                Top Employers
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Featured Companies Actively Hiring
              </h2>
            </div>
            <Link
              to="/companies"
              className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View all companies <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Continuous Animated Logo Loop (Strictly Constrained) */}
          <div className="py-2 relative w-full overflow-hidden">
            {featuredCompanies.length > 0 ? (
              <LogoLoop
                logos={featuredCompanies.map((comp) => ({
                  node: (
                    <Link
                      to={`/jobs?search=${encodeURIComponent(comp.name)}`}
                      className="group flex items-center gap-3.5 px-5 py-3 rounded-2xl border border-white/10 hover:border-cyan-400/50 bg-[#161C28] hover:bg-[#1C2333] shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl border border-white/10 p-1 flex items-center justify-center bg-white/5 group-hover:scale-105 transition-transform shrink-0">
                        <img
                          src={getMediaUrl(comp.logo)}
                          alt={comp.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comp.name)}&background=e0e7ff&color=4338ca&size=64`;
                          }}
                        />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                          {comp.name}
                        </span>
                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                          {comp.activeJobs || 10}+ open roles
                        </span>
                      </div>
                    </Link>
                  ),
                  title: comp.name,
                }))}
                speed={70}
                direction="left"
                gap={24}
                logoHeight={56}
                hoverSpeed={0}
                fadeOut
                fadeOutColor="#10131A"
                ariaLabel="Featured hiring company logos"
              />
            ) : (
              <div className="h-16 flex items-center justify-center text-sm text-slate-400">
                Loading featured companies...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Explore by Category ─────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Browse by Sector
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Popular Career Categories
            </h2>
            <p className="text-slate-400 mt-1 text-base">
              Find positions tailored to your industry skills and specialization
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {JOB_CATEGORIES.map((category) => {
            const meta = categoryMeta[category.value] || {
              icon: Briefcase,
              color: 'text-indigo-400',
              bg: 'bg-indigo-500/10 border-indigo-500/20',
            };
            const Icon = meta.icon;
            const count = categoryJobCounts[category.value] || '50+ jobs';

            return (
              <BorderGlow
                key={category.value}
                edgeSensitivity={0}
                glowColor="40 80 80"
                backgroundColor="#120F17"
                borderRadius={34}
                glowRadius={60}
                glowIntensity={2.4}
                coneSpread={39}
                animated={false}
                colors={['#c084fc', '#f472b6', '#38bdf8']}
                className="h-full"
              >
                <Link
                  to={`/jobs?category=${category.value}`}
                  className="group relative p-6 rounded-[30px] h-full transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${meta.bg} ${meta.color} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors duration-200">
                      {category.label}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{count}</p>
                  </div>

                  <div className="mt-6 flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1.5 transition-transform duration-200">
                    <span>Explore opportunities</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              </BorderGlow>
            );
          })}
        </div>
      </section>

      {/* ─── Featured Jobs Section ───────────────────────────────── */}
      <section className="py-20 bg-[#10131A]/70 border-y border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                <Zap className="w-3.5 h-3.5" />
                Handpicked Openings
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Featured Jobs of the Week
              </h2>
              <p className="text-slate-400 mt-1 text-base">
                Discover top verified roles with competitive salaries and great culture
              </p>
            </div>

            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:bg-white/10 font-semibold text-sm transition-all"
            >
              <span>Explore All Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="bg-[#121620] rounded-2xl p-12 text-center border border-white/10 max-w-lg mx-auto">
              <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No featured jobs right now</h3>
              <p className="text-sm text-slate-400 mt-1 mb-6">
                Check back soon or explore our full jobs catalog.
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition"
              >
                View All Jobs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSave={handleSaveJob}
                  isSaved={savedJobIds.has(job.id)}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold rounded-xl text-sm sm:text-base shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <span>View All 10,000+ Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why Choose Panisudar ─────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            The Panisudar Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Why Professionals & Companies Choose Panisudar
          </h2>
          <p className="text-slate-400 mt-2 text-base sm:text-lg">
            Engineered to make hiring frictionless, transparent, and high-impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            className="h-full"
          >
            <div className="p-8 rounded-[30px] h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">100% Verified Employers</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every job posting and hiring organization undergoes thorough verification to ensure legitimacy and trust.
                </p>
              </div>
            </div>
          </BorderGlow>

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
            className="h-full"
          >
            <div className="p-8 rounded-[30px] h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Instant Smart Apply</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Upload your resume once and apply directly to matching roles with personalized cover notes in seconds.
                </p>
              </div>
            </div>
          </BorderGlow>

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
            className="h-full"
          >
            <div className="p-8 rounded-[30px] h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Transparent Salaries</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Clear compensation packages, equity, and remote allowances posted upfront so you know exactly what to expect.
                </p>
              </div>
            </div>
          </BorderGlow>

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
            className="h-full"
          >
            <div className="p-8 rounded-[30px] h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Direct Recruiter Access</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Real-time notifications and transparency at every stage of the review and interview pipeline.
                </p>
              </div>
            </div>
          </BorderGlow>
        </div>
      </section>

      {/* ─── Two-sided Call to Action ─────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Seeker Card */}
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
            className="h-full"
          >
            <div className="relative overflow-hidden rounded-[30px] p-8 sm:p-10 text-white flex flex-col justify-between h-full group">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-indigo-500/10 pointer-events-none blur-3xl group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300 mb-4 backdrop-blur-sm">
                  For Job Seekers
                </div>
                <h3 className="text-2xl sm:text-3xl text-white font-extrabold mb-3">
                  Ready for your next career breakthrough?
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  Explore thousands of opportunities from high-growth tech firms on Panisudar. Create your profile in under 2 minutes.
                </p>

                <ul className="space-y-2.5 mb-8 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Free verified profile and resume hosting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Direct application tracking dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Personalized job recommendations and alerts</span>
                  </li>
                </ul>
              </div>

              <div className="relative z-10">
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-sm shadow-md hover:bg-slate-100 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Find Jobs Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </BorderGlow>

          {/* Recruiter Card */}
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
            className="h-full"
          >
            <div className="relative overflow-hidden rounded-[30px] p-8 sm:p-10 text-white flex flex-col justify-between h-full group">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-cyan-500/10 pointer-events-none blur-3xl group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs font-semibold text-cyan-300 mb-4 backdrop-blur-sm">
                  For Employers & Recruiters
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  Looking to hire top-tier talent on Panisudar?
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  Reach over 50,000+ active pre-screened job seekers. Post openings, screen applications, and manage hiring workflows effortlessly.
                </p>

                <ul className="space-y-2.5 mb-8 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Post jobs in under 3 minutes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Comprehensive applicant tracking dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Branded company profile showcase</span>
                  </li>
                </ul>
              </div>

              <div className="relative z-10">
                <Link
                  to={isAuthenticated && isEmployer ? '/employer/post-job' : '/signup?role=employer'}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-md transition-all duration-200"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Post a Job Listing</span>
                </Link>
              </div>
            </div>
          </BorderGlow>
        </div>
      </section>
    </div>
  );
}
