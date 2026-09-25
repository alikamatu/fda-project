import { apiClient } from '@/lib/api-client';

export interface AdminStats {
  totalVerifications: number;
  validVerifications: number;
  fakeVerifications: number;
  expiredVerifications: number;
  registeredManufacturers: number;
  totalProducts: number;
  activeUsers: number;
}

export const AdminDashboardService = {
  async getStats(): Promise<AdminStats> {
    return apiClient.get<AdminStats>('/admin/dashboard/stats');
  },
};
