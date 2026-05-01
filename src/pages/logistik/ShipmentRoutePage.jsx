import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    MapPin,
    ArrowRight,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";

import {
    getAllShipmentRoutes,
    createShipmentRoute,
    updateShipmentRoute,
    deleteShipmentRoute,
} from "../../services/api/logistik/shipmentRouteApi";

import {
    getPricingRulesByRoute,
    createPricingRule,
    updatePricingRule,
} from "../../services/api/logistik/shipmentPricingRuleApi";

import { getAllBranches } from "../../services/api/logistik/branchApi";
import { getAllVia } from "../../services/api/logistik/viaApi";

export default function ShipmentRoutePage() {
    const [routes, setRoutes] = useState([]);
    const [branches, setBranches] = useState([]);
    const [vias, setVias] = useState([]);

    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const [form, setForm] = useState({
        id: null,
        origin_branch: "",
        destination_branch: "",
        via: "",
        rules: [],
    });

    // ================= FETCH =================
    const fetchAll = async () => {
        try {
            const [routesRes, branchRes, viaRes] = await Promise.all([
                getAllShipmentRoutes(),
                getAllBranches(),
                getAllVia(),
            ]);

            setRoutes(routesRes);
            setBranches(branchRes);
            setVias(viaRes);
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // ================= OPEN =================
    const openCreate = () => {
        setForm({
            id: null,
            origin_branch: "",
            destination_branch: "",
            via: "",
            rules: [],
        });
        setIsOpen(true);
    };

    const openEdit = async (route) => {
        const rules = await getPricingRulesByRoute(route.id);

        setForm({
            ...route,
            rules,
        });

        setIsOpen(true);
    };

    // ================= SUBMIT =================
    const handleSubmit = async () => {
        try {
            let routeId = form.id;

            const payload = {
                origin_branch: form.origin_branch,
                destination_branch: form.destination_branch,
                via: form.via,
            };

            if (form.id) {
                await updateShipmentRoute(form.id, payload);
            } else {
                const res = await createShipmentRoute(payload);
                routeId = res.id;
            }

            for (const rule of form.rules) {
                if (rule.id) {
                    await updatePricingRule(rule.id, rule);
                } else {
                    await createPricingRule({
                        ...rule,
                        route_id: routeId,
                    });
                }
            }

            setIsOpen(false);
            fetchAll();
        } catch (err) {
            alert(err.message);
        }
    };

    // ================= FILTER =================
    const filtered = routes.filter((r) =>
        r.generated_route_code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-dvh bg-gray-50 p-4">

            <SubPageHeader title="Rute & Ongkir" />

            {/* SEARCH */}
            <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari rute..."
                    className="w-full pl-9 py-2.5 rounded-xl border bg-white text-sm"
                />
            </div>

            {/* LIST */}
            <div className="grid grid-cols-2 gap-3">
                {filtered.map((item) => (
                    <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm flex justify-between">

                        <div className="flex flex-col gap-2 text-xs">
                            <div className="flex items-center gap-2 font-semibold">
                                <MapPin size={14} />
                                {item.origin_branch}
                                <ArrowRight size={14} />
                                {item.destination_branch}
                            </div>

                            <div className="text-gray-500">
                                via {item.via}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 border-l pl-2">
                            <button onClick={() => openEdit(item)}>
                                <Pencil size={16} className="text-blue-500" />
                            </button>

                            <button onClick={() => deleteShipmentRoute(item.id)}>
                                <Trash2 size={16} className="text-red-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* FLOAT BUTTON */}
            <button
                onClick={openCreate}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-violet-600 text-white flex items-center justify-center"
            >
                <Plus />
            </button>

            {/* MODAL */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
                    <div className="bg-white w-full max-w-lg rounded-xl p-5">

                        {/* ORIGIN */}
                        <select
                            value={form.origin_branch}
                            onChange={(e) =>
                                setForm({ ...form, origin_branch: e.target.value })
                            }
                            className="w-full mb-2 border p-2 rounded"
                        >
                            <option value="">Pilih Origin</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.branch_code}>
                                    {b.branch_code}
                                </option>
                            ))}
                        </select>

                        {/* DESTINATION */}
                        <select
                            value={form.destination_branch}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    destination_branch: e.target.value,
                                })
                            }
                            className="w-full mb-2 border p-2 rounded"
                        >
                            <option value="">Pilih Destination</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.branch_code}>
                                    {b.branch_code}
                                </option>
                            ))}
                        </select>

                        {/* VIA */}
                        <select
                            value={form.via}
                            onChange={(e) =>
                                setForm({ ...form, via: e.target.value })
                            }
                            className="w-full mb-4 border p-2 rounded"
                        >
                            <option value="">Pilih Via</option>
                            {vias.map((v) => (
                                <option key={v.id} value={v.code}>
                                    {v.name} ({v.code})
                                </option>
                            ))}
                        </select>

                        {/* RULES */}
                        <div className="space-y-2">
                            {form.rules.map((rule, i) => (
                                <div key={i} className="border p-2 rounded text-xs">

                                    <input
                                        placeholder="Min"
                                        value={rule.min_weight}
                                        onChange={(e) =>
                                            updateRule(i, "min_weight", e.target.value)
                                        }
                                    />

                                    <input
                                        placeholder="Max"
                                        value={rule.max_weight || ""}
                                        onChange={(e) =>
                                            updateRule(i, "max_weight", e.target.value)
                                        }
                                    />

                                    <input
                                        placeholder="Price"
                                        value={rule.price || ""}
                                        onChange={(e) =>
                                            updateRule(i, "price", e.target.value)
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        <button onClick={handleSubmit} className="w-full mt-4 bg-violet-600 text-white py-2 rounded">
                            Simpan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}