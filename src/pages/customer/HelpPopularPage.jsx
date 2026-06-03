import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import HelpSupportCard from "../../components/help/HelpSupportCard";
import { getHelpFaqs, getHelpSettings } from "../../services/api/helpApi";

export default function HelpPopularPage() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [settings, setSettings] = useState({});
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [faqData, settingsData] = await Promise.all([
          getHelpFaqs({ popular: true, limit: 100 }),
          getHelpSettings(),
        ]);
        setFaqs(Array.isArray(faqData) ? faqData.filter(Boolean) : []);
        setSettings(settingsData && typeof settingsData === "object" ? settingsData : {});
      } catch {
        setFaqs([]);
        setSettings({});
        setError("Bantuan belum dapat dimuat. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFaqs = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return faqs;

    return faqs.filter((faq) => {
      const question = String(faq?.question || "").toLowerCase();
      const answer = String(faq?.answer || "").toLowerCase();
      return question.includes(keyword) || answer.includes(keyword);
    });
  }, [faqs, search]);

  const supportUrl = useMemo(() => {
    if (!settings?.support_whatsapp) return "";
    const text = encodeURIComponent(settings.support_message || "Halo GEx, saya membutuhkan bantuan.");
    return `https://wa.me/${settings.support_whatsapp}?text=${text}`;
  }, [settings]);

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
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur transition hover:bg-white/25"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="mt-7 max-w-[300px]">
            <h1 className="text-2xl font-bold leading-tight">Pertanyaan Paling Sering Dicari</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              Temukan jawaban dari pertanyaan yang paling sering ditanyakan pelanggan GEx
            </p>
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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari pertanyaan populer"
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
            {loading ? "Memuat pertanyaan..." : `${filteredFaqs.length} Pertanyaan`}
          </p>
        </section>

        <section>
          {loading ? (
            <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-16 animate-pulse rounded-2xl bg-white shadow-sm" />
              ))}
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <Search className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Pertanyaan tidak ditemukan</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Coba gunakan kata kunci lain atau hubungi Customer Service kami
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
              {filteredFaqs.map((faq, index) => {
                const key = faq?.id || index;
                const isOpen = openId === key;

                return (
                  <article
                    key={key}
                    className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : key)}
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
                    <div
                      className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-4 pb-4 pl-[60px]">
                          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                            {faq?.answer || ""}
                          </p>
                        </div>
                      </div>
                    </div>
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
