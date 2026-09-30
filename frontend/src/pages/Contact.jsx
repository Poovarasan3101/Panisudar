import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import BorderGlow from '@/components/common/BorderGlow';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Sparkles,
  User,
  Headphones,
} from 'lucide-react';

export default function Contact() {
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'job_seeker',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const subjectOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support & Troubleshooting' },
    { value: 'employer', label: 'Employer & Recruiter Partnerships' },
    { value: 'billing', label: 'Billing & Subscription Questions' },
    { value: 'listing_report', label: 'Report a Job Listing or Account' },
    { value: 'feature_request', label: 'Feedback & Feature Suggestions' },
  ];

  const userTypeOptions = [
    { id: 'job_seeker', label: 'Job Seeker' },
    { id: 'employer', label: 'Employer / Recruiter' },
    { id: 'other', label: 'Other' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select an inquiry subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message cannot be empty';
    } else if (formData.message.trim().length < 15) {
      newErrors.message = 'Please provide more details (minimum 15 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Simulate backend API latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSubmitted(true);
      if (toast?.success) {
        toast.success(
          'Message Dispatched!',
          'Thank you for reaching out. Our support team will reply within 2 hours.'
        );
      }

      // Reset form fields
      setFormData({
        name: '',
        email: '',
        userType: 'job_seeker',
        subject: '',
        message: '',
      });
      setErrors({});
    } catch {
      if (toast?.error) {
        toast.error('Submission Failed', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 py-12 sm:py-16 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-cyan-300 border border-indigo-500/30 mb-4">
            <Headphones className="h-4 w-4 text-cyan-400" />
            <span>24/7 Global Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            We’d Love to Hear From You
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Have questions about finding a job, hiring candidates, or platform features?
            Our dedicated support specialists are here to guide you every step of the way.
          </p>
        </div>

        {/* ── TWO-COLUMN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Contact Form (7 cols) */}
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
            className="lg:col-span-7 h-full"
          >
            <div className="p-6 sm:p-10 rounded-[30px] h-full">
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Send us a Message</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fill out the form below and we will respond directly to your email.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Typical response: &lt; 2h</span>
              </div>
            </div>

            {/* Success State Banner */}
            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-bold text-white">Thank you for contacting Panisudar!</p>
                  <p className="text-xs text-emerald-300/80 mt-1">
                    Your inquiry has been logged in our support queue. A representative will get in
                    touch with you shortly at your designated email address.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-semibold text-cyan-400 underline hover:text-cyan-300"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Role / User Type Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  I am contacting as a:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {userTypeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, userType: opt.id }))}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                        formData.userType === opt.id
                          ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 border-transparent text-white shadow-md'
                          : 'bg-[#161C28] border-white/10 text-slate-300 hover:bg-[#1C2434]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  id="contact-name"
                  name="name"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={<User className="h-4 w-4" />}
                />
                <Input
                  label="Email Address"
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>

              {/* Subject Select */}
              <Select
                label="Subject"
                id="contact-subject"
                name="subject"
                required
                placeholder="-- Choose inquiry subject --"
                value={formData.subject}
                onChange={handleChange}
                options={subjectOptions}
                error={errors.subject}
              />

              {/* Message Textarea */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between">
                  <label htmlFor="contact-message" className="block text-sm font-medium text-slate-300">
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-xs text-slate-500">
                    {formData.message.length}/1000 characters
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  maxLength={1000}
                  required
                  placeholder="Please describe your question or issue in detail..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-[#161C28] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/70 ${
                    errors.message ? 'border-rose-500/80 focus:ring-rose-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-rose-400 mt-0.5">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={submitting}
                  iconRight={<Send className="h-4 w-4 ml-1" />}
                >
                  Send Message
                </Button>
              </div>

              <p className="text-center text-xs text-slate-500">
                We respect your privacy. Inquiries are stored securely and never shared with
                third-party marketers.
              </p>
            </form>
            </div>
          </BorderGlow>

          {/* RIGHT COLUMN: Company Contact Details & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Details Card */}
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
            >
              <div className="p-6 sm:p-8 rounded-[30px]">
                <h3 className="text-lg font-bold text-white mb-1">Company Contact Info</h3>
              <p className="text-xs text-slate-400 mb-6">
                Direct channels to get in touch with our team.
              </p>

              <div className="space-y-5">
                {/* Office Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Headquarters</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      123 Innovation Drive, Suite 400<br />
                      Financial District, San Francisco, CA 94105<br />
                      United States
                    </p>
                  </div>
                </div>

                {/* Email Channels */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Email Inquiries</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      <span className="font-medium text-slate-300">General Support:</span>{' '}
                      <a href="mailto:support@panisudar.com" className="text-cyan-400 hover:underline">
                        support@panisudar.com
                      </a>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      <span className="font-medium text-slate-300">Enterprise Hiring:</span>{' '}
                      <a href="mailto:sales@panisudar.com" className="text-cyan-400 hover:underline">
                        sales@panisudar.com
                      </a>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      <span className="font-medium text-slate-300">Press & Media:</span>{' '}
                      <a href="mailto:press@panisudar.com" className="text-cyan-400 hover:underline">
                        press@panisudar.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Phone & Hotline */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Telephone</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Toll-free: <span className="font-semibold text-white">+1 (800) 555-4627</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      International: <span className="text-slate-300">+1 (555) 987-6543</span>
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Support Hours</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Monday – Friday: 9:00 AM – 6:00 PM EST
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Saturday: 10:00 AM – 2:00 PM EST
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 italic">
                      Automated ticket routing runs 24/7/365
                    </p>
                  </div>
                </div>
              </div>

              {/* Status SLA Pill */}
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Service Status</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  All Systems Operational
                </span>
              </div>
              </div>
            </BorderGlow>

            {/* Quick Self-Serve Card */}
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
            >
              <div className="p-6 sm:p-7 rounded-[30px]">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Looking for Immediate Answers?</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Explore our comprehensive knowledge base and learn how to optimize your candidate
                  search or job application.
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#161C28] hover:bg-[#1C2434] text-xs font-semibold text-white transition-colors border border-white/10"
                  >
                    <span>Frequently Asked Questions</span>
                    <span className="text-cyan-400">→</span>
                  </Link>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#161C28] hover:bg-[#1C2434] text-xs font-semibold text-white transition-colors border border-white/10"
                  >
                    <span>Search Verified Job Openings</span>
                    <span className="text-cyan-400">→</span>
                  </Link>
                </div>
              </div>
            </BorderGlow>
          </div>
        </div>
      </div>
    </div>
  );
}
