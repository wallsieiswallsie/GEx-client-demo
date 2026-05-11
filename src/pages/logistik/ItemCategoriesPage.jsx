import { useEffect, useState } from "react";

import {
    Plus,
    Pencil,
    Trash2,
    Search,
    X,
    Package,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";

import {
    getAllItemCategories,
    createItemCategory,
    updateItemCategory,
    deleteItemCategory,
} from "../../services/api/logistik/itemCategoriesApi";

export default function ItemCategoriesPage() {

    const [data, setData] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    const [form, setForm] = useState({
        id: null,
        item_name: "",
    });

    const fetchData = async () => {

        try {

            setLoading(true);

            const res = await getAllItemCategories();

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

    const openCreate = () => {

        setForm({
            id: null,
            item_name: "",
        });

        setIsOpen(true);
    };

    const openEdit = (item) => {

        setForm(item);

        setIsOpen(true);
    };

    const handleSubmit = async () => {

        const name = form.item_name.trim();

        if (!name) {
            alert("Nama item wajib diisi");
            return;
        }

        try {

            if (form.id) {

                await updateItemCategory(form.id, name);

            } else {

                await createItemCategory(name);
            }

            setIsOpen(false);

            fetchData();

        } catch (err) {

            alert(err.message);
        }
    };

    const handleDelete = async (id) => {

        if (!confirm("Hapus item ini?")) return;

        try {

            await deleteItemCategory(id);

            fetchData();

        } catch (err) {

            alert(err.message);
        }
    };

    const filtered = data.filter((item) =>
        item.item_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-dvh bg-gray-50 p-4">

            <div className="mb-5">
                <SubPageHeader title="Item Categories" />
            </div>

            {/* SEARCH */}
            <div className="relative mb-5">

                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari item..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border bg-white text-sm focus:outline-none"
                />

                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-2.5"
                    >
                        <X size={16} />
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
                            className="bg-white rounded-2xl p-4 shadow-sm border"
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex flex-col gap-2">

                                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-violet-600" />
                                    </div>

                                    <div className="text-sm font-medium">
                                        {item.item_name}
                                    </div>
                                </div>

                                <div className="flex flex-col border-l pl-2 gap-2">

                                    <button
                                        onClick={() => openEdit(item)}
                                        className="p-2 rounded-lg hover:bg-blue-50"
                                    >
                                        <Pencil className="w-4 h-4 text-blue-500" />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 rounded-lg hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!loading && filtered.length === 0 && (
                <div className="text-center py-20 text-sm text-gray-400">
                    Belum ada item
                </div>
            )}

            {/* FLOAT BUTTON */}
            <button
                onClick={openCreate}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-violet-600 text-white shadow-lg flex items-center justify-center"
            >
                <Plus />
            </button>

            {/* MODAL */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

                    <div className="bg-white w-full max-w-sm rounded-2xl p-5">

                        <div className="flex justify-between items-center mb-4">

                            <h2 className="font-semibold text-sm">
                                {form.id ? "Edit Item" : "Tambah Item"}
                            </h2>

                            <button onClick={() => setIsOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <input
                            value={form.item_name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    item_name: e.target.value,
                                })
                            }
                            placeholder="Contoh: Elektronik"
                            className="w-full border rounded-xl px-3 py-2 text-sm mb-4"
                        />

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-violet-600 text-white py-2 rounded-xl text-sm"
                        >
                            {form.id ? "Simpan Perubahan" : "Tambah"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
