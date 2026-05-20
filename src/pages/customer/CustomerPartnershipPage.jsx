import { ArrowLeft, BadgeCheck, Gift, Handshake, Info, ShieldCheck, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    title: "Keuntungan Menarik",
    subtitle: "Dapatkan berbagai benefit eksklusif.",
    icon: Gift,
    color: "text-amber-600 bg-amber-50",
  },
  {
    title: "Berkembang Bersama",
    subtitle: "Tumbuh lebih besar bersama GEx.",
    icon: TrendingUp,
    color: "text-violet-700 bg-violet-50",
  },
  {
    title: "Sistem Aman & Terpercaya",
    subtitle: "Transparan dan dapat dipercaya.",
    icon: ShieldCheck,
    color: "text-blue-600 bg-blue-50",
  },
];

export default function CustomerPartnershipPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-gray-50 pb-6 text-slate-900">
      <section
        className="relative h-[280px] overflow-hidden rounded-b-[34px] px-6 pt-8 text-white"
        style={{
          backgroundImage: "url('/images/header_background/kemitraan.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            <h1 className="text-3xl font-black leading-tight">Kemitraan</h1>
            <p className="mt-3 max-w-[190px] whitespace-pre-line text-base font-medium leading-relaxed text-white/90">
              Bersama kita tumbuh,{"\n"}sukses bersama
            </p>
          </div>
          <img
            src="/images/customer_home/kemitraan.png"
            alt=""
            className="mt-6 h-28 w-28 shrink-0 object-contain drop-shadow-2xl"
          />
        </div>
      </section>

      <main className="relative -mt-20 space-y-5 px-4">
        <section className="rounded-[30px] border border-white bg-white px-5 pb-6 pt-7 text-center shadow-[0_16px_42px_rgba(88,28,135,0.16)]">
          <img
            src="/images/kemitraan-coming-soon.png"
            alt=""
            className="mx-auto h-44 w-full max-w-[250px] object-contain"
          />

          <h2 className="mx-auto mt-4 max-w-[260px] text-2xl font-black leading-tight text-violet-950">
            Fitur Kemitraan
            <br />
            Akan Segera Hadir
          </h2>

          <div className="mx-auto my-5 h-1 w-16 rounded-full bg-gradient-to-r from-violet-700 via-fuchsia-500 to-red-500" />

          <p className="mx-auto max-w-[300px] text-sm leading-relaxed text-slate-500">
            Kami sedang menyiapkan pengalaman terbaik untuk Anda yang ingin berkembang bersama GEx.
            Nantikan fitur kemitraan dalam waktu dekat.
          </p>
        </section>

        <section className="flex items-center justify-between gap-3 rounded-2xl bg-violet-50 p-4 shadow-sm">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
              <Info className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-violet-900">Informasi</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Kami berkomitmen untuk menghadirkan program kemitraan yang transparan, mudah, dan
                menguntungkan bagi mitra terbaik kami.
              </p>
            </div>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
            <Handshake className="h-9 w-9" />
          </div>
        </section>

        <section className="space-y-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(88,28,135,0.12)]"
              >
                <div className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl ${benefit.color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-black text-slate-900">{benefit.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{benefit.subtitle}</p>
                </div>
                <BadgeCheck className="h-5 w-5 shrink-0 text-violet-300" />
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
