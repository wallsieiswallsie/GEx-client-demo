import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Reuse komponen existing biar konsisten UI
import BottomNav from "../../components/home/BottomNav";
import { SkeletonCard } from "../../components/home/SkeletonCard";

import {
    Clock,
    Truck,
    MapPin,
    PackageCheck,
    Users,
    UserX
} from "lucide-react";

// Header reuse (copy dari CustomerHome)
function GexLogo({ size = 40 }) {
    return (
        <img
            src="/images/logo_gex.png"
            alt="GEX Logo"
            style={{ height: size * 0.6 }}
            className="object-contain"
        />
    );
}

function HomeHeader({ user, onLogout }) {
    const initial =
        user?.name?.[0]?.toUpperCase() ||
        user?.username?.[0]?.toUpperCase() ||
        "U";

    return (
        <header className="flex items-center justify-between px-4 pt-5 pb-3 bg-white sticky top-0 z-40 border-b border-gray-50">
            <GexLogo size={48} />

            <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-red-500 flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">{initial}</span>
                </div>

                <button
                    onClick={onLogout}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                    ⎋
                </button>
            </div>
        </header>
    );
}

// ==========================
// MAIN PAGE
// ==========================
export default function GeneralManagerHome() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="flex flex-col min-h-dvh bg-gray-50">
            <HomeHeader user={user} onLogout={handleLogout} />

            <main className="flex-1 overflow-y-auto pb-24">
                <div className="flex flex-col gap-4 pt-3">

                    {/* ===================== */}
                    {/* Insight Kloter */}
                    {/* ===================== */}
                    <section className="bg-white mx-4 p-4 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-sm font-bold">
                                Insight Kloter (2 Bulan)
                            </h2>
                            <button className="text-xs text-violet-600">
                                Lihat lebih banyak
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <InsightItem icon={Clock} label="Menunggu Jadwal" value={12} />
                            <InsightItem icon={Truck} label="Dalam Pengiriman" value={8} />
                            <InsightItem icon={MapPin} label="Tiba Kota Tujuan" value={5} />
                            <InsightItem icon={PackageCheck} label="Selesai" value={20} />
                        </div>
                    </section>

                    {/* ===================== */}
                    {/* Insight User */}
                    {/* ===================== */}
                    <section className="bg-white mx-4 p-4 rounded-2xl shadow-sm">
                        <h2 className="text-sm font-bold mb-3">Insight User</h2>

                        <div className="grid grid-cols-2 gap-3">
                            <InsightItem icon={Users} label="Customer" value={320} />
                            <InsightItem icon={UserX} label="Non Customer" value={120} />
                        </div>
                    </section>

                    {/* ===================== */}
                    {/* Kloter Terdekat */}
                    {/* ===================== */}
                    <section className="mx-4">
                        <h2 className="text-sm font-bold mb-2">
                            Kloter Pengiriman Terdekat
                        </h2>

                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="min-w-[220px] bg-white p-4 rounded-2xl shadow-sm"
                                >
                                    <p className="text-xs text-gray-400">Kapal</p>
                                    <p className="font-bold">KM Nusantara {item}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Berangkat: 25 Mei
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ===================== */}
                    {/* Belum Dipacking */}
                    {/* ===================== */}
                    <section className="bg-white mx-4 p-4 rounded-2xl shadow-sm">
                        <h2 className="text-sm font-bold mb-3">Belum Dipacking</h2>

                        <div className="flex flex-col gap-2 text-sm">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="flex justify-between border-b pb-2"
                                >
                                    <span>PKT-{item}234</span>
                                    <span className="text-red-500 text-xs">Urgent</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ===================== */}
                    {/* Fitur */}
                    {/* ===================== */}
                    <section className="mx-4">
                        <h2 className="text-sm font-bold mb-2">Fitur</h2>

                        <div className="grid grid-cols-4 gap-3">
                            {FEATURES.map((f) => (
                                <button
                                    key={f.label}
                                    onClick={() => navigate(f.path)}
                                    className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center text-center text-[10px]"
                                >
                                    <f.icon className="w-5 h-5 mb-1 text-violet-600" />
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <GM_BottomNav />
        </div>
    );
}

// ==========================
// COMPONENTS
// ==========================
function InsightItem({ icon: Icon, label, value }) {
    return (
        <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-2">
            <Icon className="w-4 h-4 text-violet-600" />
            <div>
                <p className="text-[10px] text-gray-500">{label}</p>
                <p className="font-bold text-sm">{value}</p>
            </div>
        </div>
    );
}

// ==========================
// FEATURES
// ==========================
const FEATURES = [
    { label: "Input Paket", path: "/input", icon: PackageCheck },
    { label: "Belum Packing", path: "/belum-packing", icon: Clock },
    { label: "Paket Bermasalah", path: "/masalah", icon: MapPin },
    { label: "Database Paket", path: "/database", icon: PackageCheck },
    { label: "Manage User", path: "/users", icon: Users },
    { label: "Manage Gudang", path: "/gudang", icon: MapPin },
    { label: "Rute & Ongkir", path: "/rute", icon: Truck },
    { label: "Informasi", path: "/info", icon: PackageCheck },
    { label: "Kloter", path: "/kloter", icon: Truck },
    { label: "Ekspedisi", path: "/ekspedisi", icon: Truck },
    { label: "Konten", path: "/konten", icon: PackageCheck },
    { label: "Invoice", path: "/invoice", icon: PackageCheck },
    { label: "Kontak Customer", path: "/kontak", icon: Users },
    { label: "Kemitraan", path: "/mitra", icon: Users },
    { label: "Setoran", path: "/setoran", icon: PackageCheck },
];

// ==========================
// GM BottomNav (Protected)
// ==========================
function GM_BottomNav() {
    const navigate = useNavigate();

    const goProtected = (path) => {
        const isAllowed = true; // nanti connect ke role logic
        if (!isAllowed) return alert("Akses ditolak");
        navigate(path);
    };

    return (
        <nav className="sticky bottom-0 bg-white border-t shadow-lg grid grid-cols-5 text-xs">
            <NavItem label="Beranda" onClick={() => navigate("/gm")} />
            <NavItem label="Database" onClick={() => goProtected("/database")} />
            <NavItem label="Pengiriman" onClick={() => goProtected("/laporan-pengiriman")} />
            <NavItem label="Keuangan" onClick={() => goProtected("/laporan-keuangan")} />
            <NavItem label="Profil" onClick={() => navigate("/profil")} />
        </nav>
    );
}

function NavItem({ label, onClick }) {
    return (
        <button onClick={onClick} className="py-3">
            {label}
        </button>
    );
}