import React from 'react';
import { Building2, MapPin, Users, Briefcase, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BorderGlow from '@/components/common/BorderGlow';
import { getMediaUrl } from '@/utils/helpers';

export default function CompanyCard({ company }) {
  if (!company) return null;

  return (
    <BorderGlow
      edgeSensitivity={0}
      glowColor="40 80 80"
      backgroundColor="#120F17"
      borderRadius={34}
      glowRadius={60}
      glowIntensity={2.4}
      coneSpread={39}
      animated={false}
      colors={['#c084fc', '#f472b6', '#38bdf8']}
      className="h-full"
    >
      <div className="p-6 flex flex-col justify-between h-full rounded-[30px] transition-all duration-300">
        <div>
          <div className="flex items-start gap-4 mb-4">
            <img
              src={
                getMediaUrl(company.logo) ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  company.name
                )}&background=e0e7ff&color=4338ca&size=64`
              }
              alt={company.name}
              className="w-14 h-14 rounded-2xl object-contain border border-white/10 flex-shrink-0 bg-white/5 p-1 shadow-md"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  company.name
                )}&background=e0e7ff&color=4338ca&size=64`;
              }}
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-white truncate hover:text-cyan-300 transition-colors">
                {company.name}
              </h3>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                {company.industry}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {company.about}
          </p>

          <div className="space-y-2 text-xs text-slate-400 mb-6 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate">{company.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>{company.size?.replace('_', '–') || '50+'} employees</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-pink-400" />
              <span className="font-semibold text-slate-200">
                {company.activeJobs || 2} Open Positions
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <Link
            to={`/jobs?search=${encodeURIComponent(company.name)}`}
            className="flex-1 py-2 px-3 text-center rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            View Jobs
          </Link>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Visit Website"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </BorderGlow>
  );
}
