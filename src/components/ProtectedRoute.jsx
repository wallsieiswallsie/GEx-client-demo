import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LoadingState } from './common/Loading';
import { hasAllowedRole } from '../utils/roleAccess';
import GuestRestrictionPage from '../pages/GuestRestrictionPage';

const ProtectedRoute = ({ children, allowedRoles = [], unauthorizedTo = '/home' }) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState text="" />;
  }

  if (!isAuthenticated) {
    return <GuestRestrictionPage from={location} />;
  }

  if (!hasAllowedRole(role, allowedRoles)) {
    return <Navigate to={unauthorizedTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
