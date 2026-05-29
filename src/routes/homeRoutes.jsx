import { lazy } from 'react';
import MobileAppLayout from '../layouts/MobileAppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { INTERNAL_ROLES } from '../utils/roleAccess';

import OperasionalPage from "../pages/operasional/OperasionalPage";
import LogistikPage from "../pages/logistik/LogistikPage";
import KeuanganPage from "../pages/keuangan/KeuanganPage";
import RelasiPage from "../pages/relasi/RelasiPage";
import CMSPage from "../pages/cms/CMSPage";
import InstagramContentPage from "../pages/cms/InstagramContentPage";
import CustomerShipSchedulesPage from "../pages/customer/CustomerShipSchedulesPage";
import CustomerBranchesPage from "../pages/customer/CustomerBranchesPage";
import PaketkuPage from "../pages/customer/PaketkuPage";
import CustomerPackageDetailPage from "../pages/customer/CustomerPackageDetailPage";
import CustomerShippingRatePage from "../pages/customer/CustomerShippingRatePage";
import CustomerPartnershipPage from "../pages/customer/CustomerPartnershipPage";
import CustomerContentPage from "../pages/customer/CustomerContentPage";
import HelpPage from "../pages/customer/HelpPage";
import HelpDetailPage from "../pages/customer/HelpDetailPage";
import HelpManagementPage from "../pages/internal/HelpManagementPage";
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

const internalOnly = (element) => (
  <ProtectedRoute allowedRoles={INTERNAL_ROLES}>{element}</ProtectedRoute>
);

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
        path: '/beranda',
        element: <HomeContainer />,
      },
      {
        path: "/operasional",
        element: internalOnly(<OperasionalPage />)
      },
      {
        path: "/logistik",
        element: internalOnly(<LogistikPage />)
      },
      {
        path: "/keuangan",
        element: internalOnly(<KeuanganPage />)
      },
      {
        path: "/payment-methods",
        element: internalOnly(<PaymentMethodPage />)
      },
      {
        path: "/cash-settlements",
        element: internalOnly(<CashSettlementsPage />)
      },
      {
        path: "/cash-settlements/new",
        element: internalOnly(<CashSettlementsPage mode="new" />)
      },
      {
        path: "/cash-settlements/branch-manager/new",
        element: internalOnly(<CashSettlementsPage mode="branch-manager-new" />)
      },
      {
        path: "/cash-settlements/:id/select",
        element: internalOnly(<CashSettlementsPage mode="select" />)
      },
      {
        path: "/cash-settlements/:id",
        element: internalOnly(<CashSettlementsPage mode="detail" />)
      },
      {
        path: "/invoice",
        element: internalOnly(<InvoiceDashboardPage />)
      },
      {
        path: "/invoice/list",
        element: internalOnly(<InvoiceListPage />)
      },
      {
        path: "/invoice/create",
        element: internalOnly(<CreateInvoicePage />)
      },
      {
        path: "/invoice/:id/payment",
        element: internalOnly(<UploadInvoicePaymentPage />)
      },
      {
        path: "/invoice/:id/receipt",
        element: internalOnly(<UploadInvoiceReceiptPage />)
      },
      {
        path: "/invoice/:id",
        element: internalOnly(<InvoiceDetailPage />)
      },
      {
        path: "/relasi",
        element: internalOnly(<RelasiPage />)
      },
      {
        path: "/cms",
        element: internalOnly(<CMSPage />)
      },
      {
        path: "/cms/instagram",
        element: internalOnly(<InstagramContentPage />)
      },
      {
        path: "/cms/:section",
        element: internalOnly(<CMSPage />)
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
        path: "/konten",
        element: <CustomerContentPage />
      },
      {
        path: "/bantuan",
        element: <HelpPage />
      },
      {
        path: "/bantuan/:faqId",
        element: <HelpDetailPage />
      },
      {
        path: "/internal/help",
        element: internalOnly(<HelpManagementPage />)
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
