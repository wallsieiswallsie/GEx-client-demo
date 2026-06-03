import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Calculator,
  CreditCard,
  Grid2X2,
  MapPin,
  PackageSearch,
  Rocket,
  Search,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import HelpSupportCard from "../../components/help/HelpSupportCard";
import {
  getHelpCategories,
  getHelpFaqs,
  getHelpSettings,
} from "../../services/api/helpApi";

const iconMap = {
  Rocket,
  Calculator,
  PackageSearch,
  AlertTriangle,
  CreditCard,
  ShieldCheck,
  MapPin,
  Grid2X2,
  Truck,
};

const fallbackIcons = [Rocket, Calculator, PackageSearch, AlertTriangle, CreditCard, ShieldCheck, MapPin, Grid2X2];

const categoryColors = [
  { bg: "bg-violet-50", text: "text-violet-700", active: "border-violet-300 ring-violet-100" },
  { bg: "bg-blue-50", text: "text-blue-600", active: "border-blue-300 ring-blue-100" },
  { bg: "bg-rose-50", text: "text-rose-600", active: "border-rose-300 ring-rose-100" },
  { bg: "bg-orange-50", text: "text-orange-600", active: "border-orange-300 ring-orange-100" },
  { bg: "bg-emerald-50", text: "text-emerald-600", active: "border-emerald-300 ring-emerald-100" },
  { bg: "bg-purple-50", text: "text-purple-600", active: "border-purple-300 ring-purple-100" },
  { bg: "bg-sky-50", text: "text-sky-600", active: "border-sky-300 ring-sky-100" },
  { bg: "bg-pink-50", text: "text-pink-600", active: "border-pink-300 ring-pink-100" },
];

function EmptyState({ title, text, action, onAction }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
        <Search className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{text}</p>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="mx-auto mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 text-sm font-semibold text-white shadow-sm"
        >
          <Search className="h-4 w-4" />
          {action}
        </button>
      )}
    </div>
  );
}

function FaqList({ items, onOpen }) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];

  return (
    <div className="space-y-2.5">
      {safeItems.map((faq, index) => (
        <button
          key={faq?.id || index}
          type="button"
          onClick={() => {
            if (faq?.id) onOpen(faq.id);
          }}
          className="w-full rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow"
        >
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <PackageSearch className="h-4.5 w-4.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold leading-snug text-slate-900">
                {faq?.question || "Pertanyaan bantuan"}
              </span>
              <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-slate-500">
                {faq?.answer || ""}
              </span>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function HelpPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [popularFaqs, setPopularFaqs] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [settings, setSettings] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        const [categoryData, popularData, settingsData] = await Promise.all([
          getHelpCategories(),
          getHelpFaqs({ popular: true, limit: 5 }),
          getHelpSettings(),
        ]);
        setCategories(Array.isArray(categoryData) ? categoryData.filter(Boolean) : []);
        setPopularFaqs(Array.isArray(popularData) ? popularData.filter(Boolean) : []);
        setSettings(settingsData && typeof settingsData === "object" ? settingsData : {});
      } catch (err) {
        setCategories([]);
        setPopularFaqs([]);
        setSettings({});
        setError("Bantuan belum dapat dimuat. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, []);

  useEffect(() => {
    if (!showAll && !search && !selectedCategory) {
      setFaqs([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setSearching(true);
        setError("");
        const data = await getHelpFaqs({
          search,
          category_id: selectedCategory?.id,
          limit: 50,
        });
        setFaqs(Array.isArray(data) ? data.filter(Boolean) : []);
      } catch (err) {
        setError("Bantuan belum dapat dimuat. Silakan coba lagi.");
        setFaqs([]);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [search, selectedCategory, showAll]);

  const safeCategories = Array.isArray(categories) ? categories.filter(Boolean) : [];
  const safeFaqs = Array.isArray(faqs) ? faqs.filter(Boolean) : [];
  const safePopularFaqs = Array.isArray(popularFaqs) ? popularFaqs.filter(Boolean) : [];
  const safeSettings = settings && typeof settings === "object" ? settings : {};
  const headerSubtitle = safeSettings?.header_subtitle || "Temukan jawaban atau solusi dari pertanyaanmu di sini.";
  const visibleFaqs = showAll || search || selectedCategory ? safeFaqs : safePopularFaqs.slice(0, 3);
  const showingSearchResult = showAll || search || selectedCategory;

  const supportUrl = useMemo(() => {
    if (!safeSettings?.support_whatsapp) return "";
    const text = encodeURIComponent(safeSettings.support_message || "Halo GEx, saya membutuhkan bantuan.");
    return `https://wa.me/${safeSettings.support_whatsapp}?text=${text}`;
  }, [safeSettings]);

  const clearSearch = () => {
    setSearch("");
    setSelectedCategory(null);
    setShowAll(false);
  };

  return (
    <div className="min-h-dvh bg-gray-50 pb-32 text-slate-900 lg:px-6 lg:pb-10">
      <section
        className="relative overflow-hidden px-6 pb-12 pt-7 text-white lg:rounded-[32px] lg:px-8"
        style={{
          backgroundImage: "url('/images/header_background/bantuan.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-8 rounded-t-[50%] bg-gray-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur transition hover:bg-white/25"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold">Bantuan</h1>
          </div>

          <div className="mt-7 max-w-[240px]">
            <p className="text-base font-medium text-white/90">Halo, SOGEx!</p>
            <h2 className="mt-1 text-xl font-bold leading-tight">
              {safeSettings?.header_title || "Ada yang bisa GEx bantu?"}
            </h2>
          </div>
        </div>
      </section>

      <main className="relative -mt-8 space-y-5 px-4 lg:mx-auto lg:max-w-6xl lg:px-6">
        <div className="rounded-[24px] border border-white bg-white p-2.5 shadow-[0_10px_28px_rgba(15,23,42,0.10)]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-700" />
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setShowAll(true);
              }}
              placeholder="Masukkan kata kunci pencarian"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-11 text-sm font-medium text-slate-700 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-violet-700 transition hover:bg-violet-50"
                aria-label="Hapus pencarian"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            )}
          </label>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>
        )}

        <section>
          <h2 className="text-base font-bold text-slate-950">Kategori Pertanyaan</h2>
          <p className="mt-1 text-xs text-slate-500">Cari pertanyaanmu berdasarkan kategori berikut ini</p>
          <div className="mt-3 grid grid-cols-4 gap-2 lg:grid-cols-8 lg:gap-3">
            {(loading ? Array.from({ length: 8 }) : safeCategories).map((category, index) => {
              const Icon = loading ? Grid2X2 : iconMap[category?.icon] || fallbackIcons[index % fallbackIcons.length] || Grid2X2;
              const color = categoryColors[index % categoryColors.length];
              return (
                <button
                  key={loading ? index : category?.id || category?.slug || index}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    if (category?.slug) navigate(`/help/category/${category.slug}`);
                  }}
                  className="min-h-[78px] rounded-2xl border border-slate-100 bg-white px-1.5 py-2 text-center shadow-sm transition hover:-translate-y-0.5 disabled:cursor-default"
                >
                  <span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-xl ${color.bg} ${color.text}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="mt-1.5 line-clamp-2 block text-[10px] font-semibold leading-tight text-slate-700">
                    {loading ? "Memuat" : category?.name || "Kategori"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-base font-bold leading-tight text-slate-950">
              {showingSearchResult ? "Hasil Pencarian" : "Pertanyaan Paling Sering Dicari"}
            </h2>
            {!showingSearchResult && (
              <button
                type="button"
                onClick={() => navigate("/bantuan/populer")}
                className="shrink-0 text-xs font-semibold text-violet-700"
              >
                Lihat semua
              </button>
            )}
          </div>

          {loading || searching ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-2xl bg-white shadow-sm" />
              ))}
            </div>
          ) : visibleFaqs.length > 0 ? (
            <FaqList items={visibleFaqs} onOpen={(id) => navigate(`/bantuan/${id}`)} />
          ) : showingSearchResult ? (
            <EmptyState
              title="Pertanyaan tidak ditemukan."
              text="Coba gunakan kata kunci lain atau pilih kategori yang paling mendekati."
              action="Reset Pencarian"
              onAction={clearSearch}
            />
          ) : (
            <EmptyState
              title="Belum ada pertanyaan yang sering dicari."
              text="Coba cari pertanyaanmu atau pilih kategori untuk menemukan jawaban."
              action="Mulai Cari"
              onAction={() => setShowAll(true)}
            />
          )}
        </section>

        <HelpSupportCard supportUrl={supportUrl} />
      </main>
    </div>
  );
}
