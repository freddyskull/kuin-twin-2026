import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api-client';

export const servicesKeys = {
  all: ['services'] as const,
  detail: (id: string) => ['services', id] as const,
  categories: ['categories'] as const,
  units: ['service-units'] as const,
};

export const useServices = () => {
  return useQuery({
    queryKey: servicesKeys.all,
    queryFn: async () => {
      const { data } = await api.get('/services');
      return data;
    },
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: servicesKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/services/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: servicesKeys.categories,
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });
};

export const useServiceUnits = () => {
  return useQuery({
    queryKey: servicesKeys.units,
    queryFn: async () => {
      const { data } = await api.get('/service-units');
      return data;
    },
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newService: any) => {
      const { data } = await api.post('/services', newService);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.all });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: responseData } = await api.patch(`/services/${id}`, data);
      return responseData;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.all });
      queryClient.invalidateQueries({ queryKey: servicesKeys.detail(variables.id) });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.all });
    },
  });
};

export const useToggleServiceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data } = await api.patch(`/services/${id}`, { isActive });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.all });
      queryClient.invalidateQueries({ queryKey: servicesKeys.detail(data.id) });
    },
  });
};

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post(`/media/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
  });
};
