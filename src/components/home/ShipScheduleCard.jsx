import React, { useState } from 'react';
import { CalendarDays, Clock3, MapPin, Plane, Ship, ArrowRight } from 'lucide-react';
import { SkeletonCard } from './SkeletonCard';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
  });
}

function formatShipName(name) {
  const cleanName = (name || '-').replace(/^km\.?\s*/i, '').trim();
  return `KM. ${cleanName.toUpperCase()}`;
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
  const className = emphasis
    ? 'border-blue-100 bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] text-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.10)]'
    : label === 'Closing'
      ? 'border-gray-100 bg-gradient-to-br from-white to-[#f5f5f5] text-gray-700 shadow-[0_3px_10px_rgba(15,23,42,0.04)]'
      : 'border-slate-100 bg-gradient-to-br from-[#fafafa] to-[#f1f5f9] text-slate-700 shadow-[0_3px_10px_rgba(15,23,42,0.04)]';

  return (
    <div className={`min-w-0 overflow-hidden rounded-2xl border px-2 py-2 ${className}`}>
      <div className={`mb-1 flex min-w-0 items-center gap-1 text-[9px] font-semibold ${emphasis ? 'text-blue-600' : 'text-gray-500'}`}>
        {React.createElement(Icon, { className: "h-3 w-3 shrink-0" })}
        <span className="truncate">{label}</span>
      </div>
      <p className={`truncate text-[11px] font-bold ${emphasis ? 'text-blue-700' : ''}`}>
        {value}
      </p>
    </div>
  );
}

function Card({ schedule }) {
  const isKapal = (schedule.via_type || 'Kapal').toLowerCase() !== 'pesawat';
  const Icon = isKapal ? Ship : Plane;
  const status = getStatus(schedule);
  const shipName = formatShipName(schedule.ship_name);
  const viaType = schedule.via_type || (isKapal ? 'Kapal' : 'Pesawat');

  return (
    <div className="box-border w-full max-w-full overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-sky-50/70 to-blue-50 p-3 text-left shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition duration-200 hover:-translate-y-0.5 active:scale-[0.98]">
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex min-w-0 items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-semibold text-blue-700 shadow-sm">
              <Icon className="h-3 w-3" />
              {viaType}
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${status.className}`}>
              {status.label}
            </span>
          </div>
          <p className="line-clamp-2 min-h-[40px] text-sm font-extrabold uppercase leading-5 tracking-[-0.2px] text-gray-900">
            {shipName}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-blue-600 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="box-border max-w-full overflow-hidden rounded-2xl bg-white/85 p-1.5 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.08)]">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(54px,0.8fr)_minmax(0,1fr)] items-center gap-1.5 text-xs">
          <div className="min-w-0 rounded-xl border border-gray-100 bg-white px-2 py-2 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <p className="text-[10px] font-medium text-gray-400">Asal</p>
            <p className="truncate font-bold text-gray-800">{schedule.origin_city || '-'}</p>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="h-px flex-1 border-t-2 border-dotted border-blue-200" />
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <ArrowRight className="h-4 w-4" />
            </span>
            <span className="h-px flex-1 border-t-2 border-dotted border-blue-200" />
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-white px-2 py-2 text-right shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <p className="text-[10px] font-medium text-gray-400">Tujuan</p>
            <p className="truncate font-bold text-gray-800">{schedule.destination_city || '-'}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid min-w-0 grid-cols-[repeat(3,minmax(0,1fr))] gap-2">
        <DateMetric label="Closing" value={formatDate(schedule.closing_date)} icon={Clock3} />
        <DateMetric label="Berangkat" value={formatDate(schedule.depart_date)} icon={CalendarDays} emphasis />
        <DateMetric label="Est. Tiba" value={formatDate(schedule.estimated_arrival)} icon={MapPin} />
      </div>
    </div>
  );
}

export default function ShipScheduleSection({ schedules, isLoading, error, onViewAll }) {
  const displayedSchedules = (schedules || []).slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const viewport = event.currentTarget;
    const cardWidth = viewport.querySelector('[data-schedule-card]')?.clientWidth || 320;
    const gap = 12;
    const nextIndex = Math.round(viewport.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.max(0, Math.min(nextIndex, displayedSchedules.length - 1)));
  };

  return (
    <div className="box-border mx-4 max-w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold tracking-[-0.2px] text-gray-800">Jadwal Kapal</h2>
          <p className="mt-0.5 text-[11px] text-gray-400">Kloter terdekat untuk pengirimanmu</p>
        </div>
        <button onClick={onViewAll} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 active:text-blue-800">
          <span>Lihat Semua</span>
          <ArrowRight className="h-3.5 w-3.5" />
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
        <>
          <div className="box-border flex w-full max-w-full gap-3 overflow-x-auto pb-1 scrollbar-hide" onScroll={handleScroll}>
            {displayedSchedules.map((s) => (
              <div key={s.id} data-schedule-card className="box-border min-w-full max-w-full">
                <Card schedule={s} />
              </div>
            ))}
          </div>
          {displayedSchedules.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {displayedSchedules.map((s, index) => (
                <span
                  key={s.id || index}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    index === activeIndex ? 'w-5 bg-blue-600' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
