import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Check,
    Lock,
    Package,
    Plus,
    ScanLine,
    Trash2,
    X,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import ScannerModal from "../../components/modals/ScannerModal";

import {
    addPackageToSack,
    closeSack,
    getSackItems,
    removePackageFromSack,
    sealSack,
} from "../../services/api/operasional/batchSacksApi";

const statusClass = {
    OPEN: "bg-emerald-50 text-emerald-700 border-emerald-100",
    CLOSE: "bg-amber-50 text-amber-700 border-amber-100",
    SEALED: "bg-gray-100 text-gray-600 border-gray-200",
};

const viaLabel = {
    K: "Kapal",
    P: "Pesawat",
};

export default function SackDetailPage() {
    const { sackId } = useParams();

    const [sack, setSack] = useState(null);
    const [receipt, setReceipt] = useState("");
    const [loading, setLoading] = useState(false);
    const [scannerOpen, setScannerOpen] = useState(false);
    const [confirmation, setConfirmation] = useState(null);
    const [viaWarning, setViaWarning] = useState(null);

    const locked = sack?.status === "SEALED";

    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await getSackItems(sackId);

            setSack(res);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [sackId]);

    const handleAddPackage = async ({
        value = receipt,
        force_move = false,
    } = {}) => {
        if (!value.trim()) return;

        try {
            const res = await addPackageToSack({
                sack_id: sackId,
                receipt: value.trim(),
                force_move,
            });

            if (res?.type === "CONFIRMATION_REQUIRED") {
                setConfirmation(res);
                return;
            }

            if (res?.type === "VIA_MISMATCH_WARNING") {
                setViaWarning(res);
                return;
            }

            setReceipt("");
            setConfirmation(null);
            setSack(res);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRemovePackage = async (packageReceipt) => {
        if (!confirm("Hapus paket dari karung ini?")) return;

        try {
            const res = await removePackageFromSack({
                sack_id: sackId,
                receipt: packageReceipt,
            });

            setSack(res);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCloseSack = async () => {
        try {
            await closeSack(sackId);
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSealSack = async () => {
        try {
            await sealSack(sackId);
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-dvh bg-gray-50 p-4">
            <div className="mb-5">
                <SubPageHeader title="Detail Karung" />
            </div>

            {loading && !sack ? (
                <div className="text-center text-sm text-gray-400 py-10">
                    Loading...
                </div>
            ) : (
                sack && (
                    <div className="space-y-5 pb-24">
                        <div className="bg-white rounded-2xl shadow-sm p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Karung
                                    </div>
                                    <div className="text-base font-semibold text-gray-800">
                                        {sack.sack_number}
                                    </div>
                                </div>

                                <div className={`px-2 py-1 rounded-full border text-[11px] font-semibold ${statusClass[sack.status]}`}>
                                    {sack.status}
                                </div>
                            </div>

                            {sack.status === "CLOSE" && (
                                <div className="mb-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                                    Karung sudah ditutup. Perpindahan paket masih bisa dilakukan dengan konfirmasi.
                                </div>
                            )}

                            {sack.status === "SEALED" && (
                                <div className="mb-3 text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded-xl px-3 py-2">
                                    Karung tersegel. Seluruh aksi edit dinonaktifkan.
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-xl bg-violet-50 px-3 py-2">
                                    <div className="text-xs text-violet-500">
                                        Paket
                                    </div>
                                    <div className="font-semibold text-violet-800">
                                        {sack.total_packages || 0}
                                    </div>
                                </div>

                                <div className="rounded-xl bg-indigo-50 px-3 py-2">
                                    <div className="text-xs text-indigo-500">
                                        Berat
                                    </div>
                                    <div className="font-semibold text-indigo-800">
                                        {Number(sack.total_weight || 0).toFixed(2)} kg
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-4">
                            <div className="flex gap-2 mb-3">
                                <input
                                    value={receipt}
                                    disabled={locked}
                                    onChange={(e) => setReceipt(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleAddPackage();
                                        }
                                    }}
                                    placeholder="Input resi"
                                    className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 disabled:bg-gray-100"
                                />

                                <button
                                    disabled={locked}
                                    onClick={() => setScannerOpen(true)}
                                    className="w-11 h-10 rounded-xl bg-gray-100 flex items-center justify-center disabled:opacity-50"
                                >
                                    <ScanLine className="w-4 h-4 text-gray-600" />
                                </button>

                                <button
                                    disabled={locked}
                                    onClick={() => handleAddPackage()}
                                    className="w-11 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    disabled={sack.status !== "OPEN"}
                                    onClick={handleCloseSack}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500 text-white text-xs font-medium disabled:opacity-50"
                                >
                                    <Check className="w-3 h-3" />
                                    Close
                                </button>

                                <button
                                    disabled={sack.status !== "CLOSE"}
                                    onClick={handleSealSack}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-800 text-white text-xs font-medium disabled:opacity-50"
                                >
                                    <Lock className="w-3 h-3" />
                                    Seal
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {(sack.items || []).map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl shadow-sm px-3 py-3 flex items-center justify-between gap-3"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 bg-violet-50 text-violet-700 px-2 py-1 rounded-lg text-xs font-medium w-fit">
                                            <Package className="w-3 h-3" />
                                            {item.receipt}
                                        </div>

                                        <div className="text-xs text-gray-500 mt-2">
                                            {item.name} - {item.used_weight || 0} kg
                                        </div>
                                    </div>

                                    <button
                                        disabled={locked}
                                        onClick={() => handleRemovePackage(item.receipt)}
                                        className="p-2 rounded-lg hover:bg-red-50 disabled:opacity-40"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {!loading && (sack.items || []).length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                                <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
                                Belum ada paket
                            </div>
                        )}
                    </div>
                )
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
                                    handleAddPackage({
                                        value: confirmation.data.receipt,
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

            {viaWarning && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-sm font-semibold">
                                Via Paket Tidak Sesuai
                            </h2>

                            <button onClick={() => setViaWarning(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <p className="text-sm text-gray-700 mb-4">
                            {viaWarning.message}
                        </p>

                        <div className="space-y-2 text-sm text-gray-700 mb-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Resi</span>
                                <span className="font-semibold">{viaWarning.data.receipt || "-"}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Via seharusnya</span>
                                <span className="font-semibold">{viaLabel[viaWarning.data.package_via] || viaWarning.data.package_via}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Via batch</span>
                                <span className="font-semibold">{viaLabel[viaWarning.data.batch_via] || viaWarning.data.batch_via}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setViaWarning(null)}
                            className="w-full bg-violet-600 text-white py-2 rounded-xl text-sm font-medium"
                        >
                            Mengerti
                        </button>
                    </div>
                </div>
            )}

            <ScannerModal
                open={scannerOpen}
                onClose={() => setScannerOpen(false)}
                onResult={(value) => {
                    setReceipt(value);
                    handleAddPackage({ value });
                }}
            />
        </div>
    );
}
