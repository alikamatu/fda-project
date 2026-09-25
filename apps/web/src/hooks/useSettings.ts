'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '@/services/profile.service';
import { UpdateProfileInput, PasswordChangeInput } from '@/types/settings';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types/auth';

const PROFILE_QUERY_KEY = ['profile', 'settings'] as const;

/**
 * Hook to fetch and cache user settings
 */
export function useUserSettings() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => ProfileService.getUserSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => ProfileService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update the cache
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedUser);
      
      // Update auth store with new user data
      setUser({
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role as UserRole,
        isActive: updatedUser.isActive,
      });
    },
  });
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PasswordChangeInput) => ProfileService.changePassword(data),
  });
}

/**
 * Hook to logout from all sessions
 */
export function useLogoutAllSessions() {
  return useMutation({
    mutationFn: () => ProfileService.logoutAllSessions(),
  });
}
