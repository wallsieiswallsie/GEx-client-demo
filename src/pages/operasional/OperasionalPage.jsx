// pages/operasional/OperasionalPage.jsx
import { useNavigate } from "react-router-dom";
import { PackageCheck, Clock, AlertCircle, Database, Truck } from "lucide-react";

export default function OperasionalPage() {
    const navigate = useNavigate();

    const items = [
        { label: "Input Paket", path: "/input", icon: PackageCheck },
        { label: "Belum Packing", path: "/belum-packing", icon: Clock },
        { label: "Paket Bermasalah", path: "/masalah", icon: AlertCircle },
        { label: "Database Paket", path: "/database", icon: Database },
        { label: "Kloter", path: "/kloter", icon: Truck },
    ];

    return (
        <div className="p-4">
            <h1 className="font-bold mb-4">Operasional Paket</h1>

            <div className="grid grid-cols-3 gap-4">
                {items.map((f) => (
                    <button
                        key={f.label}
                        onClick={() => navigate(f.path)}
                        className="flex flex-col items-center"
                    >
                        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-100">
                            <f.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs mt-2">{f.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}