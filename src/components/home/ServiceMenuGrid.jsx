import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Search,
  Pencil,
  MapPin,
  Handshake,
  Camera,
  Headphones,
  Ship
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'cek-ongkir', icon: Package, label: 'Cek Ongkir', path: '/cek-ongkir', color: 'bg-blue-50 text-blue-600' },
  { id: 'lacak-paket', icon: Search, label: 'Lacak Paket', path: '/lacak', color: 'bg-amber-50 text-amber-600' },
  { id: 'daftar-paket', icon: Pencil, label: 'Daftarkan\nPaket', path: '/daftar-paket', color: 'bg-purple-50 text-purple-600' },
  { id: 'lokasi-gerai', icon: MapPin, label: 'Lokasi Gerai', path: '/gerai', color: 'bg-green-50 text-green-600' },
  { id: 'kemitraan', icon: Handshake, label: 'Kemitraan', path: '/kemitraan', color: 'bg-red-50 text-red-500' },
  { id: 'cod-unboxing', icon: Camera, label: 'COD &\nUnboxing', path: '/cod', color: 'bg-sky-50 text-sky-600' },
  { id: 'bantuan', icon: Headphones, label: 'Bantuan', path: '/bantuan', color: 'bg-orange-50 text-orange-500' },
  { id: 'jadwal-kapal', icon: Ship, label: 'Jadwal\nKapal', path: '/jadwal', color: 'bg-violet-50 text-violet-600' },
];

function MenuItem({ item, onClick }) {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item.path)}
      className="flex flex-col items-center gap-1.5"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-[10px] text-gray-600 text-center whitespace-pre-line">
        {item.label}
      </span>
    </button>
  );
}

export default function ServiceMenuGrid() {
  const navigate = useNavigate();

  return (
    <div className="bg-white mx-4 rounded-2xl p-4 shadow-sm border border-gray-100">
      <h2 className="text-sm font-bold text-gray-800 mb-4">Layanan Kami</h2>
      <div className="grid grid-cols-4 gap-y-4">
        {MENU_ITEMS.map((item) => (
          <MenuItem key={item.id} item={item} onClick={navigate} />
        ))}
      </div>
    </div>
  );
}