import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SubPageHeader from "../../components/layout/SubPageHeader";
import Button from "../../components/common/Button";
import InvoiceAccessDenied from "./InvoiceAccessDenied";
import { uploadInvoiceReceipt } from "../../services/api/invoiceApi";

export default function UploadInvoiceReceiptPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        receiver_name: "",
        received_note: "",
        received_proof: null,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!form.receiver_name || !form.received_proof) {
            alert("Nama penerima dan bukti tanda terima wajib diisi");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("receiver_name", form.receiver_name);
            formData.append("received_note", form.received_note || "");
            formData.append("received_proof", form.received_proof);

            await uploadInvoiceReceipt(id, formData);
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
                    <SubPageHeader title="Upload Tanda Terima" />
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                    <input
                        value={form.receiver_name}
                        onChange={(e) => setForm({ ...form, receiver_name: e.target.value })}
                        placeholder="Nama penerima"
                        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                    />
                    <textarea
                        value={form.received_note}
                        onChange={(e) => setForm({ ...form, received_note: e.target.value })}
                        placeholder="Catatan tanda terima"
                        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                        rows={3}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setForm({ ...form, received_proof: e.target.files?.[0] || null })}
                        className="w-full text-sm"
                    />

                    <Button
                        onClick={handleSubmit}
                        fullWidth
                        loading={loading}
                        loadingText="Mengupload..."
                    >
                        Upload Bukti Tanda Terima
                    </Button>
                </div>
            </div>
        </InvoiceAccessDenied>
    );
}
