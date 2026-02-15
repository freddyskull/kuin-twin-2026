import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'ui-components';
import { ProtectedRoute } from './components/protected-route';
import { MainLayout } from './components/main-layout';

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-dashboard-bg">
    <div className="text-white text-xl font-bold animate-pulse">Cargando...</div>
  </div>
);

// Auth Pages (Lazy Loading - Rule 11)
const LoginPage = lazy(() => import('./features/auth').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./features/auth').then(m => ({ default: m.RegisterPage })));

// Feature Pages (Lazy Loading - Rule 11)
const DashboardPage = lazy(() => import('./features/dashboard').then(m => ({ default: m.DashboardPage })));
const ServicesPage = lazy(() => import('./features/products').then(m => ({ default: m.ServicesPage })));
const CreateServicePage = lazy(() => import('./features/products').then(m => ({ default: m.CreateServicePage })));
const EditServicePage = lazy(() => import('./features/products').then(m => ({ default: m.EditServicePage })));

// Companies (Lazy Loading - Rule 11)
const CompaniesPage = lazy(() => import('./features/companies').then(m => ({ default: m.CompaniesPage })));
const CreateCompanyPage = lazy(() => import('./features/companies').then(m => ({ default: m.CreateCompanyPage })));
const EditCompanyPage = lazy(() => import('./features/companies').then(m => ({ default: m.EditCompanyPage })));

const App: React.FC = () => {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes (only accessible if NOT authenticated) */}
          <Route element={<ProtectedRoute requireAuth={false} />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Private Routes (only accessible if authenticated) */}
          <Route element={<ProtectedRoute requireAuth={true} allowedRoles={['ADMIN', 'VENDOR']} />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />

              {/* Services */}
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/create" element={<CreateServicePage />} />
              <Route path="/services/:id/edit" element={<EditServicePage />} />

              {/* Companies */}
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/companies/create" element={<CreateCompanyPage />} />
              <Route path="/companies/:id/edit" element={<EditCompanyPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
};

export default App;
