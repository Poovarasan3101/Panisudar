import React from 'react';

const statusConfig = {
  applied: {
    label: 'Applied',
    classes: 'bg-blue-100 text-blue-700 ring-blue-200',
    dot: 'bg-blue-500',
  },
  under_review: {
    label: 'Under Review',
    classes: 'bg-amber-100 text-amber-700 ring-amber-200',
    dot: 'bg-amber-500',
  },
  shortlisted: {
    label: 'Shortlisted',
    classes: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
    dot: 'bg-indigo-500',
  },
  interview: {
    label: 'Interview',
    classes: 'bg-purple-100 text-purple-700 ring-purple-200',
    dot: 'bg-purple-500',
  },
  rejected: {
    label: 'Rejected',
    classes: 'bg-red-100 text-red-700 ring-red-200',
    dot: 'bg-red-500',
  },
  selected: {
    label: 'Selected',
    classes: 'bg-green-100 text-green-700 ring-green-200',
    dot: 'bg-green-500',
  },
};

const fallback = {
  label: 'Unknown',
  classes: 'bg-gray-100 text-gray-600 ring-gray-200',
  dot: 'bg-gray-400',
};

export default function ApplicationStatusBadge({ status }) {
  const config = statusConfig[status] ?? fallback;

  return (
    <span
      aria-label={`Status: ${config.label}`}
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5',
        'text-xs font-semibold ring-1 ring-inset',
        config.classes,
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={['h-1.5 w-1.5 rounded-full shrink-0', config.dot].join(' ')}
      />
      {config.label}
    </span>
  );
}
