import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  Filter,
  Map,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  Store,
} from "lucide-react";
import { getDisplayedBranches } from "../../services/api/content/contentApi";
import {
  buildWhatsAppLink,
  calculateDistanceKm,
  formatDistanceFromUser,
  sortBranchesByDistance,
} from "../../utils/branchLocation";

const normalizeText = (value) => String(value || "").toLowerCase();

const getBranchName = (item) =>
  item.branch_name || item.name || item.city || item.branch_code || "Gerai GEx";

const getMapLink = (item) => item.gmap_link || item.map_url || item.maps_url || item.google_maps_url || "";

const getPhoneNumber = (item) =>
  item.whatsapp_number || item.hp || item.phone_number || item.phone || item.telephone || "";

const getWhatsAppLink = (item) => buildWhatsAppLink(getPhoneNumber(item), getBranchName(item));

const isBranchActive = (item) => {
  if (typeof item.is_active === "boolean") return item.is_active;
  if (typeof item.active === "boolean") return item.active;
  if (typeof item.status === "string") return normalizeText(item.status) === "aktif";
  return true;
};

export default function CustomerBranchesPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [locationMessage, setLocationMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    getDisplayedBranches()
      .then((data) => {
        setError(null);
        setItems(data || []);
      })
      .catch((err) => {
        console.error("Gagal memuat lokasi gerai customer:", err);
        setError(err.message || "Lokasi gerai belum dapat dimuat");
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      setLocationMessage("Browser Anda belum mendukung lokasi otomatis.");
      return;
    }

    setLocationStatus("loading");
    setLocationMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus("granted");
        setLocationMessage("");
      },
      () => {
        setUserLocation(null);
        setLocationStatus("denied");
        setLocationMessage("Aktifkan lokasi untuk melihat gerai terdekat");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const branchesWithDistance = useMemo(
    () =>
      items.map((item) => {
        const distanceKm = userLocation
          ? calculateDistanceKm(userLocation.latitude, userLocation.longitude, item.latitude, item.longitude)
          : null;

        return {
          ...item,
          distanceKm,
          distanceText: formatDistanceFromUser(distanceKm),
        };
      }),
    [items, userLocation]
  );

  const filteredItems = useMemo(() => {
    const keyword = normalizeText(query).trim();
    const filtered = keyword
      ? branchesWithDistance.filter((item) => {
          const haystack = [
            item.branch_name,
            item.name,
            item.city,
            item.district,
            item.address,
            item.branch_code,
          ]
            .map(normalizeText)
            .join(" ");

          return haystack.includes(keyword);
        })
      : [...branchesWithDistance];

    return filtered.sort((a, b) => {
      if (sortBy === "distance") {
        if (a.distanceKm === null && b.distanceKm === null) return 0;
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      }
      if (sortBy === "name") return getBranchName(a).localeCompare(getBranchName(b), "id");
      if (sortBy === "oldest") return Number(a.order_number || a.id || 0) - Number(b.order_number || b.id || 0);
      return Number(b.order_number || b.id || 0) - Number(a.order_number || a.id || 0);
    });
  }, [branchesWithDistance, query, sortBy]);

  const nearestBranch = useMemo(() => {
    const byDistance = sortBranchesByDistance(filteredItems, userLocation);
    return byDistance[0] || null;
  }, [filteredItems, userLocation]);

  const nearestFallback = locationMessage || "Gunakan lokasi Anda untuk melihat gerai terdekat";

  return (
    <div className="min-h-dvh bg-gray-50 pb-6 text-slate-900 lg:px-6">
      <section
        className="relative overflow-hidden px-6 pb-14 pt-8 text-white lg:rounded-[32px] lg:px-8"
        style={{
          backgroundImage: "url('/images/header_background/lokasi_gerai.png')",
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
            <h1 className="text-3xl font-bold leading-tight">Lokasi Gerai</h1>
            <p className="mt-2 max-w-[230px] text-sm leading-relaxed text-white/85">
              Temukan gerai GEx terdekat dari lokasimu.
            </p>
          </div>
        </div>
      </section>

      <main className="relative -mt-8 space-y-5 px-4 lg:px-6">
        <div className="rounded-[24px] border border-white bg-white p-3 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
          <label className="flex h-14 items-center gap-3 rounded-2xl bg-white px-3">
            <Search className="h-5 w-5 shrink-0 text-violet-700" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari gerai, kota, atau branch code"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-400"
            />
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 transition hover:bg-violet-100"
              aria-label="Filter gerai"
            >
              <Filter className="h-5 w-5" />
            </button>
          </label>
        </div>

        {loading ? (
          <BranchesSkeleton />
        ) : error ? (
          <div className="rounded-[24px] border border-red-100 bg-white p-6 text-center text-sm text-red-500 shadow-sm">
            {error}
          </div>
        ) : (
          <>
            <section className="space-y-3">
              <NearestBranchCard
                item={nearestBranch}
                hasLocation={Boolean(userLocation)}
                isLoadingLocation={locationStatus === "loading"}
                fallbackMessage={nearestFallback}
                onUseLocation={requestUserLocation}
                showLocationButton={locationStatus !== "granted"}
              />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Semua Gerai</h2>
                  <p className="text-xs font-medium text-slate-500">
                    {filteredItems.length} lokasi tersedia
                  </p>
                </div>
                <label className="relative shrink-0">
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-10 appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-9 text-xs font-bold text-slate-700 shadow-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    aria-label="Urutkan gerai"
                  >
                    {userLocation && <option value="distance">Terdekat</option>}
                    <option value="latest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="name">A-Z</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </label>
              </div>

              {filteredItems.length === 0 ? (
                <EmptyState hasQuery={Boolean(query.trim())} />
              ) : (
                <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
                  {filteredItems.map((item) => (
                    <BranchCard key={item.id || `${item.branch_name}-${item.order_number}`} item={item} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function NearestBranchCard({
  item,
  hasLocation,
  isLoadingLocation,
  fallbackMessage,
  onUseLocation,
  showLocationButton,
}) {
  if (!item) {
    return (
      <div className="rounded-[28px] border border-dashed border-violet-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <MapPin className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-violet-700">
              Gerai Terdekat
            </span>
            <h2 className="mt-3 text-lg font-black text-slate-950">Belum ada gerai tersedia</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {fallbackMessage || "Lokasi gerai akan muncul di sini setelah data tersedia."}
            </p>
            {showLocationButton && (
              <LocationButton isLoading={isLoadingLocation} onClick={onUseLocation} />
            )}
          </div>
        </div>
      </div>
    );
  }

  const mapLink = getMapLink(item);
  const whatsappLink = getWhatsAppLink(item);

  return (
    <article className="overflow-hidden rounded-[28px] border border-violet-100 bg-white shadow-[0_12px_30px_rgba(124,58,237,0.12)]">
      <div className="flex gap-4 p-5">
        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-violet-700">
            Gerai Terdekat
          </span>
          <h2 className="mt-3 text-xl font-black leading-tight text-slate-950">{getBranchName(item)}</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-violet-700" />
              {hasLocation && item.distanceKm !== null
                ? formatDistanceFromUser(item.distanceKm)
                : "Aktifkan lokasi untuk estimasi jarak"}
            </p>
            <p className="flex items-center gap-2">
              <Store className="h-4 w-4 text-emerald-600" />
              {isBranchActive(item) ? "Gerai aktif" : "Gerai belum aktif"}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {mapLink && (
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-violet-700 px-4 text-sm font-bold text-white shadow-lg shadow-violet-700/20"
              >
                Buka Maps
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-50 px-4 text-sm font-bold text-emerald-700"
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-2xl bg-slate-50 px-4 text-sm font-bold text-slate-400"
              >
                <MessageCircle className="h-4 w-4" />
                Nomor belum tersedia
              </button>
            )}
          </div>
          {showLocationButton && !hasLocation && (
            <LocationButton isLoading={isLoadingLocation} onClick={onUseLocation} />
          )}
        </div>
        <MapPreview item={item} compact />
      </div>
    </article>
  );
}

function BranchCard({ item }) {
  const mapLink = getMapLink(item);
  const whatsappLink = getWhatsAppLink(item);
  const phoneNumber = getPhoneNumber(item);

  return (
    <article className="overflow-hidden rounded-[24px] border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
          <MapPin className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 text-base font-black leading-tight text-slate-950">{getBranchName(item)}</h3>
            {isBranchActive(item) && (
              <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                Aktif
              </span>
            )}
          </div>

          {item.branch_code && (
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-violet-700">
              Branch Code {item.branch_code}
            </p>
          )}

          <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.address || "Alamat belum tersedia"}</p>

          {phoneNumber && (
            <p className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-600">
              <Phone className="h-4 w-4 text-violet-700" />
              {phoneNumber}
            </p>
          )}

          {item.distanceText && (
            <p className="mt-2 flex items-center gap-2 text-xs font-bold text-violet-700">
              <Navigation className="h-4 w-4" />
              {item.distanceText}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[92px_minmax(0,1fr)] gap-3">
        <MapPreview item={item} />
        <div className="flex min-w-0 flex-col justify-end gap-2">
          {mapLink ? (
            <a
              href={mapLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white px-3 text-sm font-black text-violet-700 transition hover:bg-violet-50"
            >
              <Navigation className="h-4 w-4" />
              Navigasi
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-400"
            >
              <Navigation className="h-4 w-4" />
              Navigasi
            </button>
          )}

          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-3 text-sm font-black text-emerald-700 transition hover:bg-emerald-100"
            >
              <MessageCircle className="h-4 w-4" />
              Chat WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-50 px-3 text-xs font-black text-slate-400 sm:text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              Nomor belum tersedia
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function LocationButton({ isLoading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="mt-4 inline-flex h-10 items-center gap-2 rounded-full border border-violet-200 bg-white px-4 text-xs font-black text-violet-700 shadow-sm transition hover:bg-violet-50 disabled:cursor-wait disabled:opacity-70"
    >
      <MapPin className="h-4 w-4" />
      {isLoading ? "Meminta lokasi..." : "Gunakan lokasi saya"}
    </button>
  );
}

function MapPreview({ item, compact = false }) {
  const hasMap = Boolean(getMapLink(item));

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl border ${
        compact ? "h-28 w-28" : "h-full min-h-[92px] w-full"
      } ${hasMap ? "border-violet-100 bg-violet-50" : "border-slate-100 bg-slate-50"}`}
    >
      <div className="absolute inset-x-0 top-1/2 border-t border-white/80" />
      <div className="absolute inset-y-0 left-1/2 border-l border-white/80" />
      <div className="absolute left-3 top-3 h-8 w-8 rounded-full bg-white/80" />
      <div className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-white/70" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`flex items-center justify-center rounded-full bg-white shadow-sm ${compact ? "h-12 w-12" : "h-11 w-11"}`}>
          {hasMap ? <MapPin className="h-6 w-6 text-violet-700" /> : <Map className="h-6 w-6 text-slate-400" />}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasQuery }) {
  return (
    <div className="rounded-[24px] border border-dashed border-violet-200 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
        <Store className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-950">
        {hasQuery ? "Gerai tidak ditemukan" : "Belum ada lokasi gerai"}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        {hasQuery
          ? "Coba gunakan nama gerai, kota, alamat, atau branch code lain."
          : "Daftar gerai akan muncul setelah data tersedia."}
      </p>
    </div>
  );
}

function BranchesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 space-y-3">
            <div className="h-6 w-28 animate-pulse rounded-full bg-slate-100" />
            <div className="h-6 w-40 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-4 w-52 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-11 w-32 animate-pulse rounded-2xl bg-slate-100" />
          </div>
          <div className="h-28 w-28 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>

      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex gap-3">
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-100" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-36 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-4 w-full animate-pulse rounded-lg bg-slate-100" />
              <div className="h-4 w-44 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-[92px_minmax(0,1fr)] gap-3">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            <div className="space-y-2">
              <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
