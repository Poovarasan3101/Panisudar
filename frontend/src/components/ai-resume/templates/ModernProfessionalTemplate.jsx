import React from 'react';
import { Mail, Phone, MapPin, Globe, Award, CheckCircle } from 'lucide-react';

export default function ModernProfessionalTemplate({ data, resume }) {
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
    <div className="bg-white text-slate-900 p-8 sm:p-12 max-w-[850px] mx-auto shadow-2xl rounded-xl font-sans leading-relaxed text-sm print:p-0 print:shadow-none print:max-w-none print:rounded-none">
      {/* Header Banner */}
      <div className="border-b-2 border-indigo-600 pb-5 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            {full_name || 'Your Full Name'}
          </h1>
          <p className="text-base font-semibold text-indigo-600 mt-0.5">
            {professional_title || 'Software Engineering Professional'}
          </p>
        </div>

        {/* Contact Links */}
        <div className="text-xs space-y-1 text-slate-600 sm:text-right">
          <div className="flex sm:justify-end items-center gap-1.5">
            {email && <span>{email}</span>}
            {phone && <span>• {phone}</span>}
          </div>
          {location && <p>{location}</p>}
          <div className="flex flex-wrap sm:justify-end gap-2.5 pt-1 text-[11px] font-medium text-indigo-600">
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                LinkedIn
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noreferrer" className="hover:underline">
                GitHub
              </a>
            )}
            {portfolio && (
              <a href={portfolio} target="_blank" rel="noreferrer" className="hover:underline">
                Portfolio
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: 2-column on desktop for modern aesthetic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (Main 2 cols) */}
        <div className="md:col-span-2 space-y-5">
          {/* Summary */}
          {summaryText && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2">
                Executive Profile
              </h2>
              <p className="text-xs leading-relaxed text-slate-700">{summaryText}</p>
            </section>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-3">
                Professional Experience
              </h2>
              <div className="space-y-3.5">
                {experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-3 border-l-2 border-indigo-200">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {exp.jobTitle || 'Role'}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-500">
                        {exp.startDate ? `${exp.startDate} – ` : ''}
                        {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-600">
                      {exp.company}
                      {exp.location && <span className="text-slate-500 font-normal"> • {exp.location}</span>}
                    </p>
                    {exp.responsibilities && (
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-line">
                        {exp.responsibilities}
                      </p>
                    )}
                    {exp.achievements && (
                      <p className="text-xs text-slate-800 mt-1 font-medium bg-slate-50 p-1.5 rounded border border-slate-100">
                        ⭐ {exp.achievements}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-3">
                Featured Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-xs text-slate-900">{proj.name}</h4>
                      <div className="flex gap-2 text-[10px] font-semibold text-indigo-600">
                        {proj.githubUrl && <a href={proj.githubUrl} className="hover:underline">Repository</a>}
                        {proj.liveUrl && <a href={proj.liveUrl} className="hover:underline">Live Preview</a>}
                      </div>
                    </div>
                    {proj.technologies && (
                      <p className="text-[11px] text-indigo-700 font-medium mt-0.5">
                        {proj.technologies}
                      </p>
                    )}
                    {proj.description && (
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar Column (1 col) */}
        <div className="space-y-5">
          {/* Skills */}
          {skillList.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2.5">
                Competencies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skillList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2.5">
                Education
              </h2>
              <div className="space-y-2.5">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-600 font-medium">
                      {edu.college || edu.university}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {edu.startYear ? edu.startYear : ''}
                      {edu.endYear ? ` – ${edu.endYear}` : ''}
                      {edu.grade && ` • ${edu.grade}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2">
                Certifications
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {certifications.map((c, idx) => (
                  <div key={idx}>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {c.issuer}{c.date ? ` • ${c.date}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2">
                Key Honors
              </h2>
              <ul className="text-xs space-y-1 text-slate-700">
                {achievements.map((ach, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-amber-500 shrink-0">★</span>
                    <span>{typeof ach === 'string' ? ach : ach.details || ach.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2">
                Languages
              </h2>
              <div className="text-xs text-slate-700 space-y-0.5">
                {languages.map((l, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="font-medium text-slate-900">{l.language || l}</span>
                    <span className="text-slate-500">{l.proficiency || 'Proficient'}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
