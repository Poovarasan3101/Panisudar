import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import {
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES,
  DATE_POSTED_OPTIONS,
  WORK_MODES,
} from '@/utils/constants';

/**
 * Collapsible filter section wrapper in dark theme.
 */
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-sm font-semibold text-slate-200 hover:text-cyan-300 transition-colors"
        aria-expanded={open}
      >
        {title}
        {open ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
};

/**
 * FilterSidebar – desktop left-hand filter panel in dark glass theme.
 */
const FilterSidebar = ({ filters = {}, onChange, onClear }) => {
  const update = (key, value) => {
    if (onChange) onChange({ ...filters, [key]: value });
  };

  const toggleArray = (key, value) => {
    const current = Array.isArray(filters[key]) ? filters[key] : [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    update(key, next);
  };

  const isChecked = (key, value) => {
    const current = Array.isArray(filters[key]) ? filters[key] : [];
    return current.includes(value);
  };

  const hasActiveFilters = Object.values(filters).some((v) =>
    Array.isArray(v) ? v.length > 0 : Boolean(v)
  );

  return (
    <aside className="w-full rounded-2xl border border-white/10 bg-[#121620]/95 backdrop-blur-md p-5 shadow-xl text-white">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-base font-bold text-white tracking-wide">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* 1. Job Type */}
      <FilterSection title="Job Type">
        {(JOB_TYPES || []).map((type) => (
          <label
            key={type.value}
            className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300 hover:text-white"
          >
            <input
              type="checkbox"
              checked={isChecked('jobType', type.value)}
              onChange={() => toggleArray('jobType', type.value)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 accent-cyan-500 cursor-pointer"
            />
            {type.label}
          </label>
        ))}
      </FilterSection>

      {/* 2. Work Mode */}
      <FilterSection title="Work Mode">
        {(WORK_MODES || []).map((mode) => (
          <label
            key={mode.value}
            className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300 hover:text-white"
          >
            <input
              type="checkbox"
              checked={isChecked('workMode', mode.value)}
              onChange={() => toggleArray('workMode', mode.value)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 accent-cyan-500 cursor-pointer"
            />
            {mode.label}
          </label>
        ))}
      </FilterSection>

      {/* 3. Experience Level */}
      <FilterSection title="Experience Level">
        {(EXPERIENCE_LEVELS || []).map((level) => (
          <label
            key={level.value}
            className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300 hover:text-white"
          >
            <input
              type="radio"
              name="experienceLevel"
              value={level.value}
              checked={filters.experienceLevel === level.value}
              onChange={() => update('experienceLevel', level.value)}
              className="h-4 w-4 border-white/20 bg-white/5 text-cyan-500 accent-cyan-500 cursor-pointer"
            />
            {level.label}
          </label>
        ))}
        {filters.experienceLevel && (
          <button
            type="button"
            onClick={() => update('experienceLevel', '')}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors mt-1"
          >
            Clear selection
          </button>
        )}
      </FilterSection>

      {/* 4. Category */}
      <FilterSection title="Category">
        <select
          value={filters.category || ''}
          onChange={(e) => update('category', e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#161C28] px-3 py-2 text-sm text-white shadow-sm focus:border-cyan-400 focus:outline-none transition"
        >
          <option value="" className="bg-[#121620] text-slate-300">All Categories</option>
          {(JOB_CATEGORIES || []).map((cat) => (
            <option key={cat.value} value={cat.value} className="bg-[#121620] text-white">
              {cat.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* 5. Location */}
      <FilterSection title="Location">
        <input
          type="text"
          placeholder="e.g. Bangalore, Mumbai"
          value={filters.location || ''}
          onChange={(e) => update('location', e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#161C28] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition"
        />
      </FilterSection>

      {/* 6. Date Posted */}
      <FilterSection title="Date Posted">
        {(DATE_POSTED_OPTIONS || []).map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300 hover:text-white"
          >
            <input
              type="radio"
              name="datePosted"
              value={opt.value}
              checked={filters.datePosted === opt.value}
              onChange={() => update('datePosted', opt.value)}
              className="h-4 w-4 border-white/20 bg-white/5 text-cyan-500 accent-cyan-500 cursor-pointer"
            />
            {opt.label}
          </label>
        ))}
      </FilterSection>

      {/* 7. Salary Range */}
      <FilterSection title="Minimum Salary (LPA)">
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={filters.salaryMin ?? 0}
            onChange={(e) => update('salaryMin', Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>₹0 LPA</span>
            <span className="font-semibold text-cyan-400">
              {filters.salaryMin ? `₹${filters.salaryMin} LPA` : 'Any'}
            </span>
            <span>₹50 LPA+</span>
          </div>
        </div>
      </FilterSection>
    </aside>
  );
};

export default FilterSidebar;
