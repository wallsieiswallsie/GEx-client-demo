import { lazy } from 'react';
import MobileAppLayout from '../layouts/MobileAppLayout';
import ProtectedRoute from '../components/ProtectedRoute';

import OperasionalPage from "../pages/operasional/OperasionalPage";
import LogistikPage from "../pages/logistik/LogistikPage";
import KeuanganPage from "../pages/keuangan/KeuanganPage";
import RelasiPage from "../pages/relasi/RelasiPage";
import CMSPage from "../pages/cms/CMSPage";

const HomeContainer = lazy(() => import('../pages/Home/HomeContainer'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

export const homeRoutes = [
  {
    element: (
      <ProtectedRoute>
        <MobileAppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/home',
        element: <HomeContainer />,
      },
      {
        path: "/operasional",
        element: <OperasionalPage />
      },
      {
        path: "/logistik",
        element: <LogistikPage />
      },
      {
        path: "/keuangan",
        element: <KeuanganPage />
      },
      {
        path: "/relasi",
        element: <RelasiPage />
      },
      {
        path: "/cms",
        element: <CMSPage />
      },
      {
        path: "/profil",
        element: <ProfilePage />
      },
    ],
  },
];
