import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHomeSummary } from '../../hooks/useHomeSummary';
import { useShipSchedules } from '../../hooks/useShipSchedules';

// Atomic components
import PackageStatusWidget from '../../components/home/PackageStatusWidget';
import ShipScheduleSection from '../../components/home/ShipScheduleCard';
import ServiceMenuGrid from '../../components/home/ServiceMenuGrid';
import NewsBanner from '../../components/home/NewsBanner';
import BottomNav from '../../components/home/BottomNav';
import { SkeletonCard } from '../../components/home/SkeletonCard';

import { getUnconfirmedCount } from '../../services/api/claimedPackages';

import { Play } from 'lucide-react';


// GEX Logo — inline SVG (mereplikasi logo dari gambar: G ungu + Ex merah)
function GexLogo({ size = 40 }) {
  return (
    <img
      src="/images/logo_gex.png"
      alt="GEX Logo"
      style={{ height: size * 0.6 }}
      className="object-contain"
    />
  );
}

// Header — Logo GEX + user greeting + logout button
function HomeHeader({ user, onLogout }) {
  const initial = user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U';

  return (
    <header className="flex items-center justify-between px-4 pt-5 pb-3 bg-white sticky top-0 z-40 border-b border-gray-50">
      <GexLogo size={48} />
      <div className="flex items-center gap-2">
        {/* Avatar lingkaran */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-red-500 flex items-center justify-center shadow-sm">
          <span className="text-white text-sm font-bold">{initial}</span>
        </div>
        {/* Logout */}
        <button
          id="btn-logout"
          onClick={onLogout}
          className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Keluar dari akun"
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}

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
  if (isLoading) {
    return (
      <div className="mx-4">
        <SkeletonCard height="180px" rounded="rounded-2xl" />
      </div>
    );
  }

  const imageUrl = banner?.content_url ||
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80';
  const title = banner?.title || 'Transformasi Digital Logistik 2024';

  return (
    <div className="mx-4 relative rounded-2xl overflow-hidden shadow-md group cursor-pointer"
      style={{ height: '180px' }}>
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="eager"
      />
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
      </div>
    </div>
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
  const [unconfirmedCount, setUnconfirmedCount] = useState(0);

  //  fetch jumlah paket menunggu
  useEffect(() => {
    const fetchUnconfirmed = async () => {
      try {
        const total = await getUnconfirmedCount();
        setUnconfirmedCount(total);
      } catch (err) {
        console.error("Gagal ambil unconfirmed:", err);
      }
    };

    fetchUnconfirmed();
  }, []);


  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleSearch = (query) => {
    navigate(`/lacak?resi=${encodeURIComponent(query)}`);
  };

  // Ambil banner pertama jika ada
  const firstBanner = null; // TODO: hook useBanners() untuk banner_dashboard

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      {/* === HEADER === */}
      <HomeHeader user={summaryData?.user || user} onLogout={handleLogout} />

      {/* === SCROLLABLE CONTENT === */}
      <main className="flex-1 overflow-y-auto pb-20" aria-label="Konten utama homepage">
        {/* 1. Search */}
        <div className="bg-white">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex flex-col gap-4 pt-3">
          {/* 2. Promo Banner */}
          <PromoBanner banner={firstBanner} isLoading={false} />

          {/* 3. Status Paketmu */}
          <PackageStatusWidget
            summary={summaryData?.package_summary}
            isLoading={summaryLoading}
            unconfirmedCount={unconfirmedCount}
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
          <NewsBanner banners={null} isLoading={false} />
        </div>
      </main>

      {/* === BOTTOM NAV (sticky) === */}
      <BottomNav />
    </div>
  );
}
