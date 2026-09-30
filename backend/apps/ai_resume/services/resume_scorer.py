import re

ACTION_VERBS = {
    'developed', 'built', 'created', 'designed', 'engineered', 'implemented',
    'architected', 'scaled', 'optimized', 'delivered', 'led', 'managed',
    'orchestrated', 'streamlined', 'deployed', 'automated', 'integrated',
    'accelerated', 'transformed', 'collaborated', 'spearheaded', 'established'
}

ATS_CORE_KEYWORDS = {
    'python', 'react', 'javascript', 'typescript', 'django', 'node', 'sql',
    'postgresql', 'mongodb', 'docker', 'kubernetes', 'aws', 'rest api', 'graphql',
    'git', 'ci/cd', 'agile', 'frontend', 'backend', 'full stack', 'cloud',
    'microservices', 'html', 'css', 'tailwind', 'redux', 'linux', 'testing'
}

def _flatten_resume(resume_data):
    if not isinstance(resume_data, dict):
        return {}
    flat = dict(resume_data)
    personal = resume_data.get('personal_info') or {}
    if isinstance(personal, dict):
        for k, v in personal.items():
            if k not in flat or not flat[k]:
                flat[k] = v
    career = resume_data.get('career_info') or {}
    if isinstance(career, dict):
        if 'summary' in career and not flat.get('professional_summary'):
            flat['professional_summary'] = career['summary']
        if 'objective' in career and not flat.get('career_objective'):
            flat['career_objective'] = career['objective']
        if 'skills' in career and not flat.get('skills'):
            flat['skills'] = career['skills']
        if 'target_role' in career and not flat.get('professional_title'):
            flat['professional_title'] = career['target_role']
    return flat

def calculate_resume_score(raw_resume_data):
    """
    Calculates a transparent, multi-category resume score (0-100) based on:
    1. Contact Information - 10
    2. Professional Summary - 10
    3. Skills - 15
    4. Education - 10
    5. Experience - 15
    6. Projects - 15
    7. ATS Keywords - 10
    8. Resume Structure - 5
    9. Achievements - 5
    10. Overall Readability - 5
    """
    resume_data = _flatten_resume(raw_resume_data)
    breakdown = {}
    strengths = []
    improvements = []

    # 1. Contact Information (10 pts)
    contact_pts = 0
    full_name = str(resume_data.get('full_name') or '').strip()
    email = str(resume_data.get('email') or '').strip()
    phone = str(resume_data.get('phone') or '').strip()
    location = str(resume_data.get('location') or '').strip()
    links = [
        resume_data.get('linkedin'),
        resume_data.get('github'),
        resume_data.get('portfolio'),
    ]
    valid_links = [l for l in links if l and str(l).strip()]

    if full_name:
        contact_pts += 3
    if email and '@' in email:
        contact_pts += 2
    if phone:
        contact_pts += 2
    if location:
        contact_pts += 1
    if len(valid_links) >= 1:
        contact_pts += min(2, len(valid_links))

    contact_pts = min(10, contact_pts)
    breakdown['contact'] = {'score': contact_pts, 'max': 10, 'label': 'Contact Information'}

    if contact_pts >= 8:
        strengths.append("Complete, clear contact details and professional profile links.")
    else:
        improvements.append("Add full contact information (phone, location, and GitHub/LinkedIn links).")

    # 2. Professional Summary (10 pts)
    summary_pts = 0
    summary = str(resume_data.get('professional_summary') or resume_data.get('career_objective') or '').strip()
    words = re.findall(r'\b\w+\b', summary)
    word_count = len(words)

    if word_count >= 10:
        summary_pts += 3
    if word_count >= 25:
        summary_pts += 4
    if any(verb in summary.lower() for verb in ACTION_VERBS):
        summary_pts += 3

    summary_pts = min(10, summary_pts)
    breakdown['summary'] = {'score': summary_pts, 'max': 10, 'label': 'Professional Summary'}

    if summary_pts >= 7:
        strengths.append("Strong, impactful professional summary with relevant keywords.")
    else:
        improvements.append("Expand your professional summary into 2–3 sentences highlighting your career strengths.")

    # 3. Skills (15 pts)
    skills_pts = 0
    raw_skills = resume_data.get('skills') or []
    skill_names = []
    for s in raw_skills:
        if isinstance(s, dict):
            name = s.get('name') or ''
        else:
            name = str(s)
        if name.strip():
            skill_names.append(name.strip().lower())

    skill_count = len(skill_names)
    if skill_count >= 3:
        skills_pts += 5
    if skill_count >= 6:
        skills_pts += 5
    if skill_count >= 10:
        skills_pts += 5

    skills_pts = min(15, skills_pts)
    breakdown['skills'] = {'score': skills_pts, 'max': 15, 'label': 'Skills'}

    if skills_pts >= 12:
        strengths.append(f"Diverse technical proficiencies showcasing {skill_count} relevant skills.")
    else:
        improvements.append("Add more in-demand technical and domain-specific skills (target 8–12 skills).")

    # 4. Education (10 pts)
    edu_pts = 0
    education = resume_data.get('education') or []
    if isinstance(education, list) and len(education) > 0:
        edu_pts += 5
        has_institution = any(e.get('college') or e.get('institution') or e.get('university') for e in education if isinstance(e, dict))
        if has_institution:
            edu_pts += 3
        has_dates = any(e.get('startYear') or e.get('endYear') or e.get('year') for e in education if isinstance(e, dict))
        if has_dates:
            edu_pts += 2

    edu_pts = min(10, edu_pts)
    breakdown['education'] = {'score': edu_pts, 'max': 10, 'label': 'Education'}

    if edu_pts >= 8:
        strengths.append("Well-documented educational milestones with college name and graduation year.")
    else:
        improvements.append("Include your university degree, college name, and graduation dates.")

    # 5. Experience (15 pts)
    exp_pts = 0
    experience = resume_data.get('experience') or []
    if isinstance(experience, list) and len(experience) > 0:
        exp_pts += 6
        if len(experience) >= 2:
            exp_pts += 3
        has_details = any(e.get('responsibilities') or e.get('description') or e.get('achievements') for e in experience if isinstance(e, dict))
        if has_details:
            exp_pts += 4
        # check action verbs
        all_exp_text = " ".join([str(e.get('responsibilities', '')) + " " + str(e.get('description', '')) for e in experience if isinstance(e, dict)]).lower()
        if any(v in all_exp_text for v in ACTION_VERBS):
            exp_pts += 2

    exp_pts = min(15, exp_pts)
    breakdown['experience'] = {'score': exp_pts, 'max': 15, 'label': 'Work Experience'}

    if exp_pts >= 11:
        strengths.append("Solid work experience entries with designated responsibilities.")
    else:
        improvements.append("Detail your work history with bullet points highlighting responsibilities and tangible results.")

    # 6. Projects (15 pts)
    proj_pts = 0
    projects = resume_data.get('projects') or []
    if isinstance(projects, list) and len(projects) > 0:
        proj_pts += 6
        if len(projects) >= 2:
            proj_pts += 4
        has_proj_details = any(p.get('description') and len(str(p.get('description')).split()) >= 8 for p in projects if isinstance(p, dict))
        if has_proj_details:
            proj_pts += 3
        has_links_or_tech = any(p.get('technologies') or p.get('githubUrl') or p.get('liveUrl') for p in projects if isinstance(p, dict))
        if has_links_or_tech:
            proj_pts += 2

    proj_pts = min(15, proj_pts)
    breakdown['projects'] = {'score': proj_pts, 'max': 15, 'label': 'Key Projects'}

    if proj_pts >= 12:
        strengths.append("Detailed project portfolio demonstrating real-world problem-solving.")
    else:
        improvements.append("Showcase at least 2 practical technical projects with descriptions and tech stacks.")

    # 7. ATS Keywords (10 pts)
    ats_pts = 0
    all_text = (
        summary + " " +
        " ".join(skill_names) + " " +
        " ".join([str(p.get('description', '')) for p in projects if isinstance(p, dict)]) + " " +
        " ".join([str(e.get('responsibilities', '')) for e in experience if isinstance(e, dict)])
    ).lower()

    action_verb_count = sum(1 for v in ACTION_VERBS if v in all_text)
    matched_core = sum(1 for k in ATS_CORE_KEYWORDS if k in all_text)

    if action_verb_count >= 2:
        ats_pts += 3
    if action_verb_count >= 4:
        ats_pts += 2
    if matched_core >= 3:
        ats_pts += 3
    if matched_core >= 6:
        ats_pts += 2

    ats_pts = min(10, ats_pts)
    breakdown['ats_keywords'] = {'score': ats_pts, 'max': 10, 'label': 'ATS Keywords'}

    if ats_pts >= 7:
        strengths.append("High presence of ATS-friendly action verbs and technical keywords.")
    else:
        improvements.append("Incorporate more industry-standard keywords and active power verbs.")

    # 8. Resume Structure (5 pts)
    structure_pts = 0
    sections_present = 0
    if contact_pts >= 5: sections_present += 1
    if summary_pts >= 3: sections_present += 1
    if skills_pts >= 5: sections_present += 1
    if edu_pts >= 5: sections_present += 1
    if exp_pts >= 5 or proj_pts >= 5: sections_present += 1

    structure_pts = sections_present # 1 pt per core section, max 5
    breakdown['structure'] = {'score': structure_pts, 'max': 5, 'label': 'Resume Structure'}

    if structure_pts >= 4:
        strengths.append("Clean, standardized layout following ATS section ordering.")
    else:
        improvements.append("Ensure standard resume sections (Contact, Summary, Skills, Experience, Education) are complete.")

    # 9. Achievements & Certifications (5 pts)
    achieve_pts = 0
    achievements = resume_data.get('achievements') or []
    certifications = resume_data.get('certifications') or []

    if (isinstance(achievements, list) and len(achievements) > 0) or (isinstance(certifications, list) and len(certifications) > 0):
        achieve_pts += 3
        if len(achievements) + len(certifications) >= 2:
            achieve_pts += 2

    achieve_pts = min(5, achieve_pts)
    breakdown['achievements'] = {'score': achieve_pts, 'max': 5, 'label': 'Achievements & Certs'}

    if achieve_pts >= 3:
        strengths.append("Verified certifications and credentials bolster candidate credibility.")
    else:
        improvements.append("Add professional certifications or notable academic/workplace achievements.")

    # 10. Overall Readability (5 pts)
    readability_pts = 0
    total_words = len(re.findall(r'\b\w+\b', all_text))
    if 50 <= total_words <= 800:
        readability_pts += 3
    elif total_words > 0:
        readability_pts += 1

    # Check formatting consistency
    if len(skill_names) > 0 and (len(experience) > 0 or len(projects) > 0):
        readability_pts += 2

    readability_pts = min(5, readability_pts)
    breakdown['readability'] = {'score': readability_pts, 'max': 5, 'label': 'Overall Readability'}

    # Calculate Total
    total_score = sum(cat['score'] for cat in breakdown.values())

    return {
        'score': total_score,
        'breakdown': breakdown,
        'strengths': strengths,
        'improvements': improvements,
        'rating': (
            'Excellent' if total_score >= 85 else
            'Good' if total_score >= 70 else
            'Average' if total_score >= 50 else
            'Needs Work'
        ),
    }
