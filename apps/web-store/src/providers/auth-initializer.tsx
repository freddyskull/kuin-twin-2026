'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/auth.store';

export function AuthInitializer() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state._hasHydrated);

  useEffect(() => {
    // Solo validamos si la tienda ya terminó de hidratarse desde localStorage
    if (isHydrated && !user) {
      checkAuth();
    }
  }, [checkAuth, user, isHydrated]);

  return null;
}
