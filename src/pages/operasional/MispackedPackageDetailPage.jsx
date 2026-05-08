import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { AlertTriangle, Package } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";

import {
    getMispackedPackageById,
} from "../../services/api/operasional/batchSacksApi";

const viaLabel = {
    K: "Kapal",
    P: "Pesawat",
};

export default function MispackedPackageDetailPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await getMispackedPackageById(id);

            setData(res);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    return (
        <div className="min-h-dvh bg-gray-50 p-4">
            <div className="mb-5">
                <SubPageHeader title="Salah Packing" />
            </div>

            {loading && !data ? (
                <div className="text-center text-sm text-gray-400 py-10">
                    Loading...
                </div>
            ) : (
                data && (
                    <div className="bg-white rounded-2xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-4">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                                Paket tidak sesuai via batch
                            </span>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-violet-600" />
                                <span className="font-semibold">
                                    {data.receipt || "-"}
                                </span>
                            </div>

                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Batch salah</span>
                                <span className="font-medium">#{data.wrong_batch_id || "-"}</span>
                            </div>

                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Via batch</span>
                                <span className="font-medium">{viaLabel[data.wrong_via] || data.wrong_via || "-"}</span>
                            </div>

                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Via seharusnya</span>
                                <span className="font-medium">{viaLabel[data.correct_via] || data.correct_via || "-"}</span>
                            </div>

                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Status</span>
                                <span className="font-medium">{data.status}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Tanggal</span>
                                <span className="font-medium">{(data.created_at || "").slice(0, 10)}</span>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
