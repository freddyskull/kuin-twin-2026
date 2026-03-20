import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getServices, 
  getServicesPaginated, 
  getServiceBySlug, 
  getReviews, 
  createReview, 
  getRelatedServices,
  getNearbyServices,
  getCategories
} from './services.api';
import { CreateReviewDto } from 'shared-types';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });
};

// Hook de scroll infinito — devuelve páginas acumuladas
export const useInfiniteServices = (filters: { limit?: number; categoryId?: string; search?: string } = {}) => {
  const { limit = 12, categoryId, search } = filters;
  
  return useInfiniteQuery({
    queryKey: ['services', 'infinite', limit, categoryId, search],
    queryFn: ({ pageParam }) => getServicesPaginated({ 
      page: pageParam as number, 
      limit,
      categoryId,
      search 
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.items.length, 0);
      return loaded < lastPage.total ? lastPage.page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useServiceBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['services', slug],
    queryFn: () => getServiceBySlug(slug),
    enabled: !!slug,
  });
};

export const useReviews = (serviceId: string) => {
  return useQuery({
    queryKey: ['reviews', serviceId],
    queryFn: () => getReviews(serviceId),
    enabled: !!serviceId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (review: CreateReviewDto) => createReview(review),
    onSuccess: (_, variables) => {
      // Invalidar reviews del servicio y el detalle del servicio para actualizar el promedio
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.serviceId] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useRelatedServices = (serviceId: string, limit: number = 4) => {
  return useQuery({
    queryKey: ['services', serviceId, 'related'],
    queryFn: () => getRelatedServices(serviceId, limit),
    enabled: !!serviceId,
  });
};

export const useNearbyServices = (params: { lat: number; lng: number; radius?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['services', 'nearby', params.lat, params.lng, params.radius, params.limit],
    queryFn: () => getNearbyServices(params),
    enabled: !!params.lat && !!params.lng,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};
