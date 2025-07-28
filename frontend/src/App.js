import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "./App.css"

// Layouts
import MainLayout from "./layouts/MainLayout"
import AdminLayout from "./layouts/AdminLayout"

// Auth Pages
import Login from "./pages/auth/Login"
import AdminLogin from "./pages/auth/AdminLogin"
import PasswordReset from "./pages/auth/PasswordReset"
import Profile from "./pages/auth/Profile"

// Dashboard Pages
import SuperadminDashboard from "./pages/dashboards/SuperadminDashboard"
import FacultyDashboard from "./pages/dashboards/FacultyDashboard"
import StudentDashboard from "./pages/dashboards/StudentDashboard"

// Course Pages
import CourseListFaculty from "./pages/courses/CourseListFaculty"
import CourseListStudent from "./pages/courses/CourseListStudent"
import ViewCourse from "./pages/courses/ViewCourse"
import CourseCreateFaculty from "./pages/courses/CourseCreateFaculty"
import CourseEditFaculty from "./pages/courses/CourseEditFaculty"
import CourseAttachmentsFaculty from "./pages/courses/CourseAttachmentsFaculty"
import AvailableCoursesStudent from "./pages/courses/AvailableCoursesStudent"
import EnrollCourseStudent from "./pages/courses/EnrollCourseStudent"
import UnenrollCourseStudent from "./pages/courses/UnenrollCourseStudent"
import CourseDetailFaculty from "./pages/courses/CourseDetailFaculty"
import CourseDetailStudent from "./pages/courses/CourseDetailStudent"
import CourseStudentListFaculty from "./pages/courses/CourseStudentListFaculty";

// Assignment Pages
import AssignmentCreateFaculty from "./pages/assignments/AssignmentCreateFaculty"
import AssignmentSubmitStudent from "./pages/assignments/AssignmentSubmitStudent"
import AssignmentListStudent from "./pages/assignments/AssignmentListStudent"
import AssignmentDetailStudent from "./pages/assignments/AssignmentDetailStudent"
import AssignmentListFaculty from "./pages/assignments/AssignmentListFaculty"
import AssignmentDetailFaculty from "./pages/assignments/AssignmentDetailFaculty"
import AssignmentEditFaculty from "./pages/assignments/AssignmentEditFaculty"

// Quiz Pages
import QuizAttempt from "./pages/quizzes/QuizAttempt"
import QuizListFaculty from "./pages/quizzes/QuizListFaculty"
import FacultyQuizView from "./pages/quizzes/FacultyQuizView"
import FacultyQuizGrade from "./pages/quizzes/FacultyQuizGrade"
import QuizCreation from "./pages/quizzes/QuizCreation"

// Other Pages
import Chat from "./pages/communication/Chat"
import Calendar from "./pages/calendar/Calendar"
import PlagiarismResults from "./pages/plagiarism/PlagiarismResults"
import AllNotifications from "./pages/notifications/AllNotifications"

// Auth Context
import { AuthProvider } from "./contexts/AuthContext"
import UserManagement from "./pages/admin/UserManagement"
import SystemSettings from "./pages/admin/SystemSettings"
import Reports from "./pages/admin/Reports"
import AuditLogs from "./pages/admin/AuditLogs"
import AddUser from "./pages/admin/AddUser"
import EditUser from "./pages/admin/EditUser"
import Settings from "./pages/Settings"
import ProtectedRoute from "./components/ProtectedRoute"
import Unauthorized from "./pages/Unauthorized"
import UserDetails from "./pages/admin/UserDetails";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/reset-password" element={<PasswordReset />} />

          {/* User Settings Route (top-level) */}
          <Route path="/settings" element={<Settings />} />

          {/* Unauthorized Route */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Faculty Routes (faculty only) */}
          <Route path="/faculty" element={
            <ProtectedRoute allowedRoles={["FACULTY"]}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<FacultyDashboard />} />
            <Route path="courses" element={<CourseListFaculty />} />
            <Route path="courses/:courseId/edit" element={<CourseEditFaculty />} />
            <Route path="courses/:courseId" element={<CourseDetailFaculty />} />
            <Route path="courses/:courseId/students" element={<CourseStudentListFaculty />} />
            <Route path="assignments/create" element={<AssignmentCreateFaculty />} />
            <Route path="assignments" element={<AssignmentListFaculty />} />
            <Route path="assignments/:id" element={<AssignmentDetailFaculty />} />
            <Route path="assignments/:id/edit" element={<AssignmentEditFaculty />} />
            <Route path="assignments/:assignmentId/grade/:submissionId" element={<AssignmentDetailFaculty />} />
            <Route path="quizzes" element={<QuizListFaculty />} />
            <Route path="quizzes/create" element={<QuizCreation />} />
            <Route path="quizzes/:id/view" element={<FacultyQuizView />} />
            <Route path="quizzes/:quizId/grade/:submissionId" element={<FacultyQuizGrade />} />
            <Route path="chat" element={<Chat />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes (superadmin only) */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
              <AdminLayout />
            </ProtectedRoute> 
          }>
            <Route path="dashboard" element={<SuperadminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="users/add" element={<AddUser />} />
            <Route path="users/edit/:userId" element={<EditUser />} />
            <Route path="users/:userId" element={<UserDetails />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="reports" element={<Reports />} />
            <Route path="logs" element={<AuditLogs />} />
            <Route path="chat" element={<Chat />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Student Routes (student only) */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<CourseListStudent />} />
            <Route path="courses/available" element={<AvailableCoursesStudent />} />
            <Route path="courses/enroll" element={<EnrollCourseStudent />} />
            <Route path="courses/unenroll" element={<UnenrollCourseStudent />} />
            <Route path="courses/:courseId" element={<CourseDetailStudent />} />
            <Route path="assignments" element={<AssignmentListStudent />} />
            <Route path="assignments/:id" element={<AssignmentDetailStudent />} />
            <Route path="assignments/:id/submit" element={<AssignmentSubmitStudent />} />
            <Route path="quizzes/attempt" element={<QuizAttempt />} />
            <Route path="quizzes/:id/view" element={<QuizAttempt />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<AllNotifications />} />
            <Route path="plagiarism" element={<PlagiarismResults />} />
            <Route path="chat" element={<Chat />} />
            <Route path="calendar" element={<Calendar />} />
          </Route>

          {/* Common Routes (all roles) */}
          {/* <Route path="/chat" element={<Chat />} />
          <Route path="/calendar" element={<Calendar />} /> */}

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
