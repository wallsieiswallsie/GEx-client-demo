import React, { Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Tunggu pengecekan token selesai sebelum memutuskan redirect
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  // Sudah login → tolak akses ke /login dan /register
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="flex items-center justify-center w-full h-40 animate-pulse">
          <div className="px-4 py-2 bg-white rounded-full shadow text-sm font-medium text-gray-400">
            Memuat halaman...
          </div>
        </div>
      }>
        <div className="w-full">
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
}