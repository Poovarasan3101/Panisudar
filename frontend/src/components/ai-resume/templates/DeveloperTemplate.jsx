import React from 'react';
import { Terminal, Code, Cpu, ExternalLink, GitBranch, Database, ShieldCheck } from 'lucide-react';

export default function DeveloperTemplate({ data, resume }) {
  const source = resume || data || {};
  const personal = source.personal_info || {};
  const career = source.career_info || {};

  const full_name = source.full_name || personal.full_name;
  const professional_title = source.professional_title || career.target_role;
  const email = source.email || personal.email;
  const phone = source.phone || personal.phone;
  const location = source.location || personal.location;
  const linkedin = source.linkedin || personal.linkedin;
  const github = source.github || personal.github;
  const portfolio = source.portfolio || personal.portfolio;
  const professional_summary = source.professional_summary || career.summary;
  const career_objective = source.career_objective || career.objective;
  const skills = source.skills || career.skills || [];
  const experience = source.experience || [];
  const projects = source.projects || [];
  const education = source.education || [];
  const certifications = source.certifications || [];
  const achievements = source.achievements || [];
  const languages = source.languages || [];

  const summaryText = professional_summary || career_objective;

  const skillList = Array.isArray(skills)
    ? skills.map((s) => (typeof s === 'string' ? s : s?.name || '')).filter(Boolean)
    : [];

  return (
    <div className="bg-[#0f172a] text-slate-200 p-8 sm:p-12 max-w-[850px] mx-auto shadow-2xl rounded-xl font-sans leading-relaxed text-sm border border-slate-800 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none print:max-w-none">
      {/* Top Terminal-style Header */}
      <div className="border-b border-cyan-500/30 pb-5 mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-cyan-400 text-xs">// candidate_profile.json</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {full_name || 'DEVELOPER_NAME'}
            </h1>
            <p className="text-sm font-semibold text-cyan-400 mt-0.5 font-mono">
              &gt; {professional_title || 'Full Stack Engineer'}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 text-xs text-slate-300 font-mono">
            {email && <span>{email}</span>}
            {phone && <span>{phone}</span>}
            {location && <span>{location}</span>}
          </div>
        </div>

        {/* Links row */}
        <div className="flex flex-wrap gap-3 pt-2 text-xs font-mono text-cyan-300">
          {github && (
            <a href={github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
              <span>gh:</span> {github.replace('https://github.com/', '')}
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
              <span>in:</span> {linkedin.replace('https://linkedin.com/in/', '')}
            </a>
          )}
          {portfolio && (
            <a href={portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
              <span>web:</span> {portfolio.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {summaryText && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-400 mb-1.5 flex items-center gap-1.5">
            <span>#</span> Engineering Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            {summaryText}
          </p>
        </section>
      )}

      {/* Skills Grid */}
      {skillList.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-400 mb-2 flex items-center gap-1.5">
            <span>#</span> Tech Stack & Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skillList.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded bg-slate-800/80 text-cyan-300 border border-cyan-500/20 text-xs font-mono"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-400 mb-2 flex items-center gap-1.5">
            <span>#</span> Work Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp, idx) => (
              <div key={idx} className="bg-slate-900/40 p-3.5 rounded-lg border border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white text-sm">
                    {exp.jobTitle || 'Engineer'} <span className="text-cyan-400">@ {exp.company || 'Company'}</span>
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {exp.startDate ? `${exp.startDate} – ` : ''}
                    {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.responsibilities && (
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed whitespace-pre-line">
                    {exp.responsibilities}
                  </p>
                )}
                {exp.achievements && (
                  <div className="mt-1.5 text-xs text-emerald-400 font-mono">
                    ✓ Impact: {exp.achievements}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-400 mb-2 flex items-center gap-1.5">
            <span>#</span> Key Projects & Deployments
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-xs font-mono">{proj.name}</h3>
                  <div className="flex gap-3 text-xs font-mono text-cyan-400">
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="hover:underline">&lt;repo/&gt;</a>}
                    {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="hover:underline">&lt;demo/&gt;</a>}
                  </div>
                </div>
                {proj.technologies && (
                  <p className="text-[11px] text-cyan-300/80 font-mono mt-0.5">
                    Stack: {proj.technologies}
                  </p>
                )}
                {proj.description && (
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-400 mb-1.5 flex items-center gap-1.5">
              <span>#</span> Education
            </h2>
            <div className="space-y-2 text-xs">
              {education.map((edu, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-900/30 border border-slate-800">
                  <p className="font-bold text-white">{edu.degree}</p>
                  <p className="text-slate-400">{edu.college || edu.university}</p>
                  <p className="text-[11px] font-mono text-slate-500">
                    {edu.startYear ? edu.startYear : ''}
                    {edu.endYear ? ` – ${edu.endYear}` : ''}
                    {edu.grade && ` • ${edu.grade}`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(certifications.length > 0 || achievements.length > 0) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-400 mb-1.5 flex items-center gap-1.5">
              <span>#</span> Certifications & Awards
            </h2>
            <div className="space-y-1.5 text-xs">
              {certifications.map((c, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/30 border border-slate-800">
                  <span className="font-bold text-slate-200">{c.name}</span>
                  {c.issuer && <span className="text-slate-400"> — {c.issuer}</span>}
                  {c.date && <span className="text-[10px] font-mono text-slate-500"> ({c.date})</span>}
                </div>
              ))}
              {achievements.map((a, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/30 border border-slate-800 text-amber-400 font-mono text-xs">
                  ★ {typeof a === 'string' ? a : a.details || a.title}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
