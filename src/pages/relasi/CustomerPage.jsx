import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Plus,
    Pencil,
    Trash2,
    Search,
    ChevronDown,
    User,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";

import {
    getAllUsersInternal,
    deleteUserInternal,
} from "../../services/api/relasi/usersInternalApi";

export default function CustomerPage() {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [openId, setOpenId] = useState(null);

    const fetchCustomers = async () => {
        try {
            setLoading(true);

            const res = await getAllUsersInternal();

            const customers = (res || []).filter(
                (u) => u.role === "customer"
            );

            setData(customers);

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(search.toLowerCase());
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    const filteredCustomers = data.filter((u) =>
        `
        ${u.name}
        ${u.username}
        ${u.email}
        `
            .toLowerCase()
            .includes(debouncedSearch)
    );

    const toggleAccordion = (id) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this customer?")) return;

        try {
            await deleteUserInternal(id);

            fetchCustomers();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-dvh bg-gray-50 p-4">

            {/* HEADER */}
            <div className="mb-5">
                <SubPageHeader
                    title="Pelanggan"
                />
            </div>

            {/* SEARCH */}
            <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari Pelanggan..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
            </div>

            {/* LIST */}
            <div className="flex flex-col gap-3">
                {loading ? (
                    <LoadingState variant="list" rows={4} />
                ) : filteredCustomers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                        <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
                        No customer data
                    </div>
                ) : (
                    filteredCustomers.map((u) => {
                        const isOpen = openId === u.id;

                        return (
                            <div
                                key={u.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                            >

                                {/* TOP */}
                                <div className="px-4 py-3 flex justify-between items-center">

                                    <div className="flex items-center gap-3">

                                        {/* CHEVRON */}
                                        <button
                                            onClick={() => toggleAccordion(u.id)}
                                            className="p-1 rounded-md hover:bg-gray-100 transition"
                                        >
                                            <ChevronDown
                                                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>

                                        {/* ICON */}
                                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <User className="w-5 h-5" />
                                        </div>

                                        {/* TEXT */}
                                        <div>
                                            <div className="font-medium text-sm text-gray-800">
                                                {u.name}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                @{u.username}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ACTION */}
                                    <div className="flex items-center gap-2">

                                        <button
                                            onClick={() => navigate(`/users-internal-form/${u.id}`)}
                                            className="p-2 rounded-lg hover:bg-blue-50 active:scale-90 transition"
                                        >
                                            <Pencil className="w-4 h-4 text-blue-500" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 active:scale-90 transition"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>

                                    </div>
                                </div>

                                {/* DETAIL */}
                                <div
                                    className={`px-4 transition-all duration-300 overflow-hidden ${isOpen
                                        ? "max-h-96 py-3 opacity-100"
                                        : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <div className="border-t pt-3 space-y-3 text-xs text-gray-600">

                                        <div>
                                            <span className="font-medium text-gray-700">
                                                Email:
                                            </span>{" "}
                                            {u.email}
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">
                                                WhatsApp:
                                            </span>{" "}

                                            <a
                                                href={`https://wa.me/${String(u.whatsapp_number).replace(/^0/, "62")}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-emerald-600 hover:underline"
                                            >
                                                {u.whatsapp_number}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">

                                            <div className="px-2 py-1 rounded-full bg-sky-100 text-sky-700 text-[11px] font-medium">
                                                Customer
                                            </div>

                                        </div>

                                    </div>
                                </div>

                            </div>
                        );
                    })
                )}
            </div>

            {/* FLOAT BUTTON */}
            <button
                onClick={() => navigate("/users-internal-form")}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition"
            >
                <Plus />
            </button>
        </div>
    );
}
