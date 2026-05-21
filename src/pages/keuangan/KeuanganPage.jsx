// pages/keuangan/KeuanganPage.jsx
import { useNavigate } from "react-router-dom";
import { CreditCard, FileText, Wallet } from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";
import { useAuth } from "../../context/useAuth";
import { canAccessInvoice } from "../../utils/invoiceAccess";

export default function KeuanganPage() {
    const navigate = useNavigate();
    const { user, role } = useAuth();

    const items = [
        canAccessInvoice(user, role)
            ? { label: "Invoice", path: "/invoice", icon: FileText, color: "bg-amber-100 text-amber-600" }
            : null,
        role === "general_manager"
            ? { label: "Payment Method", path: "/payment-methods", icon: CreditCard, color: "bg-violet-100 text-violet-600" }
            : null,
        { label: "Setoran", path: "/setoran", icon: Wallet, color: "bg-lime-100 text-lime-600" },
    ].filter(Boolean);

    return (
        <div className="min-h-dvh bg-gray-50 p-4">
            <SubPageHeader title="Keuangan" />

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
