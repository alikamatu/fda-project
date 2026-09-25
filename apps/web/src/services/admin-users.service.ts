import { apiClient } from '@/lib/api-client';
import { ManufacturerUserParams, UsersResponse } from '@/types/admin-users';

export const AdminUsersService = {
  getManufacturerUsers: async (params: ManufacturerUserParams): Promise<UsersResponse> => {
    const queryString = new URLSearchParams(params as any).toString();
    return apiClient.get(`/users/manufacturers${queryString ? '?' + queryString : ''}`);
  },

  activateUser: async (userId: string): Promise<void> => {
    return apiClient.patch(`/users/${userId}/activate`);
  },

  deactivateUser: async (userId: string): Promise<void> => {
    return apiClient.patch(`/users/${userId}/deactivate`);
  },

  approveManufacturer: async (userId: string): Promise<void> => {
    return apiClient.patch(`/users/${userId}/approve-manufacturer`);
  },

  rejectManufacturer: async (userId: string, reason: string): Promise<void> => {
    return apiClient.patch(`/users/${userId}/reject-manufacturer`, { reason });
  },
};
