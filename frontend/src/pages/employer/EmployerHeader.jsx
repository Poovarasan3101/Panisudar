import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users,
  Building2,
  Settings,
} from 'lucide-react';
import Button from '@/components/common/Button';

const navItems = [
  { to: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employer/my-jobs', label: 'My Jobs', icon: Briefcase },
  { to: '/employer/applications', label: 'Applications', icon: Users },
  { to: '/employer/post-job', label: 'Post a Job', icon: PlusCircle },
  { to: '/employer/company-profile', label: 'Company Profile', icon: Building2 },
  { to: '/employer/settings', label: 'Settings', icon: Settings },
];

export default function EmployerHeader({ title, subtitle, action }) {
  return (
    <div className="bg-[#121620] border-b border-white/10 pt-6 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top header row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {action ? (
              action
            ) : (
              <Link to="/employer/post-job">
                <Button
                  variant="primary"
                  size="md"
                  icon={<PlusCircle className="w-4 h-4" />}
                >
                  Post a Job
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto border-t border-white/10 scrollbar-none py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                    isActive
                      ? 'border-cyan-400 text-cyan-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600',
                  ].join(' ')
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
