import ProtectedRoute from "../components/ProtectedRoute";
import MobileAppLayout from "../layouts/MobileAppLayout";

import UsersInternalPage from "../pages/relasi/UsersInternalPage";
import UsersInternalForm from "../pages/relasi/UsersInternalForm";
import CustomerPage from "../pages/relasi/CustomerPage";

export const relasiRoutes = [
    {
        element: (
            <ProtectedRoute>
                <MobileAppLayout />
            </ProtectedRoute>
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