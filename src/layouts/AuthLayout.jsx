import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="flex items-center justify-center w-full h-40 animate-pulse">
            <div className="px-4 py-2 bg-white rounded-full shadow text-sm font-medium text-gray-400">Memuat halaman...</div>
        </div>
      }>
        <div className="w-full">
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
}
