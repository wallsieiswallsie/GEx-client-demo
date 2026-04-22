import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Home,
    Truck,
    MapPin,
    PackageCheck,
    Users,
    UserX,
    AlertCircle,
    Database,
    FileText,
    Wallet,
    User,
    Clock
} from "lucide-react";
import Header from "../../components/home/Header";

import { useAuth } from '../../context/AuthContext';

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
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };


    return (
        <div className="flex flex-col min-h-dvh bg-gray-50">

            {/* HEADER */}
            <Header
                initial={
                    (user?.name?.[0] ||
                        user?.username?.[0] ||
                        "U"
                    ).toUpperCase()
                }
                onLogout={handleLogout}
            />

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

                        {FEATURE_GROUPS.map((group) => (
                            <div key={group.title} className="mb-4">

                                {/* TITLE */}
                                <h3 className="text-xs font-semibold text-gray-400 mb-2 px-1">
                                    {group.title}
                                </h3>

                                {/* GRID ITEMS */}
                                <div className="grid grid-cols-4 gap-4">
                                    {group.items.map((f) => (
                                        <button
                                            key={f.label}
                                            onClick={() => navigate(f.path)}
                                            className="flex flex-col items-center text-center"
                                        >
                                            <div className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm ${f.color}`}>
                                                <f.icon className="w-6 h-6" />
                                            </div>

                                            <span className="mt-2 text-[11px] font-medium text-gray-600 leading-tight">
                                                {f.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                            </div>
                        ))}
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
const FEATURE_GROUPS = [
    {
        title: "Menu Utama",
        items: [
            { label: "Operasional", path: "/operasional", icon: PackageCheck, color: "bg-violet-100 text-violet-600" },
            { label: "Logistik", path: "/logistik", icon: Truck, color: "bg-orange-100 text-orange-600" },
            { label: "Keuangan", path: "/keuangan", icon: Wallet, color: "bg-lime-100 text-lime-600" },
            { label: "Relasi", path: "/relasi", icon: Users, color: "bg-indigo-100 text-indigo-600" },
            { label: "Konten", path: "/cms", icon: FileText, color: "bg-sky-100 text-sky-600" },
        ]
    }
];

/* =========================
   BOTTOM NAV GM
========================= */
function GM_BottomNav() {
    const navigate = useNavigate();

    return (
        <nav className="sticky bottom-0 bg-white border-t shadow-lg grid grid-cols-5 text-[10px]">
            <NavItem icon={Home} label="Beranda" onClick={() => navigate("/gm")} />
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