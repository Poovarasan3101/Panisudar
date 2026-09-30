/**
 * Format salary range for display
 */
export function formatSalary(min, max, currency = '₹') {
  const fmt = (n) => {
    if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };
  if (!min && !max) return 'Salary not disclosed';
  if (!max) return `${currency}${fmt(min)}+`;
  if (!min) return `Up to ${currency}${fmt(max)}`;
  return `${currency}${fmt(min)} – ${currency}${fmt(max)}`;
}

/**
 * Format date relative to now
 */
export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}

/**
 * Format full date
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Get initials from name
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Truncate text
 */
export function truncate(text = '', maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Calculate profile completion percentage
 */
export function calcProfileCompletion(profile) {
  const fields = [
    profile.fullName,
    profile.title,
    profile.about,
    profile.phone,
    profile.location,
    profile.skills?.length > 0,
    profile.education?.length > 0,
    profile.experience?.length > 0,
    profile.resume,
    profile.photo,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

/**
 * Debounce function
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Generate avatar color from string
 */
export function getAvatarColor(str = '') {
  const colors = [
    'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-green-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-rose-500', 'bg-amber-500',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Get status badge classes
 */
export function getStatusClasses(status) {
  const map = {
    applied: 'bg-blue-50 text-blue-700 border-blue-200',
    under_review: 'bg-amber-50 text-amber-700 border-amber-200',
    shortlisted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    interview: 'bg-purple-50 text-purple-700 border-purple-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    selected: 'bg-green-50 text-green-700 border-green-200',
  };
  return map[status] || 'bg-gray-50 text-gray-700 border-gray-200';
}

export function getStatusLabel(status) {
  const map = {
    applied: 'Applied',
    under_review: 'Under Review',
    shortlisted: 'Shortlisted',
    interview: 'Interview',
    rejected: 'Rejected',
    selected: 'Selected',
  };
  return map[status] || status;
}

export function getJobTypeLabel(type) {
  const map = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    internship: 'Internship',
    contract: 'Contract',
    remote: 'Remote',
  };
  return map[type] || type;
}

export function getExperienceLabel(level) {
  const map = {
    fresher: 'Fresher',
    '1_2': '1–2 Years',
    '2_5': '2–5 Years',
    '5_plus': '5+ Years',
  };
  return map[level] || level;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Resolve media URL with fallback handling
 */
export function getMediaUrl(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  return url.startsWith('/') ? url : `/${url}`;
}
