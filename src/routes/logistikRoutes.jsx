import ProtectedRoute from "../components/ProtectedRoute";
import MobileAppLayout from "../layouts/MobileAppLayout";
import { NoIndexSEO } from "../components/SEO";
import { INTERNAL_ROLES } from "../utils/roleAccess";

import EkspedisiPage from "../pages/logistik/EkspedisiPage";
import GudangPage from "../pages/logistik/gudang/GudangPage";
import GudangForm from "../pages/logistik/gudang/GudangForm";
import ViaPage from "../pages/logistik/ViaPage";
import ShipmentRoutePage from "../pages/logistik/ShipmentRoutePage";
import ItemCategoriesPage from "../pages/logistik/ItemCategoriesPage";

export const logistikRoutes = [
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
                path: "/ekspedisi",
                element: <EkspedisiPage />,
            },
            {
                path: "/item-categories",
                element: <ItemCategoriesPage />,
            },
            {
                path: "/gudang",
                element: <GudangPage />,
            },
            {
                path: "/gudang/create",
                element: <GudangForm />,
            },
            {
                path: "/gudang/edit/:id",
                element: <GudangForm />,
            },
            {
                path: "/via",
                element: <ViaPage />,
            },
            {
                path: "/rute",
                element: <ShipmentRoutePage />,
            },
        ],
    },
];
