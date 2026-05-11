import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Search } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import Button from "../../components/common/Button";
import { LoadingState } from "../../components/common/Loading";
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
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const selectedPackages = useMemo(
        () => packages.filter((item) => form.package_ids.includes(item.id)),
        [packages, form.package_ids]
    );

    const subtotal = selectedPackages.reduce((sum, item) => sum + Number(item.fee || 0), 0);
    const totalWeight = selectedPackages.reduce((sum, item) => sum + Number(item.used_weight || 0), 0);
    const totalAmount = subtotal + Number(form.additional_fee || 0);

    const fetchPackages = async () => {
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
        setForm((prev) => ({
            ...prev,
            package_ids: prev.package_ids.includes(packageId)
                ? prev.package_ids.filter((id) => id !== packageId)
                : [...prev.package_ids, packageId],
        }));
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
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari paket tersedia..."
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                            />
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

                        {loading && <LoadingState variant="section" text="Memuat paket..." />}
                    </section>

                    <Button
                        onClick={handleSubmit}
                        fullWidth
                        loading={submitting}
                        loadingText="Membuat..."
                    >
                        Buat Invoice
                    </Button>
                </div>
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
