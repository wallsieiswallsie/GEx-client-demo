import ProtectedRoute from "../components/ProtectedRoute";
import MobileAppLayout from "../layouts/MobileAppLayout";

import PackagesPage from "../pages/operasional/PackagesPage";
import PackageDetailPage from "../pages/operasional/PackageDetailPage";
import BatchSackPage from "../pages/operasional/BatchSackPage";
import BatchDetailPage from "../pages/operasional/BatchDetailPage";
import SackDetailPage from "../pages/operasional/SackDetailPage";
import MispackedPackageDetailPage from "../pages/operasional/MispackedPackageDetailPage";

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
            {
                path: "/kloter/:batchType/:batchId",
                element: <BatchDetailPage />,
            },
            {
                path: "/kloter/:batchType/:batchId/sacks/:sackId",
                element: <SackDetailPage />,
            },
            {
                path: "/mispacked-packages/:id",
                element: <MispackedPackageDetailPage />,
            },
        ],
    },
];
