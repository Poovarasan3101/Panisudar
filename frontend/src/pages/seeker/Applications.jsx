import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  Clock,
  Calendar,
  Building2,
  MapPin,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  FileText,
  Info,
  Check,
} from 'lucide-react';

import { applicationService } from '@/api/applicationService';
import { useToast } from '@/contexts/ToastContext';
import ApplicationStatusBadge from '@/components/common/ApplicationStatusBadge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import EmptyState from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDate, timeAgo } from '@/utils/helpers';

const STATUS_TABS = [
  { id: 'all', label: 'All Applications' },
  { id: 'applied', label: 'Applied' },
  { id: 'under_review', label: 'Under Review' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'interview', label: 'Interview' },
  { id: 'selected', label: 'Selected' },
  { id: 'rejected', label: 'Rejected' },
];

export default function SeekerApplications() {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Details Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Withdraw Modal
  const [appToWithdraw, setAppToWithdraw] = useState(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        const data = await applicationService.getMyApplications();
        setApplications(data || []);
      } catch (err) {
        console.error('Failed to load applications:', err);
        toast.error('Error', 'Unable to retrieve your applications.');
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, [toast]);

  // Counts for tabs
  const counts = useMemo(() => {
    const res = { all: applications.length };
    STATUS_TABS.forEach((t) => {
      if (t.id !== 'all') {
        res[t.id] = applications.filter((a) => a.status === t.id).length;
      }
    });
    return res;
  }, [applications]);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    let result = [...applications];

    if (activeTab !== 'all') {
      result = result.filter((a) => a.status === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.jobTitle?.toLowerCase().includes(q) ||
          a.companyName?.toLowerCase().includes(q) ||
          a.location?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [applications, activeTab, searchQuery]);

  // Handle Withdraw
  const handleConfirmWithdraw = async () => {
    if (!appToWithdraw) return;
    try {
      setWithdrawing(true);
      await applicationService.withdrawApplication(appToWithdraw.id);
      setApplications((prev) => prev.filter((a) => a.id !== appToWithdraw.id));
      toast.success(
        'Application Withdrawn',
        `Your application for ${appToWithdraw.jobTitle} has been withdrawn.`
      );
      setWithdrawModalOpen(false);
      setAppToWithdraw(null);
    } catch (err) {
      toast.error('Withdraw Failed', 'Failed to withdraw application.');
    } finally {
      setWithdrawing(false);
    }
  };

  const openDetails = (app) => {
    setSelectedApp(app);
    setDetailsModalOpen(true);
  };

  const openWithdraw = (app) => {
    setAppToWithdraw(app);
    setWithdrawModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading your applications...</p>
      </div>
    );
  }

  // Stepper milestones
  const STEPS = [
    { key: 'applied', label: 'Applied' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'shortlisted', label: 'Shortlisted' },
    { key: 'interview', label: 'Interview' },
    { key: 'decision', label: 'Decision' },
  ];

  const getStepStatus = (stepKey, currentStatus) => {
    const order = ['applied', 'under_review', 'shortlisted', 'interview', 'selected'];
    if (currentStatus === 'rejected') {
      if (stepKey === 'decision') return 'rejected';
      return 'completed';
    }
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey === 'decision' ? 'selected' : stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 py-8 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        {/* ─── Header ───────────────────────────────────────────────────── */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-cyan-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white">My Applications</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              You have submitted <span className="font-semibold text-cyan-400">{applications.length}</span>{' '}
              application{applications.length === 1 ? '' : 's'} across companies
            </p>
          </div>

          <Link to="/jobs">
            <Button variant="primary" icon={<ExternalLink className="w-4 h-4" />}>
              Find More Jobs
            </Button>
          </Link>
        </div>

        {/* ─── Status Tabs & Search Filter ──────────────────────────────── */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-4 space-y-4">
          {/* Scrollable Tabs */}
          <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar border-b border-white/10">
            {STATUS_TABS.map((tab) => {
              const count = counts[tab.id] || 0;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#161C28] text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive ? 'bg-cyan-500 text-black' : 'bg-[#161C28] text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by job title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm rounded-xl border border-white/10 bg-[#161C28] px-3.5 py-2 pl-9 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* ─── Applications List / Empty State ──────────────────────────── */}
        {applications.length === 0 ? (
          <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-8">
            <EmptyState
              icon={<Briefcase className="w-10 h-10 text-cyan-400" />}
              title="No applications submitted yet"
              description="Browse top vacancies from leading tech organizations and apply with your profile in one click."
              action={{
                label: 'Browse Jobs',
                onClick: () => navigate('/jobs'),
              }}
            />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-8 text-center">
            <p className="text-slate-400 text-sm">
              No applications match your current filter ({activeTab}
              {searchQuery ? ` matching "${searchQuery}"` : ''}).
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-5 sm:p-6 hover:shadow-2xl hover:border-cyan-500/40 transition-all duration-300 space-y-4 animate-fadeIn"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Company Logo & Details */}
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        app.companyLogo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          app.companyName
                        )}&background=4f46e5&color=fff&size=64`
                      }
                      alt={app.companyName}
                      className="w-12 h-12 rounded-xl object-contain border border-white/10 bg-[#161C28] p-1 flex-shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/jobs/${app.jobId}`}
                          className="font-bold text-base sm:text-lg text-white hover:text-cyan-400 transition-colors"
                        >
                          {app.jobTitle}
                        </Link>
                      </div>
                      <p className="text-sm font-medium text-slate-300">{app.companyName}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {app.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          Applied {formatDate(app.appliedAt)} ({timeAgo(app.appliedAt)})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                    <ApplicationStatusBadge status={app.status} />

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetails(app)}
                      >
                        View Details
                      </Button>

                      {app.status !== 'rejected' && app.status !== 'selected' && (
                        <button
                          type="button"
                          onClick={() => openWithdraw(app)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/30"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Notice Banner (Contextual helper) */}
                {app.status === 'interview' && (
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-300 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>
                        Interview scheduled for September 25, 2026. A calendar invitation with video call link was sent to your email.
                      </span>
                    </div>
                  </div>
                )}

                {app.status === 'shortlisted' && (
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>
                      Congratulations! You have been shortlisted. The recruitment panel will contact you shortly to schedule an interview.
                    </span>
                  </div>
                )}

                {app.status === 'selected' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>
                      Offer extended! Please review your official offer documents sent to your registered email.
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── Details Modal ────────────────────────────────────────────── */}
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title="Application Details"
          size="lg"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDetailsModalOpen(false)}>
                Close
              </Button>
              {selectedApp && (
                <Link to={`/jobs/${selectedApp.jobId}`}>
                  <Button variant="primary">View Job Post</Button>
                </Link>
              )}
            </div>
          }
        >
          {selectedApp && (
            <div className="space-y-6">
              {/* Top overview */}
              <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                <img
                  src={
                    selectedApp.companyLogo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedApp.companyName
                    )}&background=4f46e5&color=fff&size=64`
                  }
                  alt={selectedApp.companyName}
                  className="w-14 h-14 rounded-xl object-contain border border-white/10 bg-[#161C28] p-1 shadow-xs"
                />
                <div>
                  <h3 className="font-bold text-white text-lg">{selectedApp.jobTitle}</h3>
                  <p className="text-sm text-slate-300 font-medium">{selectedApp.companyName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedApp.location} • Applied on {formatDate(selectedApp.appliedAt)}
                  </p>
                </div>
              </div>

              {/* Status Tracker Stepper */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Application Progress
                </h4>
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700 -translate-y-1/2 z-0" />
                  {STEPS.map((step, idx) => {
                    const status = getStepStatus(step.key, selectedApp.status);
                    return (
                      <div key={step.key} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            status === 'completed'
                              ? 'bg-emerald-500 text-white'
                              : status === 'active'
                              ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20'
                              : status === 'rejected'
                              ? 'bg-rose-500 text-white'
                              : 'bg-[#161C28] border-2 border-slate-600 text-slate-400'
                          }`}
                        >
                          {status === 'completed' ? (
                            <Check className="w-4 h-4" />
                          ) : status === 'rejected' ? (
                            '✕'
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <span className="text-[11px] font-medium text-slate-300 mt-1.5 whitespace-nowrap">
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cover Letter / Notes */}
              <div className="bg-[#161C28] rounded-xl p-4 border border-white/10 text-xs sm:text-sm text-slate-300 space-y-2">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Submitted Application Notes
                </span>
                <p className="leading-relaxed text-slate-400">
                  {selectedApp.coverLetter ||
                    'Application submitted with your updated profile, resume, and contact details.'}
                </p>
              </div>

              {/* Candidate Info Sent */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Profile Snapshot Sent
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs bg-[#161C28] p-3 rounded-xl border border-white/10">
                  <div>
                    <span className="text-slate-400">Applicant:</span>{' '}
                    <span className="font-semibold text-white">
                      {selectedApp.applicantName || 'Arjun Sharma'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Experience:</span>{' '}
                    <span className="font-semibold text-white">
                      {selectedApp.experience || '3+ years'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* ─── Withdraw Confirmation Modal ──────────────────────────────── */}
        <Modal
          isOpen={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          title="Withdraw Application"
          size="sm"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setWithdrawModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                loading={withdrawing}
                onClick={handleConfirmWithdraw}
              >
                Confirm Withdrawal
              </Button>
            </div>
          }
        >
          {appToWithdraw && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-medium">
                  This action is permanent and cannot be undone.
                </p>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                Are you sure you want to withdraw your application for{' '}
                <span className="font-bold text-white">{appToWithdraw.jobTitle}</span> at{' '}
                <span className="font-bold text-white">{appToWithdraw.companyName}</span>?
              </p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
