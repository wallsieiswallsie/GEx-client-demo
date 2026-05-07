import React from 'react';
import { useAuth } from '../../context/useAuth';
import { useHomeSummary } from '../../hooks/useHomeSummary';
import BottomNav from '../../components/home/BottomNav';

export default function WarehouseHome() {
  const { user } = useAuth();
  const { data, isLoading } = useHomeSummary();

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      <header className="bg-gradient-to-r from-sky-600 to-sky-800 px-4 pt-10 pb-6 text-white">
        <p className="text-sky-200 text-xs font-medium mb-1">Dashboard Warehouse</p>
        <h1 className="text-xl font-bold">Halo, {user?.name || 'Staff'} 👋</h1>
      </header>

      <main className="flex-1 p-4 pb-24 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-sky-600 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Paket Belum Selesai', value: data?.warehouse_summary?.unfinished_packages ?? '-', color: 'text-sky-600', bg: 'bg-sky-50' },
                { label: 'Paket Bermasalah', value: data?.warehouse_summary?.problematic_packages ?? '-', color: 'text-red-500', bg: 'bg-red-50' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`${bg} rounded-2xl p-4 shadow-sm text-center border border-gray-100`}>
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                  <p className="text-[11px] text-gray-500 mt-1 leading-tight">{label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Modul operasional warehouse akan tersedia di sprint berikutnya.
              </p>
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
