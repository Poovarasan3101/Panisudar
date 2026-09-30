import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Logo from '@/components/common/Logo';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  User,
  Building2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  X,
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authError, setAuthError } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    // Clear field-specific error on edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (authError && setAuthError) {
      setAuthError(null);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const user = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (toast?.success) {
        toast.success(
          'Welcome back!',
          `Signed in as ${user?.fullName || 'User'}`
        );
      }

      // Determine redirect destination
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user?.role === 'employer') {
        navigate('/employer/dashboard', { replace: true });
      } else {
        navigate('/job-seeker/dashboard', { replace: true });
      }
    } catch (err) {
      const message = err?.message || 'Invalid email or password. Please try again.';
      setErrors((prev) => ({ ...prev, general: message }));
      if (toast?.error) {
        toast.error('Authentication Error', message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick demo account autofill helper
  const handleAutofillDemo = (role) => {
    if (role === 'seeker') {
      setFormData({
        email: 'arjun@example.com',
        password: 'Password123',
        rememberMe: true,
      });
      setErrors({});
      if (authError && setAuthError) setAuthError(null);
      if (toast?.info) {
        toast.info('Demo Seeker Loaded', 'Arjun Sharma credentials filled. Click Sign In.');
      }
    } else {
      setFormData({
        email: 'priya@example.com',
        password: 'Password123',
        rememberMe: true,
      });
      setErrors({});
      if (authError && setAuthError) setAuthError(null);
      if (toast?.info) {
        toast.info('Demo Employer Loaded', 'Priya Nair credentials filled. Click Sign In.');
      }
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) {
      if (toast?.error) toast.error('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setForgotSubmitted(true);
    if (toast?.success) {
      toast.success('Reset Link Sent', `Password reset instructions sent to ${forgotEmail}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0B0D12] text-slate-100 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand header */}
        <div className="flex justify-center">
          <Logo size="lg" variant="dark" />
        </div>

        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Or{' '}
          <Link
            to="/signup"
            className="font-medium text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 transition-colors"
          >
            create a new account for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Quick Demo Autofill Banner */}
        <div className="mb-6 bg-[#121620] border border-white/10 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Fast Reviewer Demo Accounts</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            One-click autofill to test role-based portals immediately:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleAutofillDemo('seeker')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-[#161C28] border border-white/10 rounded-xl hover:bg-[#1C2434] hover:text-white transition-all shadow-xs active:scale-[0.98]"
            >
              <User className="h-3.5 w-3.5 text-cyan-400" />
              <span>Try as Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => handleAutofillDemo('employer')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-[#161C28] border border-white/10 rounded-xl hover:bg-[#1C2434] hover:text-white transition-all shadow-xs active:scale-[0.98]"
            >
              <Building2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Try as Employer</span>
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#121620] py-8 px-6 shadow-2xl rounded-2xl border border-white/10 sm:px-8">
          {/* General Error Banner */}
          {(errors.general || authError) && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-start gap-3 text-sm">
              <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-white">Authentication Failed</p>
                <p className="text-xs text-rose-300/80 mt-0.5">
                  {errors.general || authError}
                </p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <Input
              label="Email Address"
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail className="h-4 w-4" />}
            />

            {/* Password Field */}
            <div className="relative">
              <Input
                label="Password"
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
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
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-white/20 bg-[#161C28] text-cyan-500 focus:ring-cyan-500/50 cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs sm:text-sm text-slate-300 cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>

              <div className="text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setForgotSubmitted(false);
                    setForgotEmail(formData.email);
                    setForgotModalOpen(true);
                  }}
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                iconRight={<ArrowRight className="h-4 w-4 ml-1" />}
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Social or divider footer note */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              By signing in, you agree to our{' '}
              <Link to="/about" className="text-cyan-400 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/about" className="text-cyan-400 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/10 relative text-white animate-fade-in">
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reset Password</h3>
                <p className="text-xs text-slate-400">We will email you a secure link</p>
              </div>
            </div>

            {forgotSubmitted ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-white">Check your inbox</h4>
                <p className="text-sm text-slate-300 mt-1 mb-6">
                  If an account exists for <span className="font-semibold text-white">{forgotEmail}</span>,
                  you will receive a link to reset your password shortly.
                </p>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setForgotModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-sm text-slate-300">
                  Enter the email associated with your account and we’ll send a link to reset your password.
                </p>
                <Input
                  label="Registered Email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  icon={<Mail className="h-4 w-4" />}
                />
                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setForgotModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Send Reset Link
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
