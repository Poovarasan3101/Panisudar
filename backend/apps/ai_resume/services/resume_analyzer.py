import re

# Comprehensive dictionary of role-to-keyword clusters
ROLE_KEYWORDS_DB = {
    'python': [
        'Python', 'Django', 'FastAPI', 'Flask', 'REST API', 'PostgreSQL', 'MySQL',
        'Redis', 'Celery', 'Docker', 'Git', 'Linux', 'Unit Testing', 'AWS'
    ],
    'react': [
        'React', 'JavaScript', 'TypeScript', 'Redux', 'HTML5', 'CSS3', 'Tailwind CSS',
        'Next.js', 'REST API', 'Webpack', 'Vite', 'Git', 'Responsive Design', 'Jest'
    ],
    'frontend': [
        'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Tailwind CSS',
        'Responsive Design', 'State Management', 'REST API', 'Web Performance', 'Git'
    ],
    'backend': [
        'Node.js', 'Python', 'Java', 'Django', 'Express', 'SQL', 'PostgreSQL',
        'MongoDB', 'REST API', 'Microservices', 'Docker', 'AWS', 'Authentication', 'Git'
    ],
    'full stack': [
        'React', 'Node.js', 'Python', 'Django', 'JavaScript', 'TypeScript', 'PostgreSQL',
        'MongoDB', 'REST API', 'Docker', 'Git', 'AWS', 'Tailwind CSS', 'CI/CD'
    ],
    'data science': [
        'Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'Machine Learning',
        'TensorFlow', 'Data Visualization', 'Tableau', 'Statistics', 'Jupyter', 'Git'
    ],
    'devops': [
        'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux', 'Jenkins',
        'Git', 'Bash', 'Prometheus', 'Grafana', 'Security', 'CloudFormation'
    ],
}

COMMON_TECH_PATTERNS = [
    r'\bpython\b', r'\bjavascript\b', r'\btypescript\b', r'\breact(?:\.js)?\b',
    r'\bvue(?:\.js)?\b', r'\bangular\b', r'\bnode(?:\.js)?\b', r'\bdjango\b',
    r'\bflask\b', r'\bfastapi\b', r'\bspring\s*boot\b', r'\bjava\b', r'\bhtml(?:5)?\b',
    r'\bcss(?:3)?\b', r'\btailwind\b', r'\bbootstrap\b', r'\bpostgres(?:ql)?\b',
    r'\bmysql\b', r'\bmongodb\b', r'\bredis\b', r'\bdocker\b', r'\bkubernetes\b',
    r'\baws\b', r'\bazure\b', r'\bgcp\b', r'\bgit\b', r'\bci\/cd\b', r'\brest(?:ful)?\s*api\b',
    r'\bgraphql\b', r'\blinux\b', r'\bterraform\b', r'\bjenkins\b', r'\bkafka\b'
]

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

def extract_resume_all_text(raw_resume_data):
    """Combines all resume text for keyword and text scanning."""
    resume_data = _flatten_resume(raw_resume_data)
    parts = [
        str(resume_data.get('full_name') or ''),
        str(resume_data.get('professional_title') or ''),
        str(resume_data.get('career_objective') or ''),
        str(resume_data.get('professional_summary') or ''),
    ]
    # skills
    for s in resume_data.get('skills') or []:
        if isinstance(s, dict):
            parts.append(str(s.get('name') or ''))
        else:
            parts.append(str(s))

    # experience
    for e in resume_data.get('experience') or []:
        if isinstance(e, dict):
            parts.append(str(e.get('title') or ''))
            parts.append(str(e.get('company') or ''))
            parts.append(str(e.get('responsibilities') or ''))
            parts.append(str(e.get('description') or ''))

    # projects
    for p in resume_data.get('projects') or []:
        if isinstance(p, dict):
            parts.append(str(p.get('name') or ''))
            parts.append(str(p.get('description') or ''))
            parts.append(str(p.get('technologies') or ''))

    # education
    for edu in resume_data.get('education') or []:
        if isinstance(edu, dict):
            parts.append(str(edu.get('degree') or ''))
            parts.append(str(edu.get('college') or edu.get('institution') or ''))

    return " ".join(parts).lower()

def analyze_target_job_keywords(resume_data, target_role=""):
    """
    Analyzes resume against a target job role.
    Returns matched keywords, missing keywords, and match % labeled as
    'AI ATS Compatibility Estimate'.
    """
    resume_text = extract_resume_all_text(resume_data)
    role_lower = (target_role or resume_data.get('target_role') or resume_data.get('professional_title') or 'Full Stack Developer').lower()

    # Find closest keyword cluster or synthesize one
    expected_keywords = []
    for key, kw_list in ROLE_KEYWORDS_DB.items():
        if key in role_lower:
            expected_keywords.extend(kw_list)

    if not expected_keywords:
        # Fallback to general tech stack
        expected_keywords = ROLE_KEYWORDS_DB['full stack']

    # Deduplicate preserving order
    seen = set()
    unique_expected = [k for k in expected_keywords if not (k.lower() in seen or seen.add(k.lower()))]

    matched = []
    missing = []

    for kw in unique_expected:
        # check presence with word boundary or substring
        kw_clean = kw.lower().replace('.', r'\.').replace('+', r'\+')
        if re.search(r'\b' + kw_clean + r'\b', resume_text, re.IGNORECASE) or kw.lower() in resume_text:
            matched.append(kw)
        else:
            missing.append(kw)

    total = len(unique_expected)
    matched_count = len(matched)
    match_percentage = round((matched_count / total * 100)) if total > 0 else 50

    return {
        'targetRole': target_role or "Software Developer",
        'target_role': target_role or "Software Developer",
        'matchPercentage': match_percentage,
        'match_percentage': match_percentage,
        'matchedKeywords': matched,
        'matched_keywords': matched,
        'missingKeywords': missing,
        'missing_keywords': missing,
        'label': 'AI ATS Compatibility Estimate',
        'disclaimer': 'This is an AI ATS Compatibility Estimate for guidance and optimization purposes, not an official corporate ATS score.'
    }

def analyze_job_description(resume_data, job_description):
    """
    Parses a pasted Job Description, extracts key requirements,
    and compares against the candidate's resume.
    """
    if not job_description or not job_description.strip():
        return {
            'error': 'Please provide a valid Job Description to analyze.'
        }

    jd_text = job_description.strip()
    jd_lower = jd_text.lower()
    resume_text = extract_resume_all_text(resume_data)

    # 1. Extract Technologies & Skills from JD
    extracted_skills = []
    for pattern in COMMON_TECH_PATTERNS:
        matches = re.findall(pattern, jd_lower)
        for m in matches:
            formatted = m.title()
            if formatted.lower() == 'react': formatted = 'React.js'
            if formatted.lower() == 'node': formatted = 'Node.js'
            if formatted.lower() == 'aws': formatted = 'AWS'
            if formatted.lower() == 'sql': formatted = 'SQL'
            if formatted.lower() == 'ci/cd': formatted = 'CI/CD'
            if formatted.lower() == 'html': formatted = 'HTML5'
            if formatted.lower() == 'css': formatted = 'CSS3'
            if formatted.lower() == 'rest api' or formatted.lower() == 'restful api': formatted = 'REST APIs'
            if formatted not in extracted_skills:
                extracted_skills.append(formatted)

    # 2. Extract Experience Requirements (e.g. "3+ years", "2-5 years", "fresher")
    exp_matches = re.findall(r'(\d+[\+]?\s*(?:to|-)?\s*\d*\s*(?:years?|yrs?|months?)\s*(?:of)?\s*(?:experience)?)', jd_lower)
    exp_requirement = exp_matches[0].strip() if exp_matches else "Experience level specified in job posting"

    # 3. Extract Education Requirements (e.g. "B.Tech", "Bachelor", "Master", "Degree")
    edu_matches = re.findall(r'\b(b\.?tech|b\.?e|m\.?tech|m\.?s|bca|mca|bachelor(?:\'s)?|master(?:\'s)?|degree in computer science)\b', jd_lower)
    edu_requirement = ", ".join(sorted(set([m.upper() for m in edu_matches]))) if edu_matches else "Bachelor's Degree or equivalent"

    # 4. Compare with Resume
    skills_matched = []
    skills_missing = []

    for s in extracted_skills:
        s_clean = s.lower().replace('.', r'\.').replace('+', r'\+')
        if re.search(r'\b' + s_clean + r'\b', resume_text, re.IGNORECASE) or s.lower() in resume_text:
            skills_matched.append(s)
        else:
            skills_missing.append(s)

    total_req_skills = len(extracted_skills) or 1
    match_percentage = min(100, round((len(skills_matched) / total_req_skills) * 100))

    # Recommendations
    recommended_changes = []
    if skills_missing:
        missing_preview = ", ".join(skills_missing[:5])
        recommended_changes.append(f"Add relevant missing skills mentioned in the job post: {missing_preview}.")
    if "api" in jd_lower and "api" not in resume_text:
        recommended_changes.append("Highlight your experience developing or consuming RESTful APIs.")
    if "performance" in jd_lower and "performance" not in resume_text:
        recommended_changes.append("Mention web application performance optimizations in your project descriptions.")
    if len(recommended_changes) == 0:
        recommended_changes.append("Your resume aligns well with this job posting. Ensure your summary references the company's core technology stack.")

    return {
        'matchPercentage': match_percentage,
        'match_percentage': match_percentage,
        'requiredSkills': extracted_skills[:12],
        'required_skills': extracted_skills[:12],
        'preferredSkills': extracted_skills[12:18],
        'preferred_skills': extracted_skills[12:18],
        'experienceRequirements': exp_requirement,
        'experience_requirements': exp_requirement,
        'educationRequirements': edu_requirement,
        'education_requirements': edu_requirement,
        'skillsMatched': skills_matched,
        'skills_matched': skills_matched,
        'skillsMissing': skills_missing,
        'skills_missing': skills_missing,
        'recommendedChanges': recommended_changes,
        'recommended_changes': recommended_changes,
        'label': 'Job Match Analysis',
    }
