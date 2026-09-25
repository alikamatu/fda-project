import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminUsersService } from '@/services/admin-users.service';
import { ManufacturerUserParams } from '@/types/admin-users';

export const formatError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
};

export function useManufacturerUsers(params: ManufacturerUserParams) {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => AdminUsersService.getManufacturerUsers(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AdminUsersService.activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AdminUsersService.deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useApproveManufacturer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AdminUsersService.approveManufacturer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useRejectManufacturer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      AdminUsersService.rejectManufacturer(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}
