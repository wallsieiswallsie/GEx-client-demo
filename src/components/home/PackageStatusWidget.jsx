import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  AlertCircle,
  Warehouse,
  PackageCheck,
  Truck,
  MapPin,
  Inbox,
  CheckCircle
} from 'lucide-react';
import { SkeletonCard, SkeletonText } from './SkeletonCard';

const STATUS_ORDER = [
  'menunggu_tiba',
  'tidak_valid',
  'tiba_gudang',
  'dipacking',
  'dalam_pengiriman',
  'tiba_tujuan',
  'siap_diambil',
  'selesai',
];

const STATUS_CONFIG = {
  menunggu_tiba: {
    label: 'Menunggu\nTiba',
    color: 'text-blue-600',
    bg: 'bg-gray-100 border border-gray-200',
    icon: Clock,
  },
  tidak_valid: {
    label: 'Tidak\nValid',
    color: 'text-red-500',
    bg: 'bg-gray-100 border border-gray-200',
    icon: AlertCircle,
  },
  tiba_gudang: {
    label: 'Tiba\nGudang',
    color: 'text-gray-700',
    bg: 'bg-gray-100 border border-gray-200',
    icon: Warehouse,
  },
  dipacking: {
    label: 'Dipacking',
    color: 'text-purple-600',
    bg: 'bg-gray-100 border border-gray-200',
    icon: PackageCheck,
  },
  dalam_pengiriman: {
    label: 'Dalam\nPengiriman',
    color: 'text-amber-600',
    bg: 'bg-gray-100 border border-gray-200',
    icon: Truck,
  },
  tiba_tujuan: {
    label: 'Tiba\nTujuan',
    color: 'text-green-600',
    bg: 'bg-gray-100 border border-gray-200',
    icon: MapPin,
  },
  siap_diambil: {
    label: 'Siap\nDiambil',
    color: 'text-blue-700',
    bg: 'bg-gray-100 border border-gray-200',
    icon: Inbox,
  },
  selesai: {
    label: 'Selesai',
    color: 'text-gray-600',
    bg: 'bg-gray-100 border border-gray-200',
    icon: CheckCircle,
  },
};

function StatusChip({ count, config, onClick }) {
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-shrink-0 flex flex-col justify-between rounded-xl p-3 min-w-[110px] bg-gray-100 text-left active:scale-[0.98] transition"
    >

      {/* Row: icon + angka */}
      <div className="flex items-center justify-between">
        <Icon className={`w-5 h-5 ${config.color}`} />
        <span className={`text-xl font-bold ${config.color}`}>
          {count}
        </span>
      </div>

      {/* Label */}
      <span className="text-[10px] text-gray-500 mt-2 whitespace-pre-line leading-tight">
        {config.label}
      </span>
    </button>
  );
}

export default function PackageStatusWidget({ summary, isLoading }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl mx-4 p-4 shadow-sm border">
        <div className="flex justify-between mb-3">
          <SkeletonText width="120px" />
          <SkeletonText width="60px" />
        </div>
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} height="90px" className="min-w-[90px]" />
          ))}
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="bg-white rounded-2xl mx-4 p-4 shadow-sm border">
      <div className="flex justify-between mb-3">
        <h2 className="text-sm font-bold text-gray-800">Status Paketmu</h2>
        <button
          onClick={() => navigate('/paketku')}
          className="text-xs text-violet-600 font-semibold"
        >
          Lihat Detail
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {STATUS_ORDER.map((key) => (
          <StatusChip
            key={key}
            count={
              summary[key] ?? 0
            }
            config={STATUS_CONFIG[key]}
            onClick={() => navigate(`/paketku?status=${key.replaceAll("_", "-")}`)}
          />
        ))}
      </div>
    </div>
  );
}
