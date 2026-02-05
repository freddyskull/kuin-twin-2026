import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from 'api-client'
import type { User, Profile } from 'shared-types'

interface AuthState {
  user: User | null
  profile: Profile | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (data: any) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  updateProfile: (data: any) => Promise<void>
  
  // Helper to init state from localstorage if needed beyond persist
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      token: localStorage.getItem('token'),
      isAuthenticated: !!localStorage.getItem('token'),
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/login', credentials)
          const { access_token } = response.data
          localStorage.setItem('token', access_token)
          set({ 
            token: access_token, 
            isAuthenticated: true, 
            isLoading: false 
          })
        } catch (error: any) {
          const message = error.response?.data?.message || error.message || 'Error al iniciar sesión'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          await api.post('/users/register', data)
          set({ isLoading: false })
        } catch (error: any) {
          const message = error.response?.data?.message || error.message || 'Error al registrarse'
          set({ error: message, isLoading: false })
          throw error
        }
      },


      logout: () => {
        localStorage.removeItem('token')
        set({ 
          user: null, 
          profile: null, 
          token: null, 
          isAuthenticated: false, 
          error: null 
        })
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null })
        try {
          // Assuming there is an endpoint for creating/updating profile
          const response = await api.post('/users/profile', data)
          set({ 
            profile: response.data, 
            isLoading: false 
          })
        } catch (error: any) {
          const message = error.response?.data?.message || error.message || 'Error al actualizar perfil'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      checkAuth: async () => {
        const token = get().token // Get from state (restored by persist)
        if (!token) {
           set({ isAuthenticated: false, token: null, user: null })
           return
        }
        
        // Sync token to localStorage for api-client if missing
        if (!localStorage.getItem('token')) {
          localStorage.setItem('token', token)
        }
        
        try {
           // Verify token and get current user data
           // Adjust endpoint as needed, e.g., /auth/me or /users/me
           const response = await api.get('/auth/me')
           
           // Ensure we don't store sensitive data like password even if backend sends it
           const { password, ...safeUser } = response.data.user || {}
           
           set({ 
             user: safeUser as User, 
             profile: response.data.profile,
             isAuthenticated: true,
             token
           })
        } catch (error) {
           // Valid token but maybe expired or invalid on server
           // localStorage.removeItem('token') // Handled by state update
           set({ isAuthenticated: false, token: null, user: null })
        }
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ token: state.token }), // Only persist token
    }
  )
)
