import React from 'react';

// ─── Size maps ──────────────────────────────────────────────────────────────

const spinnerSizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

// ─── LoadingSpinner ──────────────────────────────────────────────────────────

export function LoadingSpinner({ size = 'md', className = '' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={[
        'rounded-full border-indigo-200 border-t-indigo-600 animate-spin',
        spinnerSizeClasses[size] ?? spinnerSizeClasses.md,
        className,
      ].join(' ')}
    />
  );
}

// ─── SkeletonCard ────────────────────────────────────────────────────────────

export function SkeletonCard({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={[
        'rounded-xl border border-gray-100 bg-white p-5 shadow-sm',
        'animate-pulse',
        className,
      ].join(' ')}
    >
      {/* Card header row */}
      <div className="flex items-start gap-4">
        {/* Avatar / logo placeholder */}
        <div className="h-12 w-12 rounded-lg bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 w-2/3 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-200" />
        </div>
      </div>

      {/* Content lines */}
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-5/6 rounded bg-gray-200" />
        <div className="h-3 w-4/6 rounded bg-gray-200" />
      </div>

      {/* Footer row */}
      <div className="mt-5 flex items-center gap-3">
        <div className="h-6 w-16 rounded-full bg-gray-200" />
        <div className="h-6 w-20 rounded-full bg-gray-200" />
        <div className="ml-auto h-8 w-24 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

// ─── SkeletonLine ────────────────────────────────────────────────────────────

export function SkeletonLine({ width = 'full', height = 'h-4', className = '' }) {
  const widthClass =
    width === 'full'
      ? 'w-full'
      : width === '3/4'
      ? 'w-3/4'
      : width === '1/2'
      ? 'w-1/2'
      : width === '1/3'
      ? 'w-1/3'
      : width === '2/3'
      ? 'w-2/3'
      : `w-${width}`;

  return (
    <div
      aria-hidden="true"
      className={[
        'rounded bg-gray-200 animate-pulse',
        height,
        widthClass,
        className,
      ].join(' ')}
    />
  );
}

// ─── PageLoader ──────────────────────────────────────────────────────────────

export function PageLoader({ message = 'Loading…' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-4"
    >
      <LoadingSpinner size="lg" />
      {message && (
        <p className="text-sm font-medium text-gray-500">{message}</p>
      )}
    </div>
  );
}

// Default export keeps named exports as well
export default LoadingSpinner;
