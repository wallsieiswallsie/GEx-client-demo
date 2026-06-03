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
import CustomerBannerCarousel from '../../components/home/CustomerBannerCarousel';
import Header from '../../components/home/Header';

import {
  getMyPackageStatusCounts,
  getPendingProblematicClaims,
} from '../../services/api/claimedPackages';
import { getBannerDashboard } from '../../services/api/content/contentApi';
import { getInstagramContents } from '../../services/api/content/instagramContentApi';

import { AlertCircle } from 'lucide-react';


// Search bar "Lacak Paket"
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} role="search">
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
          className="h-10 w-full pl-9 pr-4 bg-white rounded-xl text-sm text-gray-700
        placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4f2e78]/30
          shadow-[0_6px_20px_rgba(0,0,0,0.12)] focus:bg-white
          focus:shadow-[0_10px_28px_rgba(0,0,0,0.16)] transition-all duration-200"
          aria-label="Lacak nomor resi paket"
        />
      </div>
    </form>
  );
}

// ================================================
// CustomerHome — halaman utama untuk role Customer
// Mereplikasi UI dari screen.jpg
// ================================================
export default function CustomerHome() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Data isolation via custom hooks — komponen tidak fetch langsung
  const { data: summaryData, isLoading: summaryLoading } = useHomeSummary();
  const { schedules, isLoading: schedulesLoading, error: schedulesError } = useShipSchedules();

  //  state untuk claimed_packages
  const [statusCounts, setStatusCounts] = useState(null);
  const [pendingProblematic, setPendingProblematic] = useState([]);
  const [banners, setBanners] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [instagramContents, setInstagramContents] = useState([]);
  const [instagramLoading, setInstagramLoading] = useState(true);
  const [instagramError, setInstagramError] = useState(null);

  //  fetch jumlah status paket
  useEffect(() => {
    const fetchStatusCounts = async () => {
      if (!isAuthenticated) {
        setStatusCounts(null);
        setPendingProblematic([]);
        return;
      }

      try {
        const counts = await getMyPackageStatusCounts();
        const pending = await getPendingProblematicClaims();
        setStatusCounts(counts);
        setPendingProblematic(pending || []);
      } catch (err) {
        console.error("Gagal ambil status paket:", err);
      }
    };

    fetchStatusCounts();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setBannerLoading(true);
        setBannerError(null);
        const data = await getBannerDashboard();
        setBanners(data || []);
      } catch (err) {
        console.error("Gagal ambil banner:", err);
        setBannerError(err.message || "Banner belum dapat dimuat");
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
        setInstagramError(null);
        const data = await getInstagramContents();
        setInstagramContents(data || []);
      } catch (err) {
        console.error("Gagal ambil konten Instagram:", err);
        setInstagramError(err.message || "Konten belum dapat dimuat");
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

  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-white via-[#f8f4ff] to-[#f1ebff]">
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
      >
        <SearchBar onSearch={handleSearch} />
      </Header>

      {/* === SCROLLABLE CONTENT === */}
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide lg:pb-10" aria-label="Konten utama homepage">
        <div className="flex flex-col gap-5 pt-2 lg:gap-6 lg:px-6">
          {/* 2. Promo Banner */}
          <CustomerBannerCarousel banners={banners} isLoading={bannerLoading} error={bannerError} />

          {/* 3. Status Paketmu */}
          {isAuthenticated && (
            <PackageStatusWidget
              summary={statusCounts}
              isLoading={summaryLoading || !statusCounts}
            />
          )}

          {pendingProblematic.length > 0 && (
            <section className="mx-4 rounded-2xl border bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.05)] lg:mx-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold text-gray-800">
                    Menunggu Konfirmasi
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {pendingProblematic.length} paket bermasalah perlu dilengkapi
                  </p>
                </div>
                <button
                  onClick={() => navigate('/daftar-paket')}
                  className="rounded-xl bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700"
                >
                  Lanjutkan
                </button>
              </div>
            </section>
          )}

          {/* 4. Layanan Kami */}
          <ServiceMenuGrid />

          {/* 5. Jadwal Kapal */}
          <ShipScheduleSection
            schedules={schedules}
            isLoading={schedulesLoading}
            error={schedulesError}
            onViewAll={() => navigate('/jadwal')}
          />

          {/* 6. Berita */}
          {instagramError ? (
            <section className="mx-4 rounded-2xl border bg-white p-4 text-center text-sm text-red-500 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
              Konten belum dapat dimuat
            </section>
          ) : (
            <NewsBanner banners={instagramContents} isLoading={instagramLoading} />
          )}
        </div>
      </main>
    </div>
  );
}
