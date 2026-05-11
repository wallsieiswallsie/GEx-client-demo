import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    X,
    Package,
    Hash,
    Tag
} from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import FloatingActionButton from "../../components/common/FloatingActionButton";

import {
    getAllVia,
    createVia,
    updateVia,
    deleteVia,
} from "../../services/api/logistik/viaApi";

export default function ViaPage() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // modal
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({
        id: null,
        name: "",
        code: "",
        volume_divisor: "",
    });

    // fetch
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getAllVia();
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

    // debounce search
    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(search.trim().toLowerCase());
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    useEffect(() => {
        setSearch("");
    }, []);

    // open create
    const openCreate = () => {
        setForm({
            id: null,
            name: "",
            code: "",
            volume_divisor: "",
        });
        setIsOpen(true);
    };

    // open edit
    const openEdit = (item) => {
        setForm(item);
        setIsOpen(true);
    };

    // submit
    const handleSubmit = async () => {
        const name = form.name.trim();
        const code = form.code.trim();

        if (!name || !code) {
            alert("Nama dan kode via wajib diisi");
            return;
        }

        try {
            const payload = {
                name,
                code,
                volume_divisor: form.volume_divisor,
            };

            if (form.id) {
                await updateVia(form.id, payload);
            } else {
                await createVia(payload);
            }

            setIsOpen(false);
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    // delete
    const handleDelete = async (id) => {
        if (!confirm("Hapus via ini?")) return;

        try {
            await deleteVia(id);
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    // filter
    const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(debouncedSearch) ||
        item.code.toLowerCase().includes(debouncedSearch)
    );

    return (
        <div className="min-h-dvh bg-gray-50 p-4">

            {/* HEADER */}
            <div className="mb-5">
                <SubPageHeader title="Via" />
            </div>

            {/* SEARCH */}
            <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari via..."
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
            <div className="grid grid-cols-2 gap-3">
                {loading ? (
                    <LoadingState variant="list" rows={4} />
                ) : (
                    filtered.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white px-3 py-3 rounded-xl shadow-sm flex justify-between items-start hover:shadow-md transition"
                        >
                            {/* LEFT */}
                            <div className="flex flex-col gap-2 w-full">

                                {/* NAME */}
                                <div className="flex items-center gap-2 bg-violet-50 text-violet-700 px-2 py-1 rounded-lg text-xs font-medium">
                                    <Tag className="w-3 h-3" />
                                    {item.name}
                                </div>

                                {/* VD */}
                                <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                    <Package className="w-3 h-3" />
                                    {item.volume_divisor ?? "-"}
                                </div>

                                {/* CODE */}
                                <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                    <Hash className="w-3 h-3" />
                                    {item.code}
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="flex flex-col items-center gap-2 pl-2 border-l ml-2">
                                <button
                                    onClick={() => openEdit(item)}
                                    className="p-1.5 rounded-lg hover:bg-blue-50 active:scale-90 transition"
                                >
                                    <Pencil className="w-4 h-4 text-blue-500" />
                                </button>

                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 active:scale-90 transition"
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
                    Belum ada data via
                </div>
            )}

            {/* FLOAT BUTTON */}
            <FloatingActionButton
                onClick={openCreate}
                ariaLabel="Tambah via"
                title="Tambah via"
            >
                <Plus />
            </FloatingActionButton>

            {/* MODAL */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-lg animate-fadeIn">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold">
                                {form.id ? "Edit Via" : "Tambah Via"}
                            </h2>

                            <button onClick={() => setIsOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* INPUT NAME */}
                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            placeholder="Nama via"
                            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-3"
                        />

                        {/* INPUT CODE */}
                        <input
                            value={form.code}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    code: e.target.value.toUpperCase(),
                                })
                            }
                            placeholder="Kode via (contoh: JKT01)"
                            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-3"
                        />

                        {/* INPUT VOLUME DIVISOR */}
                        <input
                            value={form.volume_divisor || ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    volume_divisor: e.target.value,
                                })
                            }
                            placeholder="Volume divisor"
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
