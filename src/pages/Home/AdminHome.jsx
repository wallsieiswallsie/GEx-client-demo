import React from 'react';
import { useAuth } from '../../context/useAuth';
import { useHomeSummary } from '../../hooks/useHomeSummary';
import BottomNav from '../../components/home/BottomNav';
import { LoadingState } from '../../components/common/Loading';

export default function AdminHome() {
  const { user, logout } = useAuth();
  const { data, isLoading } = useHomeSummary();

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-violet-700 to-violet-900 px-4 pt-10 pb-6 text-white">
        <p className="text-violet-200 text-xs font-medium mb-1">Dashboard Admin</p>
        <h1 className="text-xl font-bold">Halo, {user?.name || 'Admin'} 👋</h1>
      </header>

      <main className="flex-1 p-4 pb-24 flex flex-col gap-4">
        {isLoading ? (
          <LoadingState variant="section" text="Memuat ringkasan..." />
        ) : (
          <>
            {/* Global summary cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Paket', value: data?.global_summary?.total_packages ?? '-', color: 'text-violet-600' },
                { label: 'Total User', value: data?.global_summary?.total_users ?? '-', color: 'text-blue-600' },
                { label: 'Tagihan Pending', value: data?.global_summary?.pending_invoices ?? '-', color: 'text-red-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-2xl p-3 shadow-sm text-center border border-gray-100">
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Modul admin selengkapnya akan tersedia di sprint berikutnya.
              </p>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
