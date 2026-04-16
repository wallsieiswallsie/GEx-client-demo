import React from 'react';
import { SkeletonCard, SkeletonText } from './SkeletonCard';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' });
}

function ScheduleCard({ schedule }) {
  const isKapal = (schedule.via_type || 'Kapal') === 'Kapal';

  return (
    <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 w-64">
      {/* Icon + Ship name */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
          <span className="text-lg">{isKapal ? '🚢' : '✈️'}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800 leading-tight">{schedule.ship_name}</p>
          <p className="text-[11px] text-gray-400">
            Closing: {formatDate(schedule.closing_date)}
          </p>
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Asal</p>
          <p className="text-base font-bold text-gray-800">{schedule.origin_city || 'Jakarta'}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-[2px] bg-gray-300 mx-1" />
          <span className="text-gray-400 text-base">→</span>
        </div>
        <div className="flex-1 text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Tujuan</p>
          <p className="text-base font-bold text-gray-800">{schedule.destination_city || 'Makassar'}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * ShipScheduleSection — horizontal scroll list jadwal kapal/pesawat.
 * Data diterima dari CustomerHome via useShipSchedules hook (Redis-cached).
 */
export default function ShipScheduleSection({ schedules, isLoading, onViewAll }) {
  return (
    <div className="bg-white mx-4 rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-violet-600">🚢</span>
          <h2 className="text-sm font-bold text-gray-800">Jadwal Kapal</h2>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-violet-600 font-semibold hover:underline"
          aria-label="Lihat semua jadwal kapal"
        >
          Lihat Semua
        </button>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="flex gap-3 overflow-hidden">
          {[1, 2].map((i) => (
            <SkeletonCard key={i} height="120px" className="w-64 flex-shrink-0" />
          ))}
        </div>
      ) : schedules.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          Tidak ada jadwal tersedia
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {schedules.map((s) => (
            <ScheduleCard key={s.id} schedule={s} />
          ))}
        </div>
      )}
    </div>
  );
}
