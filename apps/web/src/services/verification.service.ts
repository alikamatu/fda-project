import { apiClient } from '@/lib/api-client';
import {
  VerificationLog,
  VerificationStats,
  VerificationFilter,
  VerificationListResponse,
} from '@/types/verification';



export const VerificationService = {

  async getVerifications(filters: VerificationFilter = {}): Promise<VerificationListResponse> {
    const params = new URLSearchParams();

    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.startDate) {
      params.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params.append('endDate', filters.endDate);
    }
    params.append('page', String(filters.page || 1));
    params.append('limit', String(filters.limit || 20));

    const queryString = params.toString();
    const endpoint = `/admin/verifications${queryString ? `?${queryString}` : ''}`;

    return apiClient.get<VerificationListResponse>(endpoint);
  },

  async getVerificationStats(): Promise<VerificationStats> {
    return apiClient.get<VerificationStats>('/verify/stats');
  },

  async getRecentVerifications(limit: number = 10): Promise<VerificationLog[]> {
    return apiClient.get<VerificationLog[]>(`/verify/recent?limit=${limit}`);
  },

  async getVerificationDetails(verificationId: string): Promise<VerificationLog> {
    return apiClient.get<VerificationLog>(`/admin/verifications/${verificationId}`);
  },

  async exportVerifications(filters: VerificationFilter = {}): Promise<Blob> {
    const params = new URLSearchParams();

    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.startDate) {
      params.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params.append('endDate', filters.endDate);
    }

    const queryString = params.toString();
    const endpoint = `/admin/verifications/export?${queryString}`;
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {};
    
      headers['Authorization'] = `Bearer ${token}`;

    return fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000'}${endpoint}`, {
      method: 'GET',
      headers,
    }).then((res) => res.blob());
  },
};
