import React from 'react';
import { CalendarDays, Clock3, MapPin, Plane, Ship, ArrowRight } from 'lucide-react';
import { SkeletonCard } from './SkeletonCard';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
  });
}

function getStatus(schedule) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (schedule.depart_date) {
    const departDate = new Date(schedule.depart_date);
    departDate.setHours(0, 0, 0, 0);
    if (departDate < today) return { label: 'Berangkat', className: 'bg-blue-50 text-blue-700 border-blue-100' };
  }

  if (schedule.closing_date) {
    const closingDate = new Date(schedule.closing_date);
    closingDate.setHours(0, 0, 0, 0);
    if (closingDate < today) return { label: 'Closing', className: 'bg-amber-50 text-amber-700 border-amber-100' };
  }

  return { label: 'Open', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
}

function DateMetric({ icon: Icon, label, value, emphasis = false }) {
  return (
    <div className={`min-w-0 rounded-xl px-3 py-2 ${emphasis ? 'bg-sky-50' : 'bg-gray-50'}`}>
      <div className="mb-1 flex items-center gap-1 text-[10px] font-medium text-gray-400">
        {React.createElement(Icon, { className: "h-3 w-3 shrink-0" })}
        <span>{label}</span>
      </div>
      <p className={`whitespace-nowrap text-xs font-bold ${emphasis ? 'text-sky-700' : 'text-gray-700'}`}>
        {value}
      </p>
    </div>
  );
}

function Card({ schedule }) {
  const isKapal = (schedule.via_type || 'Kapal').toLowerCase() !== 'pesawat';
  const Icon = isKapal ? Ship : Plane;
  const status = getStatus(schedule);
  const shipName = schedule.ship_name || '-';
  const viaType = schedule.via_type || (isKapal ? 'Kapal' : 'Pesawat');

  return (
    <div className="min-w-[320px] max-w-[320px] rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 p-3.5 text-left shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/80 px-2 py-1 text-[10px] font-semibold text-sky-700 shadow-sm">
              <Icon className="h-3 w-3" />
              {viaType}
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${status.className}`}>
              {status.label}
            </span>
          </div>
          <p className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-gray-850">
            {shipName.toUpperCase()}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-sky-600 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="rounded-xl bg-white/80 p-2 pt-0 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.08)]">
        <div className="flex items-center gap-2 text-xs">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium text-gray-400">Asal</p>
            <p className="truncate font-bold text-gray-800">{schedule.origin_city || '-'}</p>
          </div>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-500">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1 text-right">
            <p className="text-[10px] font-medium text-gray-400">Tujuan</p>
            <p className="truncate font-bold text-gray-800">{schedule.destination_city || '-'}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <DateMetric label="Closing" value={formatDate(schedule.closing_date)} icon={Clock3} />
        <DateMetric label="Berangkat" value={formatDate(schedule.depart_date)} icon={CalendarDays} emphasis />
        <DateMetric label="Est. Tiba" value={formatDate(schedule.estimated_arrival)} icon={MapPin} />
      </div>
    </div>
  );
}

export default function ShipScheduleSection({ schedules, isLoading, error, onViewAll }) {
  const displayedSchedules = (schedules || []).slice(0, 5);

  return (
    <div className="bg-white mx-4 rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Jadwal Kapal</h2>
          <p className="mt-0.5 text-[11px] text-gray-400">Kloter terdekat untuk pengirimanmu</p>
        </div>
        <button onClick={onViewAll} className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
          Lihat Semua
        </button>
      </div>

      {isLoading ? (
        <SkeletonCard height="156px" rounded="rounded-2xl" />
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-500">
          Jadwal kapal belum dapat dimuat
        </div>
      ) : displayedSchedules.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-400">
          Belum ada jadwal kapal
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {displayedSchedules.map((s) => (
            <Card key={s.id} schedule={s} />
          ))}
        </div>
      )}
    </div>
  );
}
