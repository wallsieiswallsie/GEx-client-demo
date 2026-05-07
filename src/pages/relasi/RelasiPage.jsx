// pages/relasi/RelasiPage.jsx
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";

export default function RelasiPage() {
    const navigate = useNavigate();

    const items = [
        { label: "User Internal", path: "/users-internal", icon: Users, color: "bg-indigo-100 text-indigo-600" },
        { label: "Pelanggan", path: "/kontak-customer", icon: Users, color: "bg-teal-100 text-teal-600" },
        { label: "Kemitraan", path: "/mitra", icon: Users, color: "bg-rose-100 text-rose-600" },
    ];

    return (
        <div className="min-h-dvh bg-gray-50 p-4">
            <SubPageHeader title="Pengguna & Relasi" />

            <div className="grid grid-cols-4 gap-4">
                {items.map((f) => (
                    <button key={f.label} onClick={() => navigate(f.path)} className="flex flex-col items-center text-center">
                        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm ${f.color}`}>
                            <f.icon className="w-6 h-6" />
                        </div>
                        <span className="mt-2 text-[11px] font-medium text-gray-600">{f.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}