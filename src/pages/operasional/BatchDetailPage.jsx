import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Plus, X } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { ButtonLoading, LoadingState } from "../../components/common/Loading";

import {
    createSack,
    getBatchById,
    getSacks,
    updateBatchStatus,
} from "../../services/api/operasional/batchSacksApi";
import { useAuth } from "../../context/useAuth";

const statusClass = {
    OPEN: "bg-emerald-50 text-emerald-700 border-emerald-100",
    CLOSE: "bg-amber-50 text-amber-700 border-amber-100",
    SEALED: "bg-gray-100 text-gray-600 border-gray-200",
    DEPARTED: "bg-indigo-50 text-indigo-700 border-indigo-100",
    ARRIVED: "bg-blue-50 text-blue-700 border-blue-100",
};

export default function BatchDetailPage() {
    const navigate = useNavigate();
    const { batchType, batchId } = useParams();
    const { user, role } = useAuth();

    const [batch, setBatch] = useState(null);
    const [sacks, setSacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({
        sack_number: "",
    });

    const fetchData = async () => {
        try {
            setLoading(true);

            const [batchRes, sacksRes] = await Promise.all([
                getBatchById({
                    batch_type: batchType,
                    batch_id: batchId,
                }),
                getSacks({
                    batch_type: batchType,
                    batch_id: batchId,
                }),
            ]);

            setBatch(batchRes);
            setSacks(sacksRes || []);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [batchType, batchId]);

    const handleCreateSack = async () => {
        if (!form.sack_number.trim()) {
            alert("Nomor karung wajib diisi");
            return;
        }

        try {
            setSubmitLoading(true);

            await createSack({
                batch_id: batchId,
                batch_type: batchType,
                sack_number: form.sack_number.trim(),
            });

            setForm({ sack_number: "" });
            setIsOpen(false);
            fetchData();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleUpdateBatchStatus = async (status) => {
        const message = status === "DEPARTED"
            ? "Berangkatkan batch ini?"
            : "Tandai batch ini sudah tiba?";

        if (!confirm(message)) return;

        try {
            setStatusLoading(true);

            await updateBatchStatus({
                batch_type: batchType,
                batch_id: batchId,
                status,
            });

            fetchData();
        } catch (err) {
            alert(err.message);
        } finally {
            setStatusLoading(false);
        }
    };

    const canDepartBatch = role === "general_manager";
    const canMarkArrived =
        role === "branch_manager" &&
        user?.is_origin === false;

    return (
        <div className="min-h-dvh bg-gray-50 p-4">
            <div className="mb-5">
                <SubPageHeader title="Detail Batch" />
            </div>

            {loading && !batch ? (
                <LoadingState variant="section" text="Memuat detail batch..." />
            ) : (
                batch && (
                    <div className="space-y-5 pb-24">
                        <div className="bg-white rounded-2xl shadow-sm p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-xs text-gray-500">
                                        {batch.batch_type === "SHIP" ? "Batch Kapal" : "Batch Pesawat"}
                                    </div>
                                    <div className="text-base font-semibold text-gray-800">
                                        {batch.batch_number}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {batch.ship_name || batch.pic}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {batch.vendor || "-"}
                                    </div>
                                </div>

                                <div className={`px-2 py-1 rounded-full border text-[11px] font-semibold ${statusClass[batch.status || "OPEN"] || statusClass.OPEN}`}>
                                    {batch.status || "OPEN"}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                                <div className="rounded-xl bg-violet-50 py-2">
                                    <div className="text-xs text-violet-500">
                                        Paket
                                    </div>
                                    <div className="font-semibold text-violet-800">
                                        {batch.total_packages || 0}
                                    </div>
                                </div>

                                <div className="rounded-xl bg-indigo-50 py-2">
                                    <div className="text-xs text-indigo-500">
                                        Berat
                                    </div>
                                    <div className="font-semibold text-indigo-800">
                                        {Number(batch.total_weight || 0).toFixed(2)}
                                    </div>
                                </div>

                                <div className="rounded-xl bg-gray-50 py-2">
                                    <div className="text-xs text-gray-500">
                                        Karung
                                    </div>
                                    <div className="font-semibold text-gray-800">
                                        {batch.total_sacks || 0}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {canDepartBatch && batch.status !== "DEPARTED" && batch.status !== "ARRIVED" && (
                                    <button
                                        onClick={() => handleUpdateBatchStatus("DEPARTED")}
                                        disabled={statusLoading}
                                        className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white disabled:bg-gray-300"
                                    >
                                        Berangkatkan Batch
                                    </button>
                                )}

                                {canMarkArrived && batch.status === "DEPARTED" && (
                                    <button
                                        onClick={() => handleUpdateBatchStatus("ARRIVED")}
                                        disabled={statusLoading}
                                        className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:bg-gray-300"
                                    >
                                        Tandai Tiba
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-800">
                                Daftar Karung
                            </h2>

                            <button
                                onClick={() => setIsOpen(true)}
                                className="flex items-center gap-1.5 bg-violet-600 text-white px-3 py-2 rounded-xl text-xs font-medium"
                            >
                                <Plus className="w-3 h-3" />
                                Karung
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {sacks.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() =>
                                        navigate(
                                            `/kloter/${batchType}/${batchId}/sacks/${item.id}`
                                        )
                                    }
                                    className="bg-white rounded-2xl shadow-sm p-3 text-left hover:shadow-md active:scale-[0.98] transition"
                                >
                                    <div className="flex items-center gap-2 font-semibold text-sm text-gray-800">
                                        <Box className="w-4 h-4 text-violet-600" />
                                        {item.sack_number}
                                    </div>

                                    <div className={`mt-2 inline-flex px-2 py-0.5 rounded-full border text-[11px] font-semibold ${statusClass[item.status]}`}>
                                        {item.status}
                                    </div>

                                    <div className="text-xs text-gray-500 mt-3">
                                        {item.total_packages || 0} paket
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {Number(item.total_weight || 0).toFixed(2)} kg
                                    </div>
                                </button>
                            ))}
                        </div>

                        {!loading && sacks.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                                <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
                                Belum ada karung
                            </div>
                        )}
                    </div>
                )
            )}

            {isOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold">
                                Tambah Karung
                            </h2>

                            <button onClick={() => setIsOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <input
                            value={form.sack_number}
                            onChange={(e) =>
                                setForm({
                                    sack_number: e.target.value,
                                })
                            }
                            placeholder="Nomor karung"
                            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 mb-4"
                        />

                        <button
                            onClick={handleCreateSack}
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
