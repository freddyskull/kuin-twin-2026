import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, getServiceBySlug, getReviews, createReview, getRelatedServices } from './services.api';
import { CreateReviewDto } from 'shared-types';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: getServices,
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
