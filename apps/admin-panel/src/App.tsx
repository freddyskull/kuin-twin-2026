import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'ui-components';
import { ProtectedRoute } from './components/protected-route';
import { MainLayout } from './components/main-layout';
import { SocketListener } from './components/socket-listener';

// Premium Galactic Loader Component
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#030303] relative overflow-hidden">
    {/* Dynamic Background Stars */}
    <div className="absolute inset-0 z-0 opacity-30">
      <div className="absolute top-[20%] left-[30%] w-1 h-1 bg-white rounded-full animate-pulse" />
      <div className="absolute top-[60%] left-[80%] w-1 h-1 bg-white rounded-full animate-pulse delay-700" />
      <div className="absolute top-[40%] left-[10%] w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-1000" />
    </div>

    <div className="relative flex items-center justify-center z-10">
      {/* Rotating Outer Ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute w-32 h-32 border-t-2 border-b-2 border-primary/30 rounded-full blur-[1px]"
      />
      
      {/* Counter-Rotating Inner Ring */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute w-24 h-24 border-l-2 border-r-2 border-primary/60 rounded-full"
      />

      {/* Central Pulsing Orb */}
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.7, 1, 0.7],
          boxShadow: [
            "0 0 20px rgba(245,192,106,0.2)",
            "0 0 50px rgba(245,192,106,0.5)",
            "0 0 20px rgba(245,192,106,0.2)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/40 relative z-20"
      >
        <span className="text-black font-black text-3xl">K</span>
      </motion.div>
    </div>

    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-12 text-center"
    >
      <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary/80 animate-pulse">
        Iniciando Inteligencia
      </h2>
      <div className="flex gap-1 justify-center mt-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        ))}
      </div>
    </motion.div>
  </div>
);

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
          {/* Redirigir siempre a web-store para login/registro si no estamos autenticados */}
          {/* ProtectedRoute ahora se encarga de la redirección externa si falta auth */}

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
