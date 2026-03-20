import axios from 'axios';

// Detect if we are on the server to use the internal Docker network URL
const isServer = typeof window === 'undefined';
const DEFAULT_API_URL = isServer ? 'http://api:3001/api' : '/api';

// On the server, we MUST use an absolute URL. 
// If NEXT_PUBLIC_API_URL is relative (starts with /), we ignore it on the server.
const API_URL = (isServer && process.env.NEXT_PUBLIC_API_URL?.startsWith('/')) 
  ? DEFAULT_API_URL 
  : (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token if exists (in case we need auth later)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem('token');
      
      // Fallback: tratar de buscarlo en el persist de zustand si no está directo
      if (!token) {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          try {
            const parsed = JSON.parse(authStorage);
            token = parsed.state?.token;
          } catch (e) {}
        }
      }

      if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
