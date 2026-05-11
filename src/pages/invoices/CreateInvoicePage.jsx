import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ScanLine, Search } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import Button from "../../components/common/Button";
import { LoadingState } from "../../components/common/Loading";
import ScannerModal from "../../components/modals/ScannerModal";
import InvoiceAccessDenied from "./InvoiceAccessDenied";
import {
    createInvoice,
    getAvailableInvoicePackages,
} from "../../services/api/invoiceApi";

export default function CreateInvoicePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        customer_name: "",
        customer_whatsapp: "",
        additional_fee: 0,
        package_ids: [],
    });
    const [packages, setPackages] = useState([]);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [scannerOpen, setScannerOpen] = useState(false);

    const subtotal = selectedPackages.reduce((sum, item) => sum + Number(item.fee || 0), 0);
    const totalWeight = selectedPackages.reduce((sum, item) => sum + Number(item.used_weight || 0), 0);
    const totalAmount = subtotal + Number(form.additional_fee || 0);

    const fetchPackages = async () => {
        if (!search.trim()) {
            setPackages([]);
            return;
        }

        try {
            setLoading(true);
            const res = await getAvailableInvoicePackages({
                limit: 50,
                search,
            });

            setPackages(res.items || []);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delay = setTimeout(fetchPackages, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const togglePackage = (packageId) => {
        const packageData = packages.find((item) => item.id === packageId);

        setForm((prev) => ({
            ...prev,
            package_ids: prev.package_ids.includes(packageId)
                ? prev.package_ids.filter((id) => id !== packageId)
                : [...prev.package_ids, packageId],
        }));

        setSelectedPackages((prev) => {
            if (prev.some((item) => item.id === packageId)) {
                return prev.filter((item) => item.id !== packageId);
            }

            return packageData ? [...prev, packageData] : prev;
        });
    };

    const handleSubmit = async () => {
        if (!form.customer_name.trim() || !form.customer_whatsapp.trim()) {
            alert("Customer wajib diisi");
            return;
        }

        if (form.package_ids.length === 0) {
            alert("Pilih minimal 1 paket");
            return;
        }

        try {
            setSubmitting(true);
            const invoice = await createInvoice({
                customer_name: form.customer_name,
                customer_whatsapp: form.customer_whatsapp,
                additional_fee: Number(form.additional_fee || 0),
                package_ids: form.package_ids,
            });

            navigate(`/invoice/${invoice.id}`, { replace: true });
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <InvoiceAccessDenied>
            <div className="min-h-dvh bg-gray-50 p-4">
                <div className="mb-5">
                    <SubPageHeader title="Buat Invoice" />
                </div>

                <div className="space-y-4">
                    <section className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                        <input
                            value={form.customer_name}
                            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                            placeholder="Nama customer"
                            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                        />
                        <input
                            value={form.customer_whatsapp}
                            onChange={(e) => setForm({ ...form, customer_whatsapp: e.target.value })}
                            placeholder="WhatsApp customer"
                            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                        />
                        <input
                            type="number"
                            min="0"
                            value={form.additional_fee}
                            onChange={(e) => setForm({ ...form, additional_fee: e.target.value })}
                            placeholder="Biaya tambahan"
                            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                        />
                    </section>

                    <section className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <Summary label="Paket" value={form.package_ids.length} />
                            <Summary label="Berat" value={`${totalWeight.toFixed(2)} kg`} />
                            <Summary label="Subtotal" value={`Rp ${subtotal.toLocaleString("id-ID")}`} />
                            <Summary label="Total" value={`Rp ${totalAmount.toLocaleString("id-ID")}`} />
                        </div>
                    </section>

                    <section>
                        <div className="flex gap-2 mb-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari / scan resi..."
                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                                />
                            </div>

                            <button
                                onClick={() => setScannerOpen(true)}
                                className="w-11 h-10 rounded-xl bg-white border flex items-center justify-center text-gray-600"
                                aria-label="Scan resi"
                            >
                                <ScanLine className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {packages.map((item) => {
                                const selected = form.package_ids.includes(item.id);

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => togglePackage(item.id)}
                                        className={`w-full rounded-2xl px-3 py-3 text-left shadow-sm border ${
                                            selected
                                                ? "bg-violet-50 border-violet-200"
                                                : "bg-white border-white"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-violet-600 shrink-0" />
                                                    <span className="font-semibold text-sm text-gray-800 truncate">
                                                        {item.receipt}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 truncate">
                                                    {item.name || "-"} - {item.route_code || "-"}
                                                </div>
                                            </div>
                                            <div className="text-xs text-right text-gray-600 shrink-0">
                                                <div>{Number(item.used_weight || 0).toFixed(2)} kg</div>
                                                <div>Rp {Number(item.fee || 0).toLocaleString("id-ID")}</div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {!loading && !search.trim() && (
                            <div className="bg-white rounded-2xl p-4 text-sm text-gray-400 text-center">
                                Cari atau scan resi untuk menampilkan paket.
                            </div>
                        )}

                        {!loading && search.trim() && packages.length === 0 && (
                            <div className="bg-white rounded-2xl p-4 text-sm text-gray-400 text-center">
                                Paket tidak ditemukan atau sudah masuk invoice.
                            </div>
                        )}

                        {loading && <LoadingState variant="section" text="Memuat paket..." />}
                    </section>

                    {selectedPackages.length > 0 && (
                        <section className="bg-white rounded-2xl p-4 shadow-sm">
                            <h2 className="font-semibold text-sm text-gray-900 mb-3">
                                Paket Dipilih
                            </h2>

                            <div className="space-y-2">
                                {selectedPackages.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => togglePackage(item.id)}
                                        className="w-full flex items-start justify-between gap-3 border-b pb-2 last:border-b-0 text-left"
                                    >
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-gray-800 truncate">
                                                {item.receipt}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">
                                                {item.name || "-"}
                                            </div>
                                        </div>
                                        <div className="text-xs text-red-500 shrink-0">
                                            Hapus
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    <Button
                        onClick={handleSubmit}
                        fullWidth
                        loading={submitting}
                        loadingText="Membuat..."
                    >
                        Buat Invoice
                    </Button>
                </div>

                <ScannerModal
                    open={scannerOpen}
                    onClose={() => setScannerOpen(false)}
                    onResult={(value) => {
                        setSearch(value);
                    }}
                />
            </div>
        </InvoiceAccessDenied>
    );
}

function Summary({ label, value }) {
    return (
        <div className="rounded-xl bg-gray-50 px-3 py-2">
            <div className="text-gray-400">{label}</div>
            <div className="font-semibold text-gray-800 truncate">{value}</div>
        </div>
    );
}
