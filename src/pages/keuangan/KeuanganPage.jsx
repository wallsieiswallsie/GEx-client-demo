// pages/keuangan/KeuanganPage.jsx
import { useNavigate } from "react-router-dom";
import { FileText, Wallet } from "lucide-react";

export default function KeuanganPage() {
    const navigate = useNavigate();

    const items = [
        { label: "Invoice", path: "/invoice", icon: FileText },
        { label: "Setoran", path: "/setoran", icon: Wallet },
    ];

    return (
        <div className="p-4">
            <h1 className="font-bold mb-4">Keuangan</h1>

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