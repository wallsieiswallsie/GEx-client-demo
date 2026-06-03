import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Package,
    Hash,
    Calendar,
    Truck,
    Weight,
    Ruler,
    Image as ImageIcon,
    Camera,
    Upload,
    ScanLine,
    Plus,
    Trash2,
} from "lucide-react";

import ScannerModal from "../modals/ScannerModal";

function ModalFormInputPackage({
    form,
    setForm,
    preview,
    setPreview,
    handleSubmit,
    expeditionOptions = [],
    itemCategoryOptions = [],
    routeOptions = [],
    onClose,
}) {
    const fileInputRef = useRef(null);

    const cameraInputRef = useRef(null);

    const resiInputRef = useRef(null);

    const [showScanner, setShowScanner] =
        useState(false);

    const [statusPaket, setStatusPaket] =
        useState("Sesuai");

    useEffect(() => {
        if (statusPaket === "Bermasalah") {
            setForm((prev) => ({
                ...prev,
                route_code: "bermasalah",
            }));
        }
    }, [setForm, statusPaket]);

    useEffect(() => {
        setStatusPaket(
            form.route_code === "bermasalah"
                ? "Bermasalah"
                : "Sesuai"
        );
    }, [form.id, form.route_code]);

    const handleChange = (e) => {
        const { name, value, type, checked } =
            e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const handleDecimalChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = value
            .replace(/,/g, ".")
            .replace(/[^0-9.]/g, "")
            .replace(/(\..*)\./g, "$1");

        setForm((prev) => ({
            ...prev,
            [name]: sanitizedValue,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setForm((prev) => ({
            ...prev,
            photo: file,
        }));

        setPreview(URL.createObjectURL(file));
    };

    const addItem = () => {
        setForm((prev) => ({
            ...prev,
            items: [
                ...(prev.items || []),
                {
                    item_name: "",
                },
            ],
        }));
    };

    const removeItem = (index) => {
        setForm((prev) => ({
            ...prev,
            items: prev.items.filter(
                (_, i) => i !== index
            ),
        }));
    };

    const updateItem = (index, value) => {
        const updated = [...form.items];

        updated[index].item_name = value;

        setForm((prev) => ({
            ...prev,
            items: updated,
        }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4">

            <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 shadow-xl scrollbar-hide">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-sm font-semibold">
                        {form.id
                            ? "Edit Package"
                            : "Tambah Package"}
                    </h2>

                    <button onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* STATUS */}
                <div className="mb-4">
                    <p className="text-sm mb-2 font-medium">
                        Status Paket
                    </p>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setStatusPaket(
                                    "Sesuai"
                                );
                                setForm((prev) => ({
                                    ...prev,
                                    route_code:
                                        prev.route_code === "bermasalah"
                                            ? ""
                                            : prev.route_code,
                                }));
                            }}
                            className={`flex-1 py-2 rounded-xl border ${statusPaket ===
                                    "Sesuai"
                                    ? "bg-green-100 border-green-500 text-green-700"
                                    : ""
                                }`}
                        >
                            Sesuai
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setStatusPaket(
                                    "Bermasalah"
                                )
                            }
                            className={`flex-1 py-2 rounded-xl border ${statusPaket ===
                                    "Bermasalah"
                                    ? "bg-gray-200 border-gray-500"
                                    : ""
                                }`}
                        >
                            Bermasalah
                        </button>
                    </div>
                </div>

                {/* RESI */}
                <div className="mb-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Hash size={16} />
                        Nomor Resi
                    </label>

                    <div className="flex gap-2">
                        <input
                            ref={resiInputRef}
                            type="text"
                            name="receipt"
                            value={form.receipt}
                            onChange={handleChange}
                            placeholder="Scan / input manual"
                            className="w-full mt-1 px-4 py-2 border rounded-lg"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowScanner(
                                    true
                                )
                            }
                            className="mt-1 px-3 bg-purple-600 text-white rounded-lg flex items-center justify-center"
                        >
                            <ScanLine size={18} />
                        </button>
                    </div>
                </div>

                {/* NAME */}
                <div className="mb-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Package size={16} />
                        Nama Paket
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border rounded-lg"
                    />
                </div>

                {/* DATE */}
                <div className="mb-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Calendar size={16} />
                        Tanggal Tiba Gudang
                    </label>

                    <input
                        type="date"
                        name="arrived_origin_at"
                        value={
                            form.arrived_origin_at
                        }
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border rounded-lg"
                    />
                </div>

                {/* EXPEDITION */}
                <div className="mb-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Truck size={16} />
                        Ekspedisi
                    </label>

                    <select
                        name="expedition"
                        value={form.expedition}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border rounded-lg"
                    >
                        <option value="">
                            Pilih Ekspedisi
                        </option>

                        {expeditionOptions.map(
                            (item) => (
                                <option
                                    key={
                                        item.id
                                    }
                                    value={
                                        item.expedition_name
                                    }
                                >
                                    {
                                        item.expedition_name
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* ROUTE */}
                {statusPaket === "Sesuai" && (
                    <div className="mb-3">
                        <label className="text-sm font-medium">
                            Kode Rute
                        </label>

                        <select
                            name="route_code"
                            value={
                                form.route_code
                            }
                            onChange={
                                handleChange
                            }
                            className="w-full mt-1 px-4 py-2 border rounded-lg"
                        >
                            <option value="">
                                Pilih Kode
                            </option>

                            {routeOptions.map(
                                (item) => (
                                    <option
                                        key={
                                            item.id
                                        }
                                        value={
                                            item.generated_route_code
                                        }
                                    >
                                        {
                                            item.generated_route_code
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                )}

                {/* WEIGHT */}
                <div className="mb-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Weight size={16} />
                        Berat (Kg)
                    </label>

                    <input
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*[.]?[0-9]*"
                        name="real_weight"
                        value={
                            form.real_weight
                        }
                        onChange={handleDecimalChange}
                        className="w-full mt-1 px-4 py-2 border rounded-lg"
                    />
                </div>

                {/* DIMENSION */}
                <div className="mb-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Ruler size={16} />
                        Dimensi Paket
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                        <input
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*[.]?[0-9]*"
                            name="length"
                            value={form.length}
                            onChange={
                                handleDecimalChange
                            }
                            placeholder="Panjang"
                            className="border p-2 rounded-lg"
                        />

                        <input
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*[.]?[0-9]*"
                            name="width"
                            value={form.width}
                            onChange={
                                handleDecimalChange
                            }
                            placeholder="Lebar"
                            className="border p-2 rounded-lg"
                        />

                        <input
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*[.]?[0-9]*"
                            name="height"
                            value={form.height}
                            onChange={
                                handleDecimalChange
                            }
                            placeholder="Tinggi"
                            className="border p-2 rounded-lg"
                        />
                    </div>
                </div>

                {/* ITEMS */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">
                            Item Paket
                        </label>

                        <button
                            type="button"
                            onClick={addItem}
                            className="flex items-center gap-1 text-xs bg-violet-600 text-white px-2 py-1 rounded-lg"
                        >
                            <Plus size={14} />
                            Tambah
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        {(form.items || []).map(
                            (
                                item,
                                index
                            ) => (
                                <div
                                    key={index}
                                    className="flex gap-2"
                                >
                                    <select
                                        value={
                                            item.item_name
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            updateItem(
                                                index,
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="flex-1 border rounded-xl px-3 py-2 text-sm"
                                    >
                                        <option value="">
                                            Pilih Item
                                        </option>

                                        {itemCategoryOptions.map(
                                            (
                                                category
                                            ) => (
                                                <option
                                                    key={
                                                        category.id
                                                    }
                                                    value={
                                                        category.item_name
                                                    }
                                                >
                                                    {
                                                        category.item_name
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeItem(
                                                index
                                            )
                                        }
                                        className="px-3 bg-red-500 text-white rounded-xl"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* PHOTO */}
                <div className="mb-4">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <ImageIcon size={16} />
                        Foto Paket
                    </label>

                    <div className="border-2 border-dashed rounded-xl p-6 text-center text-gray-400">
                        PNG, JPG, GIF up to 10MB
                    </div>

                    <div className="flex gap-2 mt-2">

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={
                                handleFileChange
                            }
                            hidden
                        />

                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            ref={
                                cameraInputRef
                            }
                            onChange={
                                handleFileChange
                            }
                            hidden
                        />

                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current.click()
                            }
                            className="flex-1 bg-gray-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                            <Upload size={16} />
                            Upload
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                cameraInputRef.current.click()
                            }
                            className="flex-1 bg-purple-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                            <Camera size={16} />
                            Kamera
                        </button>
                    </div>

                    {preview && (
                        <img
                            src={preview}
                            alt="preview"
                            className="mt-3 w-full rounded-2xl border"
                        />
                    )}
                </div>

                {/* BUTTON */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl"
                >
                    {form.id
                        ? "Simpan Perubahan"
                        : "Tambah Package"}
                </button>
            </div>

            {/* SCANNER */}
            <ScannerModal
                open={showScanner}
                onClose={() =>
                    setShowScanner(false)
                }
                onResult={(text) => {
                    setForm((prev) => ({
                        ...prev,
                        receipt: text,
                    }));

                    setTimeout(() => {
                        resiInputRef.current?.focus();
                    }, 100);
                }}
            />
        </div>
    );
}

export default ModalFormInputPackage;
