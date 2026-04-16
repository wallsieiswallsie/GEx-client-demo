import React from 'react';
import { useNavigate } from 'react-router-dom';

const MENU_ITEMS = [
  { id: 'cek-ongkir',      icon: '📦', label: 'Cek Ongkir',        path: '/cek-ongkir',      color: 'bg-blue-50   text-blue-600' },
  { id: 'lacak-paket',     icon: '🔍', label: 'Lacak Paket',       path: '/lacak',           color: 'bg-amber-50  text-amber-600' },
  { id: 'daftar-paket',    icon: '✏️',  label: 'Daftarkan\nPaket', path: '/daftar-paket',    color: 'bg-purple-50 text-purple-600' },
  { id: 'lokasi-gerai',    icon: '📍', label: 'Lokasi Gerai',      path: '/gerai',           color: 'bg-green-50  text-green-600' },
  { id: 'kemitraan',       icon: '🤝', label: 'Kemitraan',         path: '/kemitraan',       color: 'bg-red-50    text-red-500' },
  { id: 'cod-unboxing',    icon: '📷', label: 'COD &\nUnboxing',   path: '/cod',             color: 'bg-sky-50    text-sky-600' },
  { id: 'bantuan',         icon: '🎧', label: 'Bantuan',           path: '/bantuan',         color: 'bg-orange-50 text-orange-500' },
  { id: 'jadwal-kapal',    icon: '🚢', label: 'Jadwal\nKapal',     path: '/jadwal',          color: 'bg-violet-50 text-violet-600' },
];

function MenuItem({ item, onClick }) {
  return (
    <button
      id={`menu-${item.id}`}
      onClick={() => onClick(item.path)}
      className="flex flex-col items-center gap-1.5 group"
      aria-label={item.label}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
          transition-all duration-200 group-hover:scale-110 group-active:scale-95
          shadow-sm ${item.color.split(' ')[0]}`}
      >
        {item.icon}
      </div>
      <span className="text-[10px] font-medium text-gray-600 text-center leading-tight whitespace-pre-line">
        {item.label}
      </span>
    </button>
  );
}

/**
 * ServiceMenuGrid — grid 4×2 layanan utama GEX.
 * Sesuai dengan section "Layanan Kami" di screen.jpg.
 */
export default function ServiceMenuGrid() {
  const navigate = useNavigate();

  return (
    <div className="bg-white mx-4 rounded-2xl p-4 shadow-sm border border-gray-100">
      <h2 className="text-sm font-bold text-gray-800 mb-4">Layanan Kami</h2>
      <div
        className="grid grid-cols-4 gap-y-4"
        role="navigation"
        aria-label="Layanan GEX"
      >
        {MENU_ITEMS.map((item) => (
          <MenuItem key={item.id} item={item} onClick={navigate} />
        ))}
      </div>
    </div>
  );
}
