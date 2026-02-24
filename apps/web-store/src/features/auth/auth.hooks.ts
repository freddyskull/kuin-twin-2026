import { useMutation } from '@tanstack/react-query';
import { login, register, AuthResponse } from './auth.api';
import { useAuthStore } from './auth.store';
import { LoginDto, RegisterDto } from 'shared-types';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginDto) => login(data),
    onSuccess: (response: AuthResponse) => {
      setAuth(response.user, response.access_token);
      router.push('/');
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterDto) => register(data),
    onSuccess: (response: AuthResponse) => {
      setAuth(response.user, response.access_token);
      router.push('/');
    },
  });
};
