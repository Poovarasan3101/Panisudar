import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getInitials, getAvatarColor, getMediaUrl } from '@/utils/helpers';
import { notificationService } from '@/api/notificationService';
import Logo from '@/components/common/Logo';
import PillNav from '@/components/common/PillNav';
import ElectricBorder from '@/components/common/ElectricBorder';

/* ─────────────────────────────────────────────────────────────
   Desktop NavLink
───────────────────────────────────────────────────────────── */
function DesktopNavLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-lg ${
          isActive
            ? 'text-cyan-400 bg-white/10 shadow-sm font-semibold'
            : 'text-slate-300 hover:text-white hover:bg-white/5'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

/* ─────────────────────────────────────────────────────────────
   Mobile NavLink
───────────────────────────────────────────────────────────── */
function MobileNavLink({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block w-full px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Navbar
───────────────────────────────────────────────────────────── */
export default function Navbar() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [imgError, setImgError] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const drawerRef = useRef(null);

  // Reset img error when photo changes
  useEffect(() => {
    setImgError(false);
  }, [user?.photo]);

  // Scroll listener for glass elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Fetch unread notifications ── */
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const fetchCount = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        if (!cancelled) setUnreadCount(count);
      } catch {
        // silently ignore
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user]);

  /* ── Close dropdowns on outside click ── */
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Close drawer on outside click ── */
  useEffect(() => {
    function handleClickOutside(e) {
      if (drawerOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [drawerOpen]);

  /* ── Lock body scroll when drawer is open ── */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      setDrawerOpen(false);
      toast.success('Logged out', 'Logged out successfully.');
      navigate('/');
    } catch {
      toast.error('Logout Error', 'Failed to log out. Please try again.');
    }
  };

  const isGuest = !user;
  const isEmployer = user?.role === 'employer';
  const isJobSeeker = user?.role === 'job_seeker' || user?.role === 'jobseeker';
  const displayName = user?.fullName || user?.name || user?.email || 'User';
  const initials = getInitials(displayName);
  const avatarBg = getAvatarColor(displayName);

  const guestLinks = [
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'Find Jobs' },
    { to: '/ai-resume', label: 'AI Resume' },
    { to: '/companies', label: 'Companies' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const jobSeekerLinks = [
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'Find Jobs' },
    { to: '/ai-resume', label: 'AI Resume' },
    { to: '/job-seeker/saved-jobs', label: 'Saved Jobs' },
    { to: '/job-seeker/applications', label: 'Applications' },
    { to: '/job-seeker/dashboard', label: 'Dashboard' },
  ];

  const employerLinks = [
    { to: '/employer/dashboard', label: 'Dashboard' },
    { to: '/employer/post-job', label: 'Post Job' },
    { to: '/employer/my-jobs', label: 'My Jobs' },
    { to: '/ai-resume', label: 'AI Resume' },
    { to: '/employer/applications', label: 'Applications' },
    { to: '/employer/company-profile', label: 'Company Profile' },
  ];

  const navLinks = isGuest ? guestLinks : isEmployer ? employerLinks : jobSeekerLinks;
  const profilePath = isEmployer ? '/employer/company-profile' : '/job-seeker/profile';
  const settingsPath = isEmployer ? '/employer/settings' : '/job-seeker/settings';
  const notificationsPath = isEmployer ? '/employer/dashboard' : '/job-seeker/notifications';

  const userPhoto = user?.photo || user?.avatar;
  const resolvedPhoto = userPhoto ? getMediaUrl(userPhoto) : null;

  const AvatarCircle = ({ size = 'md' }) => {
    const sz = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-9 w-9 text-sm';
    return (
      <span
        className={`relative inline-flex items-center justify-center rounded-full font-bold text-white flex-shrink-0 overflow-hidden ring-2 ring-indigo-500/30 ${sz}`}
        style={{ backgroundColor: avatarBg }}
      >
        {resolvedPhoto && !imgError ? (
          <img
            src={resolvedPhoto}
            alt={displayName}
            className={`rounded-full object-cover w-full h-full`}
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </span>
    );
  };

  return (
    <>
      {/* ── Glass Navbar ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B0D12]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40 py-2.5'
            : 'bg-[#0B0D12]/75 backdrop-blur-md border-b border-white/5 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo variant="dark" size="md" />

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center">
              <PillNav
                items={isGuest ? [
                  { label: 'Home', href: '/' },
                  { label: 'Find Jobs', href: '/jobs' },
                  { label: 'AI Resume', href: '/ai-resume' },
                  { label: 'Companies', href: '/companies' },
                  { label: 'About', href: '/about' },
                  { label: 'Contact', href: '/contact' },
                ] : navLinks.map(({ to, label }) => ({ label, href: to }))}
                activeHref={location.pathname}
                ease="power2.easeOut"
                baseColor="#38bdf8"
                pillColor="#120F17"
                hoveredPillTextColor="#090D16"
                pillTextColor="#94a3b8"
              />
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isGuest ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white rounded-lg hover:bg-white/5 transition-colors duration-150"
                  >
                    Log In
                  </Link>
                  <ElectricBorder
                    color="#38bdf8"
                    speed={3}
                    chaos={0.02}
                    thickness={2}
                    borderRadius={10}
                    style={{ borderRadius: 10 }}
                  >
                    <Link
                      to="/signup"
                      className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-lg shadow-md shadow-indigo-500/25 transition-all duration-150 inline-flex items-center justify-center"
                    >
                      Get Started
                    </Link>
                  </ElectricBorder>
                </>
              ) : (
                <>
                  {/* Notification Bell */}
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => setNotifOpen((v) => !v)}
                      className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      aria-label="Notifications"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 shadow-sm shadow-cyan-500/50">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Mini-panel */}
                    {notifOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-[#121620]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-scaleIn text-white">
                        <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                          <p className="text-sm font-semibold text-white">Notifications</p>
                          <Link
                            to={notificationsPath}
                            onClick={() => setNotifOpen(false)}
                            className="text-xs text-cyan-400 hover:underline"
                          >
                            View all
                          </Link>
                        </div>
                        <p className="px-4 py-6 text-sm text-slate-400 text-center">
                          {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.`
                            : "You're all caught up!"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* User Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((v) => !v)}
                      className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-cyan-400/50 transition-all duration-150"
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen}
                    >
                      <AvatarCircle />
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          dropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Panel */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-60 bg-[#121620]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-scaleIn text-white">
                        {/* User Header */}
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-semibold text-white truncate">
                            {displayName}
                          </p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {user?.email}
                          </p>
                          <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold rounded-full uppercase tracking-wider">
                            <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                            {user?.role === 'job_seeker' ? 'Job Seeker' : 'Employer'}
                          </span>
                        </div>

                        {/* Menu Options */}
                        <div className="py-1">
                          <Link
                            to={profilePath}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <User className="h-4 w-4 text-cyan-400" />
                            Profile
                          </Link>
                          <Link
                            to={settingsPath}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Settings className="h-4 w-4 text-indigo-400" />
                            Settings
                          </Link>
                        </div>

                        <div className="border-t border-white/10 pt-1 mt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Log Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 md:hidden">
              {user && (
                <button
                  onClick={() => navigate(notificationsPath)}
                  className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={() => setDrawerOpen((v) => !v)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
              >
                {drawerOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeDrawer} />

        <div
          ref={drawerRef}
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-[#0B0D12] border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <Logo variant="dark" size="sm" />
            <button
              onClick={closeDrawer}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Strip */}
          {user && (
            <div className="flex items-center gap-3 px-5 py-4 bg-white/5 border-b border-white/10">
              <AvatarCircle size="md" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <MobileNavLink key={to} to={to} onClick={closeDrawer}>
                {label}
              </MobileNavLink>
            ))}

            {user && (
              <>
                <hr className="my-3 border-white/10" />
                <MobileNavLink to={profilePath} onClick={closeDrawer}>
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-cyan-400" /> Profile
                  </span>
                </MobileNavLink>
                <MobileNavLink to={settingsPath} onClick={closeDrawer}>
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-indigo-400" /> Settings
                  </span>
                </MobileNavLink>
              </>
            )}
          </nav>

          {/* Drawer Footer */}
          <div className="px-5 py-4 border-t border-white/10">
            {isGuest ? (
              <div className="flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={closeDrawer}
                  className="w-full text-center px-4 py-2.5 text-sm font-medium text-slate-200 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={closeDrawer}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl shadow-md transition-transform"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-red-400 border border-red-500/20 bg-red-500/5 rounded-xl hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
