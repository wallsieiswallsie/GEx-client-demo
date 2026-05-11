import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LoadingState } from './common/Loading';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState text="" />;
  }

  if (!isAuthenticated) {
    // Jika belum login, redirect ke halaman login dengan membawa path asal (state)
    // agar bisa dikembalikan ke path tersebut setelah login sukses
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
