import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Package, Receipt } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import { useAuth } from "../../context/useAuth";
import { getInternalProblematicPackages } from "../../services/api/claimedPackages";

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
        <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${confirmed
            ? "bg-emerald-50 text-emerald-700"
            : "bg-orange-50 text-orange-700"
            }`}>
            {confirmed ? "Confirmed" : "Pending"}
        </span>
    );
}

function ProblematicSection({ title, items, emptyText }) {
    const navigate = useNavigate();

    return (
        <section className="min-w-[82%] rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-800">{title}</h2>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500">
                    {items.length}
                </span>
            </div>

            {items.length === 0 ? (
                <div className="rounded-xl bg-gray-50 py-8 text-center text-sm text-gray-400">
                    {emptyText}
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <button
                            key={item.package_id}
                            onClick={() => navigate(`/packages/${item.package_id}`)}
                            className="w-full rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm active:scale-[0.99] transition"
                        >
                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                        <Receipt className="h-4 w-4 shrink-0 text-violet-600" />
                                        <span className="truncate">{item.receipt || "-"}</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                        <Package className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{item.name || "-"}</span>
                                    </div>
                                </div>

                                <StatusBadge confirmed={item.is_confirmed} />
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500">
                                <Calendar className="h-4 w-4" />
                                {formatDate(item.arrived_origin_at)}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}

export default function ProblematicConfirmationPage() {
    const { user, role } = useAuth();
    const [data, setData] = useState({
        pending: [],
        archive: [],
    });
    const [loading, setLoading] = useState(true);

    const hasAccess =
        role === "general_manager" ||
        role === "branch_staff" &&
        user?.is_origin === true;

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

            <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <ProblematicSection
                    title="Menunggu Konfirmasi"
                    items={data.pending || []}
                    emptyText="Tidak ada paket pending"
                />
                <ProblematicSection
                    title="Arsip Paket Bermasalah"
                    items={data.archive || []}
                    emptyText="Belum ada arsip"
                />
            </div>
        </div>
    );
}
