import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JobAssistant from '@/components/chatbot/JobAssistant';
import { PageLoader } from '@/components/common/LoadingSpinner';
import IntroScreen from '@/components/intro/IntroScreen';
import ClickSpark from '@/components/common/ClickSpark';

// Public pages
import Home from '@/pages/Home';
import Jobs from '@/pages/Jobs';
import JobDetail from '@/pages/JobDetail';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Companies from '@/pages/Companies';
import AiResumePage from '@/pages/ai-resume';

// Job Seeker pages
import SeekerDashboard from '@/pages/seeker/Dashboard';
import SeekerProfile from '@/pages/seeker/Profile';
import SavedJobs from '@/pages/seeker/SavedJobs';
import SeekerApplications from '@/pages/seeker/Applications';
import SeekerNotifications from '@/pages/seeker/Notifications';
import SeekerSettings from '@/pages/seeker/Settings';

// Employer pages
import EmployerDashboard from '@/pages/employer/Dashboard';
import PostJob from '@/pages/employer/PostJob';
import MyJobs from '@/pages/employer/MyJobs';
import EmployerApplications from '@/pages/employer/Applications';
import CompanyProfile from '@/pages/employer/CompanyProfile';
import EmployerSettings from '@/pages/employer/Settings';

// ─── Route Guards ─────────────────────────────────────────────────────────────

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isSeeker, isEmployer, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole === 'job_seeker' && !isSeeker) {
    return <Navigate to="/employer/dashboard" replace />;
  }
  if (requiredRole === 'employer' && !isEmployer) {
    return <Navigate to="/job-seeker/dashboard" replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, isSeeker, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (isAuthenticated) {
    return <Navigate to={isSeeker ? '/job-seeker/dashboard' : '/employer/dashboard'} replace />;
  }
  return children;
}

// Pages that don't show Footer (full-screen dashboards could omit it, but we include it everywhere)
const NO_FOOTER_ROUTES = [];

export default function App() {
  return (
    <ClickSpark
      sparkColor="#f5e6bc"
      sparkSize={10}
      sparkRadius={60}
      sparkCount={8}
      duration={700}
      className="flex flex-col min-h-screen"
    >
      {/* One-Time Website Loading Intro Screen */}
      <IntroScreen />

      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-resume" element={<AiResumePage />} />

          {/* Auth */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

          {/* Job Seeker */}
          <Route
            path="/job-seeker/dashboard"
            element={<ProtectedRoute requiredRole="job_seeker"><SeekerDashboard /></ProtectedRoute>}
          />
          <Route
            path="/job-seeker/profile"
            element={<ProtectedRoute requiredRole="job_seeker"><SeekerProfile /></ProtectedRoute>}
          />
          <Route
            path="/job-seeker/saved-jobs"
            element={<ProtectedRoute requiredRole="job_seeker"><SavedJobs /></ProtectedRoute>}
          />
          <Route
            path="/job-seeker/applications"
            element={<ProtectedRoute requiredRole="job_seeker"><SeekerApplications /></ProtectedRoute>}
          />
          <Route
            path="/job-seeker/notifications"
            element={<ProtectedRoute requiredRole="job_seeker"><SeekerNotifications /></ProtectedRoute>}
          />
          <Route
            path="/job-seeker/settings"
            element={<ProtectedRoute requiredRole="job_seeker"><SeekerSettings /></ProtectedRoute>}
          />

          {/* Employer */}
          <Route
            path="/employer/dashboard"
            element={<ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>}
          />
          <Route
            path="/employer/post-job"
            element={<ProtectedRoute requiredRole="employer"><PostJob /></ProtectedRoute>}
          />
          <Route
            path="/employer/my-jobs"
            element={<ProtectedRoute requiredRole="employer"><MyJobs /></ProtectedRoute>}
          />
          <Route
            path="/employer/applications"
            element={<ProtectedRoute requiredRole="employer"><EmployerApplications /></ProtectedRoute>}
          />
          <Route
            path="/employer/company-profile"
            element={<ProtectedRoute requiredRole="employer"><CompanyProfile /></ProtectedRoute>}
          />
          <Route
            path="/employer/settings"
            element={<ProtectedRoute requiredRole="employer"><EmployerSettings /></ProtectedRoute>}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <JobAssistant />
      <Footer />
    </ClickSpark>
  );
}
