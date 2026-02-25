import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resuelve la URL absoluta para el servidor de API.
 * Si es una URL completa, la deja igual.
 * Si es una ruta relativa, le concatena el API URL.
 */
export function getAbsoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  // Usar la variable de entorno o fallback a localhost:3001
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  // Asegurar que no haya doble slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const cleanApiUrl = apiUrl.endsWith('/api') ? apiUrl.replace('/api', '') : apiUrl;
  
  return `${cleanApiUrl}${cleanPath}`;
}

/**
 * Formatea un número como moneda (pesos mexicanos por defecto).
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '';
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
