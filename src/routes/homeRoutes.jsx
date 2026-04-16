import { lazy } from 'react';
import MobileAppLayout from '../layouts/MobileAppLayout';
import ProtectedRoute from '../components/ProtectedRoute';

const HomeContainer = lazy(() => import('../pages/Home/HomeContainer'));

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
    ],
  },
];
