// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import PageWrapper from "./components/layout/PageWrapper";

// Auth Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import Profile from "./pages/Profile";

// Dashboard & Core Pages
import Dashboard from "./pages/Dashboard";
import SubmissionsPage from "./pages/SubmissionsPage";
import Extra from "./pages/Extra";  // ← ADDED

// Challenges
import ChallengeList from "./modules/challenges/ChallengeList";
import ChallengePage from "./modules/challenges/ChallengePage";

// Forum
import ForumList from "./components/forum/ForumList";
import ThreadPage from "./components/forum/ThreadPage";
import NewThreadForm from "./components/forum/NewThreadForm";

// Notifications
import NotificationsPage from "./components/notifications/NotificationsPage";
import InboxPage from "./components/notifications/InboxPage";

// Admin
import AdminChallengeEditor from "./components/admin/AdminChallengeEditor";
import AdminChallengeList from "./components/admin/AdminChallengeList";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<EmailVerification />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <Dashboard />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <Profile />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <ChallengeList />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges/:id"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <ChallengePage />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/submissions"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <SubmissionsPage />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            {/* ← EXTRA ROUTE ADDED */}
            <Route
              path="/extra"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <Extra />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/forum"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <ForumList />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/forum/new"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <NewThreadForm />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/forum/:threadId"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <ThreadPage />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <NotificationsPage />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <InboxPage />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/challenges"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <AdminChallengeList />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/challenge/new"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <AdminChallengeEditor />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/challenge/:id/edit"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PageWrapper>
                    <AdminChallengeEditor />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;