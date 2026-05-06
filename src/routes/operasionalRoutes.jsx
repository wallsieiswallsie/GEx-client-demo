import ProtectedRoute from "../components/ProtectedRoute";
import MobileAppLayout from "../layouts/MobileAppLayout";

import PackagesPage from "../pages/operasional/PackagesPage";
import PackageDetailPage from "../pages/operasional/PackageDetailPage";

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
            {
                path: "/packages/:id",
                element: <PackageDetailPage />,
            },
        ],
    },
];