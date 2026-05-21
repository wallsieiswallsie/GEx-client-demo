import { lazy } from 'react';
import MobileAppLayout from '../layouts/MobileAppLayout';
import ProtectedRoute from '../components/ProtectedRoute';

import OperasionalPage from "../pages/operasional/OperasionalPage";
import LogistikPage from "../pages/logistik/LogistikPage";
import KeuanganPage from "../pages/keuangan/KeuanganPage";
import RelasiPage from "../pages/relasi/RelasiPage";
import CMSPage from "../pages/cms/CMSPage";
import InstagramContentPage from "../pages/cms/InstagramContentPage";
import CustomerShipSchedulesPage from "../pages/customer/CustomerShipSchedulesPage";
import CustomerBranchesPage from "../pages/customer/CustomerBranchesPage";
import CustomerTermsPage from "../pages/customer/CustomerTermsPage";
import PaketkuPage from "../pages/customer/PaketkuPage";
import CustomerPackageDetailPage from "../pages/customer/CustomerPackageDetailPage";
import CustomerShippingRatePage from "../pages/customer/CustomerShippingRatePage";
import CustomerPartnershipPage from "../pages/customer/CustomerPartnershipPage";
import InvoiceDashboardPage from "../pages/invoices/InvoiceDashboardPage";
import InvoiceListPage from "../pages/invoices/InvoiceListPage";
import CreateInvoicePage from "../pages/invoices/CreateInvoicePage";
import InvoiceDetailPage from "../pages/invoices/InvoiceDetailPage";
import UploadInvoicePaymentPage from "../pages/invoices/UploadInvoicePaymentPage";
import UploadInvoiceReceiptPage from "../pages/invoices/UploadInvoiceReceiptPage";
import PaymentMethodPage from "../pages/keuangan/PaymentMethodPage";
import CashSettlementsPage from "../pages/keuangan/CashSettlementsPage";

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
        path: "/payment-methods",
        element: <PaymentMethodPage />
      },
      {
        path: "/cash-settlements",
        element: <CashSettlementsPage />
      },
      {
        path: "/cash-settlements/new",
        element: <CashSettlementsPage mode="new" />
      },
      {
        path: "/cash-settlements/:id/select",
        element: <CashSettlementsPage mode="select" />
      },
      {
        path: "/cash-settlements/:id",
        element: <CashSettlementsPage mode="detail" />
      },
      {
        path: "/invoice",
        element: <InvoiceDashboardPage />
      },
      {
        path: "/invoice/list",
        element: <InvoiceListPage />
      },
      {
        path: "/invoice/create",
        element: <CreateInvoicePage />
      },
      {
        path: "/invoice/:id/payment",
        element: <UploadInvoicePaymentPage />
      },
      {
        path: "/invoice/:id/receipt",
        element: <UploadInvoiceReceiptPage />
      },
      {
        path: "/invoice/:id",
        element: <InvoiceDetailPage />
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
        path: "/cms/instagram",
        element: <InstagramContentPage />
      },
      {
        path: "/cms/:section",
        element: <CMSPage />
      },
      {
        path: "/jadwal",
        element: <CustomerShipSchedulesPage />
      },
      {
        path: "/gerai",
        element: <CustomerBranchesPage />
      },
      {
        path: "/cek-ongkir",
        element: <CustomerShippingRatePage />
      },
      {
        path: "/kemitraan",
        element: <CustomerPartnershipPage />
      },
      {
        path: "/bantuan",
        element: <CustomerTermsPage />
      },
      {
        path: "/paketku",
        element: <PaketkuPage />
      },
      {
        path: "/paketku/:id",
        element: <CustomerPackageDetailPage />
      },
      {
        path: "/profil",
        element: <ProfilePage />
      },
    ],
  },
];
