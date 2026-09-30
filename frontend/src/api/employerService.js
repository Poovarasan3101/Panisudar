/**
 * Employer Job Service — mock + real API stubs
 * Django endpoints:
 *   GET/POST   /api/employers/jobs/
 *   GET/PUT/DELETE /api/employers/jobs/:id/
 */

import { mockJobs } from '@/mock/jobs';

const USE_MOCK = true;
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// Only show employer's own jobs (companyId: '4' for mock employer)
let _employerJobs = mockJobs.filter((j) => j.companyId === '4').map((j) => ({ ...j }));

export const employerService = {
  async getMyJobs(params = {}) {
    if (USE_MOCK) {
      await delay();
      let jobs = [..._employerJobs];
      if (params.status === 'active') jobs = jobs.filter((j) => j.isActive);
      if (params.status === 'inactive') jobs = jobs.filter((j) => !j.isActive);
      return jobs;
    }
    // const { data } = await client.get('/employers/jobs/', { params }); return data;
  },

  async createJob(jobData) {
    if (USE_MOCK) {
      await delay(700);
      const newJob = {
        ...jobData,
        id: String(Date.now()),
        postedAt: new Date().toISOString(),
        applicationsCount: 0,
        isActive: true,
        isFeatured: false,
        companyId: '4',
        companyName: 'Razorpay',
        companyLogo: 'https://ui-avatars.com/api/?name=Razorpay&background=4f46e5&color=fff&size=64',
      };
      _employerJobs.unshift(newJob);
      return newJob;
    }
    // const { data } = await client.post('/employers/jobs/', jobData); return data;
  },

  async updateJob(jobId, updates) {
    if (USE_MOCK) {
      await delay(600);
      const idx = _employerJobs.findIndex((j) => j.id === jobId);
      if (idx === -1) throw new Error('Job not found');
      _employerJobs[idx] = { ..._employerJobs[idx], ...updates };
      return _employerJobs[idx];
    }
    // const { data } = await client.put(`/employers/jobs/${jobId}/`, updates); return data;
  },

  async deleteJob(jobId) {
    if (USE_MOCK) {
      await delay(400);
      _employerJobs = _employerJobs.filter((j) => j.id !== jobId);
      return { success: true };
    }
    // await client.delete(`/employers/jobs/${jobId}/`);
  },

  async toggleJobStatus(jobId) {
    if (USE_MOCK) {
      await delay(300);
      const job = _employerJobs.find((j) => j.id === jobId);
      if (!job) throw new Error('Job not found');
      job.isActive = !job.isActive;
      return job;
    }
    // const { data } = await client.patch(`/employers/jobs/${jobId}/toggle/`); return data;
  },

  getDashboardStats() {
    const total = _employerJobs.length;
    const active = _employerJobs.filter((j) => j.isActive).length;
    const totalApps = _employerJobs.reduce((acc, j) => acc + (j.applicationsCount || 0), 0);
    return { total, active, totalApps, shortlisted: Math.floor(totalApps * 0.3) };
  },
};

export default employerService;
