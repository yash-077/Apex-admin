import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminRoute = ({ children }) => {
  const { admin, token, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-text">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  if (!token || !admin || admin.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;
