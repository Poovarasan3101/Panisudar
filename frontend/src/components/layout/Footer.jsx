import { Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Brand SVG Icons (lucide-react does not bundle brand icons)
───────────────────────────────────────────────────────────── */
function TwitterIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
    </svg>
  );
}

function LinkedinIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function GithubIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

import Logo from '@/components/common/Logo';

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-slate-400 hover:text-indigo-400 transition-colors duration-150 text-sm leading-relaxed"
    >
      {children}
    </Link>
  );
}

function FooterHeading({ children }) {
  return (
    <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
      {children}
    </h4>
  );
}

/* ─────────────────────────────────────────────────────────────
   Social icons config
───────────────────────────────────────────────────────────── */
const socialLinks = [
  {
    href: 'https://twitter.com',
    label: 'Twitter',
    Icon: TwitterIcon,
  },
  {
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    Icon: LinkedinIcon,
  },
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    Icon: FacebookIcon,
  },
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    Icon: InstagramIcon,
  },
  {
    href: 'https://github.com',
    label: 'GitHub',
    Icon: GithubIcon,
  },
];

/* ─────────────────────────────────────────────────────────────
   Link groups
───────────────────────────────────────────────────────────── */
const jobSeekerLinks = [
  { to: '/jobs', label: 'Find Jobs' },
  { to: '/companies', label: 'Companies' },
  { to: '/job-seeker/saved-jobs', label: 'Saved Jobs' },
  { to: '/job-seeker/applications', label: 'Applications' },
  { to: '/job-seeker/profile', label: 'My Profile' },
];

const employerLinks = [
  { to: '/employer/post-job', label: 'Post a Job' },
  { to: '/employer/my-jobs', label: 'Manage Jobs' },
  { to: '/employer/applications', label: 'Applications' },
  { to: '/employer/dashboard', label: 'Dashboard' },
  { to: '/employer/company-profile', label: 'Company Profile' },
];

const companyLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/blog', label: 'Blog' },
  { to: '/help', label: 'Help Center' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

/* ─────────────────────────────────────────────────────────────
   Main Footer
───────────────────────────────────────────────────────────── */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* ── Top CTA strip ── */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                Ready to take the next step in your career?
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Join thousands of professionals who found their dream job on Panisudar.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to="/jobs"
                className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors duration-150 text-center shadow-md shadow-indigo-900/30"
              >
                Browse Jobs
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 text-sm font-semibold border border-slate-600 hover:border-indigo-500 text-slate-300 hover:text-indigo-400 rounded-lg transition-colors duration-150 text-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 xl:col-span-1">
            <Logo variant="dark" size="lg" />
            <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-xs">
              Find the Right Career. Build Your Future with Panisudar — connecting ambitious talent
              with world-class companies.
            </p>

            {/* Contact blurbs */}
            <ul className="mt-5 space-y-2">
              <li className="flex items-center gap-2 text-slate-400 text-xs">
                <MapPin className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                Bangalore, Karnataka, India
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-xs">
                <Mail className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                contact@panisudar.com
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-xs">
                <Phone className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                +91 98765 43210
              </li>
            </ul>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-150"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — For Job Seekers */}
          <div>
            <FooterHeading>For Job Seekers</FooterHeading>
            <ul className="space-y-2.5">
              {jobSeekerLinks.map(({ to, label }) => (
                <li key={to}>
                  <FooterLink to={to}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — For Employers */}
          <div>
            <FooterHeading>For Employers</FooterHeading>
            <ul className="space-y-2.5">
              {employerLinks.map(({ to, label }) => (
                <li key={to}>
                  <FooterLink to={to}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Company */}
          <div>
            <FooterHeading>Company</FooterHeading>
            <ul className="space-y-2.5">
              {companyLinks.map(({ to, label }) => (
                <li key={to}>
                  <FooterLink to={to}>{label}</FooterLink>
                </li>
              ))}
            </ul>

            {/* App badges placeholder */}
            <div className="mt-6">
              <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold">
                Get the App
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group w-fit"
                >
                  <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                    📱 App Store
                  </span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group w-fit"
                >
                  <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                    🤖 Google Play
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: '50K+', label: 'Active Jobs' },
              { value: '12K+', label: 'Companies' },
              { value: '2M+', label: 'Job Seekers' },
              { value: '850K+', label: 'Hires Made' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-extrabold text-indigo-400">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs text-center sm:text-left">
            © {currentYear} Panisudar. All rights reserved. Empowering Careers Globally.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {[
              { to: '/privacy', label: 'Privacy Policy' },
              { to: '/terms', label: 'Terms' },
              { to: '/contact', label: 'Contact' },
              { to: '/sitemap', label: 'Sitemap' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-xs text-slate-500 hover:text-indigo-400 transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
