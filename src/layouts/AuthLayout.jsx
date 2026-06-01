import React, { Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { LoadingState } from "../components/common/Loading";
import { NoIndexSEO } from "../components/SEO";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Tunggu pengecekan token selesai sebelum memutuskan redirect
  if (isLoading) {
    return <LoadingState text="" />;
  }

  // Sudah login → tolak akses ke /login dan /register
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <NoIndexSEO />
      <Suspense fallback={<LoadingState variant="section" text="Memuat halaman..." />}>
        <div className="w-full">
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
}
