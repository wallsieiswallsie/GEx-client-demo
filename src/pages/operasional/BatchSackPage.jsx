import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Archive,
    CalendarDays,
    Plane,
    Plus,
    Search,
    Ship,
    X,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { ButtonLoading, LoadingState } from "../../components/common/Loading";

import {
    createPlaneBatch,
    createShipBatch,
    getBatches,
} from "../../services/api/operasional/batchSacksApi";

const statusClass = {
    OPEN: "bg-emerald-50 text-emerald-700 border-emerald-100",
    CLOSE: "bg-amber-50 text-amber-700 border-amber-100",
    CLOSED: "bg-amber-50 text-amber-700 border-amber-100",
};

export default function BatchSackPage() {
    const navigate = useNavigate();

    const [batchType, setBatchType] = useState("SHIP");
    const [batches, setBatches] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [form, setForm] = useState({
        ship_name: "",
        closing_date: "",
        depart_date: "",
        pic: "",
        send_date: "",
        vendor: "",
    });

    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await getBatches({
                batch_type: batchType,
                search,
            });

            setBatches(res || []);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [batchType]);

    useEffect(() => {
        const delay = setTimeout(fetchData, 300);

        return () => clearTimeout(delay);
    }, [search]);

    const openCreate = () => {
        setForm({
            ship_name: "",
            closing_date: "",
            depart_date: "",
            pic: "",
            send_date: "",
            vendor: "",
        });
        setIsOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);

            if (batchType === "SHIP") {
                if (!form.ship_name.trim()) {
                    alert("Nama kapal wajib diisi");
                    return;
                }

                await createShipBatch({
                    ship_name: form.ship_name,
                    closing_date: form.closing_date || null,
                    depart_date: form.depart_date || null,
                    vendor: form.vendor || null,
                });
            } else {
                if (!form.pic.trim()) {
                    alert("PIC wajib diisi");
                    return;
                }

                await createPlaneBatch({
                    pic: form.pic,
                    send_date: form.send_date || null,
                    vendor: form.vendor || null,
                });
            }

            setIsOpen(false);
            fetchData();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="min-h-dvh bg-gray-50 p-4">
            <div className="mb-5">
                <SubPageHeader title="Kloter & Karung" />
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setBatchType("SHIP")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium border ${
                        batchType === "SHIP"
                            ? "bg-violet-600 text-white border-violet-600"
                            : "bg-white text-gray-600"
                    }`}
                >
                    <Ship className="w-4 h-4" />
                    Kapal
                </button>

                <button
                    onClick={() => setBatchType("PLANE")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium border ${
                        batchType === "PLANE"
                            ? "bg-violet-600 text-white border-violet-600"
                            : "bg-white text-gray-600"
                    }`}
                >
                    <Plane className="w-4 h-4" />
                    Pesawat
                </button>
            </div>

            <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari batch..."
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
                {loading ? (
                    <LoadingState variant="list" rows={4} />
                ) : (
                    batches.map((item) => (
                        <button
                            key={`${item.batch_type}-${item.id}`}
                            onClick={() =>
                                navigate(
                                    `/kloter/${item.batch_type}/${item.id}`
                                )
                            }
                            className="bg-white rounded-2xl shadow-sm p-3 text-left hover:shadow-md active:scale-[0.98] transition"
                        >
                            <div className="flex items-center gap-2 bg-violet-50 text-violet-700 px-2 py-1 rounded-lg text-xs font-medium w-fit mb-2">
                                <Archive className="w-3 h-3" />
                                {item.batch_number || `#${item.id}`}
                            </div>

                            <div className="text-sm font-semibold text-gray-800">
                                {item.ship_name || item.pic}
                            </div>

                            <div className="text-xs text-gray-500 mt-1">
                                {item.vendor || "-"}
                            </div>

                            <div className="grid grid-cols-3 gap-1 mt-3 text-center">
                                <div className="rounded-lg bg-gray-50 py-1">
                                    <div className="text-[10px] text-gray-400">
                                        Paket
                                    </div>
                                    <div className="text-xs font-semibold text-gray-700">
                                        {item.total_packages || 0}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-gray-50 py-1">
                                    <div className="text-[10px] text-gray-400">
                                        Kg
                                    </div>
                                    <div className="text-xs font-semibold text-gray-700">
                                        {Number(item.total_weight || 0).toFixed(1)}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-gray-50 py-1">
                                    <div className="text-[10px] text-gray-400">
                                        Sack
                                    </div>
                                    <div className="text-xs font-semibold text-gray-700">
                                        {item.total_sacks || 0}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                    <CalendarDays className="w-3 h-3" />
                                    {(item.depart_date || item.send_date || item.created_at || "").slice(0, 10)}
                                </div>

                                <div className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${statusClass[item.status] || "bg-gray-50 text-gray-600 border-gray-100"}`}>
                                    {item.status || "OPEN"}
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>

            {!loading && batches.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
                    Belum ada batch
                </div>
            )}

            <button
                onClick={openCreate}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition"
            >
                <Plus />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold">
                                Tambah Batch {batchType === "SHIP" ? "Kapal" : "Pesawat"}
                            </h2>

                            <button onClick={() => setIsOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        {batchType === "SHIP" ? (
                            <>
                                <input
                                    value={form.ship_name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            ship_name: e.target.value,
                                        })
                                    }
                                    placeholder="Nama kapal"
                                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-3"
                                />

                                <input
                                    type="date"
                                    value={form.closing_date}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            closing_date: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-3"
                                />

                                <input
                                    type="date"
                                    value={form.depart_date}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            depart_date: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-3"
                                />
                            </>
                        ) : (
                            <>
                                <input
                                    value={form.pic}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            pic: e.target.value,
                                        })
                                    }
                                    placeholder="PIC"
                                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-3"
                                />

                                <input
                                    type="date"
                                    value={form.send_date}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            send_date: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-3"
                                />
                            </>
                        )}

                        <input
                            value={form.vendor}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    vendor: e.target.value,
                                })
                            }
                            placeholder="Vendor"
                            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-4"
                        />

                        <button
                            onClick={handleSubmit}
                            disabled={submitLoading}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2 rounded-xl text-sm shadow-md hover:opacity-90"
                        >
                            {submitLoading ? <ButtonLoading text="Menyimpan..." /> : "Tambah"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
