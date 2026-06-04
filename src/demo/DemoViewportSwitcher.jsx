import React from "react";
import { Monitor, Smartphone } from "lucide-react";

const options = [
  {
    key: "desktop",
    label: "Lihat sebagai Desktop",
    icon: Monitor,
    text: "Layout normal untuk presentasi di laptop atau monitor.",
  },
  {
    key: "mobile",
    label: "Lihat sebagai Mobile",
    icon: Smartphone,
    text: "Render aplikasi di simulator mobile di tengah layar.",
  },
];

export default function DemoViewportSwitcher({ onSelectViewport }) {
  return (
    <main className="min-h-dvh bg-slate-950 px-4 py-8 text-white">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-3xl flex-col justify-center">
        <h1 className="text-3xl font-black tracking-normal">Pilih tampilan demo</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Di device mobile, GEx otomatis memakai mobile layout. Pilihan ini hanya
          tampil saat demo dibuka dari desktop.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const Icon = option.icon;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onSelectViewport(option.key)}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-5 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.1]"
              >
                <Icon className="h-8 w-8" />
                <h2 className="mt-4 text-base font-black">{option.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{option.text}</p>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
