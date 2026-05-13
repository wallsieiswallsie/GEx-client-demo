import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useHomeSummary } from '../../hooks/useHomeSummary';
import { useShipSchedules } from '../../hooks/useShipSchedules';

// Atomic components
import PackageStatusWidget from '../../components/home/PackageStatusWidget';
import ShipScheduleSection from '../../components/home/ShipScheduleCard';
import ServiceMenuGrid from '../../components/home/ServiceMenuGrid';
import NewsBanner from '../../components/home/NewsBanner';
import { SkeletonCard } from '../../components/home/SkeletonCard';
import Header from '../../components/home/Header';

import { getMyPackageStatusCounts } from '../../services/api/claimedPackages';
import { getBannerDashboard } from '../../services/api/content/contentApi';
import { getInstagramContents } from '../../services/api/content/instagramContentApi';
import { getYoutubeThumbnail } from '../../utils/youtube';

import { Play } from 'lucide-react';


// Search bar "Lacak Paket"
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3" role="search">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          id="input-lacak-paket"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Lacak Paket"
          className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-700
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300
            focus:bg-white transition-all duration-200"
          aria-label="Lacak nomor resi paket"
        />
      </div>
    </form>
  );
}

// Banner video/gambar promo dari banner_dashboard
function PromoBanner({ banner, isLoading }) {
  const [thumbnailError, setThumbnailError] = useState(false);

  useEffect(() => {
    setThumbnailError(false);
  }, [banner?.content_url]);

  if (isLoading) {
    return (
      <div className="mx-4">
        <SkeletonCard height="180px" rounded="rounded-2xl" />
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="mx-4 rounded-2xl border bg-white p-5 text-center text-sm text-gray-400 shadow-sm">
        Belum ada banner aktif
      </div>
    );
  }

  const thumbnailUrl = getYoutubeThumbnail(banner.content_url);
  if (!thumbnailUrl) return null;

  const title = banner.title || 'Info GEx';

  return (
    <button
      type="button"
      onClick={() => window.open(banner.content_url, "_blank")}
      className="mx-4 relative block rounded-2xl overflow-hidden shadow-md group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      style={{ height: '180px' }}
      aria-label={`Buka video ${title}`}
    >
      {!thumbnailError ? (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="eager"
          onError={() => setThumbnailError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200 px-5 text-center text-sm font-medium text-gray-500">
          Thumbnail video tidak tersedia
        </div>
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40
          flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
          <Play className="w-6 h-6 text-white ml-1" fill="white" />
        </div>
      </div>

      {/* Badge + Title */}
      <div className="absolute bottom-3 left-3 right-3">
        <span className="inline-block bg-amber-400 text-amber-900 text-[10px] font-bold
          px-2 py-0.5 rounded-full mb-1 uppercase tracking-wide">
          TERBARU
        </span>
        <p className="text-white text-sm font-bold leading-tight drop-shadow-md">{title}</p>
        {banner.description && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-white/85 drop-shadow-md">
            {banner.description}
          </p>
        )}
      </div>
    </button>
  );
}

// ================================================
// CustomerHome — halaman utama untuk role Customer
// Mereplikasi UI dari screen.jpg
// ================================================
export default function CustomerHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Data isolation via custom hooks — komponen tidak fetch langsung
  const { data: summaryData, isLoading: summaryLoading } = useHomeSummary();
  const { schedules, isLoading: schedulesLoading } = useShipSchedules();

  //  state untuk claimed_packages
  const [statusCounts, setStatusCounts] = useState(null);
  const [banners, setBanners] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [instagramContents, setInstagramContents] = useState([]);
  const [instagramLoading, setInstagramLoading] = useState(true);

  //  fetch jumlah status paket
  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const counts = await getMyPackageStatusCounts();
        setStatusCounts(counts);
      } catch (err) {
        console.error("Gagal ambil status paket:", err);
      }
    };

    fetchStatusCounts();
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setBannerLoading(true);
        const data = await getBannerDashboard();
        setBanners(data || []);
      } catch (err) {
        console.error("Gagal ambil banner:", err);
        setBanners([]);
      } finally {
        setBannerLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const fetchInstagramContents = async () => {
      try {
        setInstagramLoading(true);
        const data = await getInstagramContents();
        setInstagramContents(data || []);
      } catch (err) {
        console.error("Gagal ambil konten Instagram:", err);
        setInstagramContents([]);
      } finally {
        setInstagramLoading(false);
      }
    };

    fetchInstagramContents();
  }, []);


  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleSearch = (query) => {
    navigate(`/lacak?resi=${encodeURIComponent(query)}`);
  };

  // Ambil banner pertama jika ada
  const firstBanner = banners.find((banner) => getYoutubeThumbnail(banner.content_url)) || null;

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      {/* === HEADER === */}
      <Header
        initial={
          (summaryData?.user?.name?.[0] ||
            summaryData?.user?.username?.[0] ||
            user?.name?.[0] ||
            user?.username?.[0] ||
            'U'
          ).toUpperCase()
        }
        onLogout={handleLogout}
      />

      {/* === SCROLLABLE CONTENT === */}
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide" aria-label="Konten utama homepage">
        {/* 1. Search */}
        <div className="bg-white">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex flex-col gap-4 pt-3">
          {/* 2. Promo Banner */}
          <PromoBanner banner={firstBanner} isLoading={bannerLoading} />

          {/* 3. Status Paketmu */}
          <PackageStatusWidget
            summary={statusCounts}
            isLoading={summaryLoading || !statusCounts}
          />

          {/* 4. Jadwal Kapal */}
          <ShipScheduleSection
            schedules={schedules}
            isLoading={schedulesLoading}
            onViewAll={() => navigate('/jadwal')}
          />

          {/* 5. Layanan Kami */}
          <ServiceMenuGrid />

          {/* 6. Berita */}
          <NewsBanner banners={instagramContents} isLoading={instagramLoading} />
        </div>
      </main>
    </div>
  );
}
