import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AlertCircle,
    Archive,
    Calendar,
    CheckCircle,
    Package,
    Receipt,
    Search,
    Upload,
    X,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { ButtonLoading, LoadingState } from "../../components/common/Loading";
import { useAuth } from "../../context/useAuth";
import {
    confirmProblematicPackageRequest,
    getInternalProblematicPackages,
} from "../../services/api/claimedPackages";

function formatDate(value) {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function StatusBadge({ confirmed }) {
    return (
        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${confirmed
            ? "bg-emerald-50 text-emerald-700"
            : "bg-orange-50 text-orange-700"
            }`}>
            {confirmed ? "Confirmed" : "Pending"}
        </span>
    );
}

export default function ProblematicConfirmationPage() {
    const navigate = useNavigate();
    const { user, role } = useAuth();
    const fileInputRef = useRef(null);

    const [activeSection, setActiveSection] = useState("pending");
    const [data, setData] = useState({
        pending: [],
        archive: [],
    });
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState(null);
    const [photo, setPhoto] = useState(null);

    const hasAccess =
        role === "general_manager" ||
        role === "branch_staff" &&
        user?.is_origin === true;

    const activeItems = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        const source = data[activeSection] || [];

        if (!keyword) return source;

        return source.filter((item) =>
            [item.receipt, item.name]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(keyword))
        );
    }, [activeSection, data, search]);

    useEffect(() => {
        if (hasAccess) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [hasAccess]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getInternalProblematicPackages();
            setData(result || { pending: [], archive: [] });
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openConfirm = (item) => {
        setConfirmTarget(item);
        setPhoto(null);
    };

    const closeConfirm = () => {
        setConfirmTarget(null);
        setPhoto(null);
    };

    const handleConfirm = async () => {
        if (!photo) {
            alert("Foto paket terbaru wajib diupload");
            return;
        }

        try {
            setSubmitLoading(true);

            const formData = new FormData();
            formData.append("photo", photo);

            await confirmProblematicPackageRequest(
                confirmTarget.package_id,
                formData
            );

            closeConfirm();
            await fetchData();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return <LoadingState text="Memuat paket bermasalah..." />;
    }

    if (!hasAccess) {
        return (
            <div className="min-h-dvh bg-gray-50 p-4">
                <SubPageHeader title="Paket Bermasalah" />
                <div className="mt-8 rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                    Anda tidak memiliki akses ke halaman ini
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-gray-50 p-4 pb-28">
            <SubPageHeader title="Paket Bermasalah" />

            <div className="mt-4 flex gap-2 mb-4">
                <button
                    onClick={() => setActiveSection("pending")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium border ${activeSection === "pending"
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-white text-gray-600"
                        }`}
                >
                    <AlertCircle className="w-4 h-4" />
                    Menunggu
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeSection === "pending"
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                        }`}>
                        {data.pending?.length || 0}
                    </span>
                </button>

                <button
                    onClick={() => setActiveSection("archive")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium border ${activeSection === "archive"
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-white text-gray-600"
                        }`}
                >
                    <Archive className="w-4 h-4" />
                    Arsip
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeSection === "archive"
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                        }`}>
                        {data.archive?.length || 0}
                    </span>
                </button>
            </div>

            <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari package..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                />

                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-2.5 text-gray-400 text-xs"
                    >
                        x
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                {activeItems.map((item) => (
                    <div
                        key={item.package_id}
                        onClick={() => navigate(`/packages/${item.package_id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                navigate(`/packages/${item.package_id}`);
                            }
                        }}
                        className="bg-white rounded-2xl shadow-sm p-3 text-left hover:shadow-md active:scale-[0.98] transition cursor-pointer"
                    >
                        <div className="flex items-center gap-2 bg-violet-50 text-violet-700 px-2 py-1 rounded-lg text-xs font-medium w-fit max-w-full mb-2">
                            <Receipt className="w-3 h-3 shrink-0" />
                            <span className="truncate">{item.receipt || "-"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 min-w-0">
                            <Package className="w-4 h-4 shrink-0 text-gray-500" />
                            <span className="truncate">{item.name || "-"}</span>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {formatDate(item.arrived_origin_at)}
                            </div>

                            <StatusBadge confirmed={item.is_confirmed} />
                        </div>

                        {activeSection === "pending" && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openConfirm(item);
                                }}
                                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white"
                            >
                                <CheckCircle className="w-3 h-3" />
                                Konfirmasi
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {!loading && activeItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
                    Tidak ada package
                </div>
            )}

            {confirmTarget && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">
                                    Konfirmasi Paket
                                </h2>
                                <p className="mt-1 text-xs text-gray-500">
                                    {confirmTarget.receipt}
                                </p>
                            </div>

                            <button onClick={closeConfirm}>
                                <X size={18} />
                            </button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            hidden
                            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                        />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-4 text-sm font-medium text-gray-500"
                        >
                            <Upload className="w-4 h-4" />
                            {photo ? photo.name : "Upload foto paket terbaru"}
                        </button>

                        <button
                            onClick={handleConfirm}
                            disabled={submitLoading}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2.5 rounded-xl text-sm shadow-md hover:opacity-90 disabled:bg-gray-300"
                        >
                            {submitLoading ? (
                                <ButtonLoading text="Mengonfirmasi..." />
                            ) : (
                                "Konfirmasi"
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
