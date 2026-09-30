/**
 * Application Service — mock + real API stubs
 * Django endpoints:
 *   POST /api/applications/         (apply for job)
 *   GET  /api/job-seekers/applications/
 *   GET  /api/employers/applications/
 *   PATCH /api/applications/:id/    (update status)
 */

import { mockApplications } from '@/mock/applications';

const USE_MOCK = true;
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

let _applications = [...mockApplications];

export const applicationService = {
  async getMyApplications() {
    if (USE_MOCK) {
      await delay();
      return _applications;
    }
    // const { data } = await client.get('/job-seekers/applications/'); return data;
  },

  async getEmployerApplications(params = {}) {
    if (USE_MOCK) {
      await delay();
      let apps = [..._applications];
      if (params.status) apps = apps.filter((a) => a.status === params.status);
      if (params.jobId) apps = apps.filter((a) => a.jobId === params.jobId);
      return apps;
    }
    // const { data } = await client.get('/employers/applications/', { params }); return data;
  },

  async applyForJob(jobId, coverLetter = '') {
    if (USE_MOCK) {
      await delay(800);
      const already = _applications.find((a) => a.jobId === jobId);
      if (already) throw new Error('You have already applied for this job.');
      const newApp = {
        id: String(Date.now()),
        jobId,
        jobTitle: 'Applied Position',
        companyName: 'Company',
        companyLogo: 'https://ui-avatars.com/api/?name=C&background=4f46e5&color=fff',
        location: 'Bangalore',
        appliedAt: new Date().toISOString(),
        status: 'applied',
        coverLetter,
      };
      _applications.unshift(newApp);
      return newApp;
    }
    // const { data } = await client.post('/applications/', { job: jobId, coverLetter }); return data;
  },

  async updateApplicationStatus(applicationId, status) {
    if (USE_MOCK) {
      await delay(400);
      const app = _applications.find((a) => a.id === applicationId);
      if (!app) throw new Error('Application not found');
      app.status = status;
      return app;
    }
    // const { data } = await client.patch(`/applications/${applicationId}/`, { status }); return data;
  },

  async withdrawApplication(applicationId) {
    if (USE_MOCK) {
      await delay(400);
      _applications = _applications.filter((a) => a.id !== applicationId);
      return { success: true };
    }
    // await client.delete(`/applications/${applicationId}/`);
  },
};

export default applicationService;
