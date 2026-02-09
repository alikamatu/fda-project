import { apiClient } from '@/lib/api-client';
import { Product, ApprovalStatus } from './products.service';

export interface AdminProduct extends Product {
  manufacturer: {
    companyName: string;
    registrationNumber?: string;
    email?: string;
    phoneNumber?: string;
  };
  _count?: {
    batches: number;
  };
}

export interface AdminProductsResponse {
  data: AdminProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAdminProductsParams {
  page?: number;
  limit?: number;
  status?: ApprovalStatus;
}

export const AdminProductsService = {
  getProducts: async (params: GetAdminProductsParams): Promise<AdminProductsResponse> => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.status) query.append('status', params.status);
    
    return apiClient.get(`/admin/products?${query.toString()}`);
  },

  getProduct: async (id: string): Promise<AdminProduct> => {
    return apiClient.get(`/admin/products/${id}`);
  },

  approveProduct: async (id: string): Promise<Product> => {
    return apiClient.patch(`/admin/products/${id}/approve`);
  },

  rejectProduct: async (id: string, reason?: string): Promise<Product> => {
    return apiClient.patch(`/admin/products/${id}/reject`, { reason });
  },
};
