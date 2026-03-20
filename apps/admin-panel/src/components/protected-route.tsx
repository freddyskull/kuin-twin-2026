import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

interface ProtectedRouteProps {
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAuth = true,
  allowedRoles
}) => {
  const { isAuthenticated, user, checkAuth, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);


  useEffect(() => {
    const initAuth = async () => {
      // Solo verificamos si tenemos un token pero no tenemos datos de usuario aún
      // o si la página requiere autenticación explícita.
      if (localStorage.getItem('token') && !user) {
        await checkAuth();
      }
      setIsChecking(false);
    };
    initAuth();
  }, [checkAuth, user]);

  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        <div className="text-primary text-xl font-heading font-bold animate-pulse z-10">Verificando sesión...</div>
      </div>
    );
  }

  // Si requiere auth y no está autenticado
  if (requireAuth && !isAuthenticated) {
    // Redirección fuera de la SPA hacia la web-store (URL raíz /login)
    window.location.href = '/login';
    return null;
  }

  // Si NO requiere auth (ej: login/register) y YA está autenticado
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Verificación de roles (Regla 12 de GEMINI.md)
  if (requireAuth && allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Si no tiene el rol permitido, redirigir al dashboard o página de error
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
