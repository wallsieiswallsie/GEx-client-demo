import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import HelpSupportCard from "../../components/help/HelpSupportCard";
import {
  getHelpCategories,
  getHelpFaqs,
  getHelpSettings,
} from "../../services/api/helpApi";

const fallbackDescriptions = {
  "jenis-pengiriman": "Semua informasi terkait jenis layanan dan pengiriman",
  "cek-tarif": "Semua informasi terkait tarif dan estimasi biaya pengiriman",
  "lacak-paket": "Semua informasi terkait pelacakan dan status paket",
  "dangerous-goods": "Semua informasi terkait barang berbahaya dan batasan pengiriman",
  pembayaran: "Semua informasi terkait pembayaran layanan GEx",
  "klaim-dan-asuransi": "Semua informasi terkait klaim dan asuransi pengiriman",
  "klaim-asuransi": "Semua informasi terkait klaim dan asuransi pengiriman",
  embargo: "Semua informasi terkait area dan kondisi embargo",
  lainnya: "Informasi bantuan lainnya seputar layanan GEx",
};

const titleFromSlug = (slug = "") =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function HelpCategoryPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [settings, setSettings] = useState({});
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [categoriesData, settingsData] = await Promise.all([
          getHelpCategories(),
          getHelpSettings(),
        ]);
        const categories = Array.isArray(categoriesData) ? categoriesData.filter(Boolean) : [];
        setCategory(categories.find((item) => item?.slug === slug) || null);
        setSettings(settingsData && typeof settingsData === "object" ? settingsData : {});
      } catch {
        setCategory(null);
        setSettings({});
      }
    };

    fetchMeta();
  }, [slug]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setError("");
        setSearching(Boolean(search));
        if (!search) setLoading(true);

        const data = await getHelpFaqs({
          category_slug: slug,
          search,
          limit: 50,
        });
        const nextFaqs = Array.isArray(data) ? data.filter(Boolean) : [];
        setFaqs(nextFaqs);
        setOpenId((current) => current || nextFaqs[0]?.id || null);
      } catch {
        setFaqs([]);
        setError("Bantuan belum dapat dimuat. Silakan coba lagi.");
      } finally {
        setLoading(false);
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [slug, search]);

  const title = category?.name || titleFromSlug(slug);
  const description =
    category?.description ||
    fallbackDescriptions[slug] ||
    `Semua informasi terkait ${title.toLowerCase()}`;

  const supportUrl = useMemo(() => {
    if (!settings?.support_whatsapp) return "";
    const text = encodeURIComponent(settings.support_message || "Halo GEx, saya membutuhkan bantuan.");
    return `https://wa.me/${settings.support_whatsapp}?text=${text}`;
  }, [settings]);

  return (
    <div className="min-h-dvh bg-gray-50 pb-32 text-slate-900">
      <section
        className="relative overflow-hidden px-6 pb-12 pt-7 text-white"
        style={{
          backgroundImage: "url('/images/header_background/bantuan.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-8 rounded-t-[50%] bg-gray-50" />
        <div className="relative z-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur transition hover:bg-white/25"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="mt-7 max-w-[260px]">
            <h1 className="text-2xl font-bold leading-tight">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/85">{description}</p>
          </div>
        </div>
      </section>

      <main className="relative -mt-8 space-y-5 px-4">
        <div className="rounded-[24px] border border-white bg-white p-2.5 shadow-[0_10px_28px_rgba(15,23,42,0.10)]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-700" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari dalam kategori ini"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-11 text-sm font-medium text-slate-700 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
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

        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-base font-bold text-slate-950">
            {loading || searching ? "Memuat pertanyaan..." : `${faqs.length} Pertanyaan`}
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-slate-950">Daftar Pertanyaan</h2>

          {loading || searching ? (
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-16 animate-pulse rounded-2xl bg-white shadow-sm" />
              ))}
            </div>
          ) : faqs.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Pertanyaan tidak ditemukan.</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Coba gunakan kata kunci lain di kategori ini.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {faqs.map((faq, index) => {
                const isOpen = openId === faq?.id;
                return (
                  <article
                    key={faq?.id || index}
                    className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : faq?.id)}
                      className="flex w-full items-center gap-3 p-4 text-left"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-bold text-violet-700">
                        {index + 1}.
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-slate-950">
                        {faq?.question || "Pertanyaan bantuan"}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 shrink-0 text-violet-700" />
                      ) : (
                        <ChevronDown className="h-5 w-5 shrink-0 text-violet-700" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pl-[60px]">
                        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                          {faq?.answer || ""}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <HelpSupportCard supportUrl={supportUrl} />
      </main>
    </div>
  );
}
