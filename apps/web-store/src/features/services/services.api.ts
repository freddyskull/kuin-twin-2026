import { api } from '@/lib/api';
import { ServiceDto } from 'shared-types';

export const getServices = async (): Promise<ServiceDto[]> => {
  const { data } = await api.get<ServiceDto[]>('/services');
  return data;
};

export const getServiceBySlug = async (slug: string): Promise<ServiceDto> => {
  const { data } = await api.get<ServiceDto>(`/services/${slug}`);
  return data;
};
