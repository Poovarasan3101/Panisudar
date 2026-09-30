# Modern Full-Stack Job Portal Web Application

A clean, production-level, responsive **Job Portal Web Application** supporting two specialized roles:
1. **Job Seekers**
2. **Job Providers / Recruiters**

---

## 🛠 Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Lucide React, React Router v6, Axios
- **Architecture:** Decoupled service layer (`src/api/*`) for seamless transition between mock and Django REST Framework
- **Backend (API Ready):** Django & Django REST Framework ready schema & endpoints
- **Styling:** Custom Blue/Indigo design system with light backgrounds and high accessibility contrast
- **Responsiveness:** Full multi-breakpoint support (Desktop, Laptop, Tablet, Mobile)

---

## 🚀 One-Click Start

### Windows:
Double click or execute:
```cmd
start.bat
```

### Linux / macOS:
```bash
chmod +x start.sh
./start.sh
```

Or manually:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👥 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Job Seeker** | `arjun@example.com` | `Password123` |
| **Employer / Recruiter** | `priya@example.com` | `Password123` |

Quick-login demo autofill buttons are also provided directly on the `/login` page.

---

## 📂 Key Features & Pages

- **Home (`/`):** Hero section with keyword & location search, category cards, featured jobs, value props, statistics, CTA banners.
- **Find Jobs (`/jobs`):** Dedicated search page with multi-criteria sidebar filters (desktop) / drawer (mobile), dynamic sorting, and pagination.
- **Job Details (`/jobs/:id`):** In-depth role specification, responsibilities, requirements, skills pills, company details, fast apply, save, and share.
- **Companies (`/companies`):** Browse tech employers, industries, active vacancies, and company overviews.
- **Job Seeker Portal:**
  - `/job-seeker/dashboard` — Stats, profile health meter, application tracker, recommended jobs.
  - `/job-seeker/profile` — Comprehensive editable profile (Education, Experience, Projects, Certifications, Resume view/upload, Preferred roles, Additional details).
  - `/job-seeker/saved-jobs` — Bookmarked jobs list with one-click apply/unsave.
  - `/job-seeker/applications` — Status-filtered tracker (Applied, Under Review, Shortlisted, Interview, Rejected, Selected).
  - `/job-seeker/notifications` — Real-time updates and interview invites.
  - `/job-seeker/settings` — Privacy, visibility, and notification preferences.
- **Employer / Recruiter Portal:**
  - `/employer/dashboard` — Recruitment metrics, recent job listings, recent applicant feeds.
  - `/employer/post-job` — Multi-section job posting wizard with validation.
  - `/employer/my-jobs` — Active/Inactive toggle, job editor, deletion, application counts.
  - `/employer/applications` — Desktop table / Mobile card applicant management with status progression workflow.
  - `/employer/company-profile` — Brand profile customization.
  - `/employer/settings` — Recruiter credentials and preferences.
