
import { api } from 'api-client'; // Importar de librería local
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateProfileInput, Profile, User } from 'shared-types';

/**
 * Obtener el usuario actual y su perfil
 * Asumimos que /auth/me o /users/me retorna User & { profile: Profile }
 */
export const getMyProfile = async (): Promise<Profile | null> => {
  const { data } = await api.get('/auth/me'); // Ajuste: la ruta común para obtener el usuario actual
  return data.profile || null;
};

/**
 * Endpoint para crear/actualizar perfil
 * @param profileData Datos del perfil
 * @returns Perfil actualizado
 */
export const updateMyProfile = async (profileData: CreateProfileInput): Promise<Profile> => {
    // Si la lat/lng son vacías, no enviarlas o enviar undefined
    const { data } = await api.post('/users/me/profile', profileData);
    return data;
};

/**
 * Actualizar datos básicos del usuario (ej. email)
 */
export const updateMyUser = async ({ id, data }: { id: string; data: Partial<User> }): Promise<User> => {
    const { data: responseData } = await api.patch(`/users/${id}`, data);
    return responseData;
};

// Hook principal para obtener perfil
export const useMyProfile = () => {
    return useQuery({
        queryKey: ['profile', 'me'],
        queryFn: getMyProfile,
        staleTime: 5 * 60 * 1000, // 5 min cache
    });
};

// Hook para actualizar perfil
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMyProfile,
        onSuccess: (updatedProfile) => {
            // Actualizar caché de perfil
            queryClient.setQueryData(['profile', 'me'], updatedProfile);
            
            // Invalidar caché de usuario completo por si acaso
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        },
    });
};

// Hook para actualizar usuario
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMyUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
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
