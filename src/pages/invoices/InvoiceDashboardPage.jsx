import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, ReceiptText, Wallet } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import InvoiceAccessDenied from "./InvoiceAccessDenied";
import { getInvoices } from "../../services/api/invoiceApi";

export default function InvoiceDashboardPage() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState({
        total: 0,
        paid: 0,
        unpaid: 0,
        received: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const [all, paid, unpaid, received] = await Promise.all([
                    getInvoices({ limit: 1 }),
                    getInvoices({ limit: 1, payment_status: "paid" }),
                    getInvoices({ limit: 1, payment_status: "unpaid" }),
                    getInvoices({ limit: 1, received_status: "received" }),
                ]);

                setSummary({
                    total: all.total || 0,
                    paid: paid.total || 0,
                    unpaid: unpaid.total || 0,
                    received: received.total || 0,
                });
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    return (
        <InvoiceAccessDenied>
            <div className="min-h-dvh bg-gray-50 p-4">
                <div className="mb-5">
                    <SubPageHeader title="Invoice" />
                </div>

                {loading ? (
                    <LoadingState variant="section" text="Memuat invoice..." />
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <SummaryCard icon={FileText} label="Total" value={summary.total} />
                            <SummaryCard icon={Wallet} label="Unpaid" value={summary.unpaid} />
                            <SummaryCard icon={Wallet} label="Paid" value={summary.paid} />
                            <SummaryCard icon={ReceiptText} label="Received" value={summary.received} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => navigate("/invoice/create")}
                                className="bg-violet-600 text-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="text-sm font-semibold">Buat Invoice</span>
                            </button>

                            <button
                                onClick={() => navigate("/invoice/list")}
                                className="bg-white text-gray-700 rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2"
                            >
                                <FileText className="w-5 h-5 text-violet-600" />
                                <span className="text-sm font-semibold">Daftar Invoice</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </InvoiceAccessDenied>
    );
}

function SummaryCard({ icon: Icon, label, value }) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                <Icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
        </div>
    );
}
