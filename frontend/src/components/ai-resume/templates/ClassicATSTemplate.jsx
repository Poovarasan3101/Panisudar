import React from 'react';

export default function ClassicATSTemplate({ data, resume }) {
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
    <div className="bg-white text-black p-8 sm:p-12 max-w-[850px] mx-auto shadow-xl rounded-sm font-serif leading-relaxed text-sm print:p-0 print:shadow-none print:max-w-none">
      {/* Header */}
      <div className="text-center border-b border-black pb-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase">
          {full_name || 'YOUR NAME'}
        </h1>
        {professional_title && (
          <p className="text-base font-medium italic mt-0.5">{professional_title}</p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs mt-2 text-neutral-800">
          {location && <span>{location}</span>}
          {phone && <span>• {phone}</span>}
          {email && <span>• {email}</span>}
          {linkedin && <span>• <a href={linkedin} className="underline text-black">LinkedIn</a></span>}
          {github && <span>• <a href={github} className="underline text-black">GitHub</a></span>}
          {portfolio && <span>• <a href={portfolio} className="underline text-black">Portfolio</a></span>}
        </div>
      </div>

      {/* Summary */}
      {summaryText && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-sans">
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-neutral-900">{summaryText}</p>
        </section>
      )}

      {/* Skills */}
      {skillList.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-sans">
            Core Competencies & Technical Skills
          </h2>
          <p className="text-xs leading-relaxed text-neutral-900">
            {skillList.join(' • ')}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-sans">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline text-xs font-bold">
                  <span>
                    {exp.jobTitle || 'Role'} <span className="font-normal italic">at {exp.company || 'Company'}</span>
                  </span>
                  <span className="font-normal text-neutral-700">
                    {exp.startDate ? `${exp.startDate} – ` : ''}
                    {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-[11px] text-neutral-600 italic">{exp.location}</p>
                )}
                {exp.responsibilities && (
                  <p className="text-xs text-neutral-900 mt-1 leading-relaxed whitespace-pre-line">
                    {exp.responsibilities}
                  </p>
                )}
                {exp.achievements && (
                  <p className="text-xs text-neutral-900 mt-0.5 italic">
                    Key Achievement: {exp.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-sans">
            Key Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline text-xs font-bold">
                  <span>
                    {proj.name}{' '}
                    {proj.technologies && (
                      <span className="font-normal text-neutral-600 italic">
                        ({proj.technologies})
                      </span>
                    )}
                  </span>
                  <div className="flex gap-2 text-[11px] font-normal">
                    {proj.githubUrl && <a href={proj.githubUrl} className="underline">Code</a>}
                    {proj.liveUrl && <a href={proj.liveUrl} className="underline">Live Demo</a>}
                  </div>
                </div>
                {proj.description && (
                  <p className="text-xs text-neutral-900 mt-0.5 leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-sans">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold">{edu.degree || 'Degree'}</span>
                  <p className="text-neutral-800">
                    {edu.college || edu.university || 'College / University'}
                    {edu.location && ` • ${edu.location}`}
                    {edu.grade && ` • Grade: ${edu.grade}`}
                  </p>
                </div>
                <span className="text-neutral-700 whitespace-nowrap">
                  {edu.startYear ? edu.startYear : ''}
                  {edu.endYear ? ` – ${edu.endYear}` : ''}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-sans">
            Certifications
          </h2>
          <ul className="list-disc list-inside text-xs space-y-0.5 text-neutral-900">
            {certifications.map((c, idx) => (
              <li key={idx}>
                <span className="font-semibold">{c.name}</span>
                {c.issuer && ` — ${c.issuer}`}
                {c.date && ` (${c.date})`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Achievements & Languages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-sans">
              Honors & Achievements
            </h2>
            <ul className="list-disc list-inside text-xs space-y-0.5 text-neutral-900">
              {achievements.map((a, idx) => (
                <li key={idx}>{typeof a === 'string' ? a : a.details || a.title}</li>
              ))}
            </ul>
          </section>
        )}

        {languages.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-sans">
              Languages
            </h2>
            <p className="text-xs text-neutral-900">
              {languages
                .map((l) => `${l.language || l}${l.proficiency ? ` (${l.proficiency})` : ''}`)
                .join(', ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
