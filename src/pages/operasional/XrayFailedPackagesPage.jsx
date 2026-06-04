import { useCallback, useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    Loader2,
    Plus,
    Receipt,
    Route,
    Search,
    Trash2,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import Button from "../../components/common/Button";
import { LoadingState } from "../../components/common/Loading";
import { useAuth } from "../../context/useAuth";
import {
    bulkMarkPackagesXrayFailed,
    getXrayFailedPackages,
} from "../../services/api/operasional/packagesApi";
import { getAllShipmentRoutes } from "../../services/api/logistik/shipmentRouteApi";

const emptyReceipt = () => ({ id: `${Date.now()}-${Math.random()}`, value: "" });

export default function XrayFailedPackagesPage() {
    const { user, role } = useAuth();
    const [receipts, setReceipts] = useState([emptyReceipt()]);
    const [routeCode, setRouteCode] = useState("");
    const [jenisBarang, setJenisBarang] = useState("");
    const [routes, setRoutes] = useState([]);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [loadingList, setLoadingList] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState("");

    const canAccess =
        role === "general_manager" ||
        (role === "branch_staff" && user?.is_origin === true);

    const normalizedReceipts = useMemo(
        () => receipts.map((item) => item.value.trim()).filter(Boolean),
        [receipts]
    );

    const hasDuplicateReceipt =
        new Set(normalizedReceipts.map((resi) => resi.toLowerCase())).size !==
        normalizedReceipts.length;

    const submitDisabled =
        normalizedReceipts.length === 0 ||
        hasDuplicateReceipt ||
        !routeCode ||
        !jenisBarang.trim() ||
        submitting;

    const fetchList = useCallback(async (keyword = "") => {
        try {
            setLoadingList(true);

            const data = await getXrayFailedPackages({
                page: 1,
                limit: 100,
                search: keyword.trim(),
            });

            setItems(data || []);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoadingList(false);
        }
    }, []);

    useEffect(() => {
        if (!canAccess) return;

        const fetchInitialData = async () => {
            try {
                const [routesRes] = await Promise.all([
                    getAllShipmentRoutes(),
                    fetchList(""),
                ]);

                setRoutes(routesRes || []);
            } catch (err) {
                alert(err.message);
            }
        };

        fetchInitialData();
    }, [canAccess, fetchList]);

    useEffect(() => {
        if (!toast) return undefined;

        const timer = window.setTimeout(() => setToast(""), 3000);

        return () => window.clearTimeout(timer);
    }, [toast]);

    const addReceipt = () => {
        setReceipts((current) => [...current, emptyReceipt()]);
    };

    const removeReceipt = (id) => {
        setReceipts((current) =>
            current.length === 1
                ? current.map((item) => (item.id === id ? { ...item, value: "" } : item))
                : current.filter((item) => item.id !== id)
        );
    };

    const updateReceipt = (id, value) => {
        setReceipts((current) =>
            current.map((item) => (item.id === id ? { ...item, value } : item))
        );
    };

    const handleSubmit = async () => {
        if (submitDisabled) return;

        try {
            setSubmitting(true);

            const result = await bulkMarkPackagesXrayFailed({
                resi_list: normalizedReceipts,
                route_code: routeCode,
                jenis_barang: jenisBarang.trim(),
            });

            setToast(`${result.updated_count || 0} paket berhasil diproses`);
            setReceipts([emptyReceipt()]);
            setRouteCode("");
            setJenisBarang("");
            await fetchList("");
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!canAccess) {
        return (
            <div className="min-h-dvh bg-gray-50 p-4">
                <SubPageHeader title="Paket Gagal X-Ray" />
                <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    Anda tidak memiliki akses ke halaman ini.
                </div>
            </div>
        );
    }

    return (
        <div data-tour="origin-xray-failed" className="min-h-dvh bg-gray-50 p-4 pb-28">
            <SubPageHeader title="Paket Gagal X-Ray" />

            {toast && (
                <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-[398px] -translate-x-1/2 rounded-2xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white shadow-lg">
                    {toast}
                </div>
            )}

            <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <h2 className="text-sm font-bold text-gray-900">
                    Form Input Paket Gagal X-Ray
                </h2>

                <div className="mt-4 space-y-3">
                    {receipts.map((item, index) => (
                        <div key={item.id}>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                                Nomor Resi {index + 1}
                            </label>
                            <div className="flex gap-2">
                                <div className="relative min-w-0 flex-1">
                                    <Receipt className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        value={item.value}
                                        onChange={(event) => updateReceipt(item.id, event.target.value)}
                                        placeholder="Masukkan nomor resi"
                                        className="h-12 w-full rounded-xl bg-gray-50 pl-10 pr-3 text-sm font-semibold text-gray-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-violet-200"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeReceipt(item.id)}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition active:scale-[0.98]"
                                    aria-label="Hapus resi"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {hasDuplicateReceipt && (
                        <div className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                            Resi duplikat tidak boleh diproses.
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={addReceipt}
                        className="inline-flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700 transition active:scale-[0.98]"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah resi lain
                    </button>

                    <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-gray-500">
                            Kode Rute Baru
                        </span>
                        <select
                            value={routeCode}
                            onChange={(event) => setRouteCode(event.target.value)}
                            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-violet-200"
                        >
                            <option value="">Pilih kode rute</option>
                            {routes.map((route) => (
                                <option key={route.id} value={route.generated_route_code}>
                                    {formatRouteOption(route)}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-gray-500">
                            Jenis Barang
                        </span>
                        <input
                            value={jenisBarang}
                            onChange={(event) => setJenisBarang(event.target.value)}
                            placeholder="Contoh: Elektronik"
                            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-violet-200"
                        />
                    </label>

                    <div className="flex gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                            Semua resi yang diinputkan akan diubah ke kode rute baru dan dihitung ulang berat serta harganya.
                        </span>
                    </div>

                    <Button
                        fullWidth
                        onClick={handleSubmit}
                        disabled={submitDisabled}
                        loading={submitting}
                        loadingText="Memproses..."
                    >
                        Proses Paket Gagal X-Ray
                    </Button>
                </div>
            </section>

            <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-bold text-gray-900">
                        Daftar Paket Tidak Lolos X-Ray
                    </h2>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500">
                        {items.length}
                    </span>
                </div>

                <div className="relative mb-4">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") fetchList(event.currentTarget.value);
                        }}
                        placeholder="Cari resi atau jenis barang"
                        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-violet-200"
                    />
                </div>

                {loadingList ? (
                    <LoadingState variant="list" rows={4} />
                ) : items.length === 0 ? (
                    <div className="rounded-xl bg-gray-50 py-8 text-center text-sm text-gray-400">
                        Belum ada paket gagal X-Ray
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div
                                key={item.package_id}
                                className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700">
                                        Gagal X-Ray
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
                                        <Route className="h-3 w-3" />
                                        {item.route_code || "-"}
                                    </span>
                                </div>

                                <div className="mt-3 text-sm font-bold text-gray-900">
                                    {item.receipt || "-"}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    {item.name || "-"} • {item.jenis_barang || "-"}
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                    <InfoTile label="Via" value={item.via_name || item.via_code || "-"} />
                                    <InfoTile label="Berat Terpakai" value={`${item.used_weight || 0} kg`} />
                                    <InfoTile label="Harga" value={`Rp ${Number(item.fee || 0).toLocaleString("id-ID")}`} />
                                    <InfoTile label="Status Terakhir" value={item.is_finished ? "Selesai" : "Belum Selesai"} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function InfoTile({ label, value }) {
    return (
        <div className="rounded-xl bg-gray-50 px-3 py-2">
            <div className="text-[11px] text-gray-400">{label}</div>
            <div className="mt-1 break-words font-semibold text-gray-800">{value || "-"}</div>
        </div>
    );
}

function formatRouteOption(route) {
    const routeCode = route.generated_route_code || "-";
    const origin = route.origin_branch || "-";
    const destination = route.destination_branch || "-";
    const via = route.via || "-";

    return `${routeCode} - ${origin} -> ${destination} - ${via}`;
}
