/**
 * Application Service — Connected to real Django REST API
 * Endpoints:
 *   POST   /api/applications/         (apply for job)
 *   GET    /api/job-seekers/applications/ (seeker's applications)
 *   GET    /api/employers/applications/   (recruiter's applicants)
 *   PATCH  /api/applications/:id/    (update status)
 *   DELETE /api/applications/:id/    (withdraw application)
 */

import client from './client';

export const applicationService = {
  async getMyApplications() {
    const { data } = await client.get('/job-seekers/applications/');
    return Array.isArray(data) ? data : data.results || [];
  },

  async getEmployerApplications(params = {}) {
    const { data } = await client.get('/employers/applications/', { params });
    return Array.isArray(data) ? data : data.results || [];
  },

  async applyForJob(jobId, coverLetter = '') {
    const { data } = await client.post('/applications/', {
      job: jobId,
      cover_letter: coverLetter,
    });
    return data;
  },

  async updateApplicationStatus(applicationId, status) {
    const { data } = await client.patch(`/applications/${applicationId}/`, { status });
    return data;
  },

  async withdrawApplication(applicationId) {
    const { data } = await client.delete(`/applications/${applicationId}/`);
    return data;
  },
};

export default applicationService;
