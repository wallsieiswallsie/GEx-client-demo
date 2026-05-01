// pages/logistik/LogistikPage.jsx
import { useNavigate } from "react-router-dom";
import { MapPin, Truck, PackageCheck, Route, Ship } from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";

export default function LogistikPage() {
    const navigate = useNavigate();

    const items = [
        { label: "Gudang", path: "/gudang", icon: MapPin, color: "bg-green-100 text-green-600" },
        { label: "Rute & Ongkir", path: "/rute", icon: Route, color: "bg-orange-100 text-orange-600" },
        { label: "Ekspedisi", path: "/ekspedisi", icon: Truck, color: "bg-pink-100 text-pink-600" },
        { label: "Via", path: "/via", icon: Ship, color: "bg-violet-100 text-violet-600" },
        { label: "Item List", path: "/item-list", icon: PackageCheck, color: "bg-gray-100 text-gray-600" },
    ];

    return (
        <div className="min-h-dvh bg-gray-50 p-4">
            <SubPageHeader title="Logistik & Distribusi" />

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