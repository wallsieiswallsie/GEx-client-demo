import React from 'react';
import { useAuth } from '../../context/useAuth';
import { useHomeSummary } from '../../hooks/useHomeSummary';
import { LoadingState } from '../../components/common/Loading';

export default function CourierHome() {
  const { user } = useAuth();
  const { data, isLoading } = useHomeSummary();

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      <header className="bg-gradient-to-r from-green-600 to-emerald-700 px-4 pt-10 pb-6 text-white">
        <p className="text-green-200 text-xs font-medium mb-1">Dashboard Kurir</p>
        <h1 className="text-xl font-bold">Halo, {user?.name || 'Kurir'} 🚴</h1>
      </header>

      <main className="flex-1 p-4 pb-24 flex flex-col gap-4">
        {isLoading ? (
          <LoadingState variant="section" text="Memuat ringkasan..." />
        ) : (
          <>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
              <p className="text-4xl font-bold text-green-600 mb-1">
                {data?.courier_summary?.active_deliveries ?? 0}
              </p>
              <p className="text-sm text-gray-500">Pengiriman Aktif Hari Ini</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Modul kurir selengkapnya akan tersedia di sprint berikutnya.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
