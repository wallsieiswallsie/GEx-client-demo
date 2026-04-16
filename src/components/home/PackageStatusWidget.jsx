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
    label: 'MENUNGGU\nTIBA',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    icon: Clock,
  },
  tidak_valid: {
    label: 'TIDAK\nVALID',
    color: 'text-red-500',
    bg: 'bg-red-50',
    icon: AlertCircle,
  },
  tiba_gudang: {
    label: 'TIBA\nGUDANG',
    color: 'text-gray-700',
    bg: 'bg-gray-100',
    icon: Warehouse,
  },
  dipacking: {
    label: 'DIPACKING',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    icon: PackageCheck,
  },
  dalam_pengiriman: {
    label: 'DALAM\nPENGIRIMAN',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    icon: Truck,
  },
  tiba_tujuan: {
    label: 'TIBA\nTUJUAN',
    color: 'text-green-600',
    bg: 'bg-green-50',
    icon: MapPin,
  },
  siap_diambil: {
    label: 'SIAP\nDIAMBIL',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    icon: Inbox,
  },
  selesai: {
    label: 'SELESAI',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    icon: CheckCircle,
  },
};

function StatusChip({ count, config }) {
  const Icon = config.icon;

  return (
    <div className={`flex-shrink-0 flex flex-col items-center justify-center rounded-xl p-3 min-w-[90px] ${config.bg}`}>
      <Icon className={`w-5 h-5 mb-1 ${config.color}`} />
      <span className={`text-xl font-bold ${config.color}`}>{count}</span>
      <span className="text-[10px] text-gray-500 text-center whitespace-pre-line leading-tight">
        {config.label}
      </span>
    </div>
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

      <div className="flex gap-3 overflow-x-auto pb-1">
        {STATUS_ORDER.map((key) => (
          <StatusChip
            key={key}
            count={summary[key] ?? 0}
            config={STATUS_CONFIG[key]}
          />
        ))}
      </div>
    </div>
  );
}