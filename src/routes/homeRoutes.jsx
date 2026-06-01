import { lazy } from 'react';
import MobileAppLayout from '../layouts/MobileAppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import SEO, { NoIndexSEO } from '../components/SEO';
import { PUBLIC_SEO } from '../config/seo';
import { INTERNAL_ROLES } from '../utils/roleAccess';

import OperasionalPage from "../pages/operasional/OperasionalPage";
import LogistikPage from "../pages/logistik/LogistikPage";
import KeuanganPage from "../pages/keuangan/KeuanganPage";
import RelasiPage from "../pages/relasi/RelasiPage";
import CustomerContentManagementPage from "../pages/content/CustomerContentManagementPage";
import InstagramContentPage from "../pages/content/InstagramContentPage";
import CustomerShipSchedulesPage from "../pages/customer/CustomerShipSchedulesPage";
import CustomerBranchesPage from "../pages/customer/CustomerBranchesPage";
import PaketkuPage from "../pages/customer/PaketkuPage";
import CustomerPackageDetailPage from "../pages/customer/CustomerPackageDetailPage";
import CustomerShippingRatePage from "../pages/customer/CustomerShippingRatePage";
import CustomerPartnershipPage from "../pages/customer/CustomerPartnershipPage";
import CustomerContentPage from "../pages/customer/CustomerContentPage";
import HelpPage from "../pages/customer/HelpPage";
import HelpDetailPage from "../pages/customer/HelpDetailPage";
import HelpCategoryPage from "../pages/customer/HelpCategoryPage";
import HelpManagementPage from "../pages/internal/HelpManagementPage";
import CustomerFeedbackPage from "../pages/customer/CustomerFeedbackPage";
import FeedbackListPage from "../pages/internal/FeedbackListPage";
import FeedbackDetailPage from "../pages/internal/FeedbackDetailPage";
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
  <>
    <NoIndexSEO />
    <ProtectedRoute allowedRoles={INTERNAL_ROLES}>{element}</ProtectedRoute>
  </>
);

const generalManagerOnly = (element) => (
  <>
    <NoIndexSEO />
    <ProtectedRoute allowedRoles={["general_manager"]}>{element}</ProtectedRoute>
  </>
);

const withSeo = (seo, element) => (
  <>
    <SEO title={seo.title} description={seo.description} canonicalPath={seo.path} />
    {element}
  </>
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
        element: withSeo(PUBLIC_SEO.home, <HomeContainer />),
      },
      {
        path: '/beranda',
        element: withSeo(PUBLIC_SEO.home, <HomeContainer />),
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
        path: "/konten-customer",
        element: internalOnly(<CustomerContentManagementPage />)
      },
      {
        path: "/konten-customer/instagram",
        element: internalOnly(<InstagramContentPage />)
      },
      {
        path: "/konten-customer/:section",
        element: internalOnly(<CustomerContentManagementPage />)
      },
      {
        path: "/jadwal",
        element: withSeo(PUBLIC_SEO.shipSchedule, <CustomerShipSchedulesPage />)
      },
      {
        path: "/gerai",
        element: withSeo(PUBLIC_SEO.branches, <CustomerBranchesPage />)
      },
      {
        path: "/cek-ongkir",
        element: withSeo(PUBLIC_SEO.shippingRate, <CustomerShippingRatePage />)
      },
      {
        path: "/kemitraan",
        element: withSeo(PUBLIC_SEO.partnership, <CustomerPartnershipPage />)
      },
      {
        path: "/konten",
        element: withSeo(PUBLIC_SEO.content, <CustomerContentPage />)
      },
      {
        path: "/bantuan",
        element: withSeo(PUBLIC_SEO.help, <HelpPage />)
      },
      {
        path: "/saran-masukan",
        element: withSeo(PUBLIC_SEO.feedback, <CustomerFeedbackPage />)
      },
      {
        path: "/bantuan/:faqId",
        element: withSeo(PUBLIC_SEO.helpDetail, <HelpDetailPage />)
      },
      {
        path: "/help/category/:slug",
        element: withSeo(PUBLIC_SEO.helpCategory, <HelpCategoryPage />)
      },
      {
        path: "/internal/help",
        element: internalOnly(<HelpManagementPage />)
      },
      {
        path: "/feedbacks",
        element: generalManagerOnly(<FeedbackListPage />)
      },
      {
        path: "/feedbacks/:id",
        element: generalManagerOnly(<FeedbackDetailPage />)
      },
      {
        path: "/paketku",
        element: (
          <>
            <NoIndexSEO />
            <PaketkuPage />
          </>
        )
      },
      {
        path: "/paketku/:id",
        element: (
          <>
            <NoIndexSEO />
            <CustomerPackageDetailPage />
          </>
        )
      },
      {
        path: "/profil",
        element: (
          <>
            <NoIndexSEO />
            <ProfilePage />
          </>
        )
      },
    ],
  },
];
