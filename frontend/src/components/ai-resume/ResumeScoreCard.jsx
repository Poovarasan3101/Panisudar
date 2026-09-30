import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import Button from '@/components/common/Button';

export default function ResumeScoreCard({ scoreData, loading, onImproveClick, onRecalculate }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const score = scoreData?.score ?? 0;
  const rating = scoreData?.rating || (score >= 80 ? 'Excellent' : score >= 65 ? 'Good' : 'Needs Work');
  const breakdown = scoreData?.breakdown || {};
  const strengths = scoreData?.strengths || [];
  const improvements = scoreData?.improvements || [];

  // Circle progress calculation
  const circumference = 2 * Math.PI * 42; // r=42
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreColor =
    score >= 80
      ? 'text-emerald-400 stroke-emerald-500'
      : score >= 65
      ? 'text-cyan-400 stroke-cyan-500'
      : score >= 45
      ? 'text-amber-400 stroke-amber-500'
      : 'text-rose-400 stroke-rose-500';

  return (
    <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-5 sm:p-6 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Resume Score
        </h3>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
            score >= 80
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : score >= 65
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          }`}
        >
          {rating}
        </span>
      </div>

      {/* Main Score Gauge */}
      <div className="flex items-center justify-center gap-6 py-2">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              stroke="#1e293b"
              strokeWidth="9"
            />
            {/* Animated Progress Track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              className={`${scoreColor} transition-all duration-1000 ease-out`}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-white tracking-tight">{score}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ 100</span>
          </div>
        </div>

        <div className="space-y-1.5 text-left">
          <p className="text-sm font-semibold text-white">ATS Readiness</p>
          <p className="text-xs text-slate-400 leading-relaxed max-w-[180px]">
            {score >= 80
              ? 'Your resume is highly optimized for recruiter screening.'
              : score >= 65
              ? 'Solid foundation. A few key updates can push you to the top 10%.'
              : 'Several key areas require attention to pass corporate ATS screens.'}
          </p>
          {onRecalculate && (
            <button
              onClick={onRecalculate}
              disabled={loading}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold underline block pt-1"
            >
              {loading ? 'Recalculating...' : 'Recalculate Score'}
            </button>
          )}
        </div>
      </div>

      {/* Why your score is X */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Why your score is {score}
        </p>

        {strengths.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Strengths
            </span>
            {strengths.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {improvements.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              Needs Improvement
            </span>
            {improvements.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Breakdown Accordion */}
      <div className="pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => setShowBreakdown((v) => !v)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>10-Category Point Breakdown</span>
          {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showBreakdown && (
          <div className="mt-3 space-y-2 pt-2 text-xs divide-y divide-white/5 animate-fadeIn">
            {Object.entries(breakdown).map(([key, cat]) => (
              <div key={key} className="flex items-center justify-between pt-1.5 first:pt-0">
                <span className="text-slate-300">{cat.label}</span>
                <span className="font-mono font-bold text-white">
                  {cat.score} <span className="text-slate-500 font-normal">/ {cat.max}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Improve Resume Action Button */}
      {onImproveClick && (
        <Button
          variant="primary"
          size="sm"
          fullWidth
          icon={<Sparkles className="w-4 h-4" />}
          onClick={onImproveClick}
          className="shadow-md"
        >
          Improve Resume with AI
        </Button>
      )}
    </div>
  );
}
