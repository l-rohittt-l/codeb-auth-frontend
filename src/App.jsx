import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SalesDashboardPage from './pages/SalesDashboardPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './routes/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Group Management Pages
import GroupDashboard from './pages/GroupDashboard';
import AddGroup from './pages/AddGroup';
import EditGroup from './pages/EditGroup'; // ✅ FIXED missing import

const App = () => {
  return (
    <BrowserRouter>
      <>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sales/dashboard"
            element={
              <ProtectedRoute requiredRole="SALES">
                <SalesDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Group Management Routes (Admin Only) */}
          <Route
            path="/groups/dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <GroupDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups/add"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AddGroup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups/edit/:id"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <EditGroup />
              </ProtectedRoute>
            }
          />

          {/* Fallback and generic routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>

        <ToastContainer position="top-center" autoClose={3000} />
      </>
    </BrowserRouter>
  );
};

export default App;
