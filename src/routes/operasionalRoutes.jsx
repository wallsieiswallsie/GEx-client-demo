import ProtectedRoute from "../components/ProtectedRoute";
import MobileAppLayout from "../layouts/MobileAppLayout";
import { INTERNAL_ROLES } from "../utils/roleAccess";

import PackagesPage from "../pages/operasional/PackagesPage";
import PackageDetailPage from "../pages/operasional/PackageDetailPage";
import BatchSackPage from "../pages/operasional/BatchSackPage";
import BatchDetailPage from "../pages/operasional/BatchDetailPage";
import SackDetailPage from "../pages/operasional/SackDetailPage";
import MispackedPackageDetailPage from "../pages/operasional/MispackedPackageDetailPage";
import UnpackedPackagesPage from "../pages/operasional/UnpackedPackagesPage";
import MispackedPackagesPage from "../pages/operasional/MispackedPackagesPage";
import ProblematicConfirmationPage from "../pages/operasional/ProblematicConfirmationPage";
import XrayFailedPackagesPage from "../pages/operasional/XrayFailedPackagesPage";

export const operasionalRoutes = [
    {
        element: (
            <ProtectedRoute allowedRoles={INTERNAL_ROLES}>
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
                path: "/belum-packing",
                element: <UnpackedPackagesPage />,
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
            {
                path: "/mispacked-packages",
                element: <MispackedPackagesPage />,
            },
            {
                path: "/problematic-confirmations",
                element: <ProblematicConfirmationPage />,
            },
            {
                path: "/xray-failed-packages",
                element: <XrayFailedPackagesPage />,
            },
        ],
    },
];
