import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Package, Receipt, Route, Scale, Truck, Wallet, X } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import { getMyPackageDetail } from "../../services/api/claimedPackages";

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
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

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
        <div className="min-h-dvh bg-gray-50 p-4 pb-28">
            <SubPageHeader title="Detail Paket" />

            <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                {data.photo_url ? (
                    <button
                        onClick={() => setPreviewOpen(true)}
                        className="block w-full"
                    >
                        <img
                            src={data.photo_url}
                            alt={data.name || data.receipt}
                            className="h-56 w-full object-cover"
                        />
                    </button>
                ) : (
                    <div className="flex h-44 items-center justify-center bg-gray-100 text-sm text-gray-400">
                        Foto belum tersedia
                    </div>
                )}

                <div className="p-4">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700">
                        <Route className="h-4 w-4" />
                        {data.route_code || "-"}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <Info icon={<Package className="h-4 w-4" />} label="Nama Paket" value={data.name?.toUpperCase()} />
                        <Info icon={<Receipt className="h-4 w-4" />} label="Resi" value={data.receipt?.toUpperCase()} />
                        <Info icon={<Calendar className="h-4 w-4" />} label="Tanggal Tiba" value={formatDate(data.arrived_origin_at)} />
                        <Info icon={<Truck className="h-4 w-4" />} label="Ekspedisi" value={data.expedition} />
                        <Info icon={<Scale className="h-4 w-4" />} label="Berat" value={data.used_weight ? `${data.used_weight} kg` : "-"} />
                        <Info icon={<Wallet className="h-4 w-4" />} label="Tarif" value={formatFee(data.fee)} />
                    </div>
                </div>
            </div>

            {previewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                    <button
                        onClick={() => setPreviewOpen(false)}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <img
                        src={data.photo_url}
                        alt={data.name || data.receipt}
                        className="max-h-full max-w-full rounded-2xl object-contain"
                    />
                </div>
            )}
        </div>
    );
}

function Info({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-2xl bg-gray-50 px-3 py-3">
            <div className="mt-0.5 text-gray-500">{icon}</div>
            <div className="min-w-0">
                <div className="text-xs text-gray-400">{label}</div>
                <div className="mt-1 break-words text-sm font-semibold text-gray-900">
                    {value || "-"}
                </div>
            </div>
        </div>
    );
}
