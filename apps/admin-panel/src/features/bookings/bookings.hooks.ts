import { useQuery } from '@tanstack/react-query';
import { api } from 'api-client';
import type { BookingDto } from 'shared-types';

export const bookingsKeys = {
  all: (filters?: any) => ['bookings', filters] as const,
  stats: ['bookings', 'stats'] as const,
};

export const useBookings = (params?: { customerId?: string; vendorId?: string; status?: string }) => {
  return useQuery({
    queryKey: bookingsKeys.all(params),
    queryFn: async () => {
      const { data } = await api.get('/bookings', { params });
      return data as BookingDto[];
    },
  });
};

/**
 * Hook para obtener el resumen de solicitudes pendientes.
 * Retorna el número de servicios únicos que tienen pedidos pendientes.
 */
export const usePendingServicesCount = (vendorId?: string) => {
  const { data: bookings = [] } = useBookings({ vendorId, status: 'PENDING' });

  // Contar servicios únicos con pedidos pendientes
  const uniqueServices = new Set(bookings.map((b) => b.serviceId));
  return uniqueServices.size;
};
