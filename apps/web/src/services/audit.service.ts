import { apiClient } from '@/lib/api-client';
import { AuditLogsResponse, AuditLogsFilter } from '@/types/audit';

export const AuditService = {
  async getLogs(filters: AuditLogsFilter = {}): Promise<AuditLogsResponse> {
    const params = new URLSearchParams();
    
    if (filters.action) params.append('action', filters.action);
    if (filters.search) params.append('search', filters.search);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const limit = filters.limit || 20;
    const skip = ((filters.page || 1) - 1) * limit;
    
    params.append('skip', String(skip));
    params.append('take', String(limit));

    return apiClient.get<AuditLogsResponse>(`/admin/audit-logs?${params.toString()}`);
  },

  async getActions(): Promise<string[]> {
    return apiClient.get<string[]>('/admin/audit-logs/actions');
  },
};
