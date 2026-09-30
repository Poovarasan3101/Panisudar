import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Professional Panisudar Logo Component
 * - Abstract 'P' monogram with upward career growth trajectory
 * - High-impact gradient styling and modern typography
 * - Supports light, dark, and auto modes, along with multiple sizes
 */
export default function Logo({
  variant = 'dark', // 'dark' | 'light' | 'auto'
  size = 'md',      // 'sm' | 'md' | 'lg' | 'xl'
  showTagline = false,
  iconOnly = false,
  asLink = true,
  to = '/',
  className = '',
}) {
  const sizeMap = {
    sm: { icon: 24, text: 'text-lg', badge: 'text-[9px] px-1.5 py-0.2' },
    md: { icon: 32, text: 'text-xl', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 40, text: 'text-2xl', badge: 'text-xs px-2.5 py-0.5' },
    xl: { icon: 48, text: 'text-3xl', badge: 'text-xs px-2.5 py-1' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const textColorClass =
    variant === 'light'
      ? 'text-slate-900'
      : variant === 'auto'
      ? 'text-slate-900 dark:text-white'
      : 'text-white';

  const logoGraphic = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Monogram Icon */}
      <div className="relative flex-shrink-0">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md"
        >
          <defs>
            <linearGradient id="pStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <linearGradient id="pLoopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <linearGradient id="arrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <filter id="pGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Rounded base backing */}
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="10"
            className="fill-slate-900/60 stroke-indigo-500/20"
            strokeWidth="1.5"
          />

          {/* Main vertical stem of P */}
          <rect
            x="8"
            y="8"
            width="6.5"
            height="24"
            rx="3.25"
            fill="url(#pStemGrad)"
          />

          {/* Loop of P - sleek aerodynamic curve */}
          <path
            d="M13 8.5H23C27.5 8.5 31 12 31 16.5C31 21 27.5 24.5 23 24.5H13"
            stroke="url(#pLoopGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Upward Growth Arrow Trajectory (Symbolizing career ascent) */}
          <path
            d="M20 22L27 15M27 15H22M27 15V20"
            stroke="url(#arrowGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Ambient subtle glow dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
        </span>
      </div>

      {/* Wordmark */}
      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight ${currentSize.text} ${textColorClass}`}
              style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.03em' }}
            >
              Panisudar
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"></span>
          </div>

          {showTagline && (
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mt-0.5">
              Career Platform
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link to={to} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">
        {logoGraphic}
      </Link>
    );
  }

  return logoGraphic;
}
