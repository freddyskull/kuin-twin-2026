import { api } from '@/lib/api';
import { ServiceDto, ReviewDto, CreateReviewDto, CategoryDto } from 'shared-types';

export const getServices = async (): Promise<ServiceDto[]> => {
  const { data } = await api.get<{ items: ServiceDto[]; total: number }>('/services?isActive=true&limit=100');
  return data.items ?? (data as unknown as ServiceDto[]);
};

// Versión paginada para scroll infinito con filtros
export const getServicesPaginated = async (params: {
  page: number;
  limit?: number;
  isActive?: boolean;
  categoryId?: string;
  search?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}): Promise<{ items: ServiceDto[]; total: number; page: number }> => {
  const limit = params.limit ?? 12;
  const { categoryId, search, lat, lng, radius } = params;
  
  let url = `/services?isActive=true&page=${params.page}&limit=${limit}`;
  if (categoryId && categoryId !== 'all') url += `&categoryId=${categoryId}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (lat && lng) url += `&lat=${lat}&lng=${lng}`;
  if (radius) url += `&radius=${radius}`;

  const { data } = await api.get<{ items: ServiceDto[]; total: number }>(url);
  return { ...data, page: params.page };
};

export const getCategories = async (): Promise<CategoryDto[]> => {
  const { data } = await api.get<CategoryDto[]>('/categories');
  return data;
};

export const getServiceBySlug = async (slug: string): Promise<ServiceDto> => {
  const { data } = await api.get<ServiceDto>(`/services/${slug}`);
  return data;
};

export const getReviews = async (serviceId: string): Promise<ReviewDto[]> => {
  const { data } = await api.get<ReviewDto[]>(`/reviews/service/${serviceId}`);
  return data;
};

export const createReview = async (review: CreateReviewDto): Promise<ReviewDto> => {
  const { data } = await api.post<ReviewDto>('/reviews', review);
  return data;
};

export const getRelatedServices = async (serviceId: string, limit: number = 4): Promise<ServiceDto[]> => {
  const { data } = await api.get<ServiceDto[]>(`/services/${serviceId}/related?limit=${limit}`);
  return data;
};

export const getNearbyServices = async (params: {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
}): Promise<ServiceDto[]> => {
  const { lat, lng, radius = 10, limit = 10 } = params;
  const { data } = await api.get<ServiceDto[]>(`/services/nearby?lat=${lat}&lng=${lng}&radius=${radius}&limit=${limit}`);
  return data;
};

export const deleteService = async (id: string): Promise<void> => {
  await api.delete(`/services/${id}`);
};
