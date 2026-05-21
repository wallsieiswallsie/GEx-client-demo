import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SubPageHeader from "../../components/layout/SubPageHeader";
import Button from "../../components/common/Button";
import { LoadingState } from "../../components/common/Loading";
import InvoiceAccessDenied from "./InvoiceAccessDenied";
import {
    getActiveInvoicePaymentMethods,
    uploadInvoicePayment,
} from "../../services/api/invoiceApi";

export default function UploadInvoicePaymentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        payment_method_id: "",
        payment_note: "",
        payment_proof: null,
    });
    const [loading, setLoading] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [methodsLoading, setMethodsLoading] = useState(false);
    const [methodsError, setMethodsError] = useState("");

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                setMethodsLoading(true);
                setMethodsError("");
                setPaymentMethods(await getActiveInvoicePaymentMethods());
            } catch (err) {
                setMethodsError(err.message);
            } finally {
                setMethodsLoading(false);
            }
        };

        fetchPaymentMethods();
    }, []);

    const handleSubmit = async () => {
        if (!form.payment_method_id || !form.payment_proof) {
            alert("Metode dan bukti pembayaran wajib diisi");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("payment_method_id", form.payment_method_id);
            formData.append("payment_note", form.payment_note || "");
            formData.append("payment_proof", form.payment_proof);

            await uploadInvoicePayment(id, formData);
            navigate(`/invoice/${id}`, { replace: true });
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <InvoiceAccessDenied>
            <div className="min-h-dvh bg-gray-50 p-4">
                <div className="mb-5">
                    <SubPageHeader title="Upload Pembayaran" />
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                    {methodsLoading ? (
                        <LoadingState variant="section" text="Memuat metode pembayaran..." />
                    ) : methodsError ? (
                        <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                            {methodsError}
                        </div>
                    ) : paymentMethods.length === 0 ? (
                        <div className="rounded-xl border bg-gray-50 p-3 text-sm text-gray-500">
                            Belum ada metode pembayaran aktif
                        </div>
                    ) : (
                        <select
                            value={form.payment_method_id}
                            onChange={(e) => setForm({ ...form, payment_method_id: e.target.value })}
                            className="w-full border rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
                        >
                            <option value="">Pilih metode pembayaran</option>
                            {paymentMethods.map((method) => (
                                <option key={method.id} value={method.id}>
                                    {method.name} - {method.code}
                                </option>
                            ))}
                        </select>
                    )}
                    <textarea
                        value={form.payment_note}
                        onChange={(e) => setForm({ ...form, payment_note: e.target.value })}
                        placeholder="Catatan pembayaran"
                        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                        rows={3}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setForm({ ...form, payment_proof: e.target.files?.[0] || null })}
                        className="w-full text-sm"
                    />

                    <Button
                        onClick={handleSubmit}
                        fullWidth
                        loading={loading}
                        loadingText="Mengupload..."
                        disabled={methodsLoading || Boolean(methodsError) || paymentMethods.length === 0}
                    >
                        Upload Bukti Pembayaran
                    </Button>
                </div>
            </div>
        </InvoiceAccessDenied>
    );
}
