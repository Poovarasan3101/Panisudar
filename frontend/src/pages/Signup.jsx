import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Logo from '@/components/common/Logo';
import {
  Briefcase,
  User,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { register, authError, setAuthError } = useAuth();
  const toast = useToast();

  // Multi-step signup: Step 1 (Role Selection), Step 2 (Account Information)
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('job_seeker'); // 'job_seeker' or 'employer'

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Password strength calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200', textClass: 'text-gray-400', percent: 0 };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-red-500', textClass: 'text-red-500', percent: 25 };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500', textClass: 'text-amber-500', percent: 50 };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-indigo-500', textClass: 'text-indigo-500', percent: 75 };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-emerald-500', textClass: 'text-emerald-500', percent: 100 };
      default:
        return { score: 0, label: 'Very Weak', color: 'bg-red-300', textClass: 'text-red-400', percent: 10 };
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (role === 'employer' && !formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required for employers';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (authError && setAuthError) {
      setAuthError(null);
    }
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const newUser = await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: role,
        companyName: role === 'employer' ? formData.companyName.trim() : undefined,
      });

      if (toast?.success) {
        toast.success(
          'Account Created Successfully!',
          `Welcome to Panisudar, ${newUser?.fullName || 'there'}!`
        );
      }

      if (role === 'employer') {
        navigate('/employer/dashboard', { replace: true });
      } else {
        navigate('/job-seeker/dashboard', { replace: true });
      }
    } catch (err) {
      const message = err?.message || 'Failed to create account. Please try again.';
      setErrors((prev) => ({ ...prev, general: message }));
      if (toast?.error) {
        toast.error('Registration Failed', message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0B0D12] text-slate-100 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex justify-center">
          <Logo size="lg" variant="dark" />
        </div>

        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Create your Panisudar account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 transition-colors"
          >
            Sign in here
          </Link>
        </p>

        {/* Step Indicator */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 1
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md ring-4 ring-cyan-500/20'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {step > 1 ? <Check className="h-3.5 w-3.5" /> : '1'}
            </span>
            <span
              className={`text-xs font-semibold ${
                step === 1 ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              Role
            </span>
          </div>

          <div
            className={`w-12 h-0.5 transition-colors ${
              step > 1 ? 'bg-emerald-500' : 'bg-white/10'
            }`}
          />

          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 2
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md ring-4 ring-cyan-500/20'
                  : 'bg-[#161C28] text-slate-500 border border-white/10'
              }`}
            >
              2
            </span>
            <span
              className={`text-xs font-semibold ${
                step === 2 ? 'text-cyan-400' : 'text-slate-500'
              }`}
            >
              Details
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-[#121620] py-8 px-6 shadow-2xl rounded-2xl border border-white/10 sm:px-10">
          {/* General Error Banner */}
          {(errors.general || authError) && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-start gap-3 text-sm">
              <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-white">Registration Error</p>
                <p className="text-xs text-rose-300/80 mt-0.5">
                  {errors.general || authError}
                </p>
              </div>
            </div>
          )}

          {/* STEP 1: ROLE SELECTION */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white text-center mb-1">
                  How do you plan to use Panisudar?
                </h3>
                <p className="text-xs text-slate-400 text-center mb-6">
                  Select your primary account purpose. You can explore opportunities immediately.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {/* Option 1: Job Seeker */}
                  <div
                    onClick={() => setRole('job_seeker')}
                    className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-150 flex items-start gap-4 ${
                      role === 'job_seeker'
                        ? 'border-cyan-500/60 bg-[#161C28] ring-1 ring-cyan-500/30 shadow-lg'
                        : 'border-white/10 bg-[#121620] hover:bg-[#161C28] hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        role === 'job_seeker'
                          ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white'
                          : 'bg-[#161C28] border border-white/10 text-cyan-400'
                      }`}
                    >
                      <User className="h-6 w-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-white">
                          Looking for a job
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                            role === 'job_seeker'
                              ? 'bg-cyan-500 border-cyan-500 text-black'
                              : 'border-white/20 bg-[#161C28]'
                          }`}
                        >
                          {role === 'job_seeker' && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Find verified roles, build an impressive profile, and apply with 1-click.
                      </p>
                      <ul className="mt-2.5 space-y-1 text-xs text-slate-400">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Search 50,000+ top verified tech and creative jobs</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Track real-time application updates from hiring managers</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Option 2: Employer */}
                  <div
                    onClick={() => setRole('employer')}
                    className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-150 flex items-start gap-4 ${
                      role === 'employer'
                        ? 'border-cyan-500/60 bg-[#161C28] ring-1 ring-cyan-500/30 shadow-lg'
                        : 'border-white/10 bg-[#121620] hover:bg-[#161C28] hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        role === 'employer'
                          ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white'
                          : 'bg-[#161C28] border border-white/10 text-cyan-400'
                      }`}
                    >
                      <Building2 className="h-6 w-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-white">
                          Hiring talent
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                            role === 'employer'
                              ? 'bg-cyan-500 border-cyan-500 text-black'
                              : 'border-white/20 bg-[#161C28]'
                          }`}
                        >
                          {role === 'employer' && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Post job openings, manage candidates, and hire top qualified professionals.
                      </p>
                      <ul className="mt-2.5 space-y-1 text-xs text-slate-400">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Reach 2M+ active and verified candidates</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Intuitive applicant tracking & team collaboration</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  iconRight={<ArrowRight className="h-4 w-4 ml-1" />}
                >
                  Continue as {role === 'employer' ? 'Employer' : 'Job Seeker'}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: ACCOUNT DETAILS */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4" noValidate>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Change Role</span>
                </button>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#161C28] text-cyan-300 border border-cyan-500/30">
                  {role === 'employer' ? (
                    <>
                      <Building2 className="h-3 w-3 text-cyan-400" />
                      <span>Employer Account</span>
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3 text-cyan-400" />
                      <span>Job Seeker Account</span>
                    </>
                  )}
                </span>
              </div>

              {/* Full Name */}
              <Input
                label="Full Name"
                id="signup-fullname"
                name="fullName"
                type="text"
                required
                placeholder={role === 'employer' ? 'e.g. Priya Nair' : 'e.g. Arjun Sharma'}
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                icon={<User className="h-4 w-4" />}
              />

              {/* Email Address */}
              <Input
                label="Email Address"
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={
                  role === 'employer' ? 'priya@company.com' : 'arjun@example.com'
                }
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail className="h-4 w-4" />}
              />

              {/* Company Name (Employer only) */}
              {role === 'employer' && (
                <Input
                  label="Company Name"
                  id="signup-company"
                  name="companyName"
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Solutions"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={errors.companyName}
                  icon={<Building2 className="h-4 w-4" />}
                />
              )}

              {/* Password */}
              <div className="relative">
                <Input
                  label="Password"
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={<Lock className="h-4 w-4" />}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="pointer-events-auto p-1 text-slate-400 hover:text-white focus:outline-none transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                />

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Password strength:</span>
                      <span className={`font-semibold ${passwordStrength.textClass}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-[#161C28] rounded-full h-1.5 overflow-hidden border border-white/10">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  label="Confirm Password"
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  icon={<Lock className="h-4 w-4" />}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="pointer-events-auto p-1 text-slate-400 hover:text-white focus:outline-none transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                />
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <div className="flex items-start">
                  <input
                    id="agree-terms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 mt-0.5 rounded border-white/20 bg-[#161C28] text-cyan-500 focus:ring-cyan-500/50 cursor-pointer"
                  />
                  <label
                    htmlFor="agree-terms"
                    className="ml-2 block text-xs text-slate-400 cursor-pointer select-none"
                  >
                    I agree to the{' '}
                    <Link to="/about" className="font-semibold text-cyan-400 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/about" className="font-semibold text-cyan-400 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-xs text-rose-400 mt-1">{errors.agreeTerms}</p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  iconRight={<Sparkles className="h-4 w-4 ml-1" />}
                >
                  Create {role === 'employer' ? 'Employer' : 'Seeker'} Account
                </Button>
              </div>
            </form>
          )}

          {/* Bottom helper */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Need assistance?{' '}
              <Link to="/contact" className="text-cyan-400 hover:underline font-medium">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
