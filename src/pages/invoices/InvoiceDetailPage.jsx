import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Image, Package, ReceiptText, Wallet, X } from "lucide-react";

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
    const [showAllPackages, setShowAllPackages] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

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
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <h2 className="font-semibold text-sm text-gray-900">Paket</h2>
                                <span className="text-xs text-gray-400">
                                    {(data.packages || []).length} item
                                </span>
                            </div>
                            <div className="space-y-2">
                                {(showAllPackages ? data.packages || [] : (data.packages || []).slice(0, 3)).map((item) => (
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

                            {(data.packages || []).length > 3 && (
                                <button
                                    onClick={() => setShowAllPackages((prev) => !prev)}
                                    className="w-full mt-3 bg-gray-50 text-gray-700 py-2 rounded-xl text-xs font-medium"
                                >
                                    {showAllPackages ? "Tampilkan Lebih Sedikit" : "Lihat Selengkapnya"}
                                </button>
                            )}
                        </section>

                        <section className="bg-white rounded-2xl p-4 shadow-sm">
                            <h2 className="font-semibold text-sm text-gray-900 mb-3">
                                Bukti Pembayaran
                            </h2>

                            {(data.payments || []).length > 0 ? (
                                <div className="space-y-3">
                                    {(data.payments || []).map((payment) => (
                                        <ProofCard
                                            key={payment.id}
                                            imageUrl={payment.payment_proof_url}
                                            title={payment.payment_method}
                                            subtitle={`Rp ${Number(payment.payment_amount || 0).toLocaleString("id-ID")}`}
                                            note={payment.payment_note}
                                            date={payment.uploaded_at}
                                            onPreview={setPreviewImage}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyProof text="Belum ada bukti pembayaran" />
                            )}
                        </section>

                        <section className="bg-white rounded-2xl p-4 shadow-sm">
                            <h2 className="font-semibold text-sm text-gray-900 mb-3">
                                Bukti Tanda Terima
                            </h2>

                            {(data.receipts || []).length > 0 ? (
                                <div className="space-y-3">
                                    {(data.receipts || []).map((receipt) => (
                                        <ProofCard
                                            key={receipt.id}
                                            imageUrl={receipt.received_proof_url}
                                            title={receipt.receiver_name}
                                            subtitle="Tanda terima"
                                            note={receipt.received_note}
                                            date={receipt.received_at}
                                            onPreview={setPreviewImage}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyProof text="Belum ada bukti tanda terima" />
                            )}
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

                {previewImage && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"
                            aria-label="Tutup preview"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <img
                            src={previewImage}
                            alt="Preview bukti invoice"
                            className="max-w-full max-h-full rounded-2xl object-contain"
                        />
                    </div>
                )}
            </div>
        </InvoiceAccessDenied>
    );
}

function ProofCard({
    imageUrl,
    title,
    subtitle,
    note,
    date,
    onPreview,
}) {
    return (
        <button
            onClick={() => onPreview(imageUrl)}
            className="w-full flex items-center gap-3 text-left"
        >
            <img
                src={imageUrl}
                alt={title || "Bukti invoice"}
                className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0"
            />

            <div className="min-w-0">
                <div className="font-semibold text-sm text-gray-800 truncate">
                    {title || "-"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                    {subtitle || "-"}
                </div>
                {note && (
                    <div className="text-xs text-gray-400 truncate mt-1">
                        {note}
                    </div>
                )}
                <div className="text-[11px] text-gray-400 mt-1">
                    {(date || "").slice(0, 10) || "-"}
                </div>
            </div>
        </button>
    );
}

function EmptyProof({ text }) {
    return (
        <div className="rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-4 flex items-center gap-3 text-gray-400">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                <Image className="w-5 h-5" />
            </div>
            <span className="text-sm">{text}</span>
        </div>
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
