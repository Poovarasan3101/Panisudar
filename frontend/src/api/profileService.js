import client from './client';
import { getMediaUrl } from '@/utils/helpers';
import { mockJobs } from '@/mock/jobs';

export const profileService = {
  // ─── Seeker Profile ────────────────────────────────────────────────────────
  async getSeekerProfile() {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const { data } = await client.get('/job-seekers/profile/');
    if (data && data.photo) {
      data.photo = getMediaUrl(data.photo);
    }
    return data;
  },

  async updateSeekerProfile(updates) {
    const { data } = await client.patch('/job-seekers/profile/', updates);
    if (data && data.photo) {
      data.photo = getMediaUrl(data.photo);
    }
    return data;
  },

  async uploadResume(file) {
    const form = new FormData();
    form.append('resume', file);
    form.append('resume_name', file.name);
    const { data } = await client.patch('/job-seekers/profile/', form);
    return {
      name: data.resume_name || file.name,
      uploadedAt: new Date().toISOString().split('T')[0],
      url: getMediaUrl(data.resume),
    };
  },

  async uploadPhoto(file) {
    const form = new FormData();
    form.append('photo', file);
    const { data } = await client.patch('/job-seekers/profile/', form);
    const photoUrl = getMediaUrl(data.photo);
    const busterUrl = photoUrl ? `${photoUrl}${photoUrl.includes('?') ? '&' : '?'}t=${Date.now()}` : photoUrl;
    return { url: busterUrl, photo: busterUrl };
  },

  // ─── Employer Profile ──────────────────────────────────────────────────────
  async getEmployerProfile() {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const { data } = await client.get('/employers/profile/');
      return data;
    } catch {
      return null;
    }
  },

  async updateEmployerProfile(updates) {
    const { data } = await client.patch('/employers/profile/', updates);
    return data;
  },

  // ─── Saved Jobs ────────────────────────────────────────────────────────────
  async getSavedJobs() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      const localSaved = JSON.parse(localStorage.getItem('saved_job_ids') || '[]');
      return mockJobs.filter((j) => localSaved.includes(j.id));
    }
    try {
      const { data } = await client.get('/job-seekers/saved-jobs/');
      return Array.isArray(data) ? data.map((item) => item.job_details || item) : [];
    } catch {
      return [];
    }
  },

  async getSavedJobIds() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return JSON.parse(localStorage.getItem('saved_job_ids') || '[]');
    }
    try {
      const { data } = await client.get('/job-seekers/saved-jobs/');
      if (Array.isArray(data)) {
        return data.map((item) => String(item.job || item.job_details?.id || item.id));
      }
      return [];
    } catch {
      return [];
    }
  },

  async saveJob(jobId) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      const localSaved = JSON.parse(localStorage.getItem('saved_job_ids') || '[]');
      if (!localSaved.includes(jobId)) {
        localSaved.push(jobId);
        localStorage.setItem('saved_job_ids', JSON.stringify(localSaved));
      }
      return { saved: true };
    }
    try {
      const { data } = await client.post('/job-seekers/saved-jobs/', { job: jobId });
      return { saved: true, data };
    } catch {
      return { saved: true };
    }
  },

  async unsaveJob(jobId) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      let localSaved = JSON.parse(localStorage.getItem('saved_job_ids') || '[]');
      localSaved = localSaved.filter((id) => id !== jobId);
      localStorage.setItem('saved_job_ids', JSON.stringify(localSaved));
      return { saved: false };
    }
    try {
      await client.delete(`/job-seekers/saved-jobs/${jobId}/`);
      return { saved: false };
    } catch {
      return { saved: false };
    }
  },

  isSaved(jobId) {
    const localSaved = JSON.parse(localStorage.getItem('saved_job_ids') || '[]');
    return localSaved.includes(jobId);
  },
};

export default profileService;
