import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Package, ReceiptText, Wallet } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import Button from "../../components/common/Button";
import { LoadingState } from "../../components/common/Loading";
import InvoiceAccessDenied from "./InvoiceAccessDenied";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import {
    cancelInvoice,
    getInvoiceById,
} from "../../services/api/invoiceApi";

export default function InvoiceDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [canceling, setCanceling] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getInvoiceById(id);
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

    const handleCancel = async () => {
        if (!confirm("Batalkan invoice ini?")) return;

        try {
            setCanceling(true);
            const res = await cancelInvoice(id);
            setData(res);
        } catch (err) {
            alert(err.message);
        } finally {
            setCanceling(false);
        }
    };

    return (
        <InvoiceAccessDenied>
            <div className="min-h-dvh bg-gray-50 p-4">
                <div className="mb-5">
                    <SubPageHeader title="Detail Invoice" />
                </div>

                {loading && !data ? (
                    <LoadingState variant="section" text="Memuat invoice..." />
                ) : data && (
                    <div className="space-y-4">
                        <section className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h1 className="font-bold text-gray-900 truncate">{data.invoice_number}</h1>
                                    <p className="text-sm text-gray-500 mt-1">{data.customer_name}</p>
                                    <p className="text-xs text-gray-400">{data.customer_whatsapp}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <InvoiceStatusBadge value={data.payment_status} />
                                    <InvoiceStatusBadge value={data.received_status} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                                <Info label="Created" value={(data.created_at || "").slice(0, 10) || "-"} />
                                <Info label="Due Date" value={(data.due_date || "").slice(0, 10) || "-"} />
                                <Info label="Paket" value={data.total_package || 0} />
                                <Info label="Berat" value={`${Number(data.total_weight || 0).toFixed(2)} kg`} />
                                <Info label="Subtotal" value={`Rp ${Number(data.subtotal_amount || 0).toLocaleString("id-ID")}`} />
                                <Info label="Total" value={`Rp ${Number(data.total_amount || 0).toLocaleString("id-ID")}`} />
                            </div>
                        </section>

                        <section className="bg-white rounded-2xl p-4 shadow-sm">
                            <h2 className="font-semibold text-sm text-gray-900 mb-3">Paket</h2>
                            <div className="space-y-2">
                                {(data.packages || []).map((item) => (
                                    <div key={item.id} className="flex items-start justify-between gap-3 border-b pb-2 last:border-b-0">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-violet-600 shrink-0" />
                                                <span className="text-sm font-semibold text-gray-800 truncate">{item.receipt}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 truncate mt-1">{item.name || "-"}</div>
                                        </div>
                                        <div className="text-xs text-right text-gray-500 shrink-0">
                                            <div>{Number(item.used_weight || 0).toFixed(2)} kg</div>
                                            <div>Rp {Number(item.fee || 0).toLocaleString("id-ID")}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                onClick={() => navigate(`/invoice/${id}/payment`)}
                                disabled={data.payment_status === "canceled"}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <Wallet className="w-4 h-4" />
                                    Pembayaran
                                </span>
                            </Button>

                            <Button
                                onClick={() => navigate(`/invoice/${id}/receipt`)}
                                disabled={data.payment_status !== "paid"}
                                variant={data.payment_status === "paid" ? "primary" : "secondary"}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <ReceiptText className="w-4 h-4" />
                                    Tanda Terima
                                </span>
                            </Button>
                        </div>

                        {data.payment_status !== "paid" && data.payment_status !== "canceled" && (
                            <Button
                                onClick={handleCancel}
                                loading={canceling}
                                loadingText="Membatalkan..."
                                fullWidth
                                variant="secondary"
                            >
                                Cancel Invoice
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </InvoiceAccessDenied>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-xl bg-gray-50 px-3 py-2">
            <div className="text-gray-400">{label}</div>
            <div className="font-semibold text-gray-800 truncate">{value}</div>
        </div>
    );
}
