import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import FloatingActionButton from "../../components/common/FloatingActionButton";
import { LoadingState } from "../../components/common/Loading";
import InvoiceAccessDenied from "./InvoiceAccessDenied";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import { getInvoices } from "../../services/api/invoiceApi";

const LIMIT = 10;

export default function InvoiceListPage() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchData = async ({ currentPage = 1, reset = false } = {}) => {
        try {
            setLoading(true);
            const res = await getInvoices({
                page: currentPage,
                limit: LIMIT,
                search,
                payment_status: paymentStatus,
            });

            if (reset) {
                setData(res.items || []);
            } else {
                setData((prev) => [...prev, ...(res.items || [])]);
            }

            setTotal(res.total || 0);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            setPage(1);
            fetchData({ currentPage: 1, reset: true });
        }, 300);

        return () => clearTimeout(delay);
    }, [search, paymentStatus]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchData({ currentPage: nextPage });
    };

    return (
        <InvoiceAccessDenied>
            <div className="min-h-dvh bg-gray-50 p-4">
                <div className="mb-5">
                    <SubPageHeader title="Daftar Invoice" />
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari invoice/customer..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                    />
                </div>

                <div className="flex gap-2 mb-4">
                    {[
                        ["", "Semua"],
                        ["unpaid", "Unpaid"],
                        ["paid", "Paid"],
                        ["canceled", "Canceled"],
                    ].map(([value, label]) => (
                        <button
                            key={value}
                            onClick={() => setPaymentStatus(value)}
                            className={`flex-1 rounded-xl py-2 text-xs font-medium border ${
                                paymentStatus === value
                                    ? "bg-violet-600 text-white border-violet-600"
                                    : "bg-white text-gray-600"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="text-sm font-semibold text-gray-800 mb-3">
                    Total {total} invoice
                </div>

                <div className="space-y-2">
                    {data.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => navigate(`/invoice/${item.id}`)}
                            className="w-full bg-white rounded-2xl shadow-sm px-3 py-3 text-left hover:shadow-md active:scale-[0.99] transition"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="font-semibold text-sm text-gray-900 truncate">
                                        {item.invoice_number}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 truncate">
                                        {item.customer_name} - {item.customer_whatsapp}
                                    </div>
                                </div>
                                <InvoiceStatusBadge value={item.payment_status} />
                            </div>

                            <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                                <span>{item.total_package || 0} paket</span>
                                <span>{Number(item.total_weight || 0).toFixed(2)} kg</span>
                                <span>Rp {Number(item.total_amount || 0).toLocaleString("id-ID")}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {!loading && data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                        <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
                        Belum ada invoice
                    </div>
                )}

                {loading && <LoadingState variant="section" text="Memuat invoice..." />}

                {!loading && data.length < total && (
                    <button
                        onClick={loadMore}
                        className="w-full mt-4 bg-white border text-gray-700 py-2 rounded-xl text-sm font-medium"
                    >
                        Muat Lagi
                    </button>
                )}

                <FloatingActionButton
                    onClick={() => navigate("/invoice/create")}
                    ariaLabel="Buat invoice"
                    title="Buat invoice"
                >
                    <Plus />
                </FloatingActionButton>
            </div>
        </InvoiceAccessDenied>
    );
}
