import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Headphones, MessageCircle } from "lucide-react";
import { getHelpFaqDetail, getHelpSettings } from "../../services/api/helpApi";

export default function HelpDetailPage() {
  const navigate = useNavigate();
  const { faqId } = useParams();
  const [faq, setFaq] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [faqData, settingsData] = await Promise.all([
          getHelpFaqDetail(faqId),
          getHelpSettings(),
        ]);
        setFaq(faqData && typeof faqData === "object" ? faqData : {});
        setSettings(settingsData && typeof settingsData === "object" ? settingsData : {});
      } catch (err) {
        setError("Bantuan belum dapat dimuat. Silakan coba lagi.");
        setFaq({});
        setSettings({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [faqId]);

  const safeFaq = faq && typeof faq === "object" ? faq : {};
  const safeSettings = settings && typeof settings === "object" ? settings : {};

  const supportUrl = safeSettings?.support_whatsapp
    ? `https://wa.me/${safeSettings.support_whatsapp}?text=${encodeURIComponent(safeSettings.support_message || "Halo GEx, saya membutuhkan bantuan.")}`
    : "";

  return (
    <div className="min-h-dvh bg-slate-50 pb-6 text-slate-900 lg:px-6">
      <section className="bg-gradient-to-br from-[#2b057c] via-[#4f12c8] to-[#1f7af7] px-5 pb-12 pt-7 text-white lg:rounded-[32px] lg:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-black">Detail Bantuan</h1>
            <p className="mt-1 text-sm text-white/80">Jawaban dari pertanyaanmu</p>
          </div>
        </div>
      </section>

      <main className="-mt-6 space-y-4 px-4 lg:mx-auto lg:max-w-5xl lg:px-6">
        {loading ? (
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            <div className="h-40 animate-pulse rounded-[24px] bg-white shadow-sm" />
            <div className="h-28 animate-pulse rounded-[24px] bg-white shadow-sm" />
          </div>
        ) : error ? (
          <div className="rounded-[24px] border bg-white p-6 text-center shadow-sm">
            <h2 className="font-bold text-slate-950">FAQ tidak tersedia</h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-4">
            <article className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
              {safeFaq?.category_name && (
                <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                  {safeFaq.category_name}
                </span>
              )}
              <h2 className="mt-4 text-2xl font-black leading-tight text-slate-950">
                {safeFaq?.question || "Pertanyaan bantuan"}
              </h2>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Eye className="h-4 w-4" />
                Dilihat {Number(safeFaq?.view_count || 0).toLocaleString("id-ID")} kali
              </div>
              <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-600">
                {safeFaq?.answer || ""}
              </p>
            </article>

            <section className="rounded-[24px] bg-gradient-to-r from-violet-100 via-white to-blue-50 p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
                  <Headphones className="h-8 w-8" />
                </span>
                <div>
                  <h3 className="font-black text-slate-950">Masih bingung?</h3>
                  <p className="mt-1 text-sm text-slate-600">Tim CS GEx siap membantu.</p>
                </div>
              </div>
              <button
                type="button"
                disabled={!supportUrl}
                onClick={() => window.open(supportUrl, "_blank", "noopener,noreferrer")}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 font-extrabold text-white disabled:opacity-50"
              >
                <MessageCircle className="h-5 w-5" />
                Hubungi CS
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
