import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import BorderGlow from '@/components/common/BorderGlow';

export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
  iconBg = 'bg-indigo-500/10 border-indigo-500/20',
  iconColor = 'text-cyan-400',
  trend,
  trendUp = true,
  href,
}) {
  const content = (
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
      <div className="group p-6 flex items-start justify-between h-full rounded-[30px] transition-all duration-300">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-2xl lg:text-3xl font-black text-white group-hover:text-cyan-300 transition-colors">
            {value}
          </p>

          {trend && (
            <div className="flex items-center gap-1.5 text-xs font-medium pt-1">
              {trendUp ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span className={trendUp ? 'text-emerald-400' : 'text-rose-400'}>
                {trend}
              </span>
            </div>
          )}
        </div>

        <div
          className={`p-3 rounded-xl flex items-center justify-center border ${iconBg} ${iconColor} group-hover:scale-110 transition-transform duration-300 shadow-md`}
        >
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </BorderGlow>
  );

  if (href) {
    return (
      <Link to={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
