import { useEffect, useMemo, useState } from "react";
import {
    Check,
    Package,
    Plane,
    Search,
    Ship,
    SlidersHorizontal,
    X,
} from "lucide-react";

import { LoadingState } from "../../components/common/Loading";
import { getShipmentBatches } from "../../services/api/invoiceApi";
import { getAllVia } from "../../services/api/logistik/viaApi";

const BATCH_LIMIT = 20;

const MONTH_NAMES = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

function getRecentMonths(total = 6) {
    const current = new Date();

    return Array.from({ length: total }, (_, index) => {
        const date = new Date(current.getFullYear(), current.getMonth() - index, 1);
        const month = String(date.getMonth() + 1).padStart(2, "0");

        return {
            value: `${date.getFullYear()}-${month}`,
            label: `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`,
        };
    });
}

function getViaIcon(code) {
    const normalized = String(code || "").toUpperCase();

    if (normalized === "K") {
        return Ship;
    }

    if (normalized === "P") {
        return Plane;
    }

    return Package;
}

export default function FilterInvoiceSheet({
    open,
    value,
    onClose,
    onApply,
    onReset,
}) {
    const monthOptions = useMemo(() => getRecentMonths(), []);
    const [shouldRender, setShouldRender] = useState(open);
    const [draft, setDraft] = useState(value);
    const [vias, setVias] = useState([]);
    const [loadingVia, setLoadingVia] = useState(false);
    const [batchSearch, setBatchSearch] = useState("");
    const [debouncedBatchSearch, setDebouncedBatchSearch] = useState("");
    const [batches, setBatches] = useState([]);
    const [batchTotal, setBatchTotal] = useState(0);
    const [batchPage, setBatchPage] = useState(1);
    const [loadingBatch, setLoadingBatch] = useState(false);

    const hasChanges = (
        draft?.month !== value?.month ||
        draft?.via_code !== value?.via_code ||
        String(draft?.batch_id || "") !== String(value?.batch_id || "")
    );

    useEffect(() => {
        if (open) {
            setShouldRender(true);
            return undefined;
        }

        const timeout = setTimeout(() => {
            setShouldRender(false);
        }, 180);

        return () => clearTimeout(timeout);
    }, [open]);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const scrollY = window.scrollY;
        const originalPosition = document.body.style.position;
        const originalTop = document.body.style.top;
        const originalLeft = document.body.style.left;
        const originalRight = document.body.style.right;
        const originalWidth = document.body.style.width;
        const originalOverflow = document.body.style.overflow;

        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.position = originalPosition;
            document.body.style.top = originalTop;
            document.body.style.left = originalLeft;
            document.body.style.right = originalRight;
            document.body.style.width = originalWidth;
            document.body.style.overflow = originalOverflow;

            window.scrollTo(0, scrollY);
        };
    }, [open]);

    useEffect(() => {
        if (open) {
            setDraft(value);
            setBatchSearch("");
        }
    }, [open, value]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const fetchVias = async () => {
            try {
                setLoadingVia(true);
                const result = await getAllVia();
                setVias(result || []);
            } catch (err) {
                alert(err.message);
            } finally {
                setLoadingVia(false);
            }
        };

        fetchVias();
    }, [open]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedBatchSearch(batchSearch.trim());
        }, 350);

        return () => clearTimeout(delay);
    }, [batchSearch]);

    const fetchBatches = async ({ page = 1, reset = true } = {}) => {
        if (!draft?.via_code) {
            setBatches([]);
            setBatchTotal(0);
            return;
        }

        try {
            setLoadingBatch(true);
            const result = await getShipmentBatches({
                via_code: draft.via_code,
                month: draft.month,
                search: debouncedBatchSearch,
                page,
                limit: BATCH_LIMIT,
            });

            const nextItems = result.batches || result.items || [];

            setBatches((prev) => (reset ? nextItems : [...prev, ...nextItems]));
            setBatchTotal(result.total || 0);
            setBatchPage(page);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoadingBatch(false);
        }
    };

    useEffect(() => {
        if (!open) {
            return;
        }

        setBatches([]);
        setBatchTotal(0);
        setBatchPage(1);
        fetchBatches({ page: 1, reset: true });
    }, [open, draft?.via_code, draft?.month, debouncedBatchSearch]);

    if (!shouldRender) {
        return null;
    }

    const selectedVia = vias.find((item) => item.code === draft.via_code);
    const selectedBatch = draft.batch;

    const selectMonth = (month) => {
        setDraft((prev) => ({
            ...prev,
            month: prev.month === month.value ? "" : month.value,
            month_label: prev.month === month.value ? "" : month.label,
            batch_id: "",
            batch: null,
        }));
    };

    const selectVia = (via) => {
        const isSame = draft.via_code === via.code;

        setDraft((prev) => ({
            ...prev,
            via_code: isSame ? "" : via.code,
            via: isSame ? null : via,
            batch_id: "",
            batch: null,
        }));
        setBatchSearch("");
    };

    const selectBatch = (batch) => {
        setDraft((prev) => ({
            ...prev,
            batch_id: prev.batch_id === batch.id ? "" : batch.id,
            batch: prev.batch_id === batch.id ? null : batch,
        }));
    };

    const resetFilters = () => {
        setDraft({
            month: "",
            month_label: "",
            via_code: "",
            via: null,
            batch_id: "",
            batch: null,
        });
        setBatchSearch("");
        onReset();
    };

    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-200 ${
                open ? "opacity-100" : "opacity-0"
            }`}
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/40" />

            <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute bottom-0 left-0 right-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-xl transition-transform duration-200 ease-out ${
                    open ? "translate-y-0" : "translate-y-full"
                }`}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-violet-600" />
                        <h2 className="text-sm font-semibold text-gray-900">Filter Invoice</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 pb-5">
                    <section>
                        <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
                            Pilih Bulan
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {monthOptions.map((month) => (
                                <button
                                    type="button"
                                    key={month.value}
                                    onClick={() => selectMonth(month)}
                                    className={`rounded-xl border px-3 py-2 text-left text-sm font-medium ${
                                        draft.month === month.value
                                            ? "border-violet-600 bg-violet-50 text-violet-700"
                                            : "border-gray-200 bg-white text-gray-700"
                                    }`}
                                >
                                    {month.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
                            Via Pengiriman
                        </div>

                        {loadingVia ? (
                            <LoadingState variant="section" text="Memuat via..." />
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {vias.map((via) => {
                                    const Icon = getViaIcon(via.code);
                                    const active = draft.via_code === via.code;

                                    return (
                                        <button
                                            type="button"
                                            key={via.id}
                                            onClick={() => selectVia(via)}
                                            className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left ${
                                                active
                                                    ? "border-violet-600 bg-violet-50 text-violet-700"
                                                    : "border-gray-200 bg-white text-gray-700"
                                            }`}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" />
                                            <span className="min-w-0 truncate text-sm font-medium">
                                                {via.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {!loadingVia && vias.length === 0 && (
                            <div className="rounded-xl border border-dashed py-5 text-center text-sm text-gray-400">
                                Belum ada data via
                            </div>
                        )}
                    </section>

                    <section>
                        <div className="mb-2 flex items-center justify-between">
                            <div className="text-xs font-semibold uppercase text-gray-500">
                                Batch Pengiriman
                            </div>
                            {selectedVia && (
                                <div className="max-w-[50%] truncate text-xs text-gray-500">
                                    {selectedVia.name}
                                </div>
                            )}
                        </div>

                        {!draft.via_code ? (
                            <div className="rounded-xl border border-dashed py-5 text-center text-sm text-gray-400">
                                Pilih via terlebih dahulu
                            </div>
                        ) : (
                            <>
                                <div className="relative mb-3">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        value={batchSearch}
                                        onChange={(e) => setBatchSearch(e.target.value)}
                                        placeholder="Cari batch..."
                                        className="w-full rounded-xl border bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    {batches.map((batch) => {
                                        const active = draft.batch_id === batch.id;

                                        return (
                                            <button
                                                type="button"
                                                key={`${batch.via_code}-${batch.id}`}
                                                onClick={() => selectBatch(batch)}
                                                className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left ${
                                                    active
                                                        ? "border-violet-600 bg-violet-50"
                                                        : "border-gray-200 bg-white"
                                                }`}
                                            >
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-semibold text-gray-900">
                                                        {batch.display_name}
                                                    </div>
                                                    <div className="mt-1 truncate text-xs text-gray-500">
                                                        {batch.batch_code}
                                                    </div>
                                                </div>
                                                {active && <Check className="h-4 w-4 shrink-0 text-violet-600" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {!loadingBatch && batches.length === 0 && (
                                    <div className="rounded-xl border border-dashed py-5 text-center text-sm text-gray-400">
                                        Batch tidak ditemukan
                                    </div>
                                )}

                                {loadingBatch && (
                                    <LoadingState variant="section" text="Memuat batch..." />
                                )}

                                {!loadingBatch && batches.length < batchTotal && (
                                    <button
                                        type="button"
                                        onClick={() => fetchBatches({ page: batchPage + 1, reset: false })}
                                        className="mt-3 w-full rounded-xl border bg-white py-2 text-sm font-medium text-gray-700"
                                    >
                                        Muat batch lain
                                    </button>
                                )}
                            </>
                        )}

                        {selectedBatch && (
                            <div className="mt-3 text-xs text-gray-500">
                                Dipilih: {selectedBatch.display_name}
                            </div>
                        )}
                    </section>
                </div>

                <div className="sticky bottom-0 z-20 border-t bg-white p-4">
                    <div className="mx-auto flex max-w-md gap-2">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="flex-1 rounded-xl border bg-white py-2.5 text-sm font-semibold text-gray-700"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={() => onApply(draft)}
                            disabled={!hasChanges}
                            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white ${
                                hasChanges
                                    ? "bg-violet-600"
                                    : "cursor-not-allowed bg-violet-300"
                            }`}
                        >
                            Terapkan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
