export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? null : 'Enter a valid email address';
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  return null;
}

export function validateRequired(value, fieldName = 'This field') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validatePhone(phone) {
  if (!phone) return null; // optional
  const re = /^[+]?[\d\s\-().]{7,15}$/;
  return re.test(phone) ? null : 'Enter a valid phone number';
}

export function validateUrl(url) {
  if (!url) return null; // optional
  try {
    new URL(url);
    return null;
  } catch {
    return 'Enter a valid URL (e.g. https://example.com)';
  }
}

export function validateSalary(min, max) {
  const errors = {};
  if (min && max && Number(min) > Number(max)) {
    errors.salaryMax = 'Max salary must be greater than min salary';
  }
  return errors;
}

export function validateFile(file, options = {}) {
  const { maxSizeMB = 5, acceptedTypes = [] } = options;
  if (!file) return null;
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File size must not exceed ${maxSizeMB}MB`;
  }
  if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
    return `Invalid file type. Accepted: ${acceptedTypes.join(', ')}`;
  }
  return null;
}

export function validateJobForm(values) {
  const errors = {};
  if (!values.title?.trim()) errors.title = 'Job title is required';
  if (!values.category) errors.category = 'Category is required';
  if (!values.location?.trim()) errors.location = 'Location is required';
  if (!values.jobType) errors.jobType = 'Job type is required';
  if (!values.experienceLevel) errors.experienceLevel = 'Experience level is required';
  if (!values.description?.trim()) errors.description = 'Job description is required';
  if (!values.applicationDeadline) errors.applicationDeadline = 'Application deadline is required';
  const salaryErrors = validateSalary(values.salaryMin, values.salaryMax);
  Object.assign(errors, salaryErrors);
  return errors;
}
