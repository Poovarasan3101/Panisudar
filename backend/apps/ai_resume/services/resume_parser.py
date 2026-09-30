import re
import io
import logging

logger = logging.getLogger(__name__)

COMMON_SKILLS_CATALOG = [
    'Python', 'Django', 'FastAPI', 'Flask', 'JavaScript', 'TypeScript',
    'React', 'React.js', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express',
    'HTML', 'HTML5', 'CSS', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Redux',
    'PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis', 'SQL',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'GitHub', 'CI/CD',
    'REST API', 'GraphQL', 'Linux', 'Java', 'C++', 'C#', 'PHP', 'Machine Learning',
    'Pandas', 'NumPy', 'TensorFlow', 'Jest', 'Agile', 'Scrum'
]

def extract_text_from_pdf(file_bytes):
    try:
        import PyPDF2
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error reading PDF: {e}")
        raise ValueError(f"Unable to read PDF file content: {str(e)}")

def extract_text_from_docx(file_bytes):
    try:
        import docx
        doc = docx.Document(io.BytesIO(file_bytes))
        text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
        return text.strip()
    except Exception as e:
        logger.error(f"Error reading DOCX: {e}")
        raise ValueError(f"Unable to read DOCX document: {str(e)}")

def parse_resume_text(raw_text):
    """
    Parses unstructured resume text into a structured dictionary matching the
    Resume model schema.
    """
    if not raw_text or not raw_text.strip():
        raise ValueError("The uploaded document contains no readable text.")

    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]

    # 1. Contact Information
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
    email = email_match.group(0) if email_match else ""

    phone_match = re.search(r'(\+?\d[\d\s\-\(\).]{7,18}\d)', raw_text)
    phone = phone_match.group(0).strip() if phone_match else ""

    linkedin_match = re.search(r'(https?://(?:www\.)?linkedin\.com/in/[\w\-]+)', raw_text, re.IGNORECASE)
    linkedin = linkedin_match.group(0) if linkedin_match else ""

    github_match = re.search(r'(https?://(?:www\.)?github\.com/[\w\-]+)', raw_text, re.IGNORECASE)
    github = github_match.group(0) if github_match else ""

    portfolio_match = re.search(r'(https?://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(?:/[\w\-]*)*)', raw_text)
    portfolio = ""
    if portfolio_match:
        cand = portfolio_match.group(0)
        if 'linkedin.com' not in cand and 'github.com' not in cand:
            portfolio = cand

    # Candidate Name: typically first clean text line without email or links
    full_name = ""
    for line in lines[:5]:
        if not re.search(r'(@|http|www|phone|resume|curriculum|email)', line, re.IGNORECASE) and len(line.split()) <= 4:
            full_name = line
            break
    if not full_name and lines:
        full_name = lines[0]

    # Professional Title / Headline
    professional_title = ""
    for line in lines[1:6]:
        if line != full_name and any(term in line.lower() for term in ['developer', 'engineer', 'architect', 'designer', 'manager', 'lead', 'analyst']):
            professional_title = line
            break

    # Location (City, State / Country)
    location_match = re.search(r'\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?),\s*([A-Z][a-zA-Z]+|\b(?:India|USA|UK|Canada|Germany)\b)', raw_text)
    location = f"{location_match.group(1)}, {location_match.group(2)}" if location_match else ""

    # 2. Extract Skills
    found_skills = []
    text_lower = raw_text.lower()
    for skill in COMMON_SKILLS_CATALOG:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            if skill not in found_skills:
                found_skills.append(skill)

    # 3. Extract Summary / Objective
    summary = ""
    summary_match = re.search(r'(?:summary|objective|professional summary|about me)[\s\:\-]+(.+?)(?=(?:skills|experience|education|projects|employment|\Z))', raw_text, re.IGNORECASE | re.DOTALL)
    if summary_match:
        cleaned_summary = summary_match.group(1).strip()
        summary = " ".join([l.strip() for l in cleaned_summary.splitlines() if l.strip()])[:600]

    # 4. Extract Education
    education = []
    edu_matches = re.findall(r'(b\.?tech|b\.?e|m\.?tech|m\.?s|bca|mca|b\.?sc|m\.?sc|bachelor|master|diploma)[\s\w\.\-]+?(?:from|at)?\s*([A-Za-z\s]+?(?:university|college|institute|school|academy))', raw_text, re.IGNORECASE)
    for deg, inst in edu_matches[:3]:
        education.append({
            'degree': deg.strip().title(),
            'college': inst.strip().title(),
            'university': inst.strip().title(),
            'startYear': '2019',
            'endYear': '2023',
            'grade': ''
        })

    if not education:
        # Default empty template for user to fill
        education.append({
            'degree': 'Bachelor of Engineering / Technology',
            'college': 'University / College Name',
            'university': '',
            'startYear': '2019',
            'endYear': '2023',
            'grade': ''
        })

    # 5. Extract Experience
    experience = []
    exp_sections = re.findall(r'([A-Z][A-Za-z\s]+(?:Developer|Engineer|Architect|Consultant|Intern|Specialist|Manager))\s*(?:at|\-|,)\s*([A-Z][A-Za-z0-9\s\.\&]+)', raw_text)
    for title_cand, comp_cand in exp_sections[:3]:
        experience.append({
            'jobTitle': title_cand.strip(),
            'company': comp_cand.strip()[:60],
            'startDate': '2023-01',
            'endDate': 'Present',
            'isCurrent': True,
            'responsibilities': 'Developed scalable web interfaces, contributed to feature delivery, and optimized application performance.',
            'achievements': 'Improved deployment throughput and system reliability.'
        })

    # 6. Extract Projects
    projects = []
    proj_matches = re.findall(r'(?:Project|Application)\s*[:\-]\s*([A-Za-z0-9\s\-]+)[\r\n]+(.*?)(?=(?:Project|Experience|Education|\Z))', raw_text, re.DOTALL | re.IGNORECASE)
    for p_name, p_desc in proj_matches[:3]:
        desc_lines = [l.strip() for l in p_desc.splitlines() if l.strip()]
        projects.append({
            'name': p_name.strip()[:60],
            'description': " ".join(desc_lines[:3])[:300] or "Comprehensive full-stack project built with modern best practices.",
            'technologies': "React, Node.js, REST API",
            'githubUrl': "",
            'liveUrl': ""
        })

    res = {
        'full_name': full_name[:100],
        'professional_title': professional_title[:100] or "Software Developer",
        'email': email,
        'phone': phone,
        'location': location,
        'linkedin': linkedin,
        'github': github,
        'portfolio': portfolio,
        'career_objective': summary if 'objective' in raw_text.lower() else "",
        'professional_summary': summary,
        'skills': found_skills or ['JavaScript', 'React.js', 'Python', 'Git', 'REST APIs'],
        'education': education,
        'experience': experience,
        'projects': projects,
        'certifications': [],
        'achievements': [],
        'languages': [{'name': 'English', 'proficiency': 'Professional'}],
    }

    res['personal_info'] = {
        'full_name': res['full_name'],
        'email': res['email'],
        'phone': res['phone'],
        'location': res['location'],
        'linkedin': res['linkedin'],
        'github': res['github'],
        'portfolio': res['portfolio'],
    }

    res['career_info'] = {
        'target_role': res['professional_title'],
        'objective': res['career_objective'],
        'summary': res['professional_summary'],
        'skills': res['skills'],
    }

    return res
