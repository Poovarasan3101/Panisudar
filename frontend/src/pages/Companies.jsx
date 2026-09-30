import React, { useState, useEffect } from 'react';
import { Search, Building2, MapPin, Briefcase } from 'lucide-react';
import companyService from '@/api/companyService';
import CompanyCard from '@/components/companies/CompanyCard';
import { INDUSTRIES } from '@/utils/constants';
import { SkeletonCard } from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, [selectedIndustry]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await companyService.getCompanies({
        search: search.trim() || undefined,
        industry: selectedIndustry || undefined,
      });
      setCompanies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 py-12 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Top Companies Hiring Now
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-400">
            Explore verified employers, view company culture, active job openings, and find your dream workplace.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#121620] border border-white/10 rounded-2xl p-4 sm:p-5 mb-8 max-w-4xl mx-auto shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company name or keyword..."
                className="w-full bg-[#161C28] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/70"
              />
            </div>

            <div className="sm:w-64">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full bg-[#161C28] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/70 cursor-pointer"
              >
                <option value="" className="bg-[#161C28] text-slate-400">All Industries</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind} className="bg-[#161C28] text-white">
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-600/25 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-slate-400">
            Showing <span className="font-bold text-cyan-400">{companies.length}</span> companies
          </p>
        </div>

        {/* Company Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} className="h-64" />
            ))}
          </div>
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <div className="bg-[#121620] border border-white/10 rounded-2xl p-8">
            <EmptyState
              icon={<Building2 className="w-12 h-12 text-slate-400" />}
              title="No companies found"
              description="Try adjusting your search terms or selecting a different industry."
              action={{
                label: 'Reset Filters',
                onClick: () => {
                  setSearch('');
                  setSelectedIndustry('');
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
