import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Package,
    Scale,
    Truck,
    Receipt,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import FloatingActionButton from "../../components/common/FloatingActionButton";
import { useAuth } from "../../context/useAuth";
import { useHomeSummary } from "../../hooks/useHomeSummary";

import ModalFormInputPackage from "../../components/forms/ModalFormInputPackage";

import {
    getAllPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage,
} from "../../services/api/operasional/packagesApi";

import { getAllExpeditions } from "../../services/api/logistik/expeditionsApi";

import { getAllItemCategories } from "../../services/api/logistik/itemCategoriesApi";

import { getAllShipmentRoutes } from "../../services/api/logistik/shipmentRouteApi";

export default function PackagesPage() {
    const navigate = useNavigate();
    const { user, role } = useAuth();
    const { data: summaryData } = useHomeSummary();

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 10;

    const [debouncedSearch, setDebouncedSearch] =
        useState("");

    const [isOpen, setIsOpen] = useState(false);

    const [preview, setPreview] = useState(null);

    const [expeditions, setExpeditions] =
        useState([]);

    const [itemCategories, setItemCategories] =
        useState([]);

    const [routes, setRoutes] = useState([]);

    const defaultForm = {
        id: null,
        name: "",
        arrived_origin_at: "",
        receipt: "",
        expedition: "",
        length: "",
        width: "",
        height: "",
        real_weight: "",
        route_code: "",
        photo: null,
        items: [],
    };

    const [form, setForm] = useState(defaultForm);

    const isGeneralManager = role === "general_manager";
    const isBranchStaff = role === "branch_staff";
    const isOriginBranchStaff =
        isBranchStaff &&
        (
            user?.is_origin === true ||
            (
                user?.is_origin === undefined &&
                summaryData?.unpacked_packages !== null &&
                summaryData?.unpacked_packages !== undefined
            )
        );

    const canManagePackage = isGeneralManager;
    const canCreatePackage = isBranchStaff
        ? isOriginBranchStaff
        : true;

    const buildPackageFormData = (values) => {
        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("arrived_origin_at", values.arrived_origin_at);
        formData.append("receipt", values.receipt);
        formData.append("expedition", values.expedition);
        formData.append("length", values.length);
        formData.append("width", values.width);
        formData.append("height", values.height);
        formData.append("real_weight", values.real_weight);
        formData.append("route_code", values.route_code);
        formData.append("items", JSON.stringify(values.items || []));

        if (values.photo instanceof File) {
            formData.append("photo", values.photo);
        }

        return formData;
    };

    const fetchData = async ({
        currentPage = 1,
        reset = false,
    } = {}) => {
        try {
            setLoading(true);

            const res = await getAllPackages({
                page: currentPage,
                limit: LIMIT,
                search: debouncedSearch,
            });

            if (reset) {
                setData(res);
            } else {
                setData((prev) => [
                    ...prev,
                    ...res,
                ]);
            }

            setHasMore(res.length === LIMIT);

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMasterData = async () => {
        try {
            const [
                expeditionsRes,
                itemCategoriesRes,
                routesRes,
            ] = await Promise.all([
                getAllExpeditions({
                    page: 1,
                    limit: 9999,
                }),

                getAllItemCategories({
                    page: 1,
                    limit: 9999,
                }),

                getAllShipmentRoutes({
                    page: 1,
                    limit: 9999,
                }),
            ]);

            setExpeditions(
                expeditionsRes || []
            );

            setItemCategories(
                itemCategoriesRes || []
            );

            setRoutes(routesRes || []);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMasterData();
    }, []);

    useEffect(() => {
        setPage(1);

        fetchData({
            currentPage: 1,
            reset: true,
        });
    }, [debouncedSearch]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(
                search.trim().toLowerCase()
            );
        }, 300);

        return () => clearTimeout(delay);

    }, [search]);

    useEffect(() => {
        const handleScroll = () => {
            if (loading || !hasMore) return;

            const scrollTop = window.scrollY;

            const windowHeight =
                window.innerHeight;

            const fullHeight =
                document.documentElement
                    .scrollHeight;

            if (
                scrollTop + windowHeight >=
                fullHeight - 200
            ) {
                const nextPage = page + 1;

                setPage(nextPage);

                fetchData({
                    currentPage: nextPage,
                });
            }
        };

        window.addEventListener(
            "scroll",
            handleScroll
        );

        return () =>
            window.removeEventListener(
                "scroll",
                handleScroll
            );

    }, [page, loading, hasMore]);

    const openCreate = () => {
        setForm(defaultForm);

        setPreview(null);

        setIsOpen(true);
    };

    const openEdit = async (item) => {
        try {
            const detail = await getPackageById(item.id);

            setForm({
                ...detail,
                arrived_origin_at: detail.arrived_origin_at
                    ? detail.arrived_origin_at.slice(0, 10)
                    : "",
                photo: null,
                items: detail.items || [],
            });

            setPreview(detail.photo_url || null);

            setIsOpen(true);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSubmit = async () => {
        try {
            if (
                !form.name ||
                !form.receipt ||
                !form.expedition
            ) {
                alert(
                    "Data wajib belum lengkap"
                );

                return;
            }

            const formData = buildPackageFormData(form);

            if (form.id) {
                const updatedPackage = await updatePackage(
                    form.id,
                    formData
                );

                setData((prev) =>
                    prev.map((item) =>
                        item.id === updatedPackage.id
                            ? {
                                ...item,
                                ...updatedPackage,
                            }
                            : item
                    )
                );
            } else {
                await createPackage(
                    formData
                );
            }

            setIsOpen(false);

            fetchData({
                currentPage: 1,
                reset: true,
            });

        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Hapus paket ini?"))
            return;

        try {
            await deletePackage(id);

            fetchData({
                currentPage: 1,
                reset: true,
            });

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-dvh bg-gray-50 p-4">

            {/* HEADER */}
            <div className="mb-5">
                <SubPageHeader title="Packages" />
            </div>

            {/* SEARCH */}
            <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

                <input
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    placeholder="Cari paket..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                />

                {search && (
                    <button
                        onClick={() =>
                            setSearch("")
                        }
                        className="absolute right-3 top-2.5 text-gray-400 text-xs"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* LIST */}
            <div className="grid grid-cols-2 gap-3">
                {loading &&
                    data.length === 0 ? (
                    <LoadingState variant="list" rows={4} />
                ) : (
                    data.map((item) => (
                        <div
                            key={item.id}
                            onClick={() =>
                                navigate(
                                    `/packages/${item.id}`
                                )
                            }
                            className="bg-white rounded-2xl shadow-sm p-3 hover:shadow-md active:scale-[0.98] transition cursor-pointer overflow-hidden"
                        >
                            <div className="flex justify-between gap-3">

                                {/* LEFT */}
                                <div className="flex flex-col gap-2 min-w-0 flex-1">

                                    <div
                                        title={item.name || "-"}
                                        className="flex items-center gap-2 bg-violet-50 text-violet-700 px-2 py-1 rounded-lg text-xs font-medium max-w-full w-fit min-w-0"
                                    >
                                        <Package className="w-3 h-3 shrink-0" />

                                        <span className="truncate">
                                            {item.name || "-"}
                                        </span>
                                    </div>

                                    <div
                                        title={item.receipt || "-"}
                                        className="flex items-center gap-2 text-xs text-gray-600 min-w-0"
                                    >
                                        <Receipt className="w-3 h-3 shrink-0" />

                                        <span className="truncate">
                                            {item.receipt || "-"}
                                        </span>
                                    </div>

                                    <div
                                        title={item.expedition || "-"}
                                        className="flex items-center gap-2 text-xs text-gray-600 min-w-0"
                                    >
                                        <Truck className="w-3 h-3 shrink-0" />

                                        <span className="truncate">
                                            {item.expedition || "-"}
                                        </span>
                                    </div>

                                    <div
                                        title={`${item.used_weight || 0} kg`}
                                        className="flex items-center gap-2 text-xs text-gray-600 min-w-0"
                                    >
                                        <Scale className="w-3 h-3 shrink-0" />

                                        <span className="truncate">
                                            {item.used_weight || 0} kg
                                        </span>
                                    </div>

                                    <div className="mt-2 min-w-0">
                                        <div
                                            title={item.route_code || "-"}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100 max-w-full min-w-0"
                                        >
                                            <Truck className="w-3 h-3 shrink-0" />

                                            <span className="truncate">
                                                {item.route_code || "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION */}
                                {canManagePackage && (
                                    <div className="flex flex-col gap-2 border-l pl-2 shrink-0">

                                        <button
                                            onClick={(
                                                e
                                            ) => {
                                                e.stopPropagation();

                                                openEdit(
                                                    item
                                                );
                                            }}
                                            className="p-1.5 rounded-lg hover:bg-blue-50 active:scale-90 transition"
                                        >
                                            <Pencil className="w-4 h-4 text-blue-500" />
                                        </button>

                                        <button
                                            onClick={(
                                                e
                                            ) => {
                                                e.stopPropagation();

                                                handleDelete(
                                                    item.id
                                                );
                                            }}
                                            className="p-1.5 rounded-lg hover:bg-red-50 active:scale-90 transition"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* EMPTY */}
            {!loading &&
                data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                        <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>

                        Belum ada paket
                    </div>
                )}

            {/* FLOAT BUTTON */}
            {canCreatePackage && (
                <FloatingActionButton
                    onClick={openCreate}
                    ariaLabel="Tambah package"
                    title="Tambah package"
                >
                    <Plus />
                </FloatingActionButton>
            )}

            {/* MODAL */}
            {isOpen && (
                <ModalFormInputPackage
                    form={form}
                    setForm={setForm}
                    preview={preview}
                    setPreview={setPreview}
                    handleSubmit={
                        handleSubmit
                    }
                    expeditionOptions={
                        expeditions
                    }
                    itemCategoryOptions={
                        itemCategories
                    }
                    routeOptions={routes}
                    onClose={() =>
                        setIsOpen(false)
                    }
                />
            )}
        </div>
    );
}
