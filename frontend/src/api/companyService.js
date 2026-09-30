/**
 * Company Service — Connected to real Django REST API
 * Django endpoints: GET /api/companies/, GET /api/companies/:id/
 */

import client from './client';

export const companyService = {
  async getCompanies(params = {}) {
    const { data } = await client.get('/companies/', { params });
    return Array.isArray(data) ? data : data.results || [];
  },

  async getCompanyById(id) {
    const { data: company } = await client.get(`/companies/${id}/`);
    try {
      const { data: jobsData } = await client.get('/jobs/', { params: { company: id } });
      const jobs = Array.isArray(jobsData) ? jobsData : jobsData.results || [];
      return { ...company, jobs };
    } catch {
      return { ...company, jobs: [] };
    }
  },
};

export default companyService;
