import React from 'react';
import { useNavigate } from 'react-router-dom';

const MENU_ITEMS = [
  { id: 'cek-ongkir', image: '/images/customer_home/cek_ongkir.png', label: 'Cek Ongkir', path: '/cek-ongkir' },
  { id: 'lacak-paket', image: '/images/customer_home/lacak_paket.png', label: 'Lacak Paket', path: '/lacak' },
  { id: 'daftar-paket', image: '/images/customer_home/daftarkan_paket.png', label: 'Daftarkan\nPaket', path: '/daftar-paket' },
  { id: 'lokasi-gerai', image: '/images/customer_home/lokasi_gerai.png', label: 'Lokasi Gerai', path: '/gerai' },
  { id: 'kemitraan', image: '/images/customer_home/kemitraan.png', label: 'Kemitraan', path: '/kemitraan' },
  { id: 'cod-unboxing', image: '/images/customer_home/cod_unboxing.png', label: 'COD &\nUnboxing', path: '/cod' },
  { id: 'bantuan', image: '/images/customer_home/bantuan.png', label: 'Bantuan', path: '/bantuan' },
  { id: 'jadwal-kapal', image: '/images/customer_home/jadwal_kapal.png', label: 'Jadwal\nKapal', path: '/jadwal' },
];

function MenuItem({ item, onClick }) {
  return (
    <button
      onClick={() => onClick(item.path)}
      className="group flex min-h-[90px] w-full flex-col items-center justify-center gap-2 rounded-2xl bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 shadow-lg transition-all duration-200 group-hover:shadow-md">
        <img
          src={item.image}
          alt={item.label.replace('\n', ' ')}
          className="h-8 w-8 object-contain"
        />
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
      <div className="grid grid-cols-4 gap-3">
        {MENU_ITEMS.map((item) => (
          <MenuItem key={item.id} item={item} onClick={navigate} />
        ))}
      </div>
    </div>
  );
}
