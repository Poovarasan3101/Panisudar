import React, { useState } from 'react';
import { Target, Search, CheckCircle2, XCircle, Sparkles, FileText, ArrowRight } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { aiResumeService } from '@/api/aiResumeService';
import { useToast } from '@/contexts/ToastContext';

export default function ATSJobMatcher({ resumeData, resume, onTailorClick }) {
  const currentResume = resume || resumeData;
  const toast = useToast();
  const [targetRole, setTargetRole] = useState(
    currentResume?.career_info?.target_role || currentResume?.target_role || currentResume?.professional_title || ''
  );
  const [jobDescription, setJobDescription] = useState('');
  const [activeTab, setActiveTab] = useState('role'); // 'role' | 'jd'

  const [loadingRole, setLoadingRole] = useState(false);
  const [roleAnalysis, setRoleAnalysis] = useState(null);

  const [loadingJd, setLoadingJd] = useState(false);
  const [jdAnalysis, setJdAnalysis] = useState(null);

  const handleAnalyzeRole = async () => {
    if (!targetRole.trim()) {
      toast.warning('Input Required', 'Please enter a target job role.');
      return;
    }
    try {
      setLoadingRole(true);
      const res = await aiResumeService.analyzeKeywords(currentResume, targetRole.trim());
      setRoleAnalysis(res);
      toast.success('Analysis Complete', `Keyword match: ${res.matchPercentage || res.match_percentage}%`);
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to analyze keywords for this role.');
    } finally {
      setLoadingRole(false);
    }
  };

  const handleAnalyzeJD = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      toast.warning('Input Required', 'Please paste a descriptive Job Description (at least 30 characters).');
      return;
    }
    try {
      setLoadingJd(true);
      const res = await aiResumeService.analyzeJobDescription(currentResume, jobDescription.trim());
      setJdAnalysis(res);
      toast.success('Job Analyzed', `Matched ${res.skillsMatched?.length || 0} required skills.`);
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to analyze the job description.');
    } finally {
      setLoadingJd(false);
    }
  };

  return (
    <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          ATS & Job Match Analysis
        </h3>
      </div>

      {/* Tabs: By Role vs By Full Job Description */}
      <div className="flex bg-[#161C28] p-1 rounded-xl border border-white/5 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('role')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'role'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Target Job Role
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('jd')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'jd'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Paste Job Description
        </button>
      </div>

      {/* TAB 1: Target Role Keyword Analysis */}
      {activeTab === 'role' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Python Full Stack Developer"
              className="flex-1 bg-[#161C28] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
            <Button
              variant="primary"
              size="sm"
              loading={loadingRole}
              onClick={handleAnalyzeRole}
              icon={<Search className="w-3.5 h-3.5" />}
            >
              Analyze
            </Button>
          </div>

          {roleAnalysis && (
            <div className="space-y-4 pt-2 border-t border-white/10 animate-fadeIn">
              {/* Match Percentage Display */}
              <div className="p-3.5 bg-[#161C28] rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {roleAnalysis.label}
                  </span>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    For: <span className="text-white font-bold">{roleAnalysis.targetRole}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-cyan-400">
                    {roleAnalysis.matchPercentage}%
                  </span>
                </div>
              </div>

              {/* Matched Keywords */}
              <div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Matched Keywords ({roleAnalysis.matchedKeywords?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {roleAnalysis.matchedKeywords?.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded text-xs font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div>
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-2">
                  <XCircle className="w-3.5 h-3.5" />
                  Missing Keywords ({roleAnalysis.missingKeywords?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {roleAnalysis.missingKeywords?.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded text-xs font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mandatory Disclaimer */}
              <p className="text-[11px] text-slate-500 italic leading-relaxed bg-[#161C28]/40 p-2.5 rounded-lg border border-white/5">
                Note: {roleAnalysis.disclaimer}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Full Job Description Analysis */}
      {activeTab === 'jd' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Paste Complete Job Description
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting requirements, required tech stack, responsibilities..."
              className="w-full bg-[#161C28] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            fullWidth
            loading={loadingJd}
            onClick={handleAnalyzeJD}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Analyze Job Description
          </Button>

          {jdAnalysis && (
            <div className="space-y-4 pt-2 border-t border-white/10 animate-fadeIn">
              <div className="p-3.5 bg-[#161C28] rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Job Match Alignment
                  </span>
                  <span className="text-xs text-slate-300">
                    {jdAnalysis.experienceRequirements}
                  </span>
                </div>
                <span className="text-2xl font-black text-cyan-400">
                  {jdAnalysis.matchPercentage}%
                </span>
              </div>

              {/* Matched vs Missing */}
              <div className="space-y-3">
                {jdAnalysis.skillsMatched?.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-emerald-400 block mb-1.5">
                      ✓ Skills Found in Your Resume:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {jdAnalysis.skillsMatched.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {jdAnalysis.skillsMissing?.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-amber-400 block mb-1.5">
                      ⚠ Skills Needed for this Job:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {jdAnalysis.skillsMissing.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Changes */}
              {jdAnalysis.recommendedChanges?.length > 0 && (
                <div className="p-3 bg-[#161C28] rounded-xl border border-white/10 space-y-1.5">
                  <span className="text-xs font-bold text-slate-200 block">
                    Recommended Resume Changes:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {jdAnalysis.recommendedChanges.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick action: Tailor My Resume */}
              {onTailorClick && (
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  icon={<Sparkles className="w-4 h-4 text-cyan-400" />}
                  onClick={() => onTailorClick(jobDescription)}
                >
                  Tailor My Resume For This Job
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
