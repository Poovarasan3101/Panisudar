import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Shield,
  Bell,
  Building2,
  Lock,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  LogOut,
  Save,
  Key,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { profileService } from '@/api/profileService';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import EmployerHeader from './EmployerHeader';
import { validatePassword, validateEmail } from '@/utils/validators';

export default function EmployerSettings() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'security' | 'notifications'

  // Account form
  const [accountForm, setAccountForm] = useState({
    recruiterName: '',
    email: '',
    phone: '',
    designation: 'Senior Talent Acquisition Specialist',
    companyName: '',
    location: '',
  });
  const [savingAccount, setSavingAccount] = useState(false);

  // Security form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    applicantAlerts: 'instant', // 'instant' | 'daily' | 'off'
    interviewReminders: true,
    weeklyReport: true,
    candidateMessages: true,
    smsAlerts: false,
    marketingUpdates: false,
  });
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Danger zone modal
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const profile = await profileService.getEmployerProfile();
      if (profile) {
        setAccountForm({
          recruiterName: profile.recruiterName || user?.fullName || 'Priya Nair',
          email: profile.email || user?.email || 'priya.nair@razorpay.com',
          phone: profile.phone || '+91 87654 32109',
          designation: profile.designation || 'Lead Talent Acquisition Partner',
          companyName: profile.companyName || 'Razorpay',
          location: profile.location || 'Bangalore, Karnataka',
        });
      }
    } catch (err) {
      toast?.error?.('Error', 'Failed to load account settings.');
    } finally {
      setLoading(false);
    }
  }

  // Handle Account Save
  async function handleSaveAccount(e) {
    e.preventDefault();
    if (!accountForm.recruiterName.trim()) {
      toast?.error?.('Validation Error', 'Recruiter name is required.');
      return;
    }

    try {
      setSavingAccount(true);
      await profileService.updateEmployerProfile({
        recruiterName: accountForm.recruiterName,
        email: accountForm.email,
        phone: accountForm.phone,
        designation: accountForm.designation,
      });
      toast?.success?.('Profile Updated', 'Recruiter account details have been saved.');
    } catch (err) {
      toast?.error?.('Error', 'Failed to update account details.');
    } finally {
      setSavingAccount(false);
    }
  }

  // Handle Password Change
  async function handleSavePassword(e) {
    e.preventDefault();
    const errs = {};

    if (!passwordForm.currentPassword) {
      errs.currentPassword = 'Enter your current password';
    }

    const passCheck = validatePassword(passwordForm.newPassword);
    if (passCheck) {
      errs.newPassword = passCheck;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setSavingPassword(true);
      // Simulate password change
      await new Promise((r) => setTimeout(r, 700));
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast?.success?.('Password Changed', 'Your account password has been updated securely.');
    } catch (err) {
      toast?.error?.('Error', 'Could not change password.');
    } finally {
      setSavingPassword(false);
    }
  }

  // Handle Notification Save
  async function handleSaveNotifications(e) {
    e.preventDefault();
    try {
      setSavingNotifications(true);
      await new Promise((r) => setTimeout(r, 500));
      toast?.success?.('Preferences Saved', 'Recruitment notification settings updated.');
    } catch (err) {
      toast?.error?.('Error', 'Failed to save notification preferences.');
    } finally {
      setSavingNotifications(false);
    }
  }

  // Handle Logout
  async function handleConfirmLogout() {
    try {
      await logout();
      toast?.success?.('Logged Out', 'You have been successfully signed out.');
      navigate('/login');
    } catch (err) {
      toast?.error?.('Error', 'Failed to log out.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D12] text-slate-100 pb-20 relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <EmployerHeader
            title="Account & Portal Settings"
            subtitle="Configure recruiter preferences, security credentials, and alert channels"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm text-slate-400">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 pb-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <EmployerHeader
          title="Account & Portal Settings"
          subtitle="Manage recruiter credentials, security controls, company links, and alert rules"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Settings Navigation Tabs */}
          <div className="bg-[#121620] rounded-xl border border-white/10 p-2 shadow-xl flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'account'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Recruiter Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'security'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Security & Password</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Alerts & Notifications</span>
            </button>
          </div>

          {/* ─── TAB 1: RECRUITER PROFILE ─── */}
          {activeTab === 'account' && (
            <div className="space-y-8">
              <form
                onSubmit={handleSaveAccount}
                className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6"
              >
                <div className="border-b border-white/10 pb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h2 className="text-lg font-bold text-white">Personal Recruiter Profile</h2>
                    <p className="text-xs text-slate-400">
                      Your personal information attached to employer communication
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Recruiter Full Name"
                    value={accountForm.recruiterName}
                    onChange={(e) =>
                      setAccountForm((prev) => ({ ...prev, recruiterName: e.target.value }))
                    }
                    required
                  />

                  <Input
                    label="Designation / Role"
                    value={accountForm.designation}
                    onChange={(e) =>
                      setAccountForm((prev) => ({ ...prev, designation: e.target.value }))
                    }
                    placeholder="e.g. Lead Technical Recruiter"
                  />

                  <Input
                    label="Contact Email"
                    type="email"
                    value={accountForm.email}
                    onChange={(e) =>
                      setAccountForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    icon={<Mail className="w-4 h-4 text-slate-400" />}
                    required
                  />

                  <Input
                    label="Work Phone"
                    value={accountForm.phone}
                    onChange={(e) =>
                      setAccountForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    icon={<Phone className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-white/10">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={savingAccount}
                    icon={<Save className="w-4 h-4" />}
                  >
                    Save Profile Changes
                  </Button>
                </div>
              </form>

              {/* Organization Link Card */}
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {accountForm.companyName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Location: {accountForm.location} • Employer Account
                    </p>
                  </div>
                </div>

                <Link to="/employer/company-profile">
                  <Button variant="outline" size="sm">
                    Edit Company Branding Page →
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* ─── TAB 2: SECURITY & PASSWORD ─── */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <form
                onSubmit={handleSavePassword}
                className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6"
              >
                <div className="border-b border-white/10 pb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h2 className="text-lg font-bold text-white">Change Password</h2>
                    <p className="text-xs text-slate-400">
                      Update your password to ensure authorized portal access
                    </p>
                  </div>
                </div>

                <div className="max-w-md space-y-5">
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    error={passwordErrors.currentPassword}
                    icon={<Lock className="w-4 h-4 text-slate-400" />}
                    required
                  />

                  <Input
                    label="New Password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    error={passwordErrors.newPassword}
                    icon={<Key className="w-4 h-4 text-slate-400" />}
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    error={passwordErrors.confirmPassword}
                    icon={<Key className="w-4 h-4 text-slate-400" />}
                    required
                  />

                  {/* Password rule helper */}
                  <div className="text-xs text-slate-400 bg-[#161C28] p-3 rounded-lg border border-white/10 space-y-1">
                    <p className="font-semibold text-slate-300">Password Requirements:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                      <li>Minimum 8 characters length</li>
                      <li>At least 1 uppercase letter (A-Z)</li>
                      <li>At least 1 numeric digit (0-9)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-white/10">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={savingPassword}
                    icon={<Shield className="w-4 h-4" />}
                  >
                    Update Password
                  </Button>
                </div>
              </form>

              {/* Active Sessions */}
              <div className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white">Active Login Sessions</h3>
                <div className="flex items-center justify-between p-3.5 bg-[#161C28] rounded-xl border border-white/10 text-xs text-slate-300">
                  <div>
                    <p className="font-semibold text-white">Current Web Session (Windows Chrome)</p>
                    <p className="text-slate-400">IP: 103.21.12.9 • Bengaluru, India • Active Now</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-[10px]">
                    Current
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 3: NOTIFICATIONS & ALERTS ─── */}
          {activeTab === 'notifications' && (
            <form
              onSubmit={handleSaveNotifications}
              className="bg-[#121620] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6"
            >
              <div className="border-b border-white/10 pb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="text-lg font-bold text-white">Recruitment Alert Preferences</h2>
                  <p className="text-xs text-slate-400">
                    Select how and when you want to receive applicant and platform updates
                  </p>
                </div>
              </div>

              {/* Email Frequency Radio Group */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-200">
                  New Candidate Application Notifications
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      value: 'instant',
                      title: 'Instant Email',
                      desc: 'Notify right away when a candidate applies',
                    },
                    {
                      value: 'daily',
                      title: 'Daily Summary',
                      desc: 'A single consolidated digest at 9:00 AM IST',
                    },
                    {
                      value: 'off',
                      title: 'Turn Off',
                      desc: 'Check applications directly on portal',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex flex-col p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                        notifications.applicantAlerts === opt.value
                          ? 'border-cyan-500/50 bg-cyan-950/20 ring-1 ring-cyan-500/40 text-cyan-300'
                          : 'border-white/10 bg-[#161C28] text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{opt.title}</span>
                        <input
                          type="radio"
                          name="applicantAlerts"
                          value={opt.value}
                          checked={notifications.applicantAlerts === opt.value}
                          onChange={() =>
                            setNotifications((prev) => ({
                              ...prev,
                              applicantAlerts: opt.value,
                            }))
                          }
                          className="text-cyan-500 focus:ring-cyan-500/50"
                        />
                      </div>
                      <span className="text-slate-400 text-[11px] leading-relaxed">
                        {opt.desc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-semibold text-slate-200">Email & Message Alerts</h3>

                <div className="space-y-3">
                  {[
                    {
                      key: 'interviewReminders',
                      label: 'Interview Scheduling Confirmations',
                      desc: 'Alerts when candidate confirms or reschedules interview slot',
                    },
                    {
                      key: 'weeklyReport',
                      label: 'Weekly Hiring Pipeline Digest',
                      desc: 'Weekly summary of open positions, applicant counts, and response rates',
                    },
                    {
                      key: 'candidateMessages',
                      label: 'Candidate Direct Inquiries',
                      desc: 'Receive immediate notice when applicants submit a question or note',
                    },
                    {
                      key: 'smsAlerts',
                      label: 'High-Priority SMS / WhatsApp Notifications',
                      desc: 'Receive instant notifications for interview acceptances via WhatsApp',
                    },
                    {
                      key: 'marketingUpdates',
                      label: 'Portal Product & Feature Announcements',
                      desc: 'Quarterly updates on recruitment tool features and talent market trends',
                    },
                  ].map((toggle) => (
                    <div
                      key={toggle.key}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-[#161C28]"
                    >
                      <div className="space-y-0.5 max-w-lg">
                        <p className="text-xs font-semibold text-white">
                          {toggle.label}
                        </p>
                        <p className="text-[11px] text-slate-400">{toggle.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [toggle.key]: !prev[toggle.key],
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          notifications[toggle.key] ? 'bg-cyan-500' : 'bg-slate-700'
                        }`}
                        role="switch"
                        aria-checked={notifications[toggle.key]}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            notifications[toggle.key] ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-white/10">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={savingNotifications}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Preferences
                </Button>
              </div>
            </form>
          )}

          {/* ─── DANGER ZONE & SESSION ACTIONS ─── */}
          <div className="bg-[#121620] rounded-2xl border border-red-500/20 p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Account Actions</h3>
            </div>
            <p className="text-xs text-slate-400">
              Sign out of your employer session or manage organization account status.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                className="border-white/10 text-slate-300 hover:bg-white/5"
                onClick={() => setLogoutModalOpen(true)}
                icon={<LogOut className="w-4 h-4" />}
              >
                Sign Out
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => setDeleteModalOpen(true)}
              >
                Deactivate Employer Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Log Out Confirmation Modal ─── */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Sign Out"
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="outline"
              size="md"
              onClick={() => setLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirmLogout}
              icon={<LogOut className="w-4 h-4" />}
            >
              Confirm Sign Out
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-300 text-left">
          Are you sure you want to end your current session? You will need to sign in again to access the employer dashboard.
        </p>
      </Modal>

      {/* ─── Deactivate Confirmation Modal ─── */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Deactivate Employer Account"
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="outline"
              size="md"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={() => {
                setDeleteModalOpen(false);
                toast?.info?.('Request Sent', 'Your account deactivation request has been submitted to support.');
              }}
            >
              Submit Request
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-left">
          <p className="text-sm text-slate-300">
            Deactivating your employer account will unpublish all active job listings and archive candidate applications.
          </p>
          <p className="text-xs text-red-400 font-medium">
            Contact account support if you wish to transfer company ownership to another recruiter.
          </p>
        </div>
      </Modal>
    </div>
  );
}
