import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Check,
  MessageSquare,
  Sparkles,
  Calendar,
  Briefcase,
  ExternalLink,
  Trash2,
  Clock,
  Filter,
} from 'lucide-react';

import { notificationService } from '@/api/notificationService';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { timeAgo } from '@/utils/helpers';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'application_update', label: 'Applications' },
  { id: 'interview', label: 'Interviews' },
  { id: 'message', label: 'Messages' },
  { id: 'recommendation', label: 'Recommendations' },
];

export default function SeekerNotifications() {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        const data = await notificationService.getNotifications();
        setNotifications(data || []);
      } catch (err) {
        console.error('Failed to load notifications:', err);
        toast.error('Error', 'Unable to retrieve notifications.');
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [toast]);

  // Mark single as read
  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      toast.error('Error', 'Failed to update notification.');
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All Read', 'All notifications marked as read.');
    } catch (err) {
      toast.error('Error', 'Failed to mark all as read.');
    }
  };

  // Dismiss notification
  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.info('Dismissed', 'Notification removed.');
  };

  // Counts
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const filtered = useMemo(() => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread') return notifications.filter((n) => !n.isRead);
    return notifications.filter((n) => n.type === activeTab);
  }, [notifications, activeTab]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'interview':
        return {
          icon: Calendar,
          bg: 'bg-purple-500/20 border border-purple-500/30',
          color: 'text-purple-400',
          badge: 'Interview',
        };
      case 'application_update':
        return {
          icon: Briefcase,
          bg: 'bg-blue-500/20 border border-blue-500/30',
          color: 'text-cyan-400',
          badge: 'Application',
        };
      case 'message':
        return {
          icon: MessageSquare,
          bg: 'bg-emerald-500/20 border border-emerald-500/30',
          color: 'text-emerald-400',
          badge: 'Recruiter Message',
        };
      case 'recommendation':
        return {
          icon: Sparkles,
          bg: 'bg-amber-500/20 border border-amber-500/30',
          color: 'text-amber-400',
          badge: 'Job Alert',
        };
      default:
        return {
          icon: Bell,
          bg: 'bg-slate-700/40 border border-white/10',
          color: 'text-slate-300',
          badge: 'Update',
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D12] flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-slate-400 font-medium">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 py-8 relative overflow-hidden">
      {/* Ambient glowing background blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        {/* ─── Header ───────────────────────────────────────────────────── */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-[#161C28] border border-white/10 rounded-xl text-cyan-400 relative">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#121620]">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Stay updated with interview schedules, application reviews, and job alerts
                </p>
              </div>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              icon={<CheckCheck className="w-4 h-4" />}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* ─── Filter Tabs ──────────────────────────────────────────────── */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-3">
          <div className="flex overflow-x-auto gap-2 no-scrollbar">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const count =
                tab.id === 'all'
                  ? notifications.length
                  : tab.id === 'unread'
                  ? unreadCount
                  : notifications.filter((n) => n.type === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[11px] ${
                      isActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-[#161C28] text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Notifications List ───────────────────────────────────────── */}
        {notifications.length === 0 ? (
          <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-8">
            <EmptyState
              icon={<Bell className="w-10 h-10 text-cyan-400" />}
              title="No notifications yet"
              description="When employers reach out or update your application status, you will see alerts here."
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#121620] rounded-2xl border border-white/10 shadow-xl p-8 text-center">
            <p className="text-slate-400 text-sm">No notifications found in this category.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setActiveTab('all')}
            >
              View All Notifications
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const { icon: Icon, bg, color, badge } = getNotificationIcon(item.type);

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-5 transition-all flex items-start gap-4 ${
                    item.isRead
                      ? 'bg-[#121620] border-white/10 hover:border-white/20'
                      : 'bg-[#161C28] border-cyan-500/30 shadow-lg hover:border-cyan-500/50'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} ${color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm sm:text-base ${
                            item.isRead ? 'font-medium text-slate-200' : 'font-bold text-white'
                          }`}
                        >
                          {item.title}
                        </h4>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {item.message}
                    </p>

                    {/* Contextual Actions */}
                    <div className="flex items-center gap-3 pt-2">
                      {item.type === 'interview' || item.type === 'application_update' ? (
                        <Link
                          to="/job-seeker/applications"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                        >
                          View Application
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : item.type === 'recommendation' ? (
                        <Link
                          to="/jobs"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                        >
                          Browse Matched Jobs
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : null}

                      {!item.isRead && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(item.id)}
                          className="text-xs text-slate-400 hover:text-cyan-300 font-medium transition-colors"
                        >
                          Mark as read
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDismiss(item.id)}
                        className="text-xs text-slate-400 hover:text-rose-400 font-medium transition-colors ml-auto"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
