import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'ui-components';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';

// Auth Pages
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';

// Feature Pages
import { DashboardPage } from './features/dashboard/DashboardPage';
import { ServicesPage } from './features/products/ServicesPage';
import { CreateServicePage } from './features/products/CreateServicePage';
import { EditServicePage } from './features/products/EditServicePage';
import { CompaniesPage, CreateCompanyPage, EditCompanyPage } from './features/companies';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Public Routes (only accessible if NOT authenticated) */}
        <Route element={<ProtectedRoute requireAuth={false} />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Private Routes (only accessible if authenticated) */}
        <Route element={<ProtectedRoute requireAuth={true} />}>
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
      <Toaster />
    </>
  );
};

export default App;
