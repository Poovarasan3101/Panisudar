import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  X,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { aiResumeService } from '@/api/aiResumeService';

export default function TailorResumePanel({ resume, onApplyChanges }) {
  const [jobDescription, setJobDescription] = useState(resume.target_job_description || '');
  const [loading, setLoading] = useState(false);
  const [tailorResult, setTailorResult] = useState(null);
  const [error, setError] = useState('');
  const [appliedSections, setAppliedSections] = useState({});

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a target job description first.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await aiResumeService.tailorResume(resume, jobDescription, resume.id);
      setTailorResult(data);
      setAppliedSections({});
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to tailor resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSummary = () => {
    if (!tailorResult?.tailored_summary) return;
    onApplyChanges({
      career_info: {
        ...resume.career_info,
        summary: tailorResult.tailored_summary,
      },
    });
    setAppliedSections((prev) => ({ ...prev, summary: true }));
  };

  const handleAcceptSkills = () => {
    if (!tailorResult?.tailored_skills || tailorResult.tailored_skills.length === 0) return;
    // Merge existing skills with prioritized tailored skills without duplicates
    const existing = resume.career_info?.skills || [];
    const newSkills = Array.from(new Set([...tailorResult.tailored_skills, ...existing]));
    onApplyChanges({
      career_info: {
        ...resume.career_info,
        skills: newSkills,
      },
    });
    setAppliedSections((prev) => ({ ...prev, skills: true }));
  };

  const handleAcceptAll = () => {
    handleAcceptSummary();
    handleAcceptSkills();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            AI Resume Tailor
          </div>
          <h3 className="text-xl font-bold text-white">Target Job Optimization</h3>
          <p className="text-xs text-slate-400 mt-1">
            Compare your resume side-by-side with target job requirements. Review and selectively accept AI optimizations.
          </p>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-300">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-emerald-400">Strict Anti-Hallucination Guarantee:</strong> The Panisudar AI Tailor emphasizes relevant keywords and clarifies your actual accomplishments. It <span className="underline decoration-pink-500">never</span> fabricates jobs, degrees, or false metrics.
        </div>
      </div>

      {/* Job Description Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Paste Target Job Description (JD)
        </label>
        <textarea
          rows={5}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste requirements, responsibilities, or job posting content here..."
          className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono"
        />
        {error && (
          <div className="flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleTailor}
            disabled={loading || !jobDescription.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-xs shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Tailoring Resume...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate Tailored Resume
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tailor Results & Comparisons */}
      {tailorResult && (
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Tailoring Recommendations
            </h4>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium hover:bg-emerald-500/30 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              Accept All Recommendations
            </button>
          </div>

          {/* Section 1: Executive Summary Comparison */}
          {tailorResult.tailored_summary && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wide">
                  1. Professional Summary Tailoring
                </span>
                {appliedSections.summary ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                    <Check className="w-3.5 h-3.5" /> Applied to Resume
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleAcceptSummary}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all"
                  >
                    <Check className="w-3 h-3" /> Accept & Apply
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                {/* Original */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                  <div className="text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-500"></span> Current Resume Summary
                  </div>
                  <p className="text-slate-300 leading-relaxed italic">
                    {resume.career_info?.summary || 'No summary currently set.'}
                  </p>
                </div>

                {/* AI Tailored */}
                <div className="bg-purple-950/20 border border-purple-500/30 rounded-lg p-3">
                  <div className="text-[11px] font-bold text-purple-300 mb-1 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-purple-400" /> AI Tailored Summary (Target Job Focused)
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {tailorResult.tailored_summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Recommended Skills Placement */}
          {tailorResult.tailored_skills && tailorResult.tailored_skills.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">
                  2. Priority Skills Alignment
                </span>
                {appliedSections.skills ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                    <Check className="w-3.5 h-3.5" /> Applied to Resume
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleAcceptSkills}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-all"
                  >
                    <Check className="w-3 h-3" /> Accept & Merge Skills
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Skills found in job description that align with your profile, ordered by ATS ranking priority:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tailorResult.tailored_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs font-mono"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Recommended Keywords & Experience Enhancements */}
          {tailorResult.recommended_bullet_points && tailorResult.recommended_bullet_points.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wide block">
                3. High-Impact Action Bullet Ideas
              </span>
              <p className="text-xs text-slate-400">
                Incorporate these active verbs and measurable patterns into your existing projects or work history:
              </p>
              <ul className="space-y-2">
                {tailorResult.recommended_bullet_points.map((pt, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-300 bg-slate-900/80 border border-slate-800/80 rounded-lg p-2.5 flex items-start gap-2"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
