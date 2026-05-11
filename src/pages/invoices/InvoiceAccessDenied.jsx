import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import { canAccessInvoice } from "../../utils/invoiceAccess";

export default function InvoiceAccessDenied({ children }) {
    const { user, role } = useAuth();

    if (!canAccessInvoice(user, role)) {
        return <Navigate to="/home" replace />;
    }

    return children;
}
