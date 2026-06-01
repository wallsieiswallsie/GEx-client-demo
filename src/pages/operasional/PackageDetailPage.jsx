import { useCallback, useEffect, useState } from "react";

import {
    Package,
    Receipt,
    Truck,
    Scale,
    Route,
    Box,
    X,
    Ruler,
    MoveHorizontal,
    MoveVertical,
    BadgeDollarSign,
    ShieldCheck,
    Flag,
    UserRound,
} from "lucide-react";

import {
    useParams,
} from "react-router-dom";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";

import {
    getPackageById,
} from "../../services/api/operasional/packagesApi";

export default function PackageDetailPage() {

    const { id } = useParams();

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [previewOpen, setPreviewOpen] =
        useState(false);

    const fetchDetail = useCallback(async () => {
        try {
            setLoading(true);

            const res = await getPackageById(id);

            setData(res);

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    if (loading) {
        return <LoadingState text="Memuat detail paket..." />;
    }

    if (!data) {
        return (
            <div className="min-h-dvh bg-gray-50 p-4">
                <div className="text-sm text-red-500">
                    Paket tidak ditemukan
                </div>
            </div>
        );
    }

    const photoSrc = data.photo_url || "";
    const packageName = data.name || "-";
    const routeCode = data.route_code || "-";
    const claimStatus = data.is_claimed
        ? "Sudah Diklaim"
        : "Belum Diklaim";
    const finishStatus = data.is_finished
        ? "Selesai"
        : "Belum Selesai";
    const fee = `Rp ${Number(data.fee || 0).toLocaleString("id-ID")}`;
    const realWeight = formatWeight(data.real_weight);
    const volumeWeight = formatWeight(data.volume_weight);
    const usedWeight = formatWeight(data.used_weight);
    const via = data.via || "-";
    const length = formatDimension(data.length);
    const width = formatDimension(data.width);
    const height = formatDimension(data.height);
    return (
        <div className="min-h-dvh bg-gray-50 px-4 pt-4 pb-28">

            {/* HEADER */}
            <div className="mb-5">
                <SubPageHeader
                    title="Detail Package"
                />
            </div>

            {/* PHOTO CARD */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge
                            icon={<Package className="w-4 h-4" />}
                            value={packageName}
                            tone="violet"
                        />
                        <StatusBadge
                            icon={<Route className="w-4 h-4" />}
                            value={routeCode}
                            tone="indigo"
                        />
                        <StatusBadge
                            icon={<ShieldCheck className="w-4 h-4" />}
                            value={claimStatus}
                            tone={data.is_claimed ? "green" : "orange"}
                        />
                        <StatusBadge
                            icon={<Flag className="w-4 h-4" />}
                            value={finishStatus}
                            tone={data.is_finished ? "green" : "blue"}
                        />
                        {data.is_xray_failed && (
                            <StatusBadge
                                icon={<ShieldCheck className="w-4 h-4" />}
                                value="Gagal X-Ray"
                                tone="red"
                            />
                        )}
                    </div>
                </div>

                {data.photo_url ? (
                    <button
                        onClick={() =>
                            setPreviewOpen(true)
                        }
                        className="block w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-sm active:scale-[0.99] transition"
                    >
                        <img
                            src={photoSrc}
                            alt={packageName}
                            className="h-56 w-full object-cover"
                        />
                    </button>
                ) : (
                    <div className="flex h-56 w-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-sm font-medium text-gray-400">
                        Foto paket belum tersedia
                    </div>
                )}
            </section>

            {/* SUMMARY */}
            <section className="mt-4 grid grid-cols-3 gap-3">
                <SummaryCard
                    icon={<Scale className="w-5 h-5" />}
                    label="Berat Digunakan"
                    value={usedWeight}
                    tone="violet"
                />
                <SummaryCard
                    icon={<BadgeDollarSign className="w-5 h-5" />}
                    label="Fee"
                    value={fee}
                    tone="green"
                />
                <SummaryCard
                    icon={<Flag className="w-5 h-5" />}
                    label="Status Finish"
                    value={finishStatus}
                    tone="orange"
                />
            </section>

            <InfoSection title="Informasi Paket">
                <InfoItem
                    icon={<Receipt className="w-4 h-4" />}
                    label="No Resi"
                    value={data.receipt}
                    tone="violet"
                />
                <InfoItem
                    icon={<Package className="w-4 h-4" />}
                    label="Nama Paket"
                    value={packageName}
                    tone="violet"
                />
                <InfoItem
                    icon={<Truck className="w-4 h-4" />}
                    label="Ekspedisi"
                    value={data.expedition}
                    tone="indigo"
                />
                <InfoItem
                    icon={<UserRound className="w-4 h-4" />}
                    label="Partner Package"
                    value={data.is_partner ? "Ya" : "Tidak"}
                    tone="violet"
                />
                {data.partnership_code && (
                    <InfoItem
                        icon={<Box className="w-4 h-4" />}
                        label="Partnership Code"
                        value={data.partnership_code}
                        tone="indigo"
                    />
                )}
            </InfoSection>

            <InfoSection title="Dimensi & Berat">
                <InfoItem
                    icon={<Ruler className="w-4 h-4" />}
                    label="Panjang"
                    value={length}
                    tone="violet"
                />
                <InfoItem
                    icon={<MoveHorizontal className="w-4 h-4" />}
                    label="Lebar"
                    value={width}
                    tone="green"
                />
                <InfoItem
                    icon={<MoveVertical className="w-4 h-4" />}
                    label="Tinggi"
                    value={height}
                    tone="orange"
                />
                <InfoItem
                    icon={<Scale className="w-4 h-4" />}
                    label="Berat Asli"
                    value={realWeight}
                    tone="gray"
                />
                <InfoItem
                    icon={<Scale className="w-4 h-4" />}
                    label="Berat Volume"
                    value={volumeWeight}
                    tone="gray"
                />
                <InfoItem
                    icon={<Scale className="w-4 h-4" />}
                    label="Berat Digunakan"
                    value={usedWeight}
                    tone="gray"
                />
            </InfoSection>

            <InfoSection title="Informasi Pengiriman">
                <InfoItem
                    icon={<Route className="w-4 h-4" />}
                    label="Route Code"
                    value={routeCode}
                    tone="indigo"
                />
                <InfoItem
                    icon={<Truck className="w-4 h-4" />}
                    label="Via"
                    value={via}
                    tone="blue"
                />
                <InfoItem
                    icon={<BadgeDollarSign className="w-4 h-4" />}
                    label="Fee"
                    value={fee}
                    tone="green"
                />
                {data.is_xray_failed && (
                    <InfoItem
                        icon={<ShieldCheck className="w-4 h-4" />}
                        label="X-Ray"
                        value="Gagal X-Ray"
                        tone="red"
                    />
                )}
                <InfoItem
                    icon={<ShieldCheck className="w-4 h-4" />}
                    label="Status Klaim"
                    value={claimStatus}
                    tone="orange"
                />
                <InfoItem
                    icon={<Flag className="w-4 h-4" />}
                    label="Status Finish"
                    value={finishStatus}
                    tone="blue"
                />
            </InfoSection>

            {/* ITEMS */}
            {data.items?.length > 0 && (
                <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                    <h2 className="mb-4 text-base font-semibold text-gray-900">
                        Item Package
                    </h2>

                    <div className="space-y-2">
                        {data.items.map(
                            (item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-sm"
                                >
                                    <Box className="w-4 h-4 text-gray-500" />

                                    {item.item_name}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* IMAGE MODAL */}
            {previewOpen && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">

                    {/* CLOSE */}
                    <button
                        onClick={() =>
                            setPreviewOpen(false)
                        }
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* IMAGE */}
                    <img
                        src={photoSrc}
                        alt={packageName}
                        className="max-w-full max-h-full object-contain rounded-2xl"
                    />
                </div>
            )}

        </div>
    );
}

function InfoSection({
    title,
    children,
}) {
    return (
        <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
                {title}
            </h2>

            <div className="grid grid-cols-2 gap-3">
                {children}
            </div>
        </section>
    );
}

function SummaryCard({
    icon,
    label,
    value,
    tone = "violet",
}) {
    return (
        <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <IconBubble tone={tone}>
                {icon}
            </IconBubble>

            <div className="mt-3 text-[11px] leading-tight text-gray-500">
                {label}
            </div>

            <div className="mt-1 break-words text-sm font-semibold text-gray-900">
                {value || "-"}
            </div>
        </div>
    );
}

function InfoItem({
    icon,
    label,
    value,
    tone = "violet",
}) {
    return (
        <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-gray-100 bg-white px-3 py-3">

            <IconBubble tone={tone}>
                {icon}
            </IconBubble>

            <div className="flex-1 min-w-0">

                <div className="mb-1 text-xs text-gray-500">
                    {label}
                </div>

                <div className="break-words text-sm font-semibold text-gray-900">
                    {value || "-"}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({
    icon,
    value,
    tone = "violet",
}) {
    const toneClass = getToneClass(tone);

    return (
        <div className={`inline-flex max-w-full items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${toneClass.badge}`}>
            <span className="shrink-0">
                {icon}
            </span>
            <span className="truncate">
                {value || "-"}
            </span>
        </div>
    );
}

function IconBubble({
    children,
    tone,
}) {
    const toneClass = getToneClass(tone);

    return (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClass.icon}`}>
            {children}
        </div>
    );
}

function getToneClass(tone) {
    const tones = {
        violet: {
            badge: "border-violet-100 bg-violet-50 text-violet-700",
            icon: "bg-violet-50 text-violet-700",
        },
        indigo: {
            badge: "border-indigo-100 bg-indigo-50 text-indigo-700",
            icon: "bg-indigo-50 text-indigo-700",
        },
        green: {
            badge: "border-emerald-100 bg-emerald-50 text-emerald-700",
            icon: "bg-emerald-50 text-emerald-700",
        },
        orange: {
            badge: "border-orange-100 bg-orange-50 text-orange-700",
            icon: "bg-orange-50 text-orange-700",
        },
        blue: {
            badge: "border-blue-100 bg-blue-50 text-blue-700",
            icon: "bg-blue-50 text-blue-700",
        },
        red: {
            badge: "border-red-100 bg-red-50 text-red-700",
            icon: "bg-red-50 text-red-700",
        },
        gray: {
            badge: "border-gray-100 bg-gray-50 text-gray-600",
            icon: "bg-gray-100 text-gray-600",
        },
    };

    return tones[tone] || tones.violet;
}

function formatDimension(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    return `${value} cm`;
}

function formatWeight(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    return `${value} kg`;
}
