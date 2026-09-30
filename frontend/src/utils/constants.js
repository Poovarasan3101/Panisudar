export const APP_NAME = 'Panisudar';
export const APP_TAGLINE = 'Find the Right Career. Build Your Future with Panisudar.';

export const USER_ROLES = {
  SEEKER: 'job_seeker',
  EMPLOYER: 'employer',
};

export const JOB_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'internship', label: 'Internship' },
  { value: 'contract', label: 'Contract' },
  { value: 'remote', label: 'Remote' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'fresher', label: 'Fresher' },
  { value: '1_2', label: '1–2 Years' },
  { value: '2_5', label: '2–5 Years' },
  { value: '5_plus', label: '5+ Years' },
];

export const JOB_CATEGORIES = [
  { value: 'software_dev', label: 'Software Development', icon: 'Code' },
  { value: 'web_dev', label: 'Web Development', icon: 'Globe' },
  { value: 'ui_ux', label: 'UI/UX Design', icon: 'Palette' },
  { value: 'data_science', label: 'Data Science', icon: 'BarChart' },
  { value: 'marketing', label: 'Marketing', icon: 'Megaphone' },
  { value: 'finance', label: 'Finance', icon: 'DollarSign' },
  { value: 'hr', label: 'Human Resources', icon: 'Users' },
  { value: 'customer_support', label: 'Customer Support', icon: 'Headphones' },
];

export const WORK_MODES = [
  { value: 'onsite', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const APPLICATION_STATUSES = [
  { value: 'applied', label: 'Applied', color: 'blue' },
  { value: 'under_review', label: 'Under Review', color: 'amber' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'indigo' },
  { value: 'interview', label: 'Interview', color: 'purple' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'selected', label: 'Selected', color: 'green' },
];

export const DATE_POSTED_OPTIONS = [
  { value: 'any', label: 'Any time' },
  { value: '1', label: 'Last 24 hours' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
];

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'salary_high', label: 'Salary: High to Low' },
  { value: 'salary_low', label: 'Salary: Low to High' },
  { value: 'relevant', label: 'Most Relevant' },
];

export const COMPANY_SIZES = [
  { value: '1_10', label: '1–10 employees' },
  { value: '11_50', label: '11–50 employees' },
  { value: '51_200', label: '51–200 employees' },
  { value: '201_500', label: '201–500 employees' },
  { value: '501_1000', label: '501–1000 employees' },
  { value: '1001_plus', label: '1000+ employees' },
];

export const INDUSTRIES = [
  'Information Technology',
  'Finance & Banking',
  'Healthcare',
  'E-commerce',
  'Education',
  'Manufacturing',
  'Media & Entertainment',
  'Consulting',
  'Retail',
  'Telecommunications',
];

export const POPULAR_LOCATIONS = [
  'Bangalore, Karnataka',
  'Mumbai, Maharashtra',
  'Delhi, NCR',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Pune, Maharashtra',
  'Kolkata, West Bengal',
  'Remote',
];
