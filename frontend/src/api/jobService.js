import client from './client';
import { mockJobs } from '@/mock/jobs';

function normalizeJob(job) {
  if (!job) return job;
  return {
    ...job,
    companyName: job.companyName || job.company_name,
    companyLogo: job.companyLogo || job.company_logo,
    workMode: job.workMode || job.work_mode,
    jobType: job.jobType || job.job_type,
    experienceLevel: job.experienceLevel || job.experience_level,
    salaryMin: job.salaryMin || job.salary_min,
    salaryMax: job.salaryMax || job.salary_max,
    postedAt: job.postedAt || job.created_at,
    applicationDeadline: job.applicationDeadline || job.application_deadline,
    isFeatured: job.isFeatured !== undefined ? job.isFeatured : job.is_featured,
  };
}

export const jobService = {
  /**
   * Fetch paginated, filtered, sorted job listings
   */
  async getJobs(params = {}) {
    let allJobs = [];
    try {
      const { data } = await client.get('/jobs/', { params });
      const list = Array.isArray(data) ? data : data.results || [];
      if (list.length > 0) {
        allJobs = list.map(normalizeJob);
      }
    } catch {
      // Fallback to mock jobs
    }

    if (allJobs.length === 0) {
      allJobs = mockJobs.map(normalizeJob);
    }

    let jobs = [...allJobs];

    // Client-side filtering
    if (params.search) {
      const q = params.search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.companyName?.toLowerCase().includes(q) ||
          j.skills?.some((s) => s.toLowerCase().includes(q)) ||
          j.description?.toLowerCase().includes(q),
      );
    }

    if (params.location) {
      const loc = params.location.toLowerCase();
      jobs = jobs.filter(
        (j) => j.location?.toLowerCase().includes(loc) || j.workMode === 'remote',
      );
    }

    if (params.jobType && (!Array.isArray(params.jobType) || params.jobType.length > 0)) {
      jobs = jobs.filter((j) =>
        Array.isArray(params.jobType) ? params.jobType.includes(j.jobType) : j.jobType === params.jobType
      );
    }

    if (params.experienceLevel) {
      jobs = jobs.filter((j) => j.experienceLevel === params.experienceLevel);
    }

    if (params.category) {
      jobs = jobs.filter((j) => j.category === params.category);
    }

    if (params.workMode && (!Array.isArray(params.workMode) || params.workMode.length > 0)) {
      jobs = jobs.filter((j) =>
        Array.isArray(params.workMode) ? params.workMode.includes(j.workMode) : j.workMode === params.workMode
      );
    }

    if (params.salaryMin) {
      jobs = jobs.filter((j) => !j.salaryMax || j.salaryMax >= Number(params.salaryMin));
    }

    // Sorting
    if (params.sort === 'salary_high') {
      jobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    } else if (params.sort === 'salary_low') {
      jobs.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
    } else {
      jobs.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0));
    }

    const page = Number(params.page) || 1;
    const pageSize = Number(params.pageSize) || 10;
    const start = (page - 1) * pageSize;
    const paginated = jobs.slice(start, start + pageSize);

    return {
      results: paginated,
      count: jobs.length,
      totalPages: Math.ceil(jobs.length / pageSize),
      page,
    };
  },

  async getJobById(id) {
    try {
      const { data } = await client.get(`/jobs/${id}/`);
      if (data) return normalizeJob(data);
    } catch {
      // Fallback
    }
    const job = mockJobs.find((j) => String(j.id) === String(id));
    if (!job) throw new Error('Job not found');
    return normalizeJob(job);
  },

  async getFeaturedJobs() {
    try {
      const { data } = await client.get('/jobs/', { params: { is_featured: true } });
      const list = Array.isArray(data) ? data : data.results || [];
      if (list.length > 0) {
        return list.map(normalizeJob).filter((j) => j.isFeatured).slice(0, 6);
      }
    } catch {
      // Fallback
    }
    return mockJobs.map(normalizeJob).filter((j) => j.isFeatured).slice(0, 6);
  },

  async getSimilarJobs(jobId, category) {
    const all = await this.getJobs({ category });
    return all.results.filter((j) => String(j.id) !== String(jobId)).slice(0, 3);
  },
};

export default jobService;
