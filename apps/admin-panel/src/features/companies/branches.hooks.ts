import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api-client';
import type { Branch } from '../stores/branches.store';

export const branchesKeys = {
  all: (companyId: string) => ['branches', companyId] as const,
};

export const useBranches = (companyId: string) => {
  return useQuery({
    queryKey: branchesKeys.all(companyId),
    queryFn: async () => {
      const { data } = await api.get<Branch[]>(`/branches/company/${companyId}`);
      return data;
    },
    enabled: !!companyId,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newBranch: any) => {
      const { data } = await api.post('/branches', newBranch);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all(data.companyId) });
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: responseData } = await api.patch(`/branches/${id}`, data);
      return responseData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all(data.companyId) });
    },
  });
};

export const useDeleteBranch = (companyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/branches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all(companyId) });
    },
  });
};
