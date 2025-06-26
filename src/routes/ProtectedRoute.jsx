import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('role'); // "ADMIN" or "SALES"

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normalize requiredRole to array
  const allowedRoles = Array.isArray(requiredRole)
    ? requiredRole
    : requiredRole
    ? [requiredRole]
    : [];

  // Check role access if requiredRole is specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: 'crimson' }}>
        <h2>🚫 Unauthorized Access</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
