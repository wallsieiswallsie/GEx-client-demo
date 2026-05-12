import React from 'react';
import { Ship, Plane } from 'lucide-react';
import { SkeletonCard } from './SkeletonCard';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID');
}

function Card({ schedule }) {
  const isKapal = (schedule.via_type || 'Kapal') === 'Kapal';
  const Icon = isKapal ? Ship : Plane;

  return (
    <div className="w-64 p-4 bg-white rounded-2xl border shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <p className="text-sm font-bold">{schedule.ship_name}</p>
          <p className="text-xs text-gray-400">
            Closing: {formatDate(schedule.closing_date)}
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <p className="text-xs text-gray-400">Asal</p>
          <p className="font-bold">{schedule.origin_city}</p>
        </div>
        <div className="text-gray-400">→</div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Tujuan</p>
          <p className="font-bold">{schedule.destination_city}</p>
        </div>
      </div>
    </div>
  );
}

export default function ShipScheduleSection({ schedules, isLoading, onViewAll }) {
  return (
    <div className="bg-white mx-4 rounded-2xl p-4 shadow-sm border">
      <div className="flex justify-between mb-4">
        <h2 className="text-sm font-bold">Jadwal Kapal</h2>
        <button onClick={onViewAll} className="text-xs text-violet-600">
          Lihat Semua
        </button>
      </div>

      {isLoading ? (
        <SkeletonCard height="120px" />
      ) : schedules.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-400">
          Belum ada jadwal kapal
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto">
          {schedules.map((s) => (
            <Card key={s.id} schedule={s} />
          ))}
        </div>
      )}
    </div>
  );
}
