import ProtectedRoute from "../components/ProtectedRoute";
import MobileAppLayout from "../layouts/MobileAppLayout";

import PackagesPage from "../pages/operasional/PackagesPage";

export const operasionalRoutes = [
    {
        element: (
            <ProtectedRoute>
                <MobileAppLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/input",
                element: <PackagesPage />,
            },
        ],
    },
];