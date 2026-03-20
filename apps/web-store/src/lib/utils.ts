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
  if (path.startsWith('blob:')) return path;
  
  // Usar la variable de entorno o fallback a la raíz actual (puerto 80)
  const apiUrl = (typeof window !== 'undefined' && window.location.origin) || process.env.NEXT_PUBLIC_API_URL || '';
  
  // Asegurar que no haya doble slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Si la URL termina en /api, la limpiamos para servir archivos estáticos desde la raíz del dominio
  const cleanApiUrl = apiUrl.replace(/\/api$/, '');
  
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
