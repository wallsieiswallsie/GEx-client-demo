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
    AlertTriangle,
    ScanLine,
} from "lucide-react";

import {
    useParams,
} from "react-router-dom";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/useAuth";

import {
    getPackageById,
    markPackageXrayFailed,
} from "../../services/api/operasional/packagesApi";
import { getAllShipmentRoutes } from "../../services/api/logistik/shipmentRouteApi";

export default function PackageDetailPage() {

    const { id } = useParams();
    const { user, role } = useAuth();

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [routes, setRoutes] = useState([]);
    const [xrayModalOpen, setXrayModalOpen] = useState(false);
    const [xrayForm, setXrayForm] = useState({
        route_code: "",
        jenis_barang: "",
    });
    const [submittingXray, setSubmittingXray] = useState(false);
    const [toast, setToast] = useState("");

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

    useEffect(() => {
        if (!toast) return undefined;

        const timer = window.setTimeout(() => setToast(""), 3000);

        return () => window.clearTimeout(timer);
    }, [toast]);

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
    const isOriginBranchStaff =
        role === "branch_staff" &&
        user?.is_origin === true;
    const xraySubmitDisabled =
        !xrayForm.route_code ||
        !xrayForm.jenis_barang.trim() ||
        submittingXray;

    const openXrayModal = async () => {
        try {
            if (routes.length === 0) {
                const routesRes = await getAllShipmentRoutes();

                setRoutes(routesRes || []);
            }

            setXrayForm({
                route_code: "",
                jenis_barang: "",
            });
            setXrayModalOpen(true);
        } catch (err) {
            alert(err.message);
        }
    };

    const submitXrayFailed = async () => {
        if (xraySubmitDisabled) return;

        try {
            setSubmittingXray(true);

            const updatedPackage = await markPackageXrayFailed(id, {
                route_code: xrayForm.route_code,
                jenis_barang: xrayForm.jenis_barang.trim(),
            });

            setData(updatedPackage);
            setXrayModalOpen(false);
            setToast("Paket berhasil ditandai gagal X-Ray");
            await fetchDetail();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmittingXray(false);
        }
    };

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
                    </div>

                    {isOriginBranchStaff && (
                        <button
                            onClick={openXrayModal}
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 active:scale-[0.98]"
                        >
                            <ScanLine className="h-4 w-4" />
                            Gagal X-Ray
                        </button>
                    )}
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

            {xrayModalOpen && (
                <XrayFailedModal
                    routes={routes}
                    form={xrayForm}
                    setForm={setXrayForm}
                    disabled={xraySubmitDisabled}
                    loading={submittingXray}
                    onClose={() => setXrayModalOpen(false)}
                    onSubmit={submitXrayFailed}
                />
            )}

            {toast && (
                <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
                    {toast}
                </div>
            )}
        </div>
    );
}

function XrayFailedModal({
    routes,
    form,
    setForm,
    disabled,
    loading,
    onClose,
    onSubmit,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-lg">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold text-gray-900">
                        Gagal X-Ray
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-gray-700">
                            Kode Rute Baru
                        </span>
                        <select
                            value={form.route_code}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    route_code: event.target.value,
                                }))
                            }
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            <option value="">Pilih kode rute</option>
                            {routes.map((route) => (
                                <option
                                    key={route.id}
                                    value={route.generated_route_code}
                                >
                                    {formatRouteOption(route)}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-gray-700">
                            Jenis Barang
                        </span>
                        <input
                            value={form.jenis_barang}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    jenis_barang: event.target.value,
                                }))
                            }
                            placeholder="Contoh: Elektronik"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </label>

                    <div className="flex gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                            Perubahan kode rute akan menghitung ulang berat volume, berat terpakai, dan harga paket.
                        </span>
                    </div>
                </div>

                <div className="mt-5 flex gap-2">
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={onClose}
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button
                        fullWidth
                        onClick={onSubmit}
                        disabled={disabled}
                        loading={loading}
                        loadingText="Menyimpan..."
                    >
                        Simpan
                    </Button>
                </div>
            </div>
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

function formatRouteOption(route) {
    const routeCode = route.generated_route_code || "-";
    const origin = route.origin_branch || "-";
    const destination = route.destination_branch || "-";
    const via = route.via || "-";

    return `${routeCode} - ${origin} -> ${destination} - ${via}`;
}
