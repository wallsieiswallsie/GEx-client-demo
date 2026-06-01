import { Headphones } from "lucide-react";

export default function HelpSupportCard({ supportUrl }) {
  return (
    <section className="flex items-center gap-3 rounded-[20px] bg-violet-50 px-4 py-3.5 shadow-sm">
      <img
        src="/images/faq.png"
        alt=""
        className="h-16 w-16 shrink-0 object-contain min-[390px]:h-20 min-[390px]:w-20"
      />
      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-bold text-slate-950">Masih butuh bantuan?</h2>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
          Hubungi tim CS kami, siap membantu kapan pun kamu butuhkan.
        </p>
      </div>
      <button
        type="button"
        disabled={!supportUrl}
        onClick={() => window.open(supportUrl, "_blank", "noopener,noreferrer")}
        className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3 text-xs font-semibold text-violet-700 disabled:opacity-50 min-[390px]:gap-2 min-[390px]:px-4 min-[390px]:text-sm"
      >
        <Headphones className="h-4 w-4" />
        <span className="hidden min-[345px]:inline">Hubungi CS</span>
        <span className="min-[345px]:hidden">CS</span>
      </button>
    </section>
  );
}
