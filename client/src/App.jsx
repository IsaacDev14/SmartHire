"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import { ToastProvider } from "./components/ui/use-toast"

// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import VerifyEmail from "./pages/VerifyEmail"
import ResendVerification from "./pages/ResendVerification"
import Onboarding from "./pages/Onboarding"
import Pricing from "./pages/Pricing"
import About from "./pages/About"
import NotFound from "./pages/NotFound"

// Recruiter Pages
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard"
import CreateAssessment from "./pages/recruiter/CreateAssessment"
import EditAssessment from "./pages/recruiter/EditAssessment"
import RecruiterAssessments from "./pages/recruiter/Assessments"
import Candidates from "./pages/recruiter/Candidates"
import RecruiterResults from "./pages/recruiter/Results"
import Interviews from "./pages/recruiter/Interviews"
import Messages from "./pages/recruiter/Messages"
import Settings from "./pages/recruiter/Settings"
import RecruiterProfile from "./pages/recruiter/Profile"
import RecruiterFeedback from "./pages/recruiter/Feedback"
import RecruiterNotifications from "./pages/recruiter/Notifications"
import AssessmentDetails from './pages/recruiter/AssessmentDetails';
import Results from './pages/recruiter/Results';
import ResultsAnalytics from './pages/recruiter/ResultsAnalytics';
import SendInvites from './pages/recruiter/SendInvites';
import CreateTestAssessment from './pages/recruiter/CreateTestAssessment';
import Categories from "./pages/recruiter/Categories"
import PracticeProblems from "./pages/recruiter/PracticeProblems"
import CreatePracticeProblem from "./pages/recruiter/CreatePracticeProblem"
import EditPracticeProblem from "./pages/recruiter/EditPracticeProblem"
import PracticeProblemDetails from "./pages/recruiter/PracticeProblemDetails"
import ReviewSubmission from "./pages/recruiter/ReviewSubmission"

// Interviewee Pages
import IntervieweeDashboard from "./pages/interviewee/IntervieweeDashboard"
import AvailableTests from "./pages/interviewee/AvailableTests"
import IntervieweeResults from "./pages/interviewee/Results"
import PracticeArena from "./pages/interviewee/PracticeArena"
import ScheduledInterviews from "./pages/interviewee/ScheduledInterviews"
import IntervieweeMessages from "./pages/interviewee/Messages"
import IntervieweeProfile from "./pages/interviewee/Profile"
import IntervieweeSettings from "./pages/interviewee/Settings"
import AssessmentPage from "./pages/interviewee/AssessmentPage"
import IntervieweeFeedback from "./pages/interviewee/Feedback"
import IntervieweeNotifications from "./pages/interviewee/Notifications"

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === "recruiter" ? "/recruiter/dashboard" : "/interviewee/dashboard"
    return <Navigate to={redirectPath} replace />
  }

  return children
}

function OnboardingGuard({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== "interviewee") return <Navigate to="/" replace />
  if (user.onboarding === false) return children
  // If onboarding is complete, redirect to dashboard
  return <Navigate to="/interviewee/dashboard" replace />
}

function AppRoutes() {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={user.role === "recruiter" ? "/recruiter/dashboard" : "/interviewee/dashboard"} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to={user.role === "recruiter" ? "/recruiter/dashboard" : "/interviewee/dashboard"} replace />
          ) : (
            <Signup />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to={user.role === "recruiter" ? "/recruiter/dashboard" : "/interviewee/dashboard"} replace />
          ) : (
            <ForgotPassword />
          )
        }
      />
      <Route
        path="/reset-password"
        element={
          isAuthenticated ? (
            <Navigate to={user.role === "recruiter" ? "/recruiter/dashboard" : "/interviewee/dashboard"} replace />
          ) : (
            <ResetPassword />
          )
        }
      />
      <Route
        path="/verify-email"
        element={
          isAuthenticated ? (
            <Navigate to={user.role === "recruiter" ? "/recruiter/dashboard" : "/interviewee/dashboard"} replace />
          ) : (
            <VerifyEmail />
          )
        }
      />
      <Route
        path="/resend-verification"
        element={
          isAuthenticated ? (
            <Navigate to={user.role === "recruiter" ? "/recruiter/dashboard" : "/interviewee/dashboard"} replace />
          ) : (
            <ResendVerification />
          )
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requiredRole="interviewee">
            <OnboardingGuard>
              <Onboarding />
            </OnboardingGuard>
          </ProtectedRoute>
        }
      />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      
      {/* Recruiter Routes */}
      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/create-assessment"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <CreateAssessment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/edit-assessment/:id"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <EditAssessment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/assessments"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <RecruiterAssessments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/assessments/:id"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <AssessmentDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/review-submission/:assessmentId/:attemptId"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <ReviewSubmission />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/assessments/:id/results"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <Results />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/assessments/:id/send-invites"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <SendInvites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/send-invites"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <SendInvites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/candidates"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <Candidates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/results"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <RecruiterResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/analytics"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <ResultsAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/interviews"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <Interviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/messages"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/settings"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/profile"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <RecruiterProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/feedback"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <RecruiterFeedback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/notifications"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <RecruiterNotifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/create-test-assessment"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <CreateTestAssessment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/categories"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/practice-problems"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <PracticeProblems />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/practice-problems/create"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <CreatePracticeProblem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/practice-problems/edit/:id"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <EditPracticeProblem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/practice-problems/details/:id"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <PracticeProblemDetails />
          </ProtectedRoute>
        }
      />
      
      {/* Interviewee Routes */}
      <Route
        path="/interviewee/dashboard"
        element={
          <ProtectedRoute requiredRole="interviewee">
            <IntervieweeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviewee/tests"
        element={
          <ProtectedRoute requiredRole="interviewee">
            <AvailableTests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviewee/assessment/:id"
        element={
          <ProtectedRoute requiredRole="interviewee">
            <AssessmentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviewee/practice-assessment/:id"
        element={
          <ProtectedRoute requiredRole="interviewee">
            <AssessmentPage isPractice={true} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviewee/results"
        element={
          <ProtectedRoute requiredRole="interviewee">
            <IntervieweeResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviewee/practice"
        element={
          <ProtectedRoute requiredRole="interviewee">
            <PracticeArena />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviewee/interviews"
        element={
          <ProtectedRoute requiredRole="interviewee">
            <ScheduledInterviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviewee/messages"
        element={
          <ProtectedRoute requiredRole="interviewee">
            <IntervieweeMessages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviewee/profile"
        element={
          <ProtectedRoute requiredRole="interviewee">
            <IntervieweeProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviewee/settings"
        element={
          <ProtectedRoute requiredRole="interviewee">
            <IntervieweeSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviewee/feedback"
        element={
          <ProtectedRoute requiredRole="interviewee">
            <IntervieweeFeedback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviewee/notifications"
        element={
          <ProtectedRoute requiredRole="interviewee">
            <IntervieweeNotifications />
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

// Create a custom Router component with future flags
function CustomBrowserRouter({ children }) {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {children}
    </Router>
  )
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="smart-recruiter-theme">
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <CustomBrowserRouter>
              <AppRoutes />
            </CustomBrowserRouter>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}