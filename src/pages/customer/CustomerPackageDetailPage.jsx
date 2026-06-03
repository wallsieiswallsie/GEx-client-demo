import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Check, Package, Receipt, Route, Scale, Truck, Wallet } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import { getMyPackageDetail } from "../../services/api/claimedPackages";

const PROGRESS_STEPS = [
    { key: "tiba_gudang", label: "Tiba Gudang" },
    { key: "dipacking", label: "Dipacking" },
    { key: "dalam_pengiriman", label: "Dalam Pengiriman" },
    { key: "tiba_tujuan", label: "Tiba Tujuan" },
    { key: "siap_diambil", label: "Siap Diambil" },
    { key: "selesai", label: "Selesai" },
];

function formatDate(value) {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatFee(value) {
    if (value === null || value === undefined || value === "") return "-";

    return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

export default function CustomerPackageDetailPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getMyPackageDetail(id);
                setData(result);
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <LoadingState text="Memuat detail paket..." />;
    }

    if (!data) {
        return (
            <div className="min-h-dvh bg-gray-50 p-4 lg:px-6">
                <SubPageHeader title="Detail Paket" />
                <div className="mt-8 rounded-2xl bg-white p-6 text-center text-sm text-gray-500">
                    Paket tidak ditemukan
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-[#f8f7fb] px-4 pb-28 pt-4 lg:px-6 lg:pb-10">
            <SubPageHeader title="Detail Paket" />

            <div className="lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:gap-5">
            <section
                className="relative mt-5 overflow-hidden rounded-[24px] bg-[#4f2e78] px-5 py-8 text-white shadow-[0_12px_26px_rgba(79,46,120,0.16)]"
                style={{
                    backgroundImage: "url('/images/header_background/detail_package.png')",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            >
                {data.is_xray_failed && (
                    <div className="absolute right-3 top-3 z-20 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 shadow-[0_6px_14px_rgba(15,23,42,0.10)]">
                        Tidak Lolos X-Ray
                    </div>
                )}
                <div className="relative z-10">
                    <div className="inline-flex max-w-full items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 text-xs font-semibold text-[#4f2e78] shadow-[0_8px_20px_rgba(15,23,42,0.12)]">
                        <Route className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{data.route_code || "-"}</span>
                    </div>

                    <div className="mt-12">
                        <p className="text-xs font-medium text-white/90">Nama Paket</p>
                        <h1 className="mt-2 break-words text-[26px] font-semibold leading-tight tracking-normal">
                            {data.name?.toUpperCase() || "-"}
                        </h1>
                    </div>
                </div>
            </section>

            <section className="mt-5 rounded-[22px] border border-gray-100 bg-white px-3 py-6 shadow-[0_8px_22px_rgba(15,23,42,0.06)] lg:row-span-2">
                <h2 className="px-1 text-[20px] font-semibold text-gray-950">Progres Pengiriman</h2>
                <ProgressSteps status={data.final_status} />
            </section>

            <section className="mt-5 rounded-[22px] border border-gray-100 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
                <h2 className="text-[20px] font-semibold text-gray-950">Informasi Paket</h2>

                <div className="mt-4">
                    <Info icon={<Package className="h-5 w-5" />} label="Nama Paket" value={data.name?.toUpperCase()} />
                    <Info icon={<Receipt className="h-5 w-5" />} label="Resi" value={data.receipt?.toUpperCase()} />
                    <Info icon={<Calendar className="h-5 w-5" />} label="Tanggal Tiba" value={formatDate(data.arrived_origin_at)} />
                    <Info icon={<Truck className="h-5 w-5" />} label="Ekspedisi" value={data.expedition} />
                    <Info icon={<Scale className="h-5 w-5" />} label="Berat" value={data.used_weight ? `${data.used_weight} kg` : "-"} />
                    <Info icon={<Wallet className="h-5 w-5" />} label="Tarif" value={formatFee(data.fee)} isLast />
                </div>
            </section>
            </div>
        </div>
    );
}

function ProgressSteps({ status }) {
    const activeIndex = Math.max(
        0,
        PROGRESS_STEPS.findIndex((step) => step.key === status)
    );

    return (
        <div className="mt-7 grid grid-cols-6 gap-x-3">
            {PROGRESS_STEPS.map((step, index) => {
                const isDone = index < activeIndex;
                const isActive = index === activeIndex;
                const lineDone = index < activeIndex;

                return (
                    <div key={step.key} className="relative flex min-w-0 flex-col items-center">
                        {index < PROGRESS_STEPS.length - 1 && (
                            <span
                                className={`absolute left-1/2 top-[13px] h-0.5 w-[calc(100%+0.75rem)] ${
                                    lineDone ? "bg-[#4f2e78]" : "bg-gray-200"
                                }`}
                                aria-hidden="true"
                            />
                        )}

                        <div
                            className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition ${
                                isDone
                                    ? "bg-[#4f2e78] text-white"
                                    : isActive
                                        ? "border-[3px] border-[#4f2e78] bg-white shadow-[0_0_0_4px_rgba(79,46,120,0.10),0_5px_12px_rgba(79,46,120,0.16)]"
                                        : "border-2 border-gray-300 bg-white"
                            }`}
                        >
                            {isDone && <Check className="h-4 w-4" strokeWidth={3} />}
                        </div>

                        <span
                            className={`mt-3 min-h-[28px] max-w-[64px] text-center text-[10px] font-semibold leading-[1.15] ${
                                isDone || isActive ? "text-[#4f2e78]" : "text-gray-400"
                            }`}
                        >
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function Info({ icon, label, value, isLast = false }) {
    return (
        <div className={`flex items-center gap-3.5 py-3.5 ${isLast ? "" : "border-b border-gray-100/80"}`}>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#f1e9ff] text-[#4f2e78]">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-[13px] font-normal text-[#94A3B8]">{label}</div>
                <div className="mt-1 break-words text-[17px] font-semibold text-gray-950">
                    {value || "-"}
                </div>
            </div>
        </div>
    );
}
