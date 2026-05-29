import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Calculator,
  CreditCard,
  Grid2X2,
  Headphones,
  MapPin,
  PackageSearch,
  Rocket,
  Search,
  Settings2,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
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

function EmptyState({ title, text, action, onAction }) {
  return (
    <div className="rounded-[24px] border border-slate-100 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[28px] bg-violet-50 text-violet-700">
        <Search className="h-9 w-9" />
      </div>
      <h3 className="font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="mx-auto mt-5 flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-blue-600 px-6 font-bold text-white shadow-lg shadow-violet-500/20"
        >
          <Search className="h-5 w-5" />
          {action}
        </button>
      )}
    </div>
  );
}

function FaqList({ items, onOpen }) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];

  return (
    <div className="space-y-3">
      {safeItems.map((faq, index) => (
        <button
          key={faq?.id || index}
          type="button"
          onClick={() => {
            if (faq?.id) onOpen(faq.id);
          }}
          className="w-full rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <PackageSearch className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold leading-snug text-slate-900">
                {faq?.question || "Pertanyaan bantuan"}
              </span>
              <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-slate-500">
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
  const visibleFaqs = showAll || search || selectedCategory ? safeFaqs : safePopularFaqs;
  const showingSearchResult = showAll || search || selectedCategory;

  const supportUrl = useMemo(() => {
    if (!safeSettings?.support_whatsapp) return "";
    const text = encodeURIComponent(safeSettings.support_message || "Halo GEx, saya membutuhkan bantuan.");
    return `https://wa.me/${safeSettings.support_whatsapp}?text=${text}`;
  }, [safeSettings]);

  const selectCategory = (category) => {
    if (!category?.id) return;
    setSelectedCategory((current) => (current?.id === category?.id ? null : category));
    setShowAll(true);
  };

  const clearSearch = () => {
    setSearch("");
    setSelectedCategory(null);
    setShowAll(false);
  };

  return (
    <div className="min-h-dvh bg-slate-50 pb-6 text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2b057c] via-[#4f12c8] to-[#1f7af7] px-5 pb-20 pt-7 text-white">
        <div className="absolute bottom-0 left-0 right-0 h-9 rounded-t-[48%] bg-slate-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-black">Bantuan</h1>
          </div>

          <div className="mt-9 flex items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-lg font-medium text-white/90">Halo,</p>
              <h2 className="mt-1 max-w-[250px] text-2xl font-black leading-tight">
                {safeSettings?.header_title || "Ada yang bisa GEx bantu?"}
              </h2>
              <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-white/85">{headerSubtitle}</p>
            </div>
            <div className="relative mb-1 flex h-28 w-24 shrink-0 items-center justify-center">
              <div className="absolute inset-x-2 bottom-0 h-24 rounded-t-[40px] bg-white/15" />
              <Headphones className="relative h-20 w-20 drop-shadow-xl" strokeWidth={1.8} />
            </div>
          </div>
        </div>
      </section>

      <main className="relative -mt-12 space-y-7 px-4">
        <div className="rounded-[26px] border border-white bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.14)]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-violet-700" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setShowAll(true);
              }}
              placeholder="Masukkan kata kunci pencarian"
              className="h-16 w-full rounded-2xl border border-slate-100 bg-white pl-14 pr-14 text-base font-semibold text-slate-700 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-violet-700"
              aria-label="Reset filter"
            >
              {search || selectedCategory ? <X className="h-5 w-5" /> : <Settings2 className="h-5 w-5" />}
            </button>
          </label>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>
        )}

        <section>
          <h2 className="text-xl font-black text-slate-950">Kategori Pertanyaan</h2>
          <p className="mt-1 text-sm text-slate-500">Cari pertanyaanmu berdasarkan kategori berikut ini</p>
          <div className="mt-4 grid grid-cols-2 gap-3 min-[380px]:grid-cols-4">
            {(loading ? Array.from({ length: 8 }) : safeCategories).map((category, index) => {
              const Icon = loading ? Grid2X2 : iconMap[category?.icon] || fallbackIcons[index % fallbackIcons.length] || Grid2X2;
              const active = Boolean(category?.id && selectedCategory?.id === category?.id);
              return (
                <button
                  key={loading ? index : category?.id || category?.slug || index}
                  type="button"
                  disabled={loading}
                  onClick={() => selectCategory(category)}
                  className={`min-h-[112px] rounded-2xl border bg-white p-3 text-center shadow-sm transition ${active ? "border-violet-400 ring-4 ring-violet-100" : "border-slate-100"}`}
                >
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="mt-3 block text-sm font-extrabold leading-tight text-slate-700">
                    {loading ? "Memuat" : category?.name || "Kategori"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-black leading-tight text-slate-950">
              {showingSearchResult ? "Hasil Pencarian" : "Pertanyaan Paling Sering Dicari"}
            </h2>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="shrink-0 text-sm font-extrabold text-violet-700"
            >
              Lihat semua
            </button>
          </div>

          {loading || searching ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-2xl bg-white shadow-sm" />
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

        <section className="rounded-[24px] bg-gradient-to-r from-violet-100 via-white to-blue-50 p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
              <Headphones className="h-9 w-9" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-black text-slate-950">Masih butuh bantuan?</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                Hubungi tim CS kami, siap membantu kapan pun kamu butuhkan.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={!supportUrl}
            onClick={() => window.open(supportUrl, "_blank", "noopener,noreferrer")}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white font-extrabold text-violet-700 disabled:opacity-50"
          >
            <Headphones className="h-5 w-5" />
            Hubungi CS
          </button>
        </section>
      </main>
    </div>
  );
}
