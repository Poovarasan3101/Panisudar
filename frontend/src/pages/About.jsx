import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import {
  Briefcase,
  Target,
  Compass,
  User,
  Users,
  ShieldCheck,
  TrendingUp,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Building2,
  Search,
  FileCheck,
  Zap,
  Globe2,
  HeartHandshake,
  Lock,
} from 'lucide-react';
import BorderGlow from '@/components/common/BorderGlow';

export default function About() {
  const [activeTab, setActiveTab] = useState('seekers');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const stats = [
    { value: '50,000+', label: 'Active Jobs', desc: 'Curated across top tech & business verticals' },
    { value: '12,000+', label: 'Verified Employers', desc: 'From fast-growing startups to Fortune 500s' },
    { value: '2.5M+', label: 'Talented Candidates', desc: 'Engineers, designers, managers & specialists' },
    { value: '98.4%', label: 'Placement Satisfaction', desc: 'Positive feedback from hiring teams & applicants' },
  ];

  const values = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-indigo-600" />,
      title: 'Uncompromised Transparency',
      desc: 'We mandate upfront salary bands, genuine role expectations, and zero ghosting. Candidates always know where they stand.',
    },
    {
      icon: <Target className="h-6 w-6 text-indigo-600" />,
      title: 'Merit-Driven Matching',
      desc: 'Our algorithms focus on verified skills, relevant experience, and culture fit — eliminating unconscious bias from hiring pipelines.',
    },
    {
      icon: <Zap className="h-6 w-6 text-indigo-600" />,
      title: 'Speed & Simplicity',
      desc: 'From 1-click applications to real-time interview coordination, we remove bureaucratic delays so teams can hire in days, not months.',
    },
    {
      icon: <Lock className="h-6 w-6 text-indigo-600" />,
      title: 'Data Privacy & Safety',
      desc: 'Every employer is verified before posting. Your resumes and contact information are protected by strict enterprise-grade encryption.',
    },
    {
      icon: <Globe2 className="h-6 w-6 text-indigo-600" />,
      title: 'Global Career Access',
      desc: 'Work from anywhere or locate top regional hubs. We support remote-first teams and international talent mobility seamlessly.',
    },
    {
      icon: <HeartHandshake className="h-6 w-6 text-indigo-600" />,
      title: 'Candidate-First Care',
      desc: 'We are committed to helping job seekers succeed with free portfolio tools, application trackers, and personalized career alerts.',
    },
  ];

  const seekerSteps = [
    {
      step: '01',
      title: 'Build Your Profile & Showcase Projects',
      desc: 'Highlight your technical proficiencies, education, certifications, and past experience in a clean, recruiter-friendly digital CV.',
      icon: <FileCheck className="h-5 w-5 text-indigo-600" />,
    },
    {
      step: '02',
      title: 'Discover Verified, High-Paying Roles',
      desc: 'Filter opportunities by tech stack, experience level, remote flexibility, and guaranteed compensation brackets.',
      icon: <Search className="h-5 w-5 text-indigo-600" />,
    },
    {
      step: '03',
      title: '1-Click Apply & Instant Confirmation',
      desc: 'Submit your resume with a single tap. Save job bookmarks and set up custom alerts for your dream companies.',
      icon: <Zap className="h-5 w-5 text-indigo-600" />,
    },
    {
      step: '04',
      title: 'Track Pipeline & Receive Direct Offers',
      desc: 'Monitor whether your application is viewed, shortlisted, or accepted. Communicate directly with decision makers.',
      icon: <Award className="h-5 w-5 text-indigo-600" />,
    },
  ];

  const employerSteps = [
    {
      step: '01',
      title: 'Publish Role in Under 3 Minutes',
      desc: 'Create clear job requirements with automated skill tagging, salary ranges, and custom screening questions.',
      icon: <Briefcase className="h-5 w-5 text-indigo-600" />,
    },
    {
      step: '02',
      title: 'Target Qualified, Pre-Vetted Talent',
      desc: 'Instantly surface active candidates whose skills and salary expectations match your job specifications.',
      icon: <Users className="h-5 w-5 text-indigo-600" />,
    },
    {
      step: '03',
      title: 'Manage Applications With KanBan Ease',
      desc: 'Review resumes, advance candidates from screening to interview, leave collaborative team notes, and send rejection feedback.',
      icon: <TrendingUp className="h-5 w-5 text-indigo-600" />,
    },
    {
      step: '04',
      title: 'Hire & Onboard High Performers',
      desc: 'Extend formal offers and onboard top talent faster while cutting recruitment overhead costs by up to 60%.',
      icon: <Building2 className="h-5 w-5 text-indigo-600" />,
    },
  ];

  const faqs = [
    {
      question: 'Is Panisudar completely free for job seekers?',
      answer:
        'Yes, Panisudar is 100% free for all candidates. You can search thousands of jobs, upload your resume, receive alerts, and submit unlimited applications without paying any subscription fees or hidden charges.',
    },
    {
      question: 'How does Panisudar verify employers and jobs?',
      answer:
        'Every employer account undergoes an automated and manual verification check. We check company domains, business registration documents, and authentic recruiter profiles to ensure no scam or illegitimate postings enter our platform.',
    },
    {
      question: 'Can I find remote and international jobs on the platform?',
      answer:
        'Absolutely. A substantial portion of our active listings offer fully remote, hybrid, or relocation-supported employment across North America, Europe, Asia-Pacific, and Latin America.',
    },
    {
      question: 'How does applicant tracking work for employers?',
      answer:
        'Employers receive an intuitive dashboard to manage candidate pipelines. You can review resumes, filter by qualification, move candidates through application stages, and message candidates directly.',
    },
    {
      question: 'How is candidate personal data protected?',
      answer:
        'We adhere to strict data privacy standards including GDPR and SOC2 compliance. Your contact details are only shared with employers whom you explicitly apply to or authorize.',
    },
    {
      question: 'Can I create both a job seeker and employer account?',
      answer:
        'Yes! Many founders and consultants both hire talent and explore advisory roles. You can register separate accounts using your personal and work email addresses.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-indigo-500/10 text-cyan-300 border border-indigo-500/30 mb-6">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Bridging Talent & Visionary Companies</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Empowering Careers, Accelerating{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Global Businesses
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Panisudar connects millions of ambitious professionals with world-class employers.
            We eliminate hiring friction through radical transparency, intelligent matching, and modern tools.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/jobs">
              <Button size="lg" variant="primary" iconRight={<ArrowRight className="h-4 w-4 ml-1" />}>
                Explore Open Jobs
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" icon={<Building2 className="h-4 w-4 mr-1 text-cyan-400" />}>
                Post a Job / Hire Talent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CORE STATS ── */}
      <section className="py-12 bg-[#10131A] border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {stats.map((s, idx) => (
              <div key={idx} className={`text-center ${idx > 0 ? 'pt-6 lg:pt-0' : ''}`}>
                <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400">{s.value}</p>
                <p className="text-sm font-bold text-white mt-1">{s.label}</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Card */}
            <BorderGlow
              edgeSensitivity={0}
              glowColor="40 80 80"
              backgroundColor="#120F17"
              borderRadius={34}
              glowRadius={60}
              glowIntensity={2.4}
              coneSpread={39}
              animated={false}
              colors={['#c084fc', '#f472b6', '#38bdf8']}
              className="h-full"
            >
              <div className="p-8 sm:p-10 rounded-[30px] h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-cyan-400 mb-6">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                  <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                    To democratize economic opportunity by making job discovery and talent acquisition
                    effortless, fair, and accessible to everyone. We believe great careers should not
                    depend on who you know, but on what you can build.
                  </p>
                  <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>Salary clarity and transparent job requirements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>Equal opportunity hiring regardless of background</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>Zero spam, verified company credentials only</span>
                    </li>
                  </ul>
                </div>
              </div>
            </BorderGlow>

            {/* Vision Card */}
            <BorderGlow
              edgeSensitivity={0}
              glowColor="40 80 80"
              backgroundColor="#120F17"
              borderRadius={34}
              glowRadius={60}
              glowIntensity={2.4}
              coneSpread={39}
              animated={false}
              colors={['#c084fc', '#f472b6', '#38bdf8']}
              className="h-full"
            >
              <div className="p-8 sm:p-10 rounded-[30px] h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-cyan-400 mb-6">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                  <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                    A connected global workplace where skilled individuals find roles that inspire
                    them, and companies scale their missions with confidence. We aspire to become the
                    most trusted employment network in the world.
                  </p>
                  <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>Seamless cross-border and remote talent workflows</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>AI-assisted skill verification and automated matching</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>Empowering lifelong career growth and mentorship</span>
                    </li>
                  </ul>
                </div>
              </div>
            </BorderGlow>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (SEEKERS VS EMPLOYERS) ── */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#10131A]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Simple, Transparent Workflow
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              How Panisudar Works
            </p>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Choose your perspective to see how our streamlined platform delivers results.
            </p>

            {/* Toggle Tabs */}
            <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-[#121620] border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('seekers')}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  activeTab === 'seekers'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="h-4 w-4" />
                <span>For Job Seekers</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('employers')}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  activeTab === 'employers'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>For Employers</span>
              </button>
            </div>
          </div>

          {/* Workflow Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeTab === 'seekers' ? seekerSteps : employerSteps).map((item, idx) => (
              <div
                key={idx}
                className="bg-[#121620] border border-white/10 rounded-2xl p-6 relative hover:border-cyan-500/40 shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-700 group-hover:text-cyan-400/50 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to={activeTab === 'seekers' ? '/jobs' : '/signup'}>
              <Button variant="primary" size="md" iconRight={<ArrowRight className="h-4 w-4 ml-1" />}>
                {activeTab === 'seekers' ? 'Find Your Next Role' : 'Start Sourcing Talent'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Guiding Principles
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              Our Core Values
            </p>
            <p className="mt-3 text-slate-400 text-sm">
              The foundational commitments that govern every product decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, idx) => (
              <BorderGlow
                key={idx}
                edgeSensitivity={0}
                glowColor="40 80 80"
                backgroundColor="#120F17"
                borderRadius={34}
                glowRadius={60}
                glowIntensity={2.4}
                coneSpread={39}
                animated={false}
                colors={['#c084fc', '#f472b6', '#38bdf8']}
                className="h-full"
              >
                <div className="p-6 sm:p-7 rounded-[30px] h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-cyan-400 mb-5">
                      {v.icon}
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{v.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#10131A]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Got Questions?
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              Frequently Asked Questions
            </p>
            <p className="mt-3 text-slate-400 text-sm">
              Everything you need to know about navigating Panisudar as a seeker or employer.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-white/10 rounded-2xl overflow-hidden bg-[#121620] transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#161C28] transition-colors"
                  >
                    <span className="text-sm sm:text-base font-semibold text-white pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 bg-[#161C28]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            Have more questions?{' '}
            <Link to="/contact" className="text-cyan-400 font-semibold hover:underline">
              Contact our 24/7 support team
            </Link>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ── */}
      <section className="bg-gradient-to-r from-indigo-900/40 via-[#10131A] to-cyan-950/40 border-t border-white/10 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take the Next Step in Your Career?
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Join over 2.5 million professionals and 12,000 top companies who rely on Panisudar.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup">
              <Button
                variant="primary"
                size="lg"
                className="font-semibold shadow-lg shadow-indigo-600/25"
              >
                Sign Up for Free
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
              >
                Contact Sales & Partnerships
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
