import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SubPageHeader from "../../components/layout/SubPageHeader";
import Button from "../../components/common/Button";
import InvoiceAccessDenied from "./InvoiceAccessDenied";
import { uploadInvoicePayment } from "../../services/api/invoiceApi";

export default function UploadInvoicePaymentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        payment_amount: "",
        payment_method: "",
        payment_note: "",
        payment_proof: null,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!form.payment_amount || !form.payment_method || !form.payment_proof) {
            alert("Nominal, metode, dan bukti pembayaran wajib diisi");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("payment_amount", form.payment_amount);
            formData.append("payment_method", form.payment_method);
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
                    <input
                        type="number"
                        value={form.payment_amount}
                        onChange={(e) => setForm({ ...form, payment_amount: e.target.value })}
                        placeholder="Nominal pembayaran"
                        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                    />
                    <input
                        value={form.payment_method}
                        onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                        placeholder="Metode pembayaran"
                        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                    />
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
                    >
                        Upload Bukti Pembayaran
                    </Button>
                </div>
            </div>
        </InvoiceAccessDenied>
    );
}
