import { useEffect, useRef, useState } from "react";
import { Calendar, Camera, Package, Receipt, Route, Upload, User } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import {
    confirmProblematicPackageRequest,
    getProblematicPackageRequests,
} from "../../services/api/claimedPackages";

function formatDate(value) {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function ProblematicConfirmationPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState(null);
    const [photos, setPhotos] = useState({});
    const inputRefs = useRef({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getProblematicPackageRequests();
            setItems(data || []);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (packageId, file) => {
        if (!file) return;

        setPhotos((prev) => ({
            ...prev,
            [packageId]: file,
        }));
    };

    const handleConfirm = async (packageId) => {
        const photo = photos[packageId];

        if (!photo) {
            alert("Foto paket terbaru wajib diupload");
            return;
        }

        try {
            setSubmittingId(packageId);
            const formData = new FormData();
            formData.append("photo", photo);

            await confirmProblematicPackageRequest(packageId, formData);

            setPhotos((prev) => {
                const next = { ...prev };
                delete next[packageId];
                return next;
            });

            await fetchData();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmittingId(null);
        }
    };

    if (loading) {
        return <LoadingState text="Memuat request konfirmasi..." />;
    }

    return (
        <div className="min-h-dvh bg-gray-50 p-4 pb-28">
            <SubPageHeader title="Request Konfirmasi" />

            {items.length === 0 ? (
                <div className="mt-12 rounded-2xl bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
                    Tidak ada request konfirmasi paket bermasalah
                </div>
            ) : (
                <div className="mt-4 space-y-4">
                    {items.map((item) => {
                        const packageId = item.package_id;
                        const selectedPhoto = photos[packageId];

                        return (
                            <div
                                key={packageId}
                                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                            >
                                {item.photo_url ? (
                                    <img
                                        src={item.photo_url}
                                        alt={item.name || item.receipt}
                                        className="h-44 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-44 items-center justify-center bg-gray-100 text-sm text-gray-400">
                                        Foto belum tersedia
                                    </div>
                                )}

                                <div className="p-4">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                                            Bermasalah
                                            <span className="h-1 w-1 rounded-full bg-orange-500" />
                                            {item.is_confirmed ? "Confirmed" : "Pending"}
                                        </div>

                                        <span className="text-xs text-gray-400">
                                            {formatDate(item.updated_at || item.claimed_at)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        <Info icon={<Receipt className="h-4 w-4" />} label="Receipt" value={item.receipt} />
                                        <Info icon={<Package className="h-4 w-4" />} label="Nama Package" value={item.name} />
                                        <Info icon={<Route className="h-4 w-4" />} label="Route Request" value={item.route_code} />
                                        <Info
                                            icon={<User className="h-4 w-4" />}
                                            label="Customer"
                                            value={item.customer_name || item.customer_username || item.customer_whatsapp}
                                        />
                                        <Info icon={<Calendar className="h-4 w-4" />} label="Tanggal Request" value={formatDate(item.updated_at || item.claimed_at)} />
                                    </div>

                                    {!item.is_confirmed && (
                                        <div className="mt-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                hidden
                                                ref={(node) => {
                                                    inputRefs.current[packageId] = node;
                                                }}
                                                onChange={(e) =>
                                                    handlePhotoChange(packageId, e.target.files?.[0])
                                                }
                                            />

                                            <button
                                                type="button"
                                                onClick={() => inputRefs.current[packageId]?.click()}
                                                className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-3 text-sm font-medium text-gray-500"
                                            >
                                                <Upload className="h-4 w-4" />
                                                {selectedPhoto ? selectedPhoto.name : "Upload foto paket terbaru"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleConfirm(packageId)}
                                                disabled={submittingId === packageId}
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white disabled:bg-gray-300"
                                            >
                                                <Camera className="h-4 w-4" />
                                                {submittingId === packageId ? "Mengonfirmasi..." : "Konfirmasi"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function Info({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-3 py-2">
            <div className="mt-0.5 text-gray-500">
                {icon}
            </div>
            <div className="min-w-0">
                <div className="text-xs text-gray-400">
                    {label}
                </div>
                <div className="break-words font-semibold text-gray-800">
                    {value || "-"}
                </div>
            </div>
        </div>
    );
}
