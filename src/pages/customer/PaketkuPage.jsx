import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Inbox,
  MapPin,
  Package,
  PackageCheck,
  Route,
  Search,
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
              className={`flex-shrink-0 flex min-w-[110px] flex-col justify-between rounded-xl p-3 text-left transition active:scale-[0.98] ${active
                ? "bg-violet-600 text-white shadow-md"
                : "bg-gray-100 text-gray-500"
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

      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
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
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="relative rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
              >
                {item.is_xray_failed && (
                  <div className="absolute right-3 top-3 rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                    Tidak Lolos X-Ray
                  </div>
                )}

                <div className="flex items-center gap-1 pr-24 text-xs font-semibold text-violet-700">
                  <Route className="h-4 w-4 flex-shrink-0" />

                  <span className="truncate">
                    {item.route_code || "Kode Tidak Tersedia"}
                  </span>

                  <span className="text-gray-300">•</span>

                  <span className="truncate text-gray-900">
                    {item.name?.toUpperCase() || "Nama Tidak Tersedia"}
                  </span>
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  {item.receipt?.toUpperCase() || "Nomor Resi Tidak Tersedia"}
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <Wallet className="h-4 w-4" />
                  {formatFee(item.fee)}
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => navigate(`/paketku/${item.id}`)}
                    disabled={!item.package_id}
                    className="text-xs font-semibold text-violet-600 disabled:text-gray-300"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
