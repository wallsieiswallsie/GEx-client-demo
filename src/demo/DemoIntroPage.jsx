import React from "react";
import { ArrowRight, Boxes, Building2, ClipboardList, Ship, UserRound } from "lucide-react";
import { DEMO_FLOW_STEPS } from "./demoGuide";

const highlights = [
  {
    icon: Boxes,
    title: "Origin Warehouse",
    text: "Paket masuk, dicatat, dipacking ke batch atau karung, lalu statusnya diperbarui.",
  },
  {
    icon: Ship,
    title: "Pengiriman",
    text: "Barang bergerak dari gudang asal menuju kota tujuan melalui kapal atau pesawat.",
  },
  {
    icon: Building2,
    title: "Destination Branch",
    text: "Cabang tujuan menerima paket dan mengatur pengambilan atau pengantaran.",
  },
  {
    icon: UserRound,
    title: "Customer",
    text: "Customer cek ongkir, lacak resi, melihat Paketku, jadwal kapal, dan bantuan.",
  },
];

export default function DemoIntroPage({ onStart }) {
  return (
    <main className="min-h-dvh bg-slate-950 text-white">
      <section className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-5 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
              <ClipboardList className="h-4 w-4" />
              Demo publik GEx
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              GEx Expedition Flow Demo
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              GEx adalah sistem ekspedisi dan pengiriman barang dengan alur gudang asal,
              pengiriman, gudang tujuan, lalu customer atau kurir. Demo ini memperlihatkan
              bagaimana setiap role mengelola paket dari resi masuk sampai diterima.
            </p>
            <button
              type="button"
              onClick={onStart}
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-lg bg-white px-5 text-sm font-black text-slate-950 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Mulai Demo
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-slate-950">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{item.text}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <h2 className="text-sm font-black text-white">Alur Kerja Aplikasi</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {DEMO_FLOW_STEPS.map((step, index) => (
              <div key={step} className="flex gap-3 text-sm leading-6 text-slate-300">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-black text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
