import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/home/BottomNav';

/**
 * MobileAppLayout — frame mobile-first untuk semua halaman dalam app (Home, Paketku, dll).
 * Membatasi lebar maksimum 430px dan memusatkannya di layar desktop.
 * Konten dapat scroll, bottom nav tetap di bawah.
 */
export default function MobileAppLayout() {
  return (
    <div className="h-dvh bg-gray-100 flex justify-center overflow-hidden">
      <div
        className="relative w-full bg-white flex flex-col h-dvh overflow-hidden"
        style={{ maxWidth: '430px' }}
      >
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>

        <div className="shrink-0">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
