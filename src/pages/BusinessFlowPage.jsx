import React from "react";
import { CheckCircle2, PackagePlus, Ship, Store, Truck, Warehouse } from "lucide-react";
import SubPageHeader from "../components/layout/SubPageHeader";

const FLOW = [
  { label: "Customer", icon: Store, color: "bg-violet-50 text-violet-700" },
  { label: "Daftarkan Paket", icon: PackagePlus, color: "bg-blue-50 text-blue-700" },
  { label: "Gudang Asal", icon: Warehouse, color: "bg-emerald-50 text-emerald-700" },
  { label: "Packing", icon: PackagePlus, color: "bg-amber-50 text-amber-700" },
  { label: "Batch Kapal/Pesawat", icon: Ship, color: "bg-cyan-50 text-cyan-700" },
  { label: "Pengiriman", icon: Truck, color: "bg-indigo-50 text-indigo-700" },
  { label: "Gudang Tujuan", icon: Warehouse, color: "bg-fuchsia-50 text-fuchsia-700" },
  { label: "Pengantaran / Diambil Sendiri", icon: Truck, color: "bg-orange-50 text-orange-700" },
  { label: "Selesai", icon: CheckCircle2, color: "bg-lime-50 text-lime-700" },
];

export default function BusinessFlowPage() {
  return (
    <div className="min-h-dvh bg-gray-50 p-4 pb-24">
      <SubPageHeader
        title="Bagaimana GEx Bekerja?"
        subtitle="Alur bisnis pengiriman dari customer sampai selesai"
      />

      <main className="mx-auto max-w-3xl">
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:p-6">
          <div className="space-y-3">
            {FLOW.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{item.label}</p>
                      <p className="mt-0.5 text-xs leading-5 text-gray-500">
                        {getDescription(item.label)}
                      </p>
                    </div>
                  </div>
                  {index < FLOW.length - 1 && (
                    <div className="ml-8 h-6 w-px bg-gray-200" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function getDescription(label) {
  const descriptions = {
    Customer: "Pengguna mulai dari kebutuhan kirim atau pantau paket.",
    "Daftarkan Paket": "Data paket, barang, berat, dan rute dicatat.",
    "Gudang Asal": "Paket diterima dan disiapkan untuk proses operasional.",
    Packing: "Paket dikemas, dikelompokkan, dan divalidasi.",
    "Batch Kapal/Pesawat": "Paket masuk batch pengiriman berdasarkan moda dan jadwal.",
    Pengiriman: "Batch bergerak menuju cabang atau gudang tujuan.",
    "Gudang Tujuan": "Tim tujuan menerima dan memvalidasi paket.",
    "Pengantaran / Diambil Sendiri": "Paket disiapkan untuk delivery atau pickup customer.",
    Selesai: "Status akhir diperbarui dan paket selesai diproses.",
  };
  return descriptions[label] || "";
}
