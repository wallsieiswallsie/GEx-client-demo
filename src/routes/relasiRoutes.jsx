import ProtectedRoute from "../components/ProtectedRoute";
import MobileAppLayout from "../layouts/MobileAppLayout";

import UsersInternalPage from "../pages/relasi/UsersInternalPage";
import UsersInternalForm from "../pages/relasi/UsersInternalForm";

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
        ],
    },
];