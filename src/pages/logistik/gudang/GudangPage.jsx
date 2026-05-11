import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, ChevronDown } from "lucide-react";
import SubPageHeader from "../../../components/layout/SubPageHeader";
import { LoadingState } from "../../../components/common/Loading";

import {
    getAllBranches,
    deleteBranch,
} from "../../../services/api/logistik/branchApi";

export default function GudangPage() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [openId, setOpenId] = useState(null);

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getAllBranches();
            setData(res || []);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // debounce search
    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(search.toLowerCase());
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    const filtered = data.filter((b) =>
        `${b.branch_code} ${b.city} ${b.address}`
            .toLowerCase()
            .includes(debouncedSearch)
    );

    const handleDelete = async (id) => {
        if (!confirm("Hapus gudang ini?")) return;

        try {
            await deleteBranch(id);
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    const toggleOpen = (id) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="min-h-dvh bg-gray-50 p-4">

            {/* HEADER */}
            <div className="mb-5">
                <SubPageHeader
                    title="Gudang"
                />
            </div>

            {/* SEARCH */}
            <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari gudang..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
            </div>

            {/* LIST */}
            <div className="flex flex-col gap-3">
                {loading ? (
                    <LoadingState variant="list" rows={4} />
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                        <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
                        Tidak ada data gudang
                    </div>
                ) : (
                    filtered.map((b) => {
                        const isOpen = openId === b.id;

                        return (
                            <div
                                key={b.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                            >
                                {/* TOP */}
                                <div className="px-4 py-3 flex justify-between items-center">
                                    <div className="flex items-center gap-3">

                                        {/* CHEVRON */}
                                        <button
                                            onClick={() => toggleOpen(b.id)}
                                            className="p-1 rounded-md hover:bg-gray-100 transition"
                                        >
                                            <ChevronDown
                                                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>

                                        {/* INITIAL */}
                                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                            {b.branch_code?.[0]}
                                        </div>

                                        {/* TEXT */}
                                        <div>
                                            <div className="font-medium text-sm text-gray-800">
                                                {b.branch_code}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {b.city}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ACTION */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => navigate(`/gudang/edit/${b.id}`)}
                                            className="p-2 rounded-lg hover:bg-blue-50 active:scale-90 transition"
                                        >
                                            <Pencil className="w-4 h-4 text-blue-500" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 active:scale-90 transition"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* DROPDOWN DETAIL */}
                                <div
                                    className={`px-4 transition-all duration-300 ${isOpen ? "max-h-52 py-3 opacity-100" : "max-h-0 opacity-0"
                                        } overflow-hidden`}
                                >
                                    <div className="text-xs text-gray-600 border-t pt-3 space-y-2 leading-relaxed">

                                        {/* ADDRESS FORMAT */}
                                        <div>
                                            {b.address},{" "}
                                            <span className="uppercase">
                                                {b.village}, {b.district}, {b.city}, {b.province}, {b.postal_code}
                                            </span>
                                        </div>

                                        {/* MAP LINK */}
                                        {b.gmap_link && (
                                            <a
                                                href={b.gmap_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-block text-indigo-600 text-xs font-medium hover:underline"
                                            >
                                                Lihat di Google Maps
                                            </a>
                                        )}

                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* FLOAT BUTTON */}
            <button
                onClick={() => navigate("/gudang/create")}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition"
            >
                <Plus />
            </button>
        </div>
    );
}
