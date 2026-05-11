import { useEffect, useState } from "react";

import {
    CalendarDays,
    Package,
    Search,
    X,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";

import {
    getUnpackedPackages,
} from "../../services/api/operasional/unpackedPackagesApi";

const LIMIT = 10;

export default function UnpackedPackagesPage() {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filterMode, setFilterMode] = useState("single");
    const [date, setDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [appliedFilter, setAppliedFilter] = useState({
        date: "",
        start_date: "",
        end_date: "",
    });

    const fetchData = async ({
        currentPage = 1,
        reset = false,
    } = {}) => {
        try {
            setLoading(true);

            const res = await getUnpackedPackages({
                page: currentPage,
                limit: LIMIT,
                search,
                ...appliedFilter,
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
    }, [search, appliedFilter]);

    const applyFilter = () => {
        if (filterMode === "single") {
            setAppliedFilter({
                date,
                start_date: "",
                end_date: "",
            });
            return;
        }

        setAppliedFilter({
            date: "",
            start_date: startDate,
            end_date: endDate,
        });
    };

    const resetFilter = () => {
        setDate("");
        setStartDate("");
        setEndDate("");
        setAppliedFilter({
            date: "",
            start_date: "",
            end_date: "",
        });
    };

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
                <SubPageHeader title="Belum Packing" />
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari resi, nama, route..."
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

            <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => setFilterMode("single")}
                        className={`flex-1 rounded-xl py-2 text-xs font-medium border ${
                            filterMode === "single"
                                ? "bg-violet-600 text-white border-violet-600"
                                : "bg-white text-gray-600"
                        }`}
                    >
                        Satu Tanggal
                    </button>

                    <button
                        onClick={() => setFilterMode("range")}
                        className={`flex-1 rounded-xl py-2 text-xs font-medium border ${
                            filterMode === "range"
                                ? "bg-violet-600 text-white border-violet-600"
                                : "bg-white text-gray-600"
                        }`}
                    >
                        Range
                    </button>
                </div>

                {filterMode === "single" ? (
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-3"
                    />
                ) : (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                        />

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                        />
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={applyFilter}
                        className="flex-1 bg-violet-600 text-white py-2 rounded-xl text-sm font-medium"
                    >
                        Apply Filter
                    </button>

                    <button
                        onClick={resetFilter}
                        className="w-20 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-medium"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-gray-800">
                    Total {total} paket
                </div>
            </div>

            <div className="space-y-2">
                {data.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-sm px-3 py-3"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="shrink-0 bg-violet-50 text-violet-700 px-2 py-1 rounded-lg text-[11px] font-semibold">
                                        {item.route_code || "-"}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-800 truncate">
                                        {item.receipt}
                                    </span>
                                </div>

                                <div className="text-xs text-gray-500 mt-2 truncate">
                                    {item.name || "-"}
                                </div>
                            </div>

                            <Package className="w-4 h-4 text-gray-400 shrink-0" />
                        </div>

                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" />
                                {(item.arrived_origin_at || "").slice(0, 10) || "-"}
                            </div>

                            <div>
                                {item.is_finished ? "Selesai" : "Pending"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && data.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
                    Tidak ada paket belum packing
                </div>
            )}

            {loading && (
                <LoadingState variant="section" text="Memuat data..." />
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
