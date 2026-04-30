import ProtectedRoute from "../components/ProtectedRoute";
import MobileAppLayout from "../layouts/MobileAppLayout";

import EkspedisiPage from "../pages/logistik/EkspedisiPage";
import GudangPage from "../pages/logistik/gudang/GudangPage";
import GudangForm from "../pages/logistik/gudang/GudangForm";

export const logistikRoutes = [
    {
        element: (
            <ProtectedRoute>
                <MobileAppLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/ekspedisi",
                element: <EkspedisiPage />,
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
        ],
    },
];