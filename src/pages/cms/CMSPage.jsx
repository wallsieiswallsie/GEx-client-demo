// pages/cms/CMSPage.jsx
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";

export default function CMSPage() {
    const navigate = useNavigate();

    const items = [
        { label: "Informasi", path: "/info", icon: FileText, color: "bg-sky-100 text-sky-600" },
        { label: "Konten", path: "/konten", icon: FileText, color: "bg-cyan-100 text-cyan-600" },
    ];

    return (
        <div className="min-h-dvh bg-gray-50 p-4">
            <SubPageHeader title="Konten & CMS" />

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