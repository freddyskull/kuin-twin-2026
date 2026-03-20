import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { disconnectSocket } from '@/lib/socket';

// Usamos una instancia local o compartida para evitar conflictos de import.meta en Next.js
const api = axios.create({
  baseURL: (typeof window !== 'undefined' && window.location.origin + '/api') || process.env.NEXT_PUBLIC_API_URL || '/api',
});

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
  displayName?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        disconnectSocket();
        set({ user: null, token: null, isAuthenticated: false });
      },
      checkAuth: async () => {
        const token = get().token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
        
        if (!token) {
          console.log('[auth.store] No token found during checkAuth');
          return;
        }

        console.log('[auth.store] Validating session with token:', token.substring(0, 10) + '...');

        try {
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const { user } = response.data;
          console.log('[auth.store] Session validated successfully for:', user.email);
          set({ user, token, isAuthenticated: true });
        } catch (error: any) {
          console.error('[auth.store] checkAuth failed:', error.response?.data || error.message);
          get().logout();
        }
      },
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      // Persistimos tanto el token como el usuario y el estado de autenticación
      // para una experiencia de usuario instantánea al recargar.
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
