import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * MobileAppLayout — frame mobile-first untuk semua halaman dalam app (Home, Paketku, dll).
 * Membatasi lebar maksimum 430px dan memusatkannya di layar desktop.
 * Konten dapat scroll, bottom nav tetap di bawah.
 */
export default function MobileAppLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div
        className="relative w-full bg-white flex flex-col"
        style={{ maxWidth: '430px', minHeight: '100dvh' }}
      >
        <Outlet />
      </div>
    </div>
  );
}
