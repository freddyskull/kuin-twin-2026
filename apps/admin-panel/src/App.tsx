import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'ui-components';
import { ProtectedRoute } from './components/protected-route';
import { MainLayout } from './components/main-layout';
import { SocketListener } from './components/socket-listener';

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

// Companies
const CompaniesPage = lazy(() => import('./features/companies').then(m => ({ default: m.CompaniesPage })));
const CreateCompanyPage = lazy(() => import('./features/companies').then(m => ({ default: m.CreateCompanyPage })));
const EditCompanyPage = lazy(() => import('./features/companies').then(m => ({ default: m.EditCompanyPage })));
const ProfilePage = lazy(() => import('./features/profile').then(m => ({ default: m.ProfilePage })));
const MessagesPage = lazy(() => import('./features/messages').then(m => ({ default: m.MessagesList })));
const BookingsPage = lazy(() => import('./features/bookings').then(m => ({ default: m.BookingsPage })));

const App: React.FC = () => {
  return (
    <>
      <SocketListener />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes (only accessible if NOT authenticated) */}
          <Route element={<ProtectedRoute requireAuth={false} />}>
            <Route path="/iniciar-sesion" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
          </Route>

          {/* Private Routes (only accessible if authenticated) */}
          <Route element={<ProtectedRoute requireAuth={true} allowedRoles={['ADMIN', 'VENDOR']} />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />

              {/* Services */}
              <Route path="/servicios" element={<ServicesPage />} />
              <Route path="/servicios/crear" element={<CreateServicePage />} />
              <Route path="/servicios/:id/editar" element={<EditServicePage />} />

              {/* Companies */}
              <Route path="/empresas" element={<CompaniesPage />} />
              <Route path="/empresas/crear" element={<CreateCompanyPage />} />
              <Route path="/empresas/:id/editar" element={<EditCompanyPage />} />

              {/* Messages (Admin Only usually, but let's allow both for now) */}
              <Route path="/mensajes" element={<MessagesPage />}>
                <Route path=":userId" element={<MessagesPage />} />
              </Route>

              <Route path="/pedidos" element={<BookingsPage />} />

              {/* Profile */}
              <Route path="/perfil" element={<ProfilePage />} />
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
