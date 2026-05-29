import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LoadingState } from './common/Loading';
import { hasAllowedRole } from '../utils/roleAccess';

const ProtectedRoute = ({ children, allowedRoles = [], unauthorizedTo = '/home' }) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState text="" />;
  }

  if (!isAuthenticated) {
    // Jika belum login, redirect ke halaman login dengan membawa path asal (state)
    // agar bisa dikembalikan ke path tersebut setelah login sukses
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAllowedRole(role, allowedRoles)) {
    return <Navigate to={unauthorizedTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
