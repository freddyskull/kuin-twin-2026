/// <reference types="vite/client" />
import axios from 'axios';

// Default API URL that can be overridden by environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and force logout on any 401 error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        
        // Prevent infinite redirect loops if we're already on login/auth pages
        const isAuthPage = window.location.pathname.includes('/login') || 
                          window.location.pathname.includes('/auth');
        
        if (!isAuthPage) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
