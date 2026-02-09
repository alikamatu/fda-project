import { apiClient } from '@/lib/api-client';
import { VerificationStatus } from '@/types/verification';

export interface DashboardStats {
  isApproved: boolean;
  totalProducts: number;
  activeProducts: number;
  totalVerifications: number;
  recentVerificationsCount: number;
}

export interface RecentProduct {
  id: string;
  productName: string;
  productCode: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  _count: {
    batches: number;
  };
}

export interface RecentVerification {
  id: string;
  status: 'VALID' | 'EXPIRED' | 'FAKE' | 'USED';
  verifiedAt: string;
  location?: string;
  verificationCode: {
    code: string;
    productBatch: {
      batchNumber: string;
      product: {
        productName: string;
      };
    };
  };
}

export interface VerificationLog {
  id: string;
  status: 'VALID' | 'EXPIRED' | 'FAKE' | 'USED';
  verifiedAt: string;
  location?: string;
  verificationCode: {
    code: string;
    productBatch: {
      batchNumber: string;
      product: {
        productName: string;
        productCode: string;
      };
    };
  };
}

export interface GetVerificationsParams {
  page?: number;
  limit?: number;
  status?: VerificationStatus;
  productId?: string;
  startDate?: string;
  endDate?: string;
}

export interface VerificationLogResponse {
  data: VerificationLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const ManufacturerService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    return apiClient.get('/manufacturer/dashboard');
  },

  getRecentProducts: async (limit: number = 5): Promise<RecentProduct[]> => {
    return apiClient.get(`/manufacturer/products/recent?limit=${limit}`);
  },

  getRecentVerifications: async (limit: number = 10): Promise<RecentVerification[]> => {
    return apiClient.get(`/manufacturer/verifications/recent?limit=${limit}`);
  },

  getVerifications: async (params: GetVerificationsParams): Promise<VerificationLogResponse> => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.status) query.append('status', String(params.status));
    if (params.productId) query.append('productId', params.productId);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    
    return apiClient.get(`/manufacturer/verifications?${query.toString()}`);
  },
};