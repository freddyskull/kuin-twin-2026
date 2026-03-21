import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Hook para sincronizar un estado con el Query String de la URL.
 */
export function useQueryState<T extends string>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const value = (searchParams.get(key) as T) || defaultValue;

  const setValue = useCallback(
    (newValue: T) => {
      setSearchParams((prev) => {
        const nextParams = new URLSearchParams(prev);
        if (newValue === defaultValue || !newValue) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, newValue);
        }
        // Siempre resetear la página a 1 al cambiar un filtro o búsqueda
        // para evitar quedar en una página vacía
        if (key !== 'page') {
          nextParams.delete('page');
        }
        return nextParams;
      }, { replace: true });
    },
    [key, defaultValue, setSearchParams]
  );

  return [value, setValue];
}

/**
 * Versión específica para paginación (numérica)
 */
export function useQueryPagination(
  key: string = 'page',
  defaultPage: number = 1
): [number, (newPage: number) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get(key) || String(defaultPage), 10);

  const setPage = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        const nextParams = new URLSearchParams(prev);
        if (newPage <= 1) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, String(newPage));
        }
        return nextParams;
      }, { replace: true });
    },
    [key, setSearchParams]
  );

  return [page, setPage];
}
