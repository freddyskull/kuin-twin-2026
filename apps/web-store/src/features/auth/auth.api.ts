import { api } from '@/lib/api';
import { LoginDto, RegisterDto } from 'shared-types';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
    displayName?: string;
    avatarUrl?: string;
  };
  access_token: string;
}

export const login = async (data: LoginDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};
