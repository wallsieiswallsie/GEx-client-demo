// pages/logistik/LogistikPage.jsx
import { useNavigate } from "react-router-dom";
import { MapPin, Truck, PackageCheck } from "lucide-react";

export default function LogistikPage() {
    const navigate = useNavigate();

    const items = [
        { label: "Gudang", path: "/gudang", icon: MapPin },
        { label: "Rute & Ongkir", path: "/rute", icon: Truck },
        { label: "Ekspedisi", path: "/ekspedisi", icon: Truck },
        { label: "Item List", path: "/item-list", icon: PackageCheck },
    ];

    return (
        <div className="p-4">
            <h1 className="font-bold mb-4">Logistik & Distribusi</h1>

            <div className="grid grid-cols-3 gap-4">
                {items.map((f) => (
                    <button key={f.label} onClick={() => navigate(f.path)}>
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