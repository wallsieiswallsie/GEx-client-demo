import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Truck,
    MapPin,
    PackageCheck,
    Users,
    UserX,
    AlertCircle,
    FileText,
    Wallet,
    Clock
} from "lucide-react";
import Header from "../../components/home/Header";
import BottomNav from '../../components/home/BottomNav';

import { useAuth } from '../../context/useAuth';
import { useHomeSummary } from "../../hooks/useHomeSummary";

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

function Section({ title, action, onAction }) {
    return (
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-bold">{title}</h2>
            {action && <button onClick={onAction} className="text-xs text-violet-600">{action}</button>}
        </div>
    );
}

/* =========================
   MAIN PAGE
========================= */
export default function GeneralManagerHome() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { data: summaryData } = useHomeSummary();
    const mispackedPackages = summaryData?.mispacked_packages;
    const unpackedPackages = summaryData?.unpacked_packages;

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
                        Salah Packing
                    ========================= */}
                    {mispackedPackages?.count > 0 && (
                        <section className="bg-amber-50 border border-amber-100 mx-4 p-4 rounded-2xl shadow-sm">
                            <Section title={`Peringatan Salah Packing (${mispackedPackages.count})`} />

                            <div className="flex flex-col gap-2 text-sm">
                                {(mispackedPackages.items || []).map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => navigate(`/mispacked-packages/${item.id}`)}
                                        className="flex justify-between border-b border-amber-100 pb-2 text-left"
                                    >
                                        <span className="font-medium">{item.receipt || "-"}</span>
                                        <span className="text-amber-700 text-xs flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {item.correct_via} ke {item.wrong_via}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

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
                    {unpackedPackages && (
                        <section className="bg-white mx-4 p-4 rounded-2xl shadow-sm">
                            <Section
                                title={`Belum Packing (${unpackedPackages.count || 0})`}
                                action="Lihat Lainnya"
                                onAction={() => navigate("/belum-packing")}
                            />

                            <p className="text-xs text-gray-500 mb-3">
                                Paket yang belum masuk ke batch/karung
                            </p>

                            <div className="flex flex-col gap-2 text-sm">
                                {(unpackedPackages.items || []).map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => navigate("/belum-packing")}
                                        className="border-b pb-2 text-left"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="shrink-0 bg-violet-50 text-violet-700 px-2 py-0.5 rounded-lg text-[10px] font-semibold">
                                                    {item.route_code || "-"}
                                                </span>
                                                <span className="font-medium truncate">
                                                    {item.receipt}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500 truncate">
                                                {item.name || "-"}
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-gray-400 mt-1">
                                            {(item.arrived_origin_at || "").slice(0, 10) || "-"}
                                        </div>
                                    </button>
                                ))}

                                {(unpackedPackages.items || []).length === 0 && (
                                    <div className="text-sm text-gray-400 py-3">
                                        Tidak ada paket belum packing
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

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
                BOTTOM NAV
            ========================= */}
            <BottomNav />
        </div>
    );
}

/* =========================
   FEATURES LIST
========================= */
const FEATURE_GROUPS = [
    {
        items: [
            { label: "Operasional", path: "/operasional", icon: PackageCheck, color: "bg-violet-100 text-violet-600" },
        ]
    }
];


function NavItem({ icon: Icon, label, onClick }) {
    return (
        <button onClick={onClick} className="flex flex-col items-center py-3">
            <Icon className="w-4 h-4 mb-1" />
            {label}
        </button>
    );
}
