import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import Select from "react-select";

import { ArrowLeft } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";

import {
    createUserInternal,
    getUserInternalById,
    updateUserInternal,
} from "../../services/api/relasi/usersInternalApi";

const roleOptions = [
    {
        value: "general_manager",
        label: "General Manager",
    },
    {
        value: "branch_manager",
        label: "Branch Manager",
    },
    {
        value: "courier",
        label: "Courier",
    },
    {
        value: "branch_staff",
        label: "Branch Staff",
    },
];

export default function UsersInternalForm() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        username: "",
        whatsapp_number: "",
        email: "",
        role: null,
        password: "",
        is_origin: false,
    });

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);

            const data = await getUserInternalById(id);

            setForm({
                name: data.name || "",
                username: data.username || "",
                whatsapp_number: data.whatsapp_number || "",
                email: data.email || "",
                role:
                    roleOptions.find(
                        (r) => r.value === data.role
                    ) || null,
                password: "",
                is_origin: data.is_origin || false,
            });
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const payload = {
                ...form,
                role: form.role?.value,
            };

            if (!payload.password) {
                delete payload.password;
            }

            if (id) {
                await updateUserInternal(id, payload);
            } else {
                await createUserInternal(payload);
            }

            navigate("/users-internal");

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh bg-gray-50 p-4">

            {/* HEADER */}
            <div className="mb-5">
                <SubPageHeader
                    title={id ? "Edit User" : "Tambah User"}
                    leftAction={
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-lg hover:bg-gray-200"
                        >
                            <ArrowLeft size={18} />
                        </button>
                    }
                />
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-4 rounded-2xl shadow-sm space-y-4"
            >

                <input
                    placeholder="Nama"
                    value={form.name}
                    onChange={(e) =>
                        handleChange("name", e.target.value)
                    }
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                />

                <input
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) =>
                        handleChange("username", e.target.value)
                    }
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                />

                <input
                    placeholder="Nomor WhatsApp"
                    value={form.whatsapp_number}
                    onChange={(e) =>
                        handleChange(
                            "whatsapp_number",
                            e.target.value
                        )
                    }
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                />

                <input
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                        handleChange("email", e.target.value)
                    }
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                />

                <Select
                    placeholder="Pilih Role"
                    options={roleOptions}
                    value={form.role}
                    onChange={(val) =>
                        handleChange("role", val)
                    }
                />

                <input
                    placeholder={
                        id
                            ? "Password baru (opsional)"
                            : "Password"
                    }
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                        handleChange("password", e.target.value)
                    }
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                />

                {/* SWITCH */}
                <label className="flex items-center justify-between border rounded-xl px-3 py-3">

                    <div>
                        <div className="text-sm font-medium text-gray-700">
                            Gudang Asal?
                        </div>
                    </div>

                    <input
                        type="checkbox"
                        checked={form.is_origin}
                        onChange={(e) =>
                            handleChange(
                                "is_origin",
                                e.target.checked
                            )
                        }
                        className="w-4 h-4"
                    />

                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2 rounded-xl text-sm shadow-md hover:opacity-90"
                >
                    {loading ? "Menyimpan..." : "Simpan"}
                </button>

            </form>
        </div>
    );
}