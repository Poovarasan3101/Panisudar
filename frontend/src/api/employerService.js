/**
 * Employer Job Service — Connected to real Django REST API
 * Django endpoints:
 *   GET/POST       /api/employers/jobs/
 *   GET/PUT/DELETE /api/employers/jobs/:id/
 *   PATCH          /api/employers/jobs/:id/toggle/
 */

import client from './client';

export const employerService = {
  async getMyJobs(params = {}) {
    const { data } = await client.get('/employers/jobs/', { params });
    return Array.isArray(data) ? data : data.results || [];
  },

  async createJob(jobData) {
    const { data } = await client.post('/employers/jobs/', jobData);
    return data;
  },

  async updateJob(jobId, updates) {
    const { data } = await client.patch(`/employers/jobs/${jobId}/`, updates);
    return data;
  },

  async deleteJob(jobId) {
    const { data } = await client.delete(`/employers/jobs/${jobId}/`);
    return data;
  },

  async toggleJobStatus(jobId) {
    const { data } = await client.patch(`/employers/jobs/${jobId}/toggle/`);
    return data;
  },

  getDashboardStats(jobs = [], apps = []) {
    const total = jobs.length;
    const active = jobs.filter((j) => j.isActive || j.is_active).length;
    const totalApps = apps.length || jobs.reduce((acc, j) => acc + (j.applicationsCount || j.applications_count || 0), 0);
    const shortlisted = apps.filter((a) => a.status === 'shortlisted' || a.status === 'interview').length;
    return { total, active, totalApps, shortlisted };
  },
};

export default employerService;
