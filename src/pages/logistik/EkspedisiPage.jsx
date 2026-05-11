import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";

import {
    getAllExpeditions,
    createExpedition,
    updateExpedition,
    deleteExpedition,
} from "../../services/api/logistik/expeditionsApi";

export default function EkspedisiPage() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // modal state
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ id: null, expedition_name: "" });

    // fetch data
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getAllExpeditions();
            setData(res);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(search.trim().toLowerCase());
        }, 300); // 300ms debounce

        return () => clearTimeout(delay);
    }, [search]);

    useEffect(() => {
        setSearch("");
    }, []);

    // open modal create
    const openCreate = () => {
        setForm({ id: null, expedition_name: "" });
        setIsOpen(true);
    };

    // open modal edit
    const openEdit = (item) => {
        setForm(item);
        setIsOpen(true);
    };

    // submit (create / update)
    const handleSubmit = async () => {
        const name = form.expedition_name.trim();

        if (!name) {
            alert("Nama ekspedisi wajib diisi");
            return;
        }

        try {
            if (form.id) {
                await updateExpedition(form.id, name);
            } else {
                await createExpedition(name);
            }

            setIsOpen(false);
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    // delete
    const handleDelete = async (id) => {
        if (!confirm("Hapus ekspedisi ini?")) return;

        try {
            await deleteExpedition(id);
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    // search filter
    const filtered = data.filter((item) =>
        item.expedition_name.toLowerCase().includes(debouncedSearch)
    );

    return (
        <div className="min-h-dvh bg-gray-50 p-4">

            {/* HEADER */}
            <div className="mb-5">
                <SubPageHeader
                    title="Ekspedisi"
                />
            </div>

            {/* SEARCH */}
            <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari ekspedisi..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                />

                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-2.5 text-gray-400 text-xs"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* LIST */}
            <div className="flex flex-col gap-3">
                {loading ? (
                    <LoadingState variant="list" rows={4} />
                ) : (
                    filtered.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white px-4 py-3 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 text-sm font-bold">
                                    {item.expedition_name[0]}
                                </div>

                                <span className="font-medium text-sm text-gray-800">
                                    {item.expedition_name}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEdit(item)}
                                    className="p-2 rounded-lg hover:bg-blue-50 active:scale-90 transition"
                                >
                                    <Pencil className="w-4 h-4 text-blue-500" />
                                </button>

                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 rounded-lg hover:bg-red-50 active:scale-90 transition"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* EMPTY */}
            {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
                    Belum ada data ekspedisi
                </div>
            )}

            {/* FLOAT BUTTON */}
            <button
                onClick={openCreate}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition"
            >
                <Plus />
            </button>

            {/* MODAL */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-lg animate-fadeIn">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold">
                                {form.id ? "Edit Ekspedisi" : "Tambah Ekspedisi"}
                            </h2>

                            <button onClick={() => setIsOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* INPUT */}
                        <input
                            value={form.expedition_name}
                            onChange={(e) =>
                                setForm({ ...form, expedition_name: e.target.value })
                            }
                            placeholder="Nama ekspedisi"
                            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-4"
                        />

                        {/* ACTION */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2 rounded-xl text-sm shadow-md hover:opacity-90"
                        >
                            {form.id ? "Simpan Perubahan" : "Tambah"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
