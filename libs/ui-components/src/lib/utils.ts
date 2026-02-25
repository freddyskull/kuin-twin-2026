import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resuelve la URL absoluta para el servidor de API.
 * Soporta URLs completas, rutas relativas y blobs para vistas previas.
 */
export function getAbsoluteUrl(path: string | null | undefined, apiUrlFallback = 'http://localhost:3001'): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('blob:')) return path;
  
  const apiUrl = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) || apiUrlFallback;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const cleanApiUrl = apiUrl.endsWith('/api') ? apiUrl.replace('/api', '') : apiUrl;
  
  return `${cleanApiUrl}${cleanPath}`;
}

/**
 * Formatea un número como moneda (pesos mexicanos).
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '';
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(value)) return '';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
