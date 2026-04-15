import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Providers
import { AuthProvider } from "./context/AuthContext";
import { ErrorsProvider } from "./context/ErrorsContext";

// Modular Routes
import { authRoutes } from "./routes/authRoutes";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const GlobalLoadingBoundary = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
       <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
       <span className="text-gray-500 font-medium text-sm">Menyiapkan Aplikasi...</span>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <ErrorsProvider>
        <BrowserRouter>
          <Suspense fallback={<GlobalLoadingBoundary />}>
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

              {/* === PRIVATE SCALABLE ROUTES === */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <h1 className="text-2xl font-bold text-gray-800">
                      Tampilan Dashboard Sementara
                    </h1>
                  </div>
                </ProtectedRoute>
              } />

              {/* Add invoiceRoutes, logisticsRoutes here later via Array.map */}

              {/* === FALLBACK / REDIRECT === */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
              
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorsProvider>
    </AuthProvider>
  );
}
