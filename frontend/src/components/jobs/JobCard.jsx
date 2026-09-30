import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  formatSalary,
  timeAgo,
  getJobTypeLabel,
  getExperienceLabel,
  getInitials,
  getAvatarColor,
  getMediaUrl,
} from '@/utils/helpers';

import BorderGlow from '@/components/common/BorderGlow';
import ElectricBorder from '@/components/common/ElectricBorder';

/**
 * JobCard – displays a single job listing in uniform dark glass theme.
 */
const JobCard = ({
  job = {},
  onSave,
  isSaved = false,
  compact = false,
  showApply = true,
}) => {
  const [saving, setSaving] = useState(false);

  const {
    id,
    title = 'Untitled Position',
    companyName = 'Unknown Company',
    companyLogo,
    location = 'Location not specified',
    workMode,
    jobType,
    experienceLevel,
    salaryMin,
    salaryMax,
    skills = [],
    postedAt,
    applicationsCount,
  } = job;

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving || !onSave) return;
    setSaving(true);
    try {
      await onSave(id);
    } finally {
      setSaving(false);
    }
  };

  // Work mode badge color map
  const workModeBadge = {
    remote: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
    hybrid: 'bg-purple-500/10 text-purple-300 border border-purple-500/20',
    onsite: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  };
  const workModeLabel = {
    remote: 'Remote',
    hybrid: 'Hybrid',
    onsite: 'On-site',
  };

  const visibleSkills = skills.slice(0, 4);
  const extraSkills = skills.length > 4 ? skills.length - 4 : 0;

  const avatarBg = getAvatarColor(companyName);
  const initials = getInitials(companyName);

  /* ─── Compact variant ─────────────────────────────────────── */
  if (compact) {
    return (
      <Link
        to={`/jobs/${id}`}
        className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-[#121620]/90 p-4 shadow-md transition-all hover:border-cyan-400/40 hover:bg-[#161C28] hover:-translate-y-0.5"
      >
        {/* Logo */}
        <div className="mt-0.5 flex-shrink-0">
          {companyLogo ? (
            <img
              src={getMediaUrl(companyLogo)}
              alt={companyName}
              className="h-10 w-10 rounded-xl object-contain border border-white/10 p-1 bg-white/5"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=e0e7ff&color=4338ca&size=64`;
              }}
            />
          ) : (
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white ${avatarBg}`}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
            {title}
          </p>
          <p className="truncate text-xs text-slate-400 mt-0.5">{companyName}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {workMode && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${workModeBadge[workMode] ?? 'bg-white/5 text-slate-300'}`}
              >
                {workModeLabel[workMode] ?? workMode}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                <MapPin className="h-3 w-3 text-cyan-400" />
                {location}
              </span>
            )}
          </div>
        </div>

        <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-500 group-hover:text-cyan-400 mt-1 transition-colors" />
      </Link>
    );
  }

  /* ─── Full variant ────────────────────────────────────────── */
  return (
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
      <div className="group relative flex flex-col h-full rounded-[30px] transition-all duration-300">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3 p-5 pb-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Company logo / initials */}
            {companyLogo ? (
              <img
                src={getMediaUrl(companyLogo)}
                alt={companyName}
                className="h-12 w-12 flex-shrink-0 rounded-xl border border-white/10 object-contain p-1 bg-white/5"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=e0e7ff&color=4338ca&size=64`;
                }}
              />
            ) : (
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${avatarBg}`}
              >
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-200">
                {companyName}
              </p>
              {postedAt && (
                <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <Clock className="h-3 w-3 text-slate-500" />
                  {timeAgo(postedAt)}
                </p>
              )}
            </div>
          </div>

          {/* Bookmark */}
          <button
            onClick={handleSave}
            disabled={saving}
            aria-label={isSaved ? 'Unsave job' : 'Save job'}
            className={`flex-shrink-0 rounded-xl p-2 transition-colors ${
              isSaved
                ? 'text-cyan-400 bg-cyan-500/10'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            } disabled:opacity-50`}
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-5 pb-4 flex-1">
          {/* Job title */}
          <h3 className="mb-2 text-lg font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
            {title}
          </h3>

          {/* Location + work mode */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {location && (
              <span className="flex items-center gap-1 text-xs sm:text-sm text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                {location}
              </span>
            )}
            {workMode && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${workModeBadge[workMode] ?? 'bg-white/5 text-slate-300'}`}
              >
                {workModeLabel[workMode] ?? workMode}
              </span>
            )}
          </div>

          {/* Type / Experience / Salary badges */}
          <div className="mb-3.5 flex flex-wrap items-center gap-2">
            {jobType && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
                <Briefcase className="h-3 w-3" />
                {getJobTypeLabel(jobType)}
              </span>
            )}
            {experienceLevel && (
              <span className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-300">
                {getExperienceLabel(experienceLevel)}
              </span>
            )}
            {(salaryMin || salaryMax) && (
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                {formatSalary(salaryMin, salaryMax)}
              </span>
            )}
          </div>

          {/* Skills */}
          {visibleSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {visibleSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-300 font-medium"
                >
                  {skill}
                </span>
              ))}
              {extraSkills > 0 && (
                <span className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-400 font-medium">
                  +{extraSkills} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {showApply && (
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 bg-white/[0.02] px-5 py-3 rounded-b-2xl">
            {applicationsCount !== undefined ? (
              <p className="text-xs text-slate-400 font-medium">
                {applicationsCount} applicant{applicationsCount !== 1 ? 's' : ''}
              </p>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-2">
              <Link
                to={`/jobs/${id}`}
                className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:bg-white/10 hover:border-white/20"
              >
                Details
              </Link>
              <ElectricBorder
                color="#38bdf8"
                speed={3}
                chaos={0.02}
                thickness={2}
                borderRadius={10}
                style={{ borderRadius: 10 }}
              >
                <Link
                  to={`/jobs/${id}?apply=true`}
                  className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:scale-[1.02]"
                >
                  <span>Apply Now</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </ElectricBorder>
            </div>
          </div>
        )}
      </div>
    </BorderGlow>
  );
};

export default JobCard;
