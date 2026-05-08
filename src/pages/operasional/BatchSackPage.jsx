import { useEffect, useMemo, useState } from "react";

import {
    Archive,
    Box,
    Check,
    Lock,
    Package,
    Plane,
    Plus,
    ScanLine,
    Search,
    Ship,
    Trash2,
    X,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import ScannerModal from "../../components/modals/ScannerModal";

import {
    addPackageToBatch,
    addPackageToSack,
    closeSack,
    createPlaneBatch,
    createSack,
    createShipBatch,
    getBatchPackages,
    getBatches,
    getSackItems,
    getSacks,
    removePackageFromBatch,
    removePackageFromSack,
    sealSack,
} from "../../services/api/operasional/batchSacksApi";

const statusClass = {
    OPEN: "bg-emerald-50 text-emerald-700 border-emerald-100",
    CLOSE: "bg-amber-50 text-amber-700 border-amber-100",
    SEALED: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function BatchSackPage() {
    const [batchType, setBatchType] = useState("SHIP");
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [batchPackages, setBatchPackages] = useState([]);
    const [sacks, setSacks] = useState([]);
    const [selectedSack, setSelectedSack] = useState(null);
    const [sackDetail, setSackDetail] = useState(null);
    const [search, setSearch] = useState("");
    const [receiptBatch, setReceiptBatch] = useState("");
    const [receiptSack, setReceiptSack] = useState("");
    const [loading, setLoading] = useState(false);
    const [batchModalOpen, setBatchModalOpen] = useState(false);
    const [sackModalOpen, setSackModalOpen] = useState(false);
    const [scannerTarget, setScannerTarget] = useState(null);
    const [confirmation, setConfirmation] = useState(null);

    const [batchForm, setBatchForm] = useState({
        ship_name: "",
        closing_date: "",
        depart_date: "",
        pic: "",
        send_date: "",
        vendor: "",
    });

    const [sackForm, setSackForm] = useState({
        sack_number: "",
    });

    const selectedSackLocked = selectedSack?.status === "SEALED";

    const totalBatchWeight = useMemo(
        () =>
            batchPackages.reduce(
                (total, item) => total + Number(item.used_weight || 0),
                0
            ),
        [batchPackages]
    );

    const fetchBatches = async () => {
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

    const fetchBatchDetail = async (batch = selectedBatch) => {
        if (!batch) return;

        try {
            const [packagesRes, sacksRes] = await Promise.all([
                getBatchPackages({
                    batch_type: batch.batch_type,
                    batch_id: batch.id,
                    limit: 50,
                }),
                getSacks({
                    batch_type: batch.batch_type,
                    batch_id: batch.id,
                }),
            ]);

            setBatchPackages(packagesRes || []);
            setSacks(sacksRes || []);

            if (selectedSack) {
                const refreshedSack = (sacksRes || []).find(
                    (item) => item.id === selectedSack.id
                );

                if (refreshedSack) {
                    setSelectedSack(refreshedSack);
                    await fetchSackDetail(refreshedSack);
                }
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const fetchSackDetail = async (sack = selectedSack) => {
        if (!sack) return;

        try {
            const detail = await getSackItems(sack.id);

            setSackDetail(detail);
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        fetchBatches();
        setSelectedBatch(null);
        setSelectedSack(null);
        setSackDetail(null);
        setBatchPackages([]);
        setSacks([]);
    }, [batchType]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchBatches();
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    const openBatchModal = () => {
        setBatchForm({
            ship_name: "",
            closing_date: "",
            depart_date: "",
            pic: "",
            send_date: "",
            vendor: "",
        });
        setBatchModalOpen(true);
    };

    const handleCreateBatch = async () => {
        try {
            if (batchType === "SHIP") {
                if (!batchForm.ship_name.trim()) {
                    alert("Nama kapal wajib diisi");
                    return;
                }

                await createShipBatch({
                    ship_name: batchForm.ship_name,
                    closing_date: batchForm.closing_date || null,
                    depart_date: batchForm.depart_date || null,
                    vendor: batchForm.vendor || null,
                });
            } else {
                if (!batchForm.pic.trim()) {
                    alert("PIC wajib diisi");
                    return;
                }

                await createPlaneBatch({
                    pic: batchForm.pic,
                    send_date: batchForm.send_date || null,
                    vendor: batchForm.vendor || null,
                });
            }

            setBatchModalOpen(false);
            fetchBatches();
        } catch (err) {
            alert(err.message);
        }
    };

    const selectBatch = async (batch) => {
        setSelectedBatch(batch);
        setSelectedSack(null);
        setSackDetail(null);
        await fetchBatchDetail(batch);
    };

    const handleAddBatchPackage = async (receipt = receiptBatch) => {
        if (!selectedBatch || !receipt.trim()) return;

        try {
            await addPackageToBatch({
                batch_type: selectedBatch.batch_type,
                batch_id: selectedBatch.id,
                receipt: receipt.trim(),
            });

            setReceiptBatch("");
            fetchBatchDetail();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRemoveBatchPackage = async (receipt) => {
        if (!confirm("Hapus paket dari batch ini?")) return;

        try {
            await removePackageFromBatch({
                batch_type: selectedBatch.batch_type,
                batch_id: selectedBatch.id,
                receipt,
            });

            fetchBatchDetail();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCreateSack = async () => {
        if (!selectedBatch || !sackForm.sack_number.trim()) {
            alert("Nomor karung wajib diisi");
            return;
        }

        try {
            await createSack({
                batch_id: selectedBatch.id,
                batch_type: selectedBatch.batch_type,
                sack_number: sackForm.sack_number.trim(),
            });

            setSackModalOpen(false);
            setSackForm({ sack_number: "" });
            fetchBatchDetail();
        } catch (err) {
            alert(err.message);
        }
    };

    const selectSack = async (sack) => {
        setSelectedSack(sack);
        await fetchSackDetail(sack);
    };

    const handleAddSackPackage = async ({
        receipt = receiptSack,
        force_move = false,
    } = {}) => {
        if (!selectedSack || !receipt.trim()) return;

        try {
            const res = await addPackageToSack({
                sack_id: selectedSack.id,
                receipt: receipt.trim(),
                force_move,
            });

            if (res?.type === "CONFIRMATION_REQUIRED") {
                setConfirmation(res);
                return;
            }

            setReceiptSack("");
            setConfirmation(null);
            await fetchBatchDetail();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRemoveSackPackage = async (receipt) => {
        if (!confirm("Hapus paket dari karung ini?")) return;

        try {
            await removePackageFromSack({
                sack_id: selectedSack.id,
                receipt,
            });

            fetchBatchDetail();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCloseSack = async () => {
        try {
            await closeSack(selectedSack.id);
            fetchBatchDetail();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSealSack = async () => {
        try {
            await sealSack(selectedSack.id);
            fetchBatchDetail();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleScanResult = (value) => {
        if (scannerTarget === "BATCH") {
            setReceiptBatch(value);
            handleAddBatchPackage(value);
        }

        if (scannerTarget === "SACK") {
            setReceiptSack(value);
            handleAddSackPackage({ receipt: value });
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

            <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari batch..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
                {loading ? (
                    <div className="text-center text-sm text-gray-400 py-10">
                        Loading...
                    </div>
                ) : (
                    batches.map((item) => (
                        <button
                            key={`${item.batch_type}-${item.id}`}
                            onClick={() => selectBatch(item)}
                            className={`bg-white rounded-2xl shadow-sm p-3 text-left border transition ${
                                selectedBatch?.id === item.id &&
                                selectedBatch?.batch_type === item.batch_type
                                    ? "border-violet-400 ring-2 ring-violet-100"
                                    : "border-transparent"
                            }`}
                        >
                            <div className="flex items-center gap-2 text-xs font-semibold text-violet-700 bg-violet-50 rounded-lg px-2 py-1 w-fit mb-2">
                                <Archive className="w-3 h-3" />
                                {item.batch_number || `#${item.id}`}
                            </div>

                            <div className="text-sm font-semibold text-gray-800">
                                {item.ship_name || item.pic}
                            </div>

                            <div className="text-xs text-gray-500 mt-1">
                                {item.vendor || "-"}
                            </div>
                        </button>
                    ))
                )}
            </div>

            {selectedBatch && (
                <div className="space-y-5 pb-24">
                    <div className="bg-white rounded-2xl shadow-sm p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                                <div className="text-xs text-gray-500">
                                    Batch aktif
                                </div>
                                <div className="text-base font-semibold text-gray-800">
                                    {selectedBatch.batch_number}
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-xs text-gray-500">
                                    Total
                                </div>
                                <div className="text-sm font-semibold text-gray-800">
                                    {batchPackages.length} paket / {totalBatchWeight.toFixed(2)} kg
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <input
                                value={receiptBatch}
                                onChange={(e) => setReceiptBatch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleAddBatchPackage();
                                    }
                                }}
                                placeholder="Input resi ke batch"
                                className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                            />

                            <button
                                onClick={() => {
                                    setScannerTarget("BATCH");
                                }}
                                className="w-11 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
                            >
                                <ScanLine className="w-4 h-4 text-gray-600" />
                            </button>

                            <button
                                onClick={() => handleAddBatchPackage()}
                                className="w-11 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mt-3 space-y-2">
                            {batchPackages.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 border rounded-xl px-3 py-2"
                                >
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">
                                            {item.receipt}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {item.name} - {item.used_weight || 0} kg
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleRemoveBatchPackage(item.receipt)}
                                        className="p-2 rounded-lg hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold text-gray-800">
                                Karung
                            </h2>

                            <button
                                onClick={() => setSackModalOpen(true)}
                                className="flex items-center gap-1.5 bg-violet-600 text-white px-3 py-2 rounded-xl text-xs font-medium"
                            >
                                <Plus className="w-3 h-3" />
                                Karung
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {sacks.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => selectSack(item)}
                                    className={`text-left border rounded-xl p-3 ${
                                        selectedSack?.id === item.id
                                            ? "border-violet-400 ring-2 ring-violet-100"
                                            : "border-gray-100"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 font-semibold text-sm text-gray-800">
                                        <Box className="w-4 h-4 text-violet-600" />
                                        {item.sack_number}
                                    </div>

                                    <div className={`mt-2 inline-flex px-2 py-0.5 rounded-full border text-[11px] font-semibold ${statusClass[item.status]}`}>
                                        {item.status}
                                    </div>

                                    <div className="text-xs text-gray-500 mt-2">
                                        {item.total_packages || 0} paket / {Number(item.total_weight || 0).toFixed(2)} kg
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedSack && (
                        <div className="bg-white rounded-2xl shadow-sm p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Isi karung
                                    </div>
                                    <div className="text-base font-semibold text-gray-800">
                                        {selectedSack.sack_number}
                                    </div>
                                </div>

                                <div className={`px-2 py-1 rounded-full border text-[11px] font-semibold ${statusClass[selectedSack.status]}`}>
                                    {selectedSack.status}
                                </div>
                            </div>

                            {selectedSack.status === "CLOSE" && (
                                <div className="mb-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                                    Karung sudah ditutup. Perpindahan paket masih bisa dilakukan dengan konfirmasi.
                                </div>
                            )}

                            {selectedSack.status === "SEALED" && (
                                <div className="mb-3 text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded-xl px-3 py-2">
                                    Karung tersegel. Seluruh aksi edit dinonaktifkan.
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="rounded-xl bg-violet-50 px-3 py-2">
                                    <div className="text-xs text-violet-500">
                                        Paket
                                    </div>
                                    <div className="font-semibold text-violet-800">
                                        {sackDetail?.total_packages || selectedSack.total_packages || 0}
                                    </div>
                                </div>

                                <div className="rounded-xl bg-indigo-50 px-3 py-2">
                                    <div className="text-xs text-indigo-500">
                                        Berat
                                    </div>
                                    <div className="font-semibold text-indigo-800">
                                        {Number(sackDetail?.total_weight || selectedSack.total_weight || 0).toFixed(2)} kg
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mb-3">
                                <input
                                    value={receiptSack}
                                    disabled={selectedSackLocked}
                                    onChange={(e) => setReceiptSack(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleAddSackPackage();
                                        }
                                    }}
                                    placeholder="Input resi ke karung"
                                    className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 disabled:bg-gray-100"
                                />

                                <button
                                    disabled={selectedSackLocked}
                                    onClick={() => setScannerTarget("SACK")}
                                    className="w-11 h-10 rounded-xl bg-gray-100 flex items-center justify-center disabled:opacity-50"
                                >
                                    <ScanLine className="w-4 h-4 text-gray-600" />
                                </button>

                                <button
                                    disabled={selectedSackLocked}
                                    onClick={() => handleAddSackPackage()}
                                    className="w-11 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex gap-2 mb-3">
                                <button
                                    disabled={selectedSack.status !== "OPEN"}
                                    onClick={handleCloseSack}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500 text-white text-xs font-medium disabled:opacity-50"
                                >
                                    <Check className="w-3 h-3" />
                                    Close
                                </button>

                                <button
                                    disabled={selectedSack.status !== "CLOSE"}
                                    onClick={handleSealSack}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-800 text-white text-xs font-medium disabled:opacity-50"
                                >
                                    <Lock className="w-3 h-3" />
                                    Seal
                                </button>
                            </div>

                            <div className="space-y-2">
                                {(sackDetail?.items || []).map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 border rounded-xl px-3 py-2"
                                    >
                                        <div>
                                            <div className="text-sm font-medium text-gray-800">
                                                {item.receipt}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {item.name} - {item.used_weight || 0} kg
                                            </div>
                                        </div>

                                        <button
                                            disabled={selectedSackLocked}
                                            onClick={() => handleRemoveSackPackage(item.receipt)}
                                            className="p-2 rounded-lg hover:bg-red-50 disabled:opacity-40"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={openBatchModal}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition"
            >
                <Plus />
            </button>

            {batchModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold">
                                Tambah Batch {batchType === "SHIP" ? "Kapal" : "Pesawat"}
                            </h2>

                            <button onClick={() => setBatchModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        {batchType === "SHIP" ? (
                            <>
                                <input
                                    value={batchForm.ship_name}
                                    onChange={(e) => setBatchForm({ ...batchForm, ship_name: e.target.value })}
                                    placeholder="Nama kapal"
                                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-3"
                                />
                                <input
                                    type="date"
                                    value={batchForm.closing_date}
                                    onChange={(e) => setBatchForm({ ...batchForm, closing_date: e.target.value })}
                                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-3"
                                />
                                <input
                                    type="date"
                                    value={batchForm.depart_date}
                                    onChange={(e) => setBatchForm({ ...batchForm, depart_date: e.target.value })}
                                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-3"
                                />
                            </>
                        ) : (
                            <>
                                <input
                                    value={batchForm.pic}
                                    onChange={(e) => setBatchForm({ ...batchForm, pic: e.target.value })}
                                    placeholder="PIC"
                                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-3"
                                />
                                <input
                                    type="date"
                                    value={batchForm.send_date}
                                    onChange={(e) => setBatchForm({ ...batchForm, send_date: e.target.value })}
                                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-3"
                                />
                            </>
                        )}

                        <input
                            value={batchForm.vendor}
                            onChange={(e) => setBatchForm({ ...batchForm, vendor: e.target.value })}
                            placeholder="Vendor"
                            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-4"
                        />

                        <button
                            onClick={handleCreateBatch}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2 rounded-xl text-sm shadow-md hover:opacity-90"
                        >
                            Tambah
                        </button>
                    </div>
                </div>
            )}

            {sackModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold">
                                Tambah Karung
                            </h2>

                            <button onClick={() => setSackModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <input
                            value={sackForm.sack_number}
                            onChange={(e) => setSackForm({ sack_number: e.target.value })}
                            placeholder="Nomor karung"
                            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-4"
                        />

                        <button
                            onClick={handleCreateSack}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2 rounded-xl text-sm shadow-md hover:opacity-90"
                        >
                            Tambah
                        </button>
                    </div>
                </div>
            )}

            {confirmation && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-sm font-semibold">
                                Konfirmasi Pindah Karung
                            </h2>

                            <button onClick={() => setConfirmation(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-2 text-sm text-gray-700 mb-4">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-violet-600" />
                                {confirmation.data.receipt}
                            </div>
                            <div>
                                Asal: <span className="font-semibold">{confirmation.data.current_sack_number}</span>
                            </div>
                            <div>
                                Tujuan: <span className="font-semibold">{confirmation.data.target_sack_number}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setConfirmation(null)}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-medium"
                            >
                                Batal
                            </button>

                            <button
                                onClick={() =>
                                    handleAddSackPackage({
                                        receipt: confirmation.data.receipt,
                                        force_move: true,
                                    })
                                }
                                className="flex-1 bg-violet-600 text-white py-2 rounded-xl text-sm font-medium"
                            >
                                Pindahkan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ScannerModal
                open={!!scannerTarget}
                onClose={() => setScannerTarget(null)}
                onResult={handleScanResult}
            />
        </div>
    );
}
