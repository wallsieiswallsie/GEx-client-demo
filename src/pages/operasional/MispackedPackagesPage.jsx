import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    AlertTriangle,
    Package,
    Search,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";

import {
    getMispackedPackages,
} from "../../services/api/operasional/batchSacksApi";

const LIMIT = 10;

export default function MispackedPackagesPage() {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("pending");
    const [loading, setLoading] = useState(false);

    const fetchData = async ({
        currentPage = 1,
        reset = false,
    } = {}) => {
        try {
            setLoading(true);

            const res = await getMispackedPackages({
                page: currentPage,
                limit: LIMIT,
                status,
                search,
            });

            if (reset) {
                setData(res.items || []);
            } else {
                setData((prev) => [
                    ...prev,
                    ...(res.items || []),
                ]);
            }

            setTotal(res.total || 0);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            setPage(1);
            fetchData({
                currentPage: 1,
                reset: true,
            });
        }, 300);

        return () => clearTimeout(delay);
    }, [search, status]);

    const loadMore = () => {
        const nextPage = page + 1;

        setPage(nextPage);
        fetchData({
            currentPage: nextPage,
        });
    };

    return (
        <div className="min-h-dvh bg-gray-50 p-4">
            <div className="mb-5">
                <SubPageHeader title="Peringatan Salah Packing" />
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari paket, resi, route..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setStatus("pending")}
                    className={`flex-1 rounded-xl py-2 text-xs font-medium border ${
                        status === "pending"
                            ? "bg-violet-600 text-white border-violet-600"
                            : "bg-white text-gray-600"
                    }`}
                >
                    Pending
                </button>

                <button
                    onClick={() => setStatus("resolved")}
                    className={`flex-1 rounded-xl py-2 text-xs font-medium border ${
                        status === "resolved"
                            ? "bg-violet-600 text-white border-violet-600"
                            : "bg-white text-gray-600"
                    }`}
                >
                    Resolved
                </button>

                <button
                    onClick={() => setStatus("")}
                    className={`flex-1 rounded-xl py-2 text-xs font-medium border ${
                        status === ""
                            ? "bg-violet-600 text-white border-violet-600"
                            : "bg-white text-gray-600"
                    }`}
                >
                    Semua
                </button>
            </div>

            <div className="text-sm font-semibold text-gray-800 mb-3">
                Total {total} data
            </div>

            <div className="space-y-2">
                {data.map((item) => {
                    const displayName = (item.name || item.receipt || "-").toUpperCase();

                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(`/packages/${item.package_id}`)}
                            className="w-full bg-white rounded-2xl shadow-sm px-3 py-3 text-left hover:shadow-md active:scale-[0.99] transition"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="shrink-0 bg-violet-50 text-violet-700 px-2 py-1 rounded-lg text-[11px] font-semibold">
                                            {item.route_code || "-"}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-800 truncate">
                                            {displayName}
                                        </span>
                                    </div>

                                    <div className="text-xs text-gray-500 mt-2">
                                        {item.receipt || "-"}
                                    </div>
                                </div>

                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                                <div>
                                    <div className="text-gray-400">Via Batch</div>
                                    <div className="font-semibold text-gray-700">{item.wrong_via || "-"}</div>
                                </div>

                                <div>
                                    <div className="text-gray-400">Via Paket</div>
                                    <div className="font-semibold text-gray-700">{item.correct_via || "-"}</div>
                                </div>

                                <div>
                                    <div className="text-gray-400">Status</div>
                                    <div className="font-semibold text-gray-700">{item.status || "-"}</div>
                                </div>
                            </div>

                            <div className="text-[11px] text-gray-400 mt-3">
                                {(item.created_at || "").slice(0, 10) || "-"}
                            </div>
                        </button>
                    );
                })}
            </div>

            {!loading && data.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
                    Tidak ada data salah packing
                </div>
            )}

            {loading && (
                <div className="text-center text-sm text-gray-400 py-5">
                    Loading...
                </div>
            )}

            {!loading && data.length < total && (
                <button
                    onClick={loadMore}
                    className="w-full mt-4 bg-white border text-gray-700 py-2 rounded-xl text-sm font-medium"
                >
                    Muat Lagi
                </button>
            )}
        </div>
    );
}
