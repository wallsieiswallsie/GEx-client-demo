import ProtectedRoute from "../components/ProtectedRoute";
import MobileAppLayout from "../layouts/MobileAppLayout";
import { NoIndexSEO } from "../components/SEO";
import { INTERNAL_ROLES } from "../utils/roleAccess";

import UsersInternalPage from "../pages/relasi/UsersInternalPage";
import UsersInternalForm from "../pages/relasi/UsersInternalForm";
import CustomerPage from "../pages/relasi/CustomerPage";

export const relasiRoutes = [
    {
        element: (
            <>
                <NoIndexSEO />
                <ProtectedRoute allowedRoles={INTERNAL_ROLES}>
                    <MobileAppLayout />
                </ProtectedRoute>
            </>
        ),
        children: [
            {
                path: "/users-internal",
                element: <UsersInternalPage />,
            },
            {
                path: "/users-internal-form",
                element: <UsersInternalForm />,
            },
            {
                path: "/users-internal-form/:id",
                element: <UsersInternalForm />,
            },
            {
                path: "/kontak-customer",
                element: <CustomerPage />,
            },
        ],
    },
];
