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
            <div className="min-h-dvh bg-gray-50 p-4">
                <SubPageHeader title="Detail Paket" />
                <div className="mt-8 rounded-2xl bg-white p-6 text-center text-sm text-gray-500">
                    Paket tidak ditemukan
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-[#f8f7fb] px-4 pb-28 pt-4">
            <SubPageHeader title="Detail Paket" />

            <section
                className="relative mt-5 overflow-hidden rounded-[24px] bg-[#4f2e78] px-5 py-8 text-white shadow-[0_18px_40px_rgba(79,46,120,0.22)]"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg, rgba(79,46,120,0.94) 0%, rgba(79,46,120,0.72) 48%, rgba(79,46,120,0.28) 100%), url('/images/header_background/detail_package.png')",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            >
                <div className="relative z-10">
                    <div className="inline-flex max-w-full items-center gap-2 rounded-2xl bg-white/92 px-4 py-3 text-sm font-extrabold text-[#4f2e78] shadow-sm backdrop-blur">
                        <Route className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{data.route_code || "-"}</span>
                    </div>

                    <div className="mt-12">
                        <p className="text-sm font-bold text-white/90">Nama Paket</p>
                        <h1 className="mt-2 break-words text-3xl font-extrabold leading-tight tracking-normal">
                            {data.name?.toUpperCase() || "-"}
                        </h1>
                    </div>
                </div>
            </section>

            <section className="mt-5 rounded-[22px] border border-gray-100 bg-white px-4 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <h2 className="text-base font-extrabold text-gray-950">Progres Pengiriman</h2>
                <ProgressSteps status={data.final_status} />
            </section>

            <section className="mt-5 rounded-[22px] border border-gray-100 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <h2 className="text-base font-extrabold text-gray-950">Informasi Paket</h2>

                <div className="mt-5">
                    <Info icon={<Package className="h-6 w-6" />} label="Nama Paket" value={data.name?.toUpperCase()} />
                    <Info icon={<Receipt className="h-6 w-6" />} label="Resi" value={data.receipt?.toUpperCase()} />
                    <Info icon={<Calendar className="h-6 w-6" />} label="Tanggal Tiba" value={formatDate(data.arrived_origin_at)} />
                    <Info icon={<Truck className="h-6 w-6" />} label="Ekspedisi" value={data.expedition} />
                    <Info icon={<Scale className="h-6 w-6" />} label="Berat" value={data.used_weight ? `${data.used_weight} kg` : "-"} />
                    <Info icon={<Wallet className="h-6 w-6" />} label="Tarif" value={formatFee(data.fee)} isLast />
                </div>
            </section>
        </div>
    );
}

function ProgressSteps({ status }) {
    const activeIndex = Math.max(
        0,
        PROGRESS_STEPS.findIndex((step) => step.key === status)
    );

    return (
        <div className="mt-6 grid grid-cols-6">
            {PROGRESS_STEPS.map((step, index) => {
                const isDone = index < activeIndex;
                const isActive = index === activeIndex;
                const lineDone = index < activeIndex;

                return (
                    <div key={step.key} className="relative flex min-w-0 flex-col items-center">
                        {index < PROGRESS_STEPS.length - 1 && (
                            <span
                                className={`absolute left-1/2 top-[15px] h-1 w-full ${
                                    lineDone ? "bg-[#4f2e78]" : "bg-gray-200"
                                }`}
                                aria-hidden="true"
                            />
                        )}

                        <div
                            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition ${
                                isDone
                                    ? "bg-[#4f2e78] text-white"
                                    : isActive
                                        ? "border-[4px] border-[#4f2e78] bg-white shadow-[0_0_0_5px_rgba(79,46,120,0.10),0_6px_16px_rgba(79,46,120,0.22)]"
                                        : "border-[3px] border-gray-300 bg-white"
                            }`}
                        >
                            {isDone && <Check className="h-5 w-5" strokeWidth={3} />}
                        </div>

                        <span
                            className={`mt-3 max-w-[58px] text-center text-[10px] font-extrabold leading-[1.15] ${
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
        <div className={`flex items-center gap-4 py-4 ${isLast ? "" : "border-b border-gray-100"}`}>
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#f1e9ff] text-[#4f2e78]">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-gray-400">{label}</div>
                <div className="mt-1 break-words text-base font-extrabold text-gray-950">
                    {value || "-"}
                </div>
            </div>
        </div>
    );
}
