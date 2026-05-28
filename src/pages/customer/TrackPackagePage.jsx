import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ImageOff,
  Loader2,
  Package,
  Receipt,
  Route,
  Scale,
  Search,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { useAuth } from "../../context/useAuth";
import {
  claimTrackedPackage,
  trackPackageByReceipt,
} from "../../services/api/claimedPackages";

function formatFee(value) {
  if (value === null || value === undefined || value === "") return "-";

  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function formatWeight(value) {
  if (value === null || value === undefined || value === "") return "-";

  return `${Number(value).toLocaleString("id-ID")} kg`;
}

function formatDate(value) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getClaimTone(claim) {
  if (!claim?.is_claimed) {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }

  if (claim.claimed_by_current_user) {
    return "bg-violet-50 text-violet-700 border-violet-100";
  }

  return "bg-gray-100 text-gray-600 border-gray-200";
}

export default function TrackPackagePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();
  const initialReceipt = searchParams.get("resi") || searchParams.get("receipt") || "";

  const [receipt, setReceipt] = useState(initialReceipt);
  const [lastReceipt, setLastReceipt] = useState(initialReceipt.trim());
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const packageData = result?.package;
  const claim = result?.claim;
  const logs = result?.logs || [];

  const emptyState = !loading && !error && !result && !lastReceipt;
  const notFoundState = !loading && !error && result?.found === false;

  const claimText = useMemo(() => {
    if (!claim) return "";
    if (claim.claimed_by_current_user) return "Paket ini sudah kamu claim";
    if (claim.is_claimed) return "Paket ini sudah di-claim";
    return "Belum terhubung ke akun customer";
  }, [claim]);

  useEffect(() => {
    if (initialReceipt.trim()) {
      handleTrack(initialReceipt.trim(), { syncUrl: false });
    }
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(""), 3000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleTrack = async (nextReceipt = receipt, options = {}) => {
    const normalizedReceipt = nextReceipt.trim();
    setLastReceipt(normalizedReceipt);
    setResult(null);
    setError("");

    if (!normalizedReceipt) {
      return;
    }

    try {
      setLoading(true);
      const data = await trackPackageByReceipt(normalizedReceipt);
      setResult(data);

      if (options.syncUrl !== false) {
        setSearchParams({ resi: normalizedReceipt });
      }
    } catch (err) {
      setError(err.message || "Gagal melacak paket");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleTrack();
  };

  const handleClaim = async () => {
    if (!packageData?.receipt) return;

    if (!isAuthenticated) {
      setToast("Silakan login terlebih dahulu untuk claim paket");
      navigate("/login", { state: { from: location } });
      return;
    }

    if (role !== "customer") {
      setToast("Claim paket hanya tersedia untuk akun customer");
      return;
    }

    try {
      setClaiming(true);
      const data = await claimTrackedPackage(packageData.receipt);
      setResult(data);
      setToast("Paket berhasil di-claim");
    } catch (err) {
      setError(err.message || "Gagal claim paket");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 p-4 pb-28">
      <SubPageHeader
        title="Lacak Paket"
        subtitle="Cari status terbaru berdasarkan nomor resi"
      />

      {toast && (
        <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-[398px] -translate-x-1/2 rounded-2xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <label htmlFor="receipt" className="mb-2 block text-xs font-semibold text-gray-500">
          Nomor Resi
        </label>
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Receipt className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="receipt"
              type="search"
              value={receipt}
              onChange={(event) => setReceipt(event.target.value)}
              placeholder="Masukkan nomor resi"
              className="h-12 w-full rounded-xl bg-gray-50 pl-10 pr-3 text-sm font-semibold text-gray-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-violet-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm transition active:scale-[0.98] disabled:bg-violet-300"
            aria-label="Cari paket"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </button>
        </div>
      </form>

      <div className="mt-4">
        {emptyState && (
          <StateCard
            icon={<Package className="h-6 w-6" />}
            title="Masukkan nomor resi"
            description="Status paket akan muncul setelah kamu melakukan pencarian."
          />
        )}

        {loading && (
          <StateCard
            icon={<Loader2 className="h-6 w-6 animate-spin" />}
            title="Mencari paket"
            description="Mohon tunggu sebentar."
          />
        )}

        {notFoundState && (
          <StateCard
            icon={<AlertCircle className="h-6 w-6" />}
            title="Paket tidak ditemukan"
            description={`Tidak ada paket dengan resi ${lastReceipt}. Pastikan nomor resi sudah benar.`}
          />
        )}

        {error && (
          <StateCard
            icon={<AlertCircle className="h-6 w-6" />}
            title="Gagal melacak paket"
            description={error}
            tone="danger"
          />
        )}

        {!loading && !error && result?.found && packageData && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {packageData.photo_url ? (
                <img
                  src={packageData.photo_url}
                  alt={packageData.name || packageData.receipt}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-36 items-center justify-center bg-gray-100 text-gray-400">
                  <ImageOff className="h-7 w-7" />
                </div>
              )}

              <div className="p-4">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                    <Truck className="h-4 w-4" />
                    {packageData.status || "Terdata"}
                  </span>
                  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${getClaimTone(claim)}`}>
                    <ShieldCheck className="h-4 w-4" />
                    {claimText}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                  {packageData.name || "Nama paket belum tersedia"}
                </h2>
                <p className="mt-1 text-sm font-semibold text-gray-500">
                  {packageData.receipt}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  <Info icon={<Truck className="h-4 w-4" />} label="Ekspedisi" value={packageData.expedition} />
                  <Info icon={<Route className="h-4 w-4" />} label="Route Code" value={packageData.route_code} />
                  <Info icon={<Scale className="h-4 w-4" />} label="Berat Digunakan" value={formatWeight(packageData.used_weight)} />
                  <Info icon={<Wallet className="h-4 w-4" />} label="Biaya/Fee" value={formatFee(packageData.fee)} />
                </div>

                {claim?.can_claim && (
                  <button
                    type="button"
                    onClick={handleClaim}
                    disabled={claiming}
                    className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:bg-violet-300"
                  >
                    {claiming ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                    Claim Paket
                  </button>
                )}

                {claim?.claimed_by_current_user && (
                  <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    Paket berhasil terhubung ke akun customer kamu.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800">Timeline Paket</h3>
              {logs.length === 0 ? (
                <div className="mt-3 rounded-xl bg-gray-50 py-6 text-center text-sm text-gray-400">
                  Log perjalanan belum tersedia
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {logs.map((log, index) => (
                    <div key={log.id || index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-700">
                          <Clock3 className="h-4 w-4" />
                        </span>
                        {index < logs.length - 1 && <span className="mt-2 h-full w-px flex-1 bg-gray-200" />}
                      </div>
                      <div className="min-w-0 pb-1">
                        <p className="text-sm font-semibold text-gray-800">{log.action || "Update paket"}</p>
                        <p className="mt-1 text-xs text-gray-400">{formatDate(log.created_at) || "Tanggal tidak tersedia"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StateCard({ icon, title, description, tone = "default" }) {
  const toneClass = tone === "danger"
    ? "bg-red-50 text-red-600"
    : "bg-violet-50 text-violet-700";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
      <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${toneClass}`}>
        {icon}
      </div>
      <h2 className="mt-4 text-base font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-gray-50 px-3 py-3">
      <div className="mt-0.5 text-gray-500">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="mt-1 break-words text-sm font-semibold text-gray-900">
          {value || "-"}
        </div>
      </div>
    </div>
  );
}
