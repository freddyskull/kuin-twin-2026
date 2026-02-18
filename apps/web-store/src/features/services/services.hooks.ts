import { useQuery } from '@tanstack/react-query';
import { getServices, getServiceBySlug } from './services.api';

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
