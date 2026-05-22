import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Database,
    Truck,
    PackageCheck,
    AlertCircle,
    Ship
} from "lucide-react";
import Header from "../../components/home/Header";

import { useAuth } from '../../context/useAuth';
import { useHomeSummary } from "../../hooks/useHomeSummary";

/* =========================
   COMPONENT KECIL
========================= */
function InsightItem({ icon: label, value }) {
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
    const shipBatches = summaryData?.ship_batches || [];

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
            <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
                <div className="flex flex-col gap-4 pt-3">

                    {/* =========================
                        Salah Packing
                    ========================= */}
                    {mispackedPackages?.count > 0 && (
                        <section className="bg-amber-50 border border-amber-100 mx-4 p-4 rounded-2xl shadow-sm">
                            <Section
                                title={`Peringatan Salah Packing (${mispackedPackages.count})`}
                                action="Lihat Semua"
                                onAction={() => navigate("/mispacked-packages")}
                            />

                            <div className="flex flex-col gap-2 text-sm">
                                {(mispackedPackages.items || []).slice(0, 3).map((item) => {
                                    const displayName = (item.name || item.receipt || "-").toUpperCase();

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => navigate(`/packages/${item.package_id}`)}
                                            className="flex justify-between gap-3 border-b border-amber-100 pb-2 text-left"
                                        >
                                            <span className="font-medium truncate">{displayName}</span>
                                            <span className="text-amber-700 text-xs flex items-center gap-1 shrink-0">
                                                <AlertCircle className="w-3 h-3" />
                                                {item.correct_via} ke {item.wrong_via}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* =========================
                        Kloter Terdekat
                     ========================= */}
                    <section className="mx-4">
                        <Section
                            title="Kloter Pengiriman Terdekat"
                            action="Lihat Lainnya"
                            onAction={() => navigate("/kloter")}
                        />

                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {shipBatches.slice(0, 3).map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => navigate("/kloter")}
                                    className="min-w-[240px] text-left bg-gradient-to-br from-sky-50 via-white to-blue-100 p-4 rounded-2xl shadow-sm border border-sky-100"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs text-sky-600 font-medium">Kapal</p>
                                            <p className="font-bold text-gray-800 mt-1">
                                                KM. {(item.ship_name || "-").toUpperCase()}
                                            </p>
                                        </div>

                                        <div className="w-10 h-10 rounded-2xl bg-white/80 flex items-center justify-center text-sky-600 shadow-sm">
                                            <Ship className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                                        <div className="bg-white/70 rounded-xl px-2 py-1.5">
                                            <p className="text-gray-400">Closing</p>
                                            <p className="font-semibold text-gray-700">
                                                {(item.closing_date || "").slice(0, 10) || "-"}
                                            </p>
                                        </div>
                                        <div className="bg-white/70 rounded-xl px-2 py-1.5">
                                            <p className="text-gray-400">Berangkat</p>
                                            <p className="font-semibold text-gray-700">
                                                {(item.depart_date || "").slice(0, 10) || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}

                            {shipBatches.length === 0 && (
                                <div className="min-w-full bg-white p-4 rounded-2xl shadow-sm text-sm text-gray-400">
                                    Belum ada jadwal kapal
                                </div>
                            )}
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
            { label: "Database", path: "/input", icon: Database, color: "bg-blue-100 text-blue-600" },
            { label: "Jadwal Kapal", path: "/cms/ship-schedules", icon: Ship, color: "bg-indigo-100 text-indigo-600" },
        ]
    }
];
