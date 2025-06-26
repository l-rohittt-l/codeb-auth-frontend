import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboardPage from './pages/AdminDashboard/MainDashboard/AdminDashboardPage';
import SalesDashboardPage from './pages/SalesDashboard/SalesDashboardPage';
import HomePage from './pages/Home/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ProtectedRoute from './routes/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Role Management
import PromoteUser from './pages/AdminDashboard/ManageRoles/PromoteUserPage/PromoteUserPage';
import DemoteUserPage from './pages/AdminDashboard/ManageRoles/DemoteUserPage/DemoteUserPage';
import ManageRolesPage from './pages/AdminDashboard/ManageRoles/ManageRolesPage';

// Group Management
import GroupDashboard from './pages/GroupDashboard/MainGroupDashboard/GroupDashboard';
import AddGroup from './pages/GroupDashboard/AddGroup/AddGroup';
import EditGroup from './pages/GroupDashboard/EditGroup/EditGroup';

// Chain Management
import ChainDashboard from './pages/ChainDashboard/MainDashboard/ChainDashboard';
import AddChain from './pages/ChainDashboard/AddChain/AddChain';
import EditChain from './pages/ChainDashboard/EditChain/EditChain';

// Brand Management
import BrandDashboardPage from './pages/BrandDashboard/BrandDashboardPage';
import AddBrandPage from './pages/BrandDashboard/AddBrandPage';
import EditBrandPage from './pages/BrandDashboard/EditBrandPage';

// Zone Management
import ZoneDashboardPage from './pages/ZoneDashboard/ZoneDashboardPage';
import AddZone from './pages/ZoneDashboard/AddZone';
import EditZone from './pages/ZoneDashboard/EditZone';

// ✅ Estimate Management
import EstimateDashboard from './pages/EstimateDashboard/EstimateDashboard';
import AddEstimate from './pages/EstimateDashboard/AddEstimate';
import EditEstimate from './pages/EstimateDashboard/EditEstimate';

// ✅ Invoice Management
import CreateInvoice from './pages/InvoiceDashboard/CreateInvoice';
import InvoiceDashboard from './pages/InvoiceDashboard/InvoiceDashboard';

// ✅ OTP Verification Page
import OtpVerificationPage from './pages/VerifyOtp/OtpVerificationPage';

const App = () => {
  return (
    <BrowserRouter>
      <>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OtpVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Dashboards */}
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

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Manage Roles */}
          <Route
            path="/admin/manage-roles"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ManageRolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/promote"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <PromoteUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/demote"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DemoteUserPage />
              </ProtectedRoute>
            }
          />

          {/* Group Management */}
          <Route
            path="/groups/dashboard"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <GroupDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups/add"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <AddGroup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups/edit/:id"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <EditGroup />
              </ProtectedRoute>
            }
          />

          {/* Chain Management */}
          <Route
            path="/chains/dashboard"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <ChainDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chains/add"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <AddChain />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chains/edit/:id"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <EditChain />
              </ProtectedRoute>
            }
          />

          {/* Brand Management */}
          <Route
            path="/brands"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <BrandDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brands/add"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <AddBrandPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brands/edit/:id"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <EditBrandPage />
              </ProtectedRoute>
            }
          />

          {/* Zone Management */}
          <Route
            path="/zones"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <ZoneDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/zones/add"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <AddZone />
              </ProtectedRoute>
            }
          />
          <Route
            path="/zones/edit/:id"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <EditZone />
              </ProtectedRoute>
            }
          />

          {/* ✅ Estimate Management */}
          <Route
            path="/estimates"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <EstimateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estimates/add"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <AddEstimate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estimates/edit/:id"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <EditEstimate />
              </ProtectedRoute>
            }
          />

          {/* ✅ Invoice Management */}
          <Route
            path="/invoices"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <InvoiceDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices/create/:estimateId"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "SALES"]}>
                <CreateInvoice />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>

        <ToastContainer position="top-center" autoClose={3000} />
      </>
    </BrowserRouter>
  );
};

export default App;
