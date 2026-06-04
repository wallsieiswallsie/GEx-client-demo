import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Providers
import { AuthProvider } from "./context/AuthContext";
import { ErrorsProvider } from "./context/ErrorsContext";
import { DemoProvider } from "./demo/DemoProvider";
import DemoExperience from "./demo/DemoExperience";

// Modular Routes
import { authRoutes } from "./routes/authRoutes";
import { homeRoutes } from "./routes/homeRoutes";
import { logistikRoutes } from "./routes/logistikRoutes";
import { operasionalRoutes } from "./routes/operasionalRoutes";
import { relasiRoutes } from "./routes/relasiRoutes";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import SEO, { NoIndexSEO } from "./components/SEO";
import { LoadingState } from "./components/common/Loading";
import MobileAppLayout from "./layouts/MobileAppLayout";
import { PUBLIC_SEO } from "./config/seo";
import { CUSTOMER_ROLES, INTERNAL_ROLES } from "./utils/roleAccess";

import FormDaftarPaket from "./pages/FormDaftarPaket";
import TrackPackagePage from "./pages/customer/TrackPackagePage";
import GuestRestrictionPage from "./pages/GuestRestrictionPage";

export default function App() {
  return (
    <DemoProvider>
      <AuthProvider>
        <ErrorsProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingState text="Menyiapkan Aplikasi..." />}>
              <DemoExperience>
                <Routes>

              {/* === PUBLIC AUTH ROUTES === */}
              {authRoutes.map((route, index) => (
                <Route key={index} element={route.element}>
                  {route.children.map((child, childIndex) => (
                    <Route
                      key={childIndex}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
                </Route>
              ))}

              {/* === HOME, PUBLIC CUSTOMER, AND PROTECTED APP ROUTES === */}
              {homeRoutes.map((route, index) => (
                <Route key={`home-${index}`} element={route.element}>
                  {route.children.map((child, childIndex) => (
                    <Route
                      key={childIndex}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
                </Route>
              ))}

              {logistikRoutes.map((route, index) => (
                <Route key={`logistik-${index}`} element={route.element}>
                  {route.children.map((child, childIndex) => (
                    <Route
                      key={childIndex}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
                </Route>
              ))}
              {operasionalRoutes.map((route, index) => (
                <Route key={`operasional-${index}`} element={route.element}>
                  {route.children.map((child, childIndex) => (
                    <Route
                      key={childIndex}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
                </Route>
              ))}
              {relasiRoutes.map((route, index) => (
                <Route key={`relasi-${index}`} element={route.element}>
                  {route.children.map((child, childIndex) => (
                    <Route
                      key={childIndex}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
                </Route>
              ))}

              <Route
                element={<MobileAppLayout />}
              >
                <Route
                  path="/lacak"
                  element={
                    <>
                      <SEO
                        title={PUBLIC_SEO.tracking.title}
                        description={PUBLIC_SEO.tracking.description}
                        canonicalPath={PUBLIC_SEO.tracking.path}
                      />
                      <TrackPackagePage />
                    </>
                  }
                />
              </Route>

              <Route
                element={
                  <ProtectedRoute allowedRoles={CUSTOMER_ROLES}>
                    <MobileAppLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="/daftar-paket"
                  element={
                    <>
                      <SEO
                        title={PUBLIC_SEO.registerPackage.title}
                        description={PUBLIC_SEO.registerPackage.description}
                        canonicalPath={PUBLIC_SEO.registerPackage.path}
                      />
                      <FormDaftarPaket />
                    </>
                  }
                />
              </Route>

              <Route
                path="/guest-restriction"
                element={
                  <>
                    <NoIndexSEO />
                    <GuestRestrictionPage />
                  </>
                }
              />

              {/* === LEGACY DASHBOARD === */}
              <Route path="/dashboard" element={
                <>
                  <NoIndexSEO />
                  <ProtectedRoute allowedRoles={INTERNAL_ROLES}>
                    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                      <h1 className="text-2xl font-bold text-gray-800">
                        Tampilan Dashboard Sementara
                      </h1>
                    </div>
                  </ProtectedRoute>
                </>
              } />

              {/* === FALLBACK PROTECTION === */}
              <Route
                path="*"
                element={
                  <>
                    <NoIndexSEO />
                    <ProtectedRoute>
                      <GuestRestrictionPage />
                    </ProtectedRoute>
                  </>
                }
              />

                </Routes>
              </DemoExperience>
            </Suspense>
          </BrowserRouter>
        </ErrorsProvider>
      </AuthProvider>
    </DemoProvider>
  );
}
