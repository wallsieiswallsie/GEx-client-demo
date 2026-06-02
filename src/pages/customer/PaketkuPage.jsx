import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  Clock,
  Inbox,
  MapPin,
  Package,
  PackageCheck,
  Route,
  Search,
  Scale,
  Truck,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import { getMyPackages } from "../../services/api/claimedPackages";

const STATUS_TABS = [
  { key: "semua", label: "Semua", icon: Package },
  { key: "menunggu_tiba", label: "Menunggu\nTiba", icon: Clock },
  { key: "tidak_valid", label: "Tidak\nValid", icon: XCircle },
  { key: "tiba_gudang", label: "Tiba\nGudang", icon: Inbox },
  { key: "dipacking", label: "Dipacking", icon: PackageCheck },
  { key: "dalam_pengiriman", label: "Dalam\nPengiriman", icon: Truck },
  { key: "tiba_tujuan", label: "Tiba\nTujuan", icon: MapPin },
  { key: "siap_diambil", label: "Siap\nDiambil", icon: Inbox },
  { key: "selesai", label: "Selesai", icon: CheckCircle },
];

function normalizeStatus(value) {
  return String(value || "semua").replaceAll("-", "_");
}

function formatFee(value) {
  if (value === null || value === undefined || value === "") return "-";

  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function formatWeight(value) {
  if (value === null || value === undefined || value === "") return "-";

  return `${Number(value).toLocaleString("id-ID")} kg`;
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusLabel(status) {
  const tab = STATUS_TABS.find((item) => item.key === normalizeStatus(status));

  return tab?.label.replace("\n", " ") || String(status || "Terdata");
}

function getStatusTone(status) {
  const tones = {
    menunggu_tiba: "border-amber-100 bg-amber-50 text-amber-700",
    tidak_valid: "border-red-100 bg-red-50 text-red-700",
    tiba_gudang: "border-emerald-100 bg-emerald-50 text-emerald-700",
    dipacking: "border-violet-100 bg-violet-50 text-violet-700",
    dalam_pengiriman: "border-sky-100 bg-sky-50 text-sky-700",
    tiba_tujuan: "border-teal-100 bg-teal-50 text-teal-700",
    siap_diambil: "border-emerald-100 bg-emerald-50 text-emerald-700",
    selesai: "border-emerald-100 bg-emerald-50 text-emerald-700",
  };

  return tones[normalizeStatus(status)] || "border-emerald-100 bg-emerald-50 text-emerald-700";
}

function isXrayFailed(item) {
  return item.is_xray_failed === true || item.is_xray_failed === 1 || item.is_xray_failed === "true";
}

export default function PaketkuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeStatus, setActiveStatus] = useState(
    normalizeStatus(searchParams.get("status"))
  );
  const [summary, setSummary] = useState({});
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPackages(activeStatus);
  }, [activeStatus]);

  const activeTab = useMemo(
    () => STATUS_TABS.find((tab) => tab.key === activeStatus) || STATUS_TABS[0],
    [activeStatus]
  );

  const filteredItems = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) return items;

    return items.filter((pkg) => {
      const packageName = pkg.nama_paket || pkg.nama || pkg.name || "";
      const packageResi = pkg.resi || pkg.receipt || "";

      return (
        packageName.toLowerCase().includes(keyword) ||
        packageResi.toLowerCase().includes(keyword)
      );
    });
  }, [items, searchQuery]);

  const fetchPackages = async (status) => {
    try {
      setLoading(true);
      const data = await getMyPackages({
        status: status === "semua" ? "" : status,
      });
      setSummary(data?.summary || {});
      setItems(data?.items || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 p-4 pb-28">
      <SubPageHeader title="Paketku" />

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Cari nama paket atau resi"
          className="h-12 w-full rounded-full border border-gray-200 bg-white pl-11 pr-11 text-sm font-semibold text-gray-800 shadow-sm outline-none transition placeholder:font-medium placeholder:text-gray-400 focus:border-violet-200 focus:ring-4 focus:ring-violet-100"
          aria-label="Cari nama paket atau resi"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Hapus pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {STATUS_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeStatus === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveStatus(tab.key)}
              className={`flex-shrink-0 flex min-w-[110px] flex-col justify-between rounded-xl p-3 text-left transition active:scale-[0.98] ${
                active ? "bg-violet-600 text-white shadow-md" : "bg-gray-100 text-gray-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5" />
                <span className="text-xl font-bold">
                  {summary[tab.key] ?? 0}
                </span>
              </div>
              <span className="mt-2 whitespace-pre-line text-[10px] leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-gray-100 bg-white px-2 py-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800">
            {activeTab.label.replace("\n", " ")}
          </h2>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500">
            {filteredItems.length}
          </span>
        </div>

        {loading ? (
          <LoadingState variant="list" rows={4} />
        ) : items.length === 0 ? (
          <div className="rounded-xl bg-gray-50 py-8 text-center text-sm text-gray-400">
            Tidak ada package
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-xl bg-gray-50 px-4 py-8 text-center">
            <h3 className="text-sm font-bold text-gray-700">
              Paket tidak ditemukan
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Coba gunakan nama paket atau resi lain.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const status = item.final_status || item.status;
              const dateValue = item.arrived_origin_at || item.claimed_at || item.updated_at;
              const dateLabel = item.arrived_origin_at ? "Tiba di Gudang Tangerang" : "Tanggal Status";

              return (
                <div
                  key={item.id}
                  className="rounded-[26px] border border-gray-100 bg-white px-4 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <div className="flex min-w-0 items-start gap-2">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                        <Route className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-gray-800">
                          {item.receipt?.toUpperCase() || "Nomor Resi Tidak Tersedia"}
                        </h3>
                        <div className="mt-2 flex min-w-0 items-center gap-1.5 text-[11px] font-medium">
                          <span className="shrink-0 text-gray-400">&bull;</span>
                          <span className="truncate text-violet-600">
                            {item.route_code || "Kode Tidak Tersedia"}
                          </span>
                          <span className="h-3.5 w-px shrink-0 bg-gray-300" />
                          <span className="truncate text-gray-900">
                            {item.name?.toUpperCase() || "Nama Tidak Tersedia"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${getStatusTone(status)}`}>
                        <PackageCheck className="h-3 w-3" />
                        {getStatusLabel(status)}
                      </span>

                      {isXrayFailed(item) && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-red-100 bg-red-50 px-2 py-1 text-[9px] font-semibold text-red-600">
                          <XCircle className="h-3 w-3" />
                          Tidak Lolos X-Ray
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <PackageMetric
                      icon={<Wallet className="h-4 w-4" />}
                      label="Ongkir"
                      value={formatFee(item.fee)}
                    />
                    <PackageMetric
                      icon={<Scale className="h-4 w-4" />}
                      label="Berat"
                      value={formatWeight(item.used_weight)}
                    />
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <div className="flex items-end justify-between gap-3">
                      <PackageMetric
                        icon={<CalendarDays className="h-4 w-4" />}
                        label={dateLabel}
                        value={formatDate(dateValue)}
                      />

                      <button
                        onClick={() => navigate(`/paketku/${item.id}`)}
                        disabled={!item.package_id}
                        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-semibold text-violet-600 transition active:scale-[0.98] disabled:text-gray-300"
                      >
                        Lihat Detail
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function PackageMetric({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <div className="mt-0.5 shrink-0 text-gray-500">{icon}</div>
      <div className="min-w-0">
        <div className="truncate text-[11px] font-medium text-gray-500">{label}</div>
        <div className="mt-1 truncate text-[13px] font-semibold text-gray-900">{value || "-"}</div>
      </div>
    </div>
  );
}
