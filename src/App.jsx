import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Providers
import { AuthProvider } from "./context/AuthContext";
import { ErrorsProvider } from "./context/ErrorsContext";

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
import { INTERNAL_ROLES } from "./utils/roleAccess";

import FormDaftarPaket from "./pages/FormDaftarPaket";
import TrackPackagePage from "./pages/customer/TrackPackagePage";

export default function App() {
  return (
    <AuthProvider>
      <ErrorsProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingState text="Menyiapkan Aplikasi..." />}>
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

              {/* === PRIVATE HOME ROUTES === */}
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
                  <ProtectedRoute>
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

              {/* === REDIRECT === */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="*" element={<Navigate to="/home" replace />} />

            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorsProvider>
    </AuthProvider>
  );
}
