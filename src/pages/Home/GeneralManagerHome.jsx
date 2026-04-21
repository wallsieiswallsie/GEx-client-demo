import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Clock,
    Truck,
    MapPin,
    PackageCheck,
    Users,
    UserX,
    AlertCircle,
    Database,
    FileText,
    Wallet,
    User
} from "lucide-react";

/* =========================
   HEADER
========================= */
function GexLogo({ size = 40 }) {
    return (
        <img
            src="/images/logo_gex.png"
            alt="GEX"
            style={{ height: size * 0.6 }}
        />
    );
}

function Header() {
    return (
        <header className="flex justify-between items-center px-4 pt-5 pb-3 bg-white border-b">
            <GexLogo size={48} />

            <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-red-500 flex items-center justify-center text-white font-bold">
                    G
                </div>
            </div>
        </header>
    );
}

/* =========================
   COMPONENT KECIL
========================= */
function InsightItem({ icon: Icon, label, value }) {
    return (
        <div className="bg-gray-50 rounded-xl p-3 flex gap-2 items-center">
            <Icon className="w-4 h-4 text-violet-600" />
            <div>
                <p className="text-[10px] text-gray-500">{label}</p>
                <p className="font-bold text-sm">{value}</p>
            </div>
        </div>
    );
}

function Section({ title, action }) {
    return (
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-bold">{title}</h2>
            {action && <button className="text-xs text-violet-600">{action}</button>}
        </div>
    );
}

/* =========================
   MAIN PAGE
========================= */
export default function GeneralManagerHome() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-dvh bg-gray-50">

            {/* HEADER */}
            <Header />

            {/* CONTENT */}
            <main className="flex-1 overflow-y-auto pb-24">
                <div className="flex flex-col gap-4 pt-3">

                    {/* =========================
             Insight Kloter
          ========================= */}
                    <section className="bg-white mx-4 p-4 rounded-2xl shadow-sm">
                        <Section title="Insight Kloter (2 Bulan Terakhir)" action="Lihat lebih banyak" />

                        <div className="grid grid-cols-2 gap-3">
                            <InsightItem icon={Clock} label="Menunggu Jadwal" value="12" />
                            <InsightItem icon={Truck} label="Dalam Pengiriman" value="8" />
                            <InsightItem icon={MapPin} label="Tiba Kota Tujuan" value="5" />
                            <InsightItem icon={PackageCheck} label="Selesai" value="20" />
                        </div>
                    </section>

                    {/* =========================
             Insight User
          ========================= */}
                    <section className="bg-white mx-4 p-4 rounded-2xl shadow-sm">
                        <Section title="Insight User" />

                        <div className="grid grid-cols-2 gap-3">
                            <InsightItem icon={Users} label="Customer" value="320" />
                            <InsightItem icon={UserX} label="Non Customer" value="120" />
                        </div>
                    </section>

                    {/* =========================
             Kloter Terdekat
          ========================= */}
                    <section className="mx-4">
                        <Section title="Kloter Pengiriman Terdekat" />

                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="min-w-[230px] bg-white p-4 rounded-2xl shadow-sm"
                                >
                                    <p className="text-xs text-gray-400">Kapal</p>
                                    <p className="font-bold">KM Nusantara {item}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Berangkat: 25 Mei 2026
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* =========================
             Belum Dipacking
          ========================= */}
                    <section className="bg-white mx-4 p-4 rounded-2xl shadow-sm">
                        <Section title="Belum Dipacking" />

                        <div className="flex flex-col gap-2 text-sm">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="flex justify-between border-b pb-2"
                                >
                                    <span>PKT-00{item}234</span>
                                    <span className="text-red-500 text-xs flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Pending
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* =========================
             FITUR
          ========================= */}
                    <section className="mx-4">
                        <Section title="Fitur" />

                        <div className="grid grid-cols-4 gap-3">
                            {FEATURES.map((f) => (
                                <button
                                    key={f.label}
                                    onClick={() => navigate(f.path)}
                                    className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center text-center text-[10px]"
                                >
                                    <f.icon className="w-5 h-5 text-violet-600 mb-1" />
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            {/* =========================
         BOTTOM NAV (GM)
      ========================= */}
            <GM_BottomNav />
        </div>
    );
}

/* =========================
   FEATURES LIST
========================= */
const FEATURES = [
    { label: "Input Paket", path: "/input", icon: PackageCheck },
    { label: "Belum Packing", path: "/belum-packing", icon: Clock },
    { label: "Paket Bermasalah", path: "/masalah", icon: AlertCircle },
    { label: "Database Paket", path: "/database", icon: Database },
    { label: "Manage User", path: "/users", icon: Users },
    { label: "Manage Gudang", path: "/gudang", icon: MapPin },
    { label: "Rute & Ongkir", path: "/rute", icon: Truck },
    { label: "Informasi", path: "/info", icon: FileText },
    { label: "Kloter", path: "/kloter", icon: Truck },
    { label: "Ekspedisi", path: "/ekspedisi", icon: Truck },
    { label: "Konten", path: "/konten", icon: FileText },
    { label: "Invoice", path: "/invoice", icon: FileText },
    { label: "Kontak", path: "/kontak", icon: Users },
    { label: "Kemitraan", path: "/mitra", icon: Users },
    { label: "Setoran", path: "/setoran", icon: Wallet },
];

/* =========================
   BOTTOM NAV GM
========================= */
function GM_BottomNav() {
    const navigate = useNavigate();

    return (
        <nav className="sticky bottom-0 bg-white border-t shadow-lg grid grid-cols-5 text-[10px]">
            <NavItem icon={Clock} label="Beranda" onClick={() => navigate("/gm")} />
            <NavItem icon={Database} label="Database" onClick={() => navigate("/database")} />
            <NavItem icon={Truck} label="Pengiriman" onClick={() => navigate("/laporan-pengiriman")} />
            <NavItem icon={Wallet} label="Keuangan" onClick={() => navigate("/laporan-keuangan")} />
            <NavItem icon={User} label="Profil" onClick={() => navigate("/profil")} />
        </nav>
    );
}

function NavItem({ icon: Icon, label, onClick }) {
    return (
        <button onClick={onClick} className="flex flex-col items-center py-3">
            <Icon className="w-4 h-4 mb-1" />
            {label}
        </button>
    );
}