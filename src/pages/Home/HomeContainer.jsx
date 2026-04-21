import React from 'react';
import { useAuth } from '../../context/AuthContext';
import CustomerHome from './CustomerHome';
import GeneralManagerHome from './GeneralManagerHome';
import BranchManagerHome from './BranchManagerHome';
import BranchStaffHome from './BranchStaffHome';
import SuperAdminHome from './SuperAdminHome';

// Scaffold cepat untuk role lain — akan dikembangkan di sprint berikutnya
const CourierHome = React.lazy(() => import('./CourierHome'));

/**
 * HomeContainer — Role Switcher.
 * Membaca role dari AuthContext dan merender sub-komponen yang sesuai.
 * Frontend tidak menentukan data apa yang tampil — hanya menentukan TAMPILAN per role.
 * Data filtering dilakukan sepenuhnya di backend berdasarkan JWT credentials.
 */
export default function HomeContainer() {
  const { role, isLoading } = useAuth();

  // Masih loading auth
  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-violet-600 animate-spin" />
          <span className="text-sm text-gray-500 font-medium">Memuat...</span>
        </div>
      </div>
    );
  }

  // Role switcher
  switch (role) {
    case 'customer':
      return <CustomerHome />;

    case 'general_manager':
      return (
        <React.Suspense fallback={<RoleFallback />}>
          <GeneralManagerHome />
        </React.Suspense>
      );

    case 'branch_manager':
      return (
        <React.Suspense fallback={<RoleFallback />}>
          <BranchManagerHome />
        </React.Suspense>
      );

    case 'courier':
      return (
        <React.Suspense fallback={<RoleFallback />}>
          <CourierHome />
        </React.Suspense>
      );

    case 'branch_staff':
      return (
        <React.Suspense fallback={<RoleFallback />}>
          <BranchStaffHome />
        </React.Suspense>
      );

    case 'super_admin':
      return (
        <React.Suspense fallback={<RoleFallback />}>
          <SuperAdminHome />
        </React.Suspense>
      );

    default:
      // Role tidak dikenal — tampilkan pesan aman
      return (
        <div className="min-h-dvh flex items-center justify-center bg-gray-50 px-6">
          <div className="text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h1 className="text-lg font-bold text-gray-800 mb-2">Role Tidak Dikenali</h1>
            <p className="text-sm text-gray-500">
              Akun Anda tidak memiliki role yang valid. Hubungi administrator.
            </p>
          </div>
        </div>
      );
  }
}

function RoleFallback() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-violet-600 animate-spin" />
    </div>
  );
}
