import { Navigate, useNavigate } from "react-router-dom";
import { BarChart3, CreditCard, FileText, History, ShieldCheck, Wallet } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { useAuth } from "../../context/useAuth";
import { canAccessInvoice } from "../../utils/invoiceAccess";
import { canAccessFinance } from "../../utils/financeAccess";

function MenuGrid({ items }) {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-3 gap-4">
            {items.map((item) => (
                <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-center text-center"
                >
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${item.color}`}>
                        <item.icon className="h-6 w-6" />
                    </div>
                    <span className="mt-2 text-[11px] font-medium leading-tight text-gray-600">
                        {item.label}
                    </span>
                </button>
            ))}
        </div>
    );
}

function FinanceShell({ title, subtitle, children }) {
    return (
        <div className="min-h-dvh bg-gray-50 p-4">
            <div className="mb-5">
                <SubPageHeader title="Keuangan" />
            </div>

            <section className="mb-5 rounded-2xl bg-white p-4 shadow-sm">
                <h1 className="text-sm font-bold text-gray-900">{title}</h1>
                <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
            </section>

            {children}
        </div>
    );
}

function GeneralManagerFinanceView({ canInvoice }) {
    const items = [
        canInvoice && { label: "Invoice", path: "/invoice", icon: FileText, color: "bg-amber-100 text-amber-600" },
        { label: "Payment Method", path: "/payment-methods", icon: CreditCard, color: "bg-violet-100 text-violet-600" },
        { label: "Setoran Tunai", path: "/cash-settlements", icon: Wallet, color: "bg-emerald-100 text-emerald-600" },
    ].filter(Boolean);

    return (
        <FinanceShell
            title="Monitoring Keuangan"
            subtitle="Pantau invoice, payment method, dan seluruh setoran tunai cabang."
        >
            <MenuGrid items={items} />
        </FinanceShell>
    );
}

function BranchStaffFinanceView({ canInvoice }) {
    const items = [
        canInvoice && { label: "Invoice", path: "/invoice", icon: FileText, color: "bg-amber-100 text-amber-600" },
        { label: "Ajukan Setoran Tunai", path: "/cash-settlements/new", icon: Wallet, color: "bg-emerald-100 text-emerald-600" },
        { label: "Riwayat Setoran Saya", path: "/cash-settlements", icon: History, color: "bg-sky-100 text-sky-600" },
    ].filter(Boolean);

    return (
        <FinanceShell
            title="Keuangan Cabang Destination"
            subtitle="Ajukan setoran tunai dari invoice cash yang sudah paid."
        >
            <MenuGrid items={items} />
        </FinanceShell>
    );
}

function BranchManagerFinanceView({ canInvoice }) {
    const items = [
        canInvoice && { label: "Invoice", path: "/invoice", icon: FileText, color: "bg-amber-100 text-amber-600" },
        { label: "Approval Setoran Tunai", path: "/cash-settlements?approval=1", icon: ShieldCheck, color: "bg-violet-100 text-violet-600" },
        { label: "Ajukan ke GM", path: "/cash-settlements/branch-manager/new", icon: Wallet, color: "bg-emerald-100 text-emerald-600" },
        { label: "Riwayat Setoran ke GM", path: "/cash-settlements?source_type=branch_manager_to_general_manager&mine=1", icon: History, color: "bg-sky-100 text-sky-600" },
    ].filter(Boolean);

    return (
        <FinanceShell
            title="Approval Keuangan Cabang"
            subtitle="Review pengajuan setoran tunai dan histori setoran cabang."
        >
            <MenuGrid items={items} />
        </FinanceShell>
    );
}

export default function KeuanganPage() {
    const { user, role } = useAuth();
    const canFinance = canAccessFinance(user, role);
    const canInvoice = canAccessInvoice(user, role);

    if (!canFinance) {
        return <Navigate to="/home" replace />;
    }

    if (role === "general_manager") {
        return <GeneralManagerFinanceView canInvoice={canInvoice} />;
    }

    if (role === "branch_staff") {
        return <BranchStaffFinanceView canInvoice={canInvoice} />;
    }

    if (role === "branch_manager") {
        return <BranchManagerFinanceView canInvoice={canInvoice} />;
    }

    return <Navigate to="/home" replace />;
}
