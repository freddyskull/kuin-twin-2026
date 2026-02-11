import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api-client';
import type { Company } from '../stores/companies.store';

export const companiesKeys = {
  all: ['companies'] as const,
  detail: (id: string) => ['companies', id] as const,
};

export const useCompanies = () => {
  return useQuery({
    queryKey: companiesKeys.all,
    queryFn: async () => {
      const { data } = await api.get<Company[]>('/companies');
      return data;
    },
  });
};

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: companiesKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<Company>(`/companies/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCompany: any) => {
      const { data } = await api.post('/companies', newCompany);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companiesKeys.all });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: responseData } = await api.patch(`/companies/${id}`, data);
      return responseData;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: companiesKeys.all });
      queryClient.invalidateQueries({ queryKey: companiesKeys.detail(variables.id) });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/companies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companiesKeys.all });
    },
  });
};
