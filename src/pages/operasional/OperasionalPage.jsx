// pages/operasional/OperasionalPage.jsx
import { useNavigate } from "react-router-dom";
import { PackageCheck, Clock, AlertCircle, Database, Truck } from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";

export default function OperasionalPage() {
    const navigate = useNavigate();

    const items = [
        { label: "Database Paket", path: "/input", icon: Database, color: "bg-blue-100 text-blue-600" },
        { label: "Belum Packing", path: "/belum-packing", icon: Clock, color: "bg-yellow-100 text-yellow-600" },
        { label: "Paket Bermasalah", path: "/problematic-confirmations", icon: AlertCircle, color: "bg-red-100 text-red-500" },
        { label: "Kloter", path: "/kloter", icon: Truck, color: "bg-purple-100 text-purple-600" },
    ];

    return (
        <div className="min-h-dvh bg-gray-50 p-4">
            <SubPageHeader title="Operasional Paket" />

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
