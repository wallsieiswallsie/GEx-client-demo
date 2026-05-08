import ProtectedRoute from "../components/ProtectedRoute";
import MobileAppLayout from "../layouts/MobileAppLayout";

import PackagesPage from "../pages/operasional/PackagesPage";
import PackageDetailPage from "../pages/operasional/PackageDetailPage";
import BatchSackPage from "../pages/operasional/BatchSackPage";

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
            {
                path: "/kloter",
                element: <BatchSackPage />,
            },
        ],
    },
];
