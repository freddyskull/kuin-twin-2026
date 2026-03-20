import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { disconnectSocket } from '@/lib/socket';

// Usamos una instancia local o compartida para evitar conflictos de import.meta en Next.js
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
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
        // Obtenemos el token del estado (que ya fue hidratado por persist)
        // o del localStorage como fallback seguro
        const token = get().token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
        
        if (!token) return;

        try {
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const { user } = response.data;
          set({ user, token, isAuthenticated: true });
        } catch (error) {
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
