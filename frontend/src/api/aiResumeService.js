import client from './client';

export const aiResumeService = {
  // ─── CRUD ──────────────────────────────────────────────────────────────────
  async listResumes() {
    const token = localStorage.getItem('access_token');
    if (!token) return [];
    try {
      const { data } = await client.get('/ai-resume/');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async getResume(id) {
    const { data } = await client.get(`/ai-resume/${id}/`);
    return data;
  },

  async createResume(resumeData) {
    const { data } = await client.post('/ai-resume/', resumeData);
    return data;
  },

  async updateResume(id, resumeData) {
    const { data } = await client.put(`/ai-resume/${id}/`, resumeData);
    return data;
  },

  async deleteResume(id) {
    await client.delete(`/ai-resume/${id}/`);
    return true;
  },

  // ─── AI Scoring & Analysis ─────────────────────────────────────────────────
  async calculateScore(resumeData, resumeId = null) {
    const payload = { resume_data: resumeData };
    if (resumeId) payload.resume_id = resumeId;
    const { data } = await client.post('/ai-resume/score/', payload);
    return data;
  },

  async analyzeKeywords(resumeData, targetRole = '', resumeId = null) {
    const payload = {
      resume_data: resumeData,
      target_role: targetRole,
    };
    if (resumeId) payload.resume_id = resumeId;
    const { data } = await client.post('/ai-resume/analyze/', payload);
    return data;
  },

  async analyzeJobDescription(resumeData, jobDescription, resumeId = null) {
    const payload = {
      resume_data: resumeData,
      job_description: jobDescription,
    };
    if (resumeId) payload.resume_id = resumeId;
    const { data } = await client.post('/ai-resume/job-analysis/', payload);
    return data;
  },

  async improveContent({ section, rawText = '', targetRole = '', projectName = '', company = '', techStack = '', resumeData = {} }) {
    const payload = {
      section,
      raw_text: rawText,
      target_role: targetRole,
      project_name: projectName,
      company: company,
      tech_stack: techStack,
      resume_data: resumeData,
    };
    const { data } = await client.post('/ai-resume/improve/', payload);
    return data;
  },

  async tailorResume(resumeData, jobDescription, resumeId = null) {
    const payload = {
      resume_data: resumeData,
      job_description: jobDescription,
    };
    if (resumeId) payload.resume_id = resumeId;
    const { data } = await client.post('/ai-resume/tailor/', payload);
    return data;
  },

  async uploadResumeFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await client.post('/ai-resume/upload/', formData);
    return data;
  },

  async chatWithAssistant(message, resumeData, resumeId = null) {
    const payload = {
      message,
      resume_data: resumeData,
    };
    if (resumeId) payload.resume_id = resumeId;
    const { data } = await client.post('/ai-resume/chat/', payload);
    return data;
  },
};
