import client from './client';

export function normalizeJob(job) {
  if (!job) return job;
  return {
    ...job,
    companyName: job.companyName || job.company_name || job.company?.name,
    companyLogo: job.companyLogo || job.company_logo || job.company?.logo,
    workMode: job.workMode || job.work_mode,
    jobType: job.jobType || job.job_type,
    experienceLevel: job.experienceLevel || job.experience_level,
    salaryMin: job.salaryMin || job.salary_min,
    salaryMax: job.salaryMax || job.salary_max,
    postedAt: job.postedAt || job.created_at,
    applicationDeadline: job.applicationDeadline || job.application_deadline,
    isFeatured: job.isFeatured !== undefined ? job.isFeatured : Boolean(job.is_featured),
    isActive: job.isActive !== undefined ? job.isActive : (job.is_active !== undefined ? Boolean(job.is_active) : true),
    applicationsCount: job.applicationsCount || job.applications_count || 0,
  };
}

export const jobService = {
  /**
   * Fetch paginated, filtered, sorted job listings from real Django REST API
   */
  async getJobs(params = {}) {
    const queryParams = { ...params };
    // Map camelCase to snake_case for backend
    if (params.jobType) queryParams.job_type = params.jobType;
    if (params.workMode) queryParams.work_mode = params.workMode;
    if (params.experienceLevel) queryParams.experience_level = params.experienceLevel;
    if (params.salaryMin) queryParams.salary_min = params.salaryMin;
    if (params.isFeatured !== undefined) queryParams.is_featured = params.isFeatured;

    const { data } = await client.get('/jobs/', { params: queryParams });
    const list = Array.isArray(data) ? data : data.results || [];
    const normalizedList = list.map(normalizeJob);

    const count = data.count !== undefined ? data.count : normalizedList.length;
    const page = Number(params.page) || 1;
    const pageSize = Number(params.pageSize) || 10;
    const totalPages = Math.ceil(count / pageSize) || 1;

    // If server already paginated:
    if (data.results && data.count !== undefined) {
      return {
        results: normalizedList,
        count,
        totalPages,
        page,
      };
    }

    // If server returned unpaginated list, slice for UI pagination:
    const start = (page - 1) * pageSize;
    const paginated = normalizedList.slice(start, start + pageSize);

    return {
      results: paginated,
      count,
      totalPages,
      page,
    };
  },

  async getJobById(id) {
    const { data } = await client.get(`/jobs/${id}/`);
    return normalizeJob(data);
  },

  async getFeaturedJobs() {
    const { data } = await client.get('/jobs/', { params: { is_featured: true } });
    const list = Array.isArray(data) ? data : data.results || [];
    return list.map(normalizeJob).slice(0, 6);
  },

  async getSimilarJobs(jobId, category) {
    const { data } = await client.get('/jobs/', { params: { category } });
    const list = Array.isArray(data) ? data : data.results || [];
    return list
      .map(normalizeJob)
      .filter((j) => String(j.id) !== String(jobId))
      .slice(0, 3);
  },
};

export default jobService;
