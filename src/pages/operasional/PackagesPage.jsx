import { useEffect, useMemo, useState } from "react";

import {
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    Package,
    Scale,
    Truck,
    Receipt,
    Image as ImageIcon,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";

import {
    getAllPackages,
    createPackage,
    updatePackage,
    deletePackage,
} from "../../services/api/operasional/packagesApi";

export default function PackagesPage() {
    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 10;

    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [isOpen, setIsOpen] = useState(false);

    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        id: null,
        name: "",
        arrived_origin_at: "",
        receipt: "",
        expedition: "",
        length: "",
        width: "",
        height: "",
        real_weight: "",
        route_code: "",
        is_partner: false,
        partnership_code: "",
        photo: null,
    });

    const fetchData = async ({
        currentPage = 1,
        reset = false,
    } = {}) => {
        try {
            setLoading(true);

            const res = await getAllPackages({
                page: currentPage,
                limit: LIMIT,
                search: debouncedSearch,
            });

            if (reset) {
                setData(res);
            } else {
                setData((prev) => [...prev, ...res]);
            }

            setHasMore(res.length === LIMIT);

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);

        fetchData({
            currentPage: 1,
            reset: true,
        });
    }, [debouncedSearch]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(search.trim().toLowerCase());
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    useEffect(() => {
        const handleScroll = () => {

            if (loading || !hasMore) return;

            const scrollTop = window.scrollY;

            const windowHeight = window.innerHeight;

            const fullHeight =
                document.documentElement.scrollHeight;

            if (
                scrollTop + windowHeight >=
                fullHeight - 200
            ) {
                const nextPage = page + 1;

                setPage(nextPage);

                fetchData({
                    currentPage: nextPage,
                });
            }
        };

        window.addEventListener(
            "scroll",
            handleScroll
        );

        return () =>
            window.removeEventListener(
                "scroll",
                handleScroll
            );

    }, [page, loading, hasMore]);

    const openCreate = () => {
        setForm({
            id: null,
            name: "",
            arrived_origin_at: "",
            receipt: "",
            expedition: "",
            length: "",
            width: "",
            height: "",
            real_weight: "",
            route_code: "",
            is_partner: false,
            partnership_code: "",
            photo: null,
        });

        setPreview(null);

        setIsOpen(true);
    };

    const openEdit = (item) => {
        setForm({
            ...item,
            photo: null,
        });

        setPreview(item.photo_url || null);

        setIsOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (
                !form.name ||
                !form.receipt ||
                !form.expedition
            ) {
                alert("Data wajib belum lengkap");
                return;
            }

            if (form.id) {
                await updatePackage(form.id, form);
            } else {
                const formData = new FormData();

                formData.append("name", form.name);
                formData.append(
                    "arrived_origin_at",
                    form.arrived_origin_at
                );
                formData.append("receipt", form.receipt);
                formData.append("expedition", form.expedition);
                formData.append("length", form.length);
                formData.append("width", form.width);
                formData.append("height", form.height);
                formData.append(
                    "real_weight",
                    form.real_weight
                );
                formData.append(
                    "route_code",
                    form.route_code
                );

                formData.append(
                    "is_partner",
                    form.is_partner
                );

                formData.append(
                    "partnership_code",
                    form.partnership_code || ""
                );

                if (form.photo) {
                    formData.append("photo", form.photo);
                }

                await createPackage(formData);
            }

            setIsOpen(false);

            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Hapus paket ini?")) return;

        try {
            await deletePackage(id);

            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-dvh bg-gray-50 p-4">

            {/* HEADER */}
            <div className="mb-5">
                <SubPageHeader title="Packages" />
            </div>

            {/* SEARCH */}
            <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

                <input
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Cari paket..."
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
                    <div className="text-center text-sm text-gray-400 py-10">
                        Loading...
                    </div>
                ) : (
                    data.map(((item) => (
                        <div
                            key={item.id}
                            onClick={() =>
                                navigate(`/packages/${item.id}`)
                            }
                            className="bg-white rounded-2xl shadow-sm p-3 hover:shadow-md active:scale-[0.98] transition cursor-pointer"
                        >
                            <div className="flex justify-between gap-3">

                                {/* LEFT */}
                                <div className="flex flex-col gap-2 w-full">

                                    <div className="flex items-center gap-2 bg-violet-50 text-violet-700 px-2 py-1 rounded-lg text-xs font-medium w-fit">
                                        <Package className="w-3 h-3" />
                                        {item.name}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Receipt className="w-3 h-3" />
                                        {item.receipt}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Truck className="w-3 h-3" />
                                        {item.expedition}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Scale className="w-3 h-3" />
                                        {item.used_weight || 0} kg
                                    </div>

                                    <div className="mt-2">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100">
                                            <Truck className="w-3 h-3" />
                                            {item.route_code || "-"}
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION */}
                                <div className="flex flex-col gap-2 border-l pl-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEdit(item);
                                        }}
                                        className="p-1.5 rounded-lg hover:bg-blue-50 active:scale-90 transition"
                                    >
                                        <Pencil className="w-4 h-4 text-blue-500" />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(item.id);
                                        }}
                                        className="p-1.5 rounded-lg hover:bg-red-50 active:scale-90 transition"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                    ))}
            </div>

            {/* EMPTY */}
            {!loading && data.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
                    Belum ada paket
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
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-xl max-h-[90vh] overflow-y-auto">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-sm font-semibold">
                                {form.id
                                    ? "Edit Package"
                                    : "Tambah Package"}
                            </h2>

                            <button
                                onClick={() =>
                                    setIsOpen(false)
                                }
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* NAME */}
                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            placeholder="Nama paket"
                            className="w-full border rounded-xl px-3 py-2 text-sm mb-3"
                        />

                        {/* DATE */}
                        <input
                            type="date"
                            value={form.arrived_origin_at}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    arrived_origin_at:
                                        e.target.value,
                                })
                            }
                            className="w-full border rounded-xl px-3 py-2 text-sm mb-3"
                        />

                        {/* RECEIPT */}
                        <input
                            value={form.receipt}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    receipt: e.target.value,
                                })
                            }
                            placeholder="No resi"
                            className="w-full border rounded-xl px-3 py-2 text-sm mb-3"
                        />

                        {/* EXPEDITION */}
                        <input
                            value={form.expedition}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    expedition:
                                        e.target.value,
                                })
                            }
                            placeholder="Ekspedisi"
                            className="w-full border rounded-xl px-3 py-2 text-sm mb-3"
                        />

                        {/* SIZE */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <input
                                value={form.length}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        length:
                                            e.target.value,
                                    })
                                }
                                placeholder="Panjang"
                                className="border rounded-xl px-3 py-2 text-sm"
                            />

                            <input
                                value={form.width}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        width:
                                            e.target.value,
                                    })
                                }
                                placeholder="Lebar"
                                className="border rounded-xl px-3 py-2 text-sm"
                            />

                            <input
                                value={form.height}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        height:
                                            e.target.value,
                                    })
                                }
                                placeholder="Tinggi"
                                className="border rounded-xl px-3 py-2 text-sm"
                            />
                        </div>

                        {/* WEIGHT */}
                        <input
                            value={form.real_weight}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    real_weight:
                                        e.target.value,
                                })
                            }
                            placeholder="Berat asli"
                            className="w-full border rounded-xl px-3 py-2 text-sm mb-3"
                        />

                        {/* ROUTE */}
                        <input
                            value={form.route_code}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    route_code:
                                        e.target.value,
                                })
                            }
                            placeholder="Route code"
                            className="w-full border rounded-xl px-3 py-2 text-sm mb-3"
                        />

                        {/* PARTNER */}
                        <label className="flex items-center gap-2 text-sm mb-3">
                            <input
                                type="checkbox"
                                checked={form.is_partner}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        is_partner:
                                            e.target.checked,
                                    })
                                }
                            />
                            Partner package
                        </label>

                        {/* PARTNERSHIP CODE */}
                        <input
                            value={form.partnership_code}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    partnership_code:
                                        e.target.value,
                                })
                            }
                            placeholder="Partnership code"
                            className="w-full border rounded-xl px-3 py-2 text-sm mb-3"
                        />

                        {/* PHOTO */}
                        <div className="mb-4">
                            <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <ImageIcon className="w-4 h-4" />
                                Upload Foto
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file =
                                        e.target.files[0];

                                    setForm({
                                        ...form,
                                        photo: file,
                                    });

                                    if (file) {
                                        setPreview(
                                            URL.createObjectURL(
                                                file
                                            )
                                        );
                                    }
                                }}
                                className="w-full text-sm"
                            />

                            {preview && (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="mt-3 w-full h-40 object-cover rounded-2xl border"
                                />
                            )}
                        </div>

                        {/* BUTTON */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium shadow-md hover:opacity-90"
                        >
                            {form.id
                                ? "Simpan Perubahan"
                                : "Tambah Package"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}