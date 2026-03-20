'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/auth.store';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state._hasHydrated);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Siempre validamos si hay un token, incluso si ya tenemos datos de usuario,
    // para asegurar que la sesión sigue siendo válida en el servidor.
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
    
    if (isHydrated && hasToken) {
      checkAuth();
    }
  }, [checkAuth, isHydrated]);

  // Si no ha hidratado o no ha montado, no renderizamos los children
  // para asegurar consistencia total en el primer render
  if (!isMounted || !isHydrated) {
    return null;
  }

  return <>{children}</>;
}
