import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ManualTimetable from './pages/admin/ManualTimetable';
import LoginRegister from './pages/auth/LoginRegister';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTimetableView from './pages/admin/AdminTimetableView';
import HODView from './pages/hod/HODView';
import FacultyView from './pages/faculty/FacultyView';
import StudentView from './pages/student/StudentView';
import HODDashboard from './pages/hod/HODDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import CalendarTimetable from './components/timetable/CalendarTimetable';
import AdminCalendarView from './pages/admin/AdminCalendarView';
import useAuth from './hooks/useAuth';

const ProtectedRoute = ({ role, roles, children }) => {
  const { user } = useAuth();
  
  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // If specific role required but user doesn't have it
  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  // If multiple roles allowed but user doesn't have any of them
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return children;
};

const App = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LoginRegister />} />
      
      {/* Admin routes */}
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-view/:role" 
        element={
          <ProtectedRoute role="admin">
            <AdminTimetableView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/manual-entry" 
        element={
          <ProtectedRoute role="admin">
            <ManualTimetable />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-calendar" 
        element={
          <ProtectedRoute role="admin">
            <AdminCalendarView />
          </ProtectedRoute>
        } 
      />
      
      {/* HOD routes */}
      <Route 
        path="/hod" 
        element={
          <ProtectedRoute role="hod">
            <HODDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hod-view" 
        element={
          <ProtectedRoute role="hod">
            <HODView />
          </ProtectedRoute>
        } 
      />
      
      {/* Faculty routes */}
      <Route 
        path="/faculty" 
        element={
          <ProtectedRoute role="faculty">
            <FacultyDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/faculty-view" 
        element={
          <ProtectedRoute role="faculty">
            <FacultyView />
          </ProtectedRoute>
        } 
      />
      
      {/* Student routes */}
      <Route 
        path="/student" 
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student-view" 
        element={
          <ProtectedRoute role="student">
            <StudentView />
          </ProtectedRoute>
        } 
      />
      
      {/* Shared calendar route for all roles except admin */}
      <Route 
        path="/calendar-view" 
        element={
          <ProtectedRoute roles={['hod', 'faculty', 'student']}>
            <CalendarTimetable />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect for common dashboard path */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 page */}
      <Route path="*" element={<h1 style={{ textAlign: 'center', marginTop: '4rem' }}>404 - Page Not Found</h1>} />
    </Routes>
  </Router>
);

// Dashboard redirect component
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/" replace />;
  
  switch(user.role) {
    case 'admin':
      return <Navigate to="/admin-dashboard" replace />;
    case 'hod':
      return <Navigate to="/hod" replace />;
    case 'faculty':
      return <Navigate to="/faculty" replace />;
    case 'student':
      return <Navigate to="/student" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default App;