/**
 * Company Service — mock + real API stubs
 * Django endpoints: GET /api/companies/, GET /api/companies/:id/
 */

import { mockCompanies } from '@/mock/companies';
import { mockJobs } from '@/mock/jobs';

const USE_MOCK = true;
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const companyService = {
  async getCompanies(params = {}) {
    if (USE_MOCK) {
      await delay();
      let companies = [...mockCompanies];
      if (params.search) {
        const q = params.search.toLowerCase();
        companies = companies.filter(
          (c) => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q),
        );
      }
      if (params.industry) {
        companies = companies.filter((c) => c.industry === params.industry);
      }
      return companies;
    }
    // const { data } = await client.get('/companies/', { params }); return data;
  },

  async getCompanyById(id) {
    if (USE_MOCK) {
      await delay();
      const company = mockCompanies.find((c) => c.id === id);
      if (!company) throw new Error('Company not found');
      const jobs = mockJobs.filter((j) => j.companyId === id && j.isActive);
      return { ...company, jobs };
    }
    // const { data } = await client.get(`/companies/${id}/`); return data;
  },
};

export default companyService;
