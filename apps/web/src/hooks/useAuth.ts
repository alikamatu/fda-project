'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { APP_ROUTES } from '@/lib/routes';
import type {
  LoginRequest,
  UserRegisterRequest,
  ManufacturerRegisterRequest,
  AuthUser,
} from '@/types/auth';

const AUTH_QUERY_KEY = ['auth', 'user'] as const;

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const user = await AuthService.getCurrentUser();
      setUser(user);
      return user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (user: AuthUser) => {
      console.log('[useLogin] Login successful:', { user });
      setUser(user);
      queryClient.setQueryData(AUTH_QUERY_KEY, user);

      // Redirect based on role
      switch (user.role) {
        case 'ADMIN':
          router.push(APP_ROUTES.ADMIN);
          break;
        case 'MANUFACTURER':
          router.push(APP_ROUTES.MANUFACTURER_PENDING);
          break;
        default:
          router.push(APP_ROUTES.VERIFY);
      }
    },
    onError: (error: Error) => {
      console.error('[useLogin] Login failed:', {
        error: error.message,
        stack: error.stack,
      });
    },
  });
}

export function useRegisterUser() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: UserRegisterRequest) => AuthService.registerUser(data),
    onSuccess: (user: AuthUser) => {
      setUser(user);
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      router.push(APP_ROUTES.VERIFY);
    },
  });
}

export function useRegisterManufacturer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: ManufacturerRegisterRequest) => AuthService.registerManufacturer(data),
    onSuccess: (result) => {
      // the service now returns { user, manufacturer }
      const { user } = result;
      // store the partially registered user so role shows correctly in UI
      setUser(user);
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      router.push(APP_ROUTES.MANUFACTURER_PENDING);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: async () => {
      AuthService.logout();
    },
    onSuccess: () => {
      clearUser();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
      router.push(APP_ROUTES.LOGIN);
    },
  });
}
