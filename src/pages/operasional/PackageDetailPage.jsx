import { useEffect, useState } from "react";

import {
    Package,
    Receipt,
    Truck,
    Scale,
    Route,
    ArrowLeft,
    Box,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import SubPageHeader from "../../components/layout/SubPageHeader";

import {
    getPackageById,
} from "../../services/api/operasional/packagesApi";

export default function PackageDetailPage() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const fetchDetail = async () => {
        try {
            setLoading(true);

            const res = await getPackageById(id);

            setData(res);

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-dvh bg-gray-50 p-4">
                <div className="text-sm text-gray-500">
                    Loading...
                </div>
            </div>
        );
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

    return (
        <div className="min-h-dvh bg-gray-50 p-4">

            {/* HEADER */}
            <div className="mb-5 flex items-center gap-3">

                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center active:scale-95 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <SubPageHeader title="Detail Package" />
            </div>

            {/* MAIN CARD */}
            <div className="bg-white rounded-3xl shadow-sm p-5">

                {/* PACKAGE NAME */}
                <div className="flex items-center gap-2 bg-violet-50 text-violet-700 px-3 py-2 rounded-xl text-sm font-semibold w-fit mb-5">
                    <Package className="w-4 h-4" />
                    {data.name}
                </div>

                {/* DETAILS */}
                <div className="space-y-4">

                    <DetailItem
                        icon={<Receipt className="w-4 h-4" />}
                        label="No Resi"
                        value={data.receipt}
                    />

                    <DetailItem
                        icon={<Truck className="w-4 h-4" />}
                        label="Ekspedisi"
                        value={data.expedition}
                    />

                    <DetailItem
                        icon={<Scale className="w-4 h-4" />}
                        label="Berat Asli"
                        value={`${data.real_weight || 0} kg`}
                    />

                    <DetailItem
                        icon={<Scale className="w-4 h-4" />}
                        label="Berat Volume"
                        value={`${data.volume_weight || 0} kg`}
                    />

                    <DetailItem
                        icon={<Scale className="w-4 h-4" />}
                        label="Berat Digunakan"
                        value={`${data.used_weight || 0} kg`}
                    />

                    <DetailItem
                        icon={<Route className="w-4 h-4" />}
                        label="Route Code"
                        value={data.route_code}
                    />

                    <DetailItem
                        icon={<Box className="w-4 h-4" />}
                        label="Fee"
                        value={`Rp ${Number(
                            data.fee || 0
                        ).toLocaleString("id-ID")}`}
                    />

                    <DetailItem
                        icon={<Box className="w-4 h-4" />}
                        label="Partner Package"
                        value={data.is_partner ? "Ya" : "Tidak"}
                    />

                    {data.partnership_code && (
                        <DetailItem
                            icon={<Box className="w-4 h-4" />}
                            label="Partnership Code"
                            value={data.partnership_code}
                        />
                    )}

                    <DetailItem
                        icon={<Box className="w-4 h-4" />}
                        label="Status Klaim"
                        value={data.is_claimed ? "Sudah Diklaim" : "Belum Diklaim"}
                    />

                    <DetailItem
                        icon={<Box className="w-4 h-4" />}
                        label="Status Finish"
                        value={data.is_finished ? "Selesai" : "Belum"}
                    />
                </div>

                {/* ROUTE LABEL */}
                <div className="mt-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                        <Route className="w-3.5 h-3.5" />
                        {data.route_code || "-"}
                    </div>
                </div>
            </div>

            {/* ITEMS */}
            {data.items?.length > 0 && (
                <div className="mt-4 bg-white rounded-3xl shadow-sm p-5">

                    <h2 className="text-sm font-semibold mb-4">
                        Item Package
                    </h2>

                    <div className="space-y-2">
                        {data.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-sm"
                            >
                                <Box className="w-4 h-4 text-gray-500" />

                                {item.item_name}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailItem({
    icon,
    label,
    value,
}) {
    return (
        <div className="flex items-start gap-3">

            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                {icon}
            </div>

            <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 mb-1">
                    {label}
                </div>

                <div className="text-sm font-medium text-gray-800 break-words">
                    {value || "-"}
                </div>
            </div>
        </div>
    );
}