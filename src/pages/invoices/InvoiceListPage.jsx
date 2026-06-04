import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Plus, Search, X } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import FloatingActionButton from "../../components/common/FloatingActionButton";
import { LoadingState } from "../../components/common/Loading";
import { useAuth } from "../../context/useAuth";
import InvoiceAccessDenied from "./InvoiceAccessDenied";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import FilterInvoiceSheet from "./FilterInvoiceSheet";
import { getInvoices } from "../../services/api/invoiceApi";

const LIMIT = 10;
const LIST_TOP_ID = "invoice-list-top";

function getBatchText(batches = []) {
    if (!batches.length) {
        return "";
    }

    const first = batches[0];
    const displayName = first.display_name || first.batch_code;
    const compactName = displayName?.includes("•")
        ? displayName.split("•").map((item) => item.trim()).filter(Boolean).join(" • ")
        : displayName;
    const suffix = batches.length > 1 ? ` +${batches.length - 1} batch lain` : "";

    return `${first.via_name} • ${compactName}${suffix}`;
}

function emptyFilters() {
    return {
        month: "",
        month_label: "",
        via_code: "",
        via: null,
        batch_id: "",
        batch: null,
        branch_code: "",
        branch: null,
    };
}

export default function InvoiceListPage() {
    const navigate = useNavigate();
    const { user, role } = useAuth();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [appliedFilter, setAppliedFilter] = useState(emptyFilters());
    const [filterOpen, setFilterOpen] = useState(false);
    const [branchMissing, setBranchMissing] = useState(false);
    const isGeneralManager = role === "general_manager";

    const fetchData = async ({ currentPage = 1, reset = false } = {}) => {
        try {
            setLoading(true);
            const res = await getInvoices({
                page: currentPage,
                limit: LIMIT,
                search,
                payment_status: paymentStatus,
                month: appliedFilter.month,
                via_code: appliedFilter.via_code,
                batch_id: appliedFilter.batch_id,
                branch_code: isGeneralManager ? appliedFilter.branch_code : "",
            });

            if (reset) {
                setData(res.items || []);
            } else {
                setData((prev) => [...prev, ...(res.items || [])]);
            }

            setTotal(res.total || 0);
        } catch (err) {
            if (err.message === "User belum terhubung dengan cabang aktif.") {
                setBranchMissing(true);
                return;
            }

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
    }, [search, paymentStatus, appliedFilter]);

    const activeChips = [
        appliedFilter.month && {
            key: "month",
            label: appliedFilter.month_label || appliedFilter.month,
            onRemove: () => setAppliedFilter((prev) => ({
                ...prev,
                month: "",
                month_label: "",
                batch_id: "",
                batch: null,
            })),
        },
        appliedFilter.via_code && {
            key: "via",
            label: appliedFilter.via?.name || appliedFilter.via_code,
            onRemove: () => setAppliedFilter((prev) => ({
                ...prev,
                via_code: "",
                via: null,
                batch_id: "",
                batch: null,
            })),
        },
        appliedFilter.batch_id && {
            key: "batch",
            label: appliedFilter.batch?.display_name || "Batch",
            onRemove: () => setAppliedFilter((prev) => ({
                ...prev,
                batch_id: "",
                batch: null,
            })),
        },
        isGeneralManager && appliedFilter.branch_code && {
            key: "branch",
            label: appliedFilter.branch?.branch_code || appliedFilter.branch_code,
            onRemove: () => setAppliedFilter((prev) => ({
                ...prev,
                branch_code: "",
                branch: null,
            })),
        },
    ].filter(Boolean);

    const scrollListToTop = () => {
        document.getElementById(LIST_TOP_ID)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const applyFilters = (nextFilter) => {
        setPage(1);
        setLoading(true);
        setAppliedFilter(nextFilter);
        setFilterOpen(false);
        scrollListToTop();
    };

    const resetFilters = () => {
        setPage(1);
        setLoading(true);
        setAppliedFilter(emptyFilters());
        setFilterOpen(false);
        scrollListToTop();
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchData({ currentPage: nextPage });
    };

    return (
        <InvoiceAccessDenied>
            <div id={LIST_TOP_ID} className="min-h-dvh bg-gray-50 p-4">
                <div className="mb-5">
                    <SubPageHeader
                        title="Daftar Invoice"
                        rightAction={
                            !branchMissing && (
                                <FloatingActionButton
                                    onClick={() => navigate("/invoice/create")}
                                    ariaLabel="Buat invoice"
                                    title="Buat invoice"
                                    className="hidden md:flex md:static md:h-11 md:w-11 md:shrink-0"
                                >
                                    <Plus />
                                </FloatingActionButton>
                            )
                        }
                    />
                    {role !== "general_manager" && user?.branch_code && (
                        <div className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            Cabang {user.branch_code}
                        </div>
                    )}
                </div>

                {branchMissing ? (
                    <div className="bg-white rounded-2xl p-5 text-center text-sm text-gray-500 shadow-sm">
                        Akun Anda belum terhubung dengan cabang gudang. Silakan hubungi General Manager.
                    </div>
                ) : (
                    <>

                <div className="mb-4 flex gap-2">
                    <div className="relative min-w-0 flex-1">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari invoice/customer..."
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setFilterOpen(true)}
                        className={`relative flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold ${
                            activeChips.length
                                ? "border-violet-600 bg-violet-50 text-violet-700"
                                : "border-gray-200 bg-white text-gray-700"
                        }`}
                    >
                        <Filter className="h-4 w-4" />
                        Filter
                        {activeChips.length > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] text-white">
                                {activeChips.length}
                            </span>
                        )}
                    </button>
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

                {activeChips.length > 0 && (
                    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                        {activeChips.map((chip) => (
                            <button
                                type="button"
                                key={chip.key}
                                onClick={chip.onRemove}
                                className="flex max-w-[220px] shrink-0 items-center gap-1 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700"
                            >
                                <span className="truncate">{chip.label}</span>
                                <X className="h-3 w-3 shrink-0" />
                            </button>
                        ))}
                    </div>
                )}

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

                            {getBatchText(item.shipment_batches) && (
                                <div className="mt-3 border-t border-gray-100 pt-2 text-xs font-medium text-gray-500">
                                    {getBatchText(item.shipment_batches)}
                                </div>
                            )}
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
                    className="md:hidden"
                >
                    <Plus />
                </FloatingActionButton>

                <FilterInvoiceSheet
                    open={filterOpen}
                    value={appliedFilter}
                    isGeneralManager={isGeneralManager}
                    onClose={() => setFilterOpen(false)}
                    onApply={applyFilters}
                    onReset={resetFilters}
                />
                    </>
                )}
            </div>
        </InvoiceAccessDenied>
    );
}
