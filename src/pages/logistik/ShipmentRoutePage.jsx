import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    X,
    MapPin,
    ArrowRight,
} from "lucide-react";
import Select from "react-select";

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
    deletePricingRule,
} from "../../services/api/logistik/shipmentPricingRuleApi";

import { getAllBranches } from "../../services/api/logistik/branchApi";
import { getAllVia } from "../../services/api/logistik/viaApi";

export default function ShipmentRoutePage() {
    const [routes, setRoutes] = useState([]);
    const [branches, setBranches] = useState([]);
    const [vias, setVias] = useState([]);

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    const [form, setForm] = useState({
        id: null,
        origin_branch: "",
        destination_branch: "",
        via: "",
        rules: [],
    });

    // ================= STYLE =================
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            borderRadius: "12px",
            borderColor: state.isFocused ? "#8b5cf6" : "#e5e7eb",
            boxShadow: "none",
            fontSize: "12px",
            padding: "2px",
        }),
    };

    // ================= FETCH =================
    const fetchAll = async () => {
        try {
            setLoading(true);

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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // ================= OPTIONS =================
    const branchOptions = branches.map((b) => ({
        value: b.branch_code,
        label: b.branch_code,
    }));

    const viaOptions = vias.map((v) => ({
        value: v.code,
        label: `${v.name} (${v.code})`,
    }));

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
        try {
            const rules = await getPricingRulesByRoute(route.id);

            setForm({
                ...route,
                rules,
            });

            setIsOpen(true);
        } catch (err) {
            alert(err.message);
        }
    };

    // ================= RULE HANDLER =================
    const addRule = () => {
        setForm({
            ...form,
            rules: [
                ...form.rules,
                {
                    min_weight: "",
                    max_weight: "",
                    pricing_type: "PER_KG",
                    price: "",
                    step_weight: "",
                    step_price: "",
                },
            ],
        });
    };

    const updateRule = (index, key, value) => {
        const newRules = [...form.rules];
        newRules[index][key] = value;
        setForm({ ...form, rules: newRules });
    };

    const removeRule = async (index) => {
        const rule = form.rules[index];

        if (rule.id) {
            await deletePricingRule(rule.id);
        }

        const newRules = [...form.rules];
        newRules.splice(index, 1);

        setForm({ ...form, rules: newRules });
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

            if (!payload.origin_branch || !payload.destination_branch || !payload.via) {
                alert("Semua field route wajib diisi");
                return;
            }

            if (form.id) {
                await updateShipmentRoute(form.id, payload);
            } else {
                const res = await createShipmentRoute(payload);
                routeId = res.id;
            }

            for (const rule of form.rules) {
                const payloadRule = {
                    route_id: routeId,
                    min_weight: rule.min_weight,
                    max_weight: rule.max_weight || null,
                    pricing_type: rule.pricing_type,
                    price: rule.price || null,
                    step_weight: rule.step_weight || null,
                    step_price: rule.step_price || null,
                };

                if (rule.id) {
                    await updatePricingRule(rule.id, payloadRule);
                } else {
                    await createPricingRule(payloadRule);
                }
            }

            setIsOpen(false);
            fetchAll();
        } catch (err) {
            alert(err.message);
        }
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!confirm("Hapus route ini?")) return;

        try {
            await deleteShipmentRoute(id);
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

            <div className="mb-5">
                <SubPageHeader title="Shipment Routes & Pricing" />
            </div>

            {/* SEARCH */}
            <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari route..."
                    className="w-full pl-9 py-2.5 rounded-xl border bg-white text-sm"
                />
            </div>

            {/* LIST */}
            <div className="grid grid-cols-2 gap-3">
                {loading ? (
                    <div className="text-center text-sm text-gray-400 py-10">
                        Loading...
                    </div>
                ) : (
                    filtered.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-3 rounded-xl shadow-sm flex justify-between hover:shadow-md transition"
                        >
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

                                <div className="text-[11px] text-gray-400">
                                    {item.generated_route_code}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 border-l pl-2">
                                <button onClick={() => openEdit(item)}>
                                    <Pencil size={16} className="text-blue-500" />
                                </button>

                                <button onClick={() => handleDelete(item.id)}>
                                    <Trash2 size={16} className="text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* FLOAT BUTTON */}
            <button
                onClick={openCreate}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg flex items-center justify-center hover:scale-110"
            >
                <Plus />
            </button>

            {/* MODAL */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-lg">

                        {/* HEADER */}
                        <div className="flex justify-between mb-4">
                            <h2 className="text-sm font-semibold">
                                {form.id ? "Edit Route" : "Tambah Route"}
                            </h2>
                            <button onClick={() => setIsOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* ORIGIN */}
                        <Select
                            options={branchOptions}
                            value={branchOptions.find(
                                (o) => o.value === form.origin_branch
                            )}
                            onChange={(v) =>
                                setForm({ ...form, origin_branch: v?.value || "" })
                            }
                            placeholder="Pilih Origin"
                            styles={selectStyles}
                        />

                        {/* DESTINATION */}
                        <div className="mt-2">
                            <Select
                                options={branchOptions}
                                value={branchOptions.find(
                                    (o) => o.value === form.destination_branch
                                )}
                                onChange={(v) =>
                                    setForm({
                                        ...form,
                                        destination_branch: v?.value || "",
                                    })
                                }
                                placeholder="Pilih Destination"
                                styles={selectStyles}
                            />
                        </div>

                        {/* VIA */}
                        <div className="mt-2">
                            <Select
                                options={viaOptions}
                                value={viaOptions.find(
                                    (o) => o.value === form.via
                                )}
                                onChange={(v) =>
                                    setForm({ ...form, via: v?.value || "" })
                                }
                                placeholder="Pilih Via"
                                styles={selectStyles}
                            />
                        </div>

                        {/* RULES */}
                        <div className="mt-4 space-y-2">
                            {form.rules.map((rule, i) => (
                                <div key={i} className="border p-2 rounded text-xs">

                                    <div className="grid grid-cols-3 gap-2">
                                        <input
                                            placeholder="Min"
                                            value={rule.min_weight}
                                            onChange={(e) =>
                                                updateRule(i, "min_weight", e.target.value)
                                            }
                                            className="border p-1 rounded"
                                        />

                                        <input
                                            placeholder="Max"
                                            value={rule.max_weight || ""}
                                            onChange={(e) =>
                                                updateRule(i, "max_weight", e.target.value)
                                            }
                                            className="border p-1 rounded"
                                        />

                                        <input
                                            placeholder="Price"
                                            value={rule.price || ""}
                                            onChange={(e) =>
                                                updateRule(i, "price", e.target.value)
                                            }
                                            className="border p-1 rounded"
                                        />
                                    </div>

                                    <button
                                        onClick={() => removeRule(i)}
                                        className="text-red-500 mt-1 text-[11px]"
                                    >
                                        Hapus Rule
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addRule}
                            className="mt-2 text-xs text-violet-600"
                        >
                            + Tambah Rule
                        </button>

                        {/* ACTION */}
                        <button
                            onClick={handleSubmit}
                            className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2 rounded-xl text-sm"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}