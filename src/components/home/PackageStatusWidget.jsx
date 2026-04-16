import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SkeletonCard, SkeletonText } from './SkeletonCard';

const STATUS_CONFIG = {
  dalam_proses: {
    label: 'MENUNGGU\nTIBA',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    icon: '🕐',
  },
  tagihan_belum_bayar: {
    label: 'TIDAK\nVALID',
    color: 'text-red-500',
    bg: 'bg-red-50',
    iconColor: 'text-red-400',
    icon: '⚠️',
  },
  diambil: {
    label: 'SUDAH\nDIAMBIL',
    color: 'text-green-600',
    bg: 'bg-green-50',
    iconColor: 'text-green-500',
    icon: '✓',
  },
  selesai: {
    label: 'SELESAI',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    icon: '📦',
  },
};

function StatusChip({ count, config }) {
  return (
    <div className={`flex-shrink-0 flex flex-col items-center justify-center rounded-xl p-3 min-w-[80px] ${config.bg} border border-gray-100`}>
      <span className={`text-2xl font-bold ${config.color}`}>{count}</span>
      <span className={`text-[10px] font-semibold mt-1 text-center leading-tight text-gray-500 whitespace-pre-line`}>
        {config.label}
      </span>
    </div>
  );
}

/**
 * PackageStatusWidget — widget "Status Paketmu" dengan horizontal scroll chips.
 * Data diterima dari parent (CustomerHome) yang menggunakan useHomeSummary hook.
 */
export default function PackageStatusWidget({ summary, isLoading }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl mx-4 p-4 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <SkeletonText width="120px" />
          <SkeletonText width="60px" />
        </div>
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} height="80px" className="min-w-[80px]" />
          ))}
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const items = Object.entries(STATUS_CONFIG).map(([key, config]) => ({
    key,
    count: summary[key] ?? 0,
    config,
  }));

  return (
    <div className="bg-white rounded-2xl mx-4 p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-bold text-gray-800">Status Paketmu</h2>
        <button
          onClick={() => navigate('/paketku')}
          className="text-xs text-violet-600 font-semibold hover:underline"
          aria-label="Lihat detail semua paket"
        >
          Lihat Detail
        </button>
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide"
        role="list"
        aria-label="Status paket"
      >
        {items.map(({ key, count, config }) => (
          <div key={key} role="listitem">
            <StatusChip count={count} config={config} />
          </div>
        ))}
      </div>
    </div>
  );
}
