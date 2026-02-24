import { api } from '@/lib/api';
import { ServiceDto, ReviewDto, CreateReviewDto } from 'shared-types';

export const getServices = async (): Promise<ServiceDto[]> => {
  const { data } = await api.get<ServiceDto[]>('/services?isActive=true');
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
