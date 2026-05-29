import { createElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  PackageSearch,
  Ship,
} from "lucide-react";
import { LoadingState } from "../../components/common/Loading";
import { getDisplayedShipSchedules } from "../../services/api/content/contentApi";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const parseDateOnly = (value) => {
  if (!value) return null;

  const normalized = String(value).slice(0, 10);
  const parts = normalized.split("-").map(Number);

  if (parts.length === 3 && parts.every(Number.isFinite)) {
    const [year, month, day] = parts;
    return new Date(Date.UTC(year, month - 1, day));
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value) => {
  const date = parseDateOnly(value);
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const getDurationLabel = (departDate, arrivalDate) => {
  const depart = parseDateOnly(departDate);
  const arrival = parseDateOnly(arrivalDate);

  if (!depart || !arrival) return "-";

  const diffDays = Math.round((arrival.getTime() - depart.getTime()) / DAY_IN_MS);
  if (!Number.isFinite(diffDays) || diffDays < 0) return "-";

  return `${diffDays} Hari`;
};

const getAvailabilityLabel = (item) => {
  if (typeof item?.is_available === "boolean") {
    return item.is_available ? "Tersedia" : "Tidak Tersedia";
  }

  if (typeof item?.available === "boolean") {
    return item.available ? "Tersedia" : "Tidak Tersedia";
  }

  const rawStatus = item?.availability_status || item?.availability || item?.status;
  if (!rawStatus) return "";

  const normalized = String(rawStatus).replace(/[_-]/g, " ").trim();
  if (!normalized) return "";

  return normalized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function CustomerShipSchedulesPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDisplayedShipSchedules()
      .then((data) => setItems(data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-dvh bg-gray-50 pb-6 text-slate-900">
      <section
        className="relative overflow-hidden px-6 pb-16 pt-8 text-white"
        style={{
          backgroundImage: "url('/images/header_background/jadwal_kapal.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-10 rounded-t-[50%] bg-gray-50" />

        <div className="relative z-10 flex items-start gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold leading-tight">Jadwal Kapal</h1>
            <p className="mt-2 max-w-[210px] text-sm leading-relaxed text-white/85">
              Cari jadwal keberangkatan kapal ke tujuanmu
            </p>
          </div>
        </div>
      </section>

      <main className="relative -mt-10 space-y-5 px-4">
        <div className="flex items-center gap-3 rounded-[28px] border border-white bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <CalendarCheck2 className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold leading-snug text-violet-900">
              Pastikan jadwal sesuai rencana kirimmu
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Jadwal dapat berubah sewaktu-waktu
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState variant="list" rows={4} />
        ) : items.length === 0 ? (
          <EmptyScheduleState />
        ) : (
          <section className="space-y-4">
            {items.map((item) => (
              <ScheduleCard key={item.id} item={item} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function ScheduleCard({ item }) {
  const availabilityLabel = getAvailabilityLabel(item);
  const durationLabel = getDurationLabel(item.depart_date, item.estimated_arrival);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
      <div className="flex items-start gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Ship className="h-9 w-9" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-black text-slate-950">
                {item.ship_name || "-"}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                Closing: {formatDate(item.closing_date)}
              </p>
            </div>

            {availabilityLabel && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                {availabilityLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="my-4 border-t border-slate-100" />

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <RoutePoint
          label="Asal"
          city={item.origin_city || "-"}
          dateLabel="Berangkat"
          date={formatDate(item.depart_date)}
          accent="blue"
        />

        <div className="flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-700">
            <ArrowRight className="h-6 w-6" />
          </div>
        </div>

        <RoutePoint
          label="Tujuan"
          city={item.destination_city || "-"}
          dateLabel="Tiba"
          date={formatDate(item.estimated_arrival)}
          accent="violet"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-2xl bg-violet-50/70">
        <ScheduleMeta Icon={Clock3} label="Estimasi Durasi" value={durationLabel} />
        <ScheduleMeta Icon={Ship} label="Jenis Kapal" value="Kapal Pelni" withDivider />
      </div>
    </article>
  );
}

function RoutePoint({ label, city, dateLabel, date, accent }) {
  const accentClass = accent === "blue" ? "text-blue-600" : "text-violet-700";

  return (
    <div className="min-w-0">
      <p className="text-xs font-bold text-slate-400">{label}</p>
      <p className="mt-2 truncate text-lg font-black text-slate-950">{city}</p>
      <p className={`mt-5 flex items-center gap-2 text-sm font-bold ${accentClass}`}>
        <CalendarDays className="h-4 w-4" />
        {dateLabel}
      </p>
      <p className="mt-2 text-base font-semibold text-slate-800">{date}</p>
    </div>
  );
}

function ScheduleMeta({ Icon, label, value, withDivider = false }) {
  return (
    <div className={`flex min-w-0 items-center gap-3 p-4 ${withDivider ? "border-l border-violet-200/70" : ""}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700">
        {createElement(Icon, { className: "h-6 w-6" })}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <p className="mt-1 truncate text-sm font-bold text-slate-950">{value}</p>
      </div>
    </div>
  );
}

function EmptyScheduleState() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
        <PackageSearch className="h-7 w-7" />
      </div>
      <h2 className="font-bold text-slate-900">Jadwal belum tersedia</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Belum ada jadwal kapal yang dapat ditampilkan saat ini.
      </p>
    </div>
  );
}
