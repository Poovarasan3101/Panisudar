import React, { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Shield,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Phone,
  Save,
  Check,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';

export default function SeekerSettings() {
  const { user, logout } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('account');

  // Account Information State
  const [accountForm, setAccountForm] = useState({
    fullName: user?.fullName || 'Arjun Sharma',
    email: user?.email || 'arjun.sharma@email.com',
    phone: '+91 98765 43210',
  });
  const [savingAccount, setSavingAccount] = useState(false);

  // Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    applicationUpdates: true,
    interviewAlerts: true,
    recommendations: true,
    recruiterMessages: true,
    weeklyDigest: false,
    smsAlerts: true,
  });

  // Privacy & Visibility State
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public', // 'public' | 'applied_only' | 'private'
    allowResumeDownload: true,
    jobSearchStatus: 'actively_looking', // 'actively_looking' | 'open' | 'not_looking'
  });

  // Danger Zone Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Handle Account Update
  const handleSaveAccount = async (e) => {
    e.preventDefault();
    if (!accountForm.fullName.trim() || !accountForm.email.trim()) {
      toast.error('Validation Error', 'Name and Email cannot be empty.');
      return;
    }
    setSavingAccount(true);
    setTimeout(() => {
      setSavingAccount(false);
      toast.success('Account Updated', 'Your personal account info has been saved.');
    }, 600);
  };

  // Handle Password Update
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      toast.error('Error', 'Please enter your current password.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Weak Password', 'New password must be at least 8 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mismatch', 'New password and confirm password do not match.');
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Password Changed', 'Your account password has been updated securely.');
    }, 800);
  };

  // Handle Notification Toggle
  const handleToggleNotification = (key) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success('Preferences Updated', 'Notification settings saved.');
      return next;
    });
  };

  // Handle Privacy Change
  const handleSavePrivacy = () => {
    toast.success('Privacy Settings Updated', 'Your profile visibility has been saved.');
  };

  // Handle Delete Account
  const handleConfirmDelete = async () => {
    setDeletingAccount(true);
    setTimeout(async () => {
      setDeletingAccount(false);
      setDeleteModalOpen(false);
      toast.info('Account Closed', 'Your account has been permanently deactivated.');
      await logout();
    }, 1000);
  };

  const SETTING_TABS = [
    { id: 'account', label: 'Account Information', icon: User },
    { id: 'security', label: 'Login & Password', icon: Lock },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'privacy', label: 'Privacy & Visibility', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 py-8 relative overflow-hidden">
      {/* Ambient glowing background blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        {/* ─── Header ───────────────────────────────────────────────────── */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your personal profile security, notifications, and privacy preferences
          </p>

          {/* Navigation Tabs */}
          <div className="mt-6 border-t border-white/10 pt-4 flex overflow-x-auto gap-2 no-scrollbar">
            {SETTING_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── TAB 1: Account Information ───────────────────────────────── */}
        {activeTab === 'account' && (
          <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Personal Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Update your registered contact credentials
              </p>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Full Name"
                  value={accountForm.fullName}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, fullName: e.target.value })
                  }
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={accountForm.email}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, email: e.target.value })
                  }
                  required
                />
                <Input
                  label="Phone Number"
                  value={accountForm.phone}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, phone: e.target.value })
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Account Role
                  </label>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#161C28] border border-white/10 rounded-xl text-sm text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold capitalize">Job Seeker Account</span>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  loading={savingAccount}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Account Changes
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ─── TAB 2: Login & Password ──────────────────────────────────── */}
        {activeTab === 'security' && (
          <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                Change Password
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Ensure your account is protected with a strong password
              </p>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4 max-w-md">
              {/* Current Password */}
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-8 text-slate-400 hover:text-white"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <Input
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  placeholder="Minimum 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-8 text-slate-400 hover:text-white"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  placeholder="Re-type new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-8 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={savingPassword}
                  icon={<Save className="w-4 h-4" />}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ─── TAB 3: Notification Preferences ──────────────────────────── */}
        {activeTab === 'notifications' && (
          <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                Notification Preferences
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Choose which channels and alerts you want to receive
              </p>
            </div>

            <div className="divide-y divide-white/10">
              {[
                {
                  key: 'applicationUpdates',
                  title: 'Application Status Updates',
                  desc: 'Get notified when an employer reviews, shortlists, or updates your application.',
                },
                {
                  key: 'interviewAlerts',
                  title: 'Interview Schedules & Reminders',
                  desc: 'Receive immediate invitations and reminder notifications for upcoming interviews.',
                },
                {
                  key: 'recommendations',
                  title: 'Recommended Jobs',
                  desc: 'Personalized job listings matched against your target roles and skills.',
                },
                {
                  key: 'recruiterMessages',
                  title: 'Recruiter Inquiries',
                  desc: 'Direct messages sent by hiring managers regarding job opportunities.',
                },
                {
                  key: 'weeklyDigest',
                  title: 'Weekly Job Digest',
                  desc: 'A curated summary of top hiring trends and new companies on the portal.',
                },
                {
                  key: 'smsAlerts',
                  title: 'SMS Alert Notifications',
                  desc: 'Receive urgent SMS alerts for scheduled interview calls on your mobile number.',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-lg">{item.desc}</p>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={Boolean(notifications[item.key])}
                      onChange={() => handleToggleNotification(item.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#161C28] border border-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 4: Privacy & Visibility ──────────────────────────────── */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Privacy & Profile Visibility
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Control how recruiters discover and interact with your profile
                </p>
              </div>

              {/* Visibility Options */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-300">
                  Profile Searchability
                </label>
                {[
                  {
                    value: 'public',
                    title: 'Public (Recommended)',
                    desc: 'All verified recruiters and companies can view your profile and contact you directly.',
                  },
                  {
                    value: 'applied_only',
                    title: 'Applied Companies Only',
                    desc: 'Only companies you actively submit applications to can view your full details.',
                  },
                  {
                    value: 'private',
                    title: 'Private',
                    desc: 'Your profile is completely hidden from recruiter search. Only visible to you.',
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      privacy.profileVisibility === opt.value
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-white/10 bg-[#161C28]/50 hover:bg-[#161C28]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="profileVisibility"
                      value={opt.value}
                      checked={privacy.profileVisibility === opt.value}
                      onChange={(e) =>
                        setPrivacy({ ...privacy, profileVisibility: e.target.value })
                      }
                      className="mt-0.5 text-cyan-500 focus:ring-cyan-500/50 bg-[#161C28] border-white/20"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{opt.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Resume download permission */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Direct Resume Downloads
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Allow verified recruiters to download your PDF resume without requiring prior approval.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={privacy.allowResumeDownload}
                    onChange={(e) =>
                      setPrivacy({ ...privacy, allowResumeDownload: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#161C28] border border-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                </label>
              </div>

              {/* Job search status */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  Job Search Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'actively_looking', label: 'Actively Looking', color: 'emerald' },
                    { id: 'open', label: 'Open to Opportunities', color: 'indigo' },
                    { id: 'not_looking', label: 'Not Looking', color: 'gray' },
                  ].map((status) => (
                    <button
                      key={status.id}
                      type="button"
                      onClick={() => setPrivacy({ ...privacy, jobSearchStatus: status.id })}
                      className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold text-center transition-all ${
                        privacy.jobSearchStatus === status.id
                          ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300 shadow-xs'
                          : 'border-white/10 bg-[#161C28] text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={handleSavePrivacy}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Privacy Preferences
                </Button>
              </div>
            </div>

            {/* ─── Danger Zone ─────────────────────────────────────────── */}
            <div className="bg-rose-500/10 rounded-2xl border border-rose-500/30 p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  Danger Zone
                </h3>
                <p className="text-xs text-rose-400 mt-1">
                  Permanently remove or temporarily deactivate your job seeker profile
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                  <h4 className="text-sm font-semibold text-white">Delete Account</h4>
                  <p className="text-xs text-slate-400">
                    Once you delete your account, all your applications, saved jobs, and profile history will be erased.
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteModalOpen(true)}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Delete Account Confirmation Modal ────────────────────────── */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Account Permanently"
          size="sm"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                loading={deletingAccount}
                onClick={handleConfirmDelete}
              >
                Yes, Delete My Account
              </Button>
            </div>
          }
        >
          <div className="space-y-3">
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>
                Warning: This action is permanent and all associated applications will be cancelled.
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Are you sure you want to delete your Panisudar account? You will lose access to all your
              job applications and saved bookmarks.
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
}
