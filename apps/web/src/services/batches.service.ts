import { apiClient } from '@/lib/api-client';

export interface CreateBatchPayload {
  productId: string;
  batchNumber: string;
  manufactureDate: string; // ISO date string
  expiryDate: string; // ISO date string
  quantity: number;
}

export interface BatchResponse {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  manufactureDate: string;
  expiryDate: string;
  notes?: string;
  qrCodeUrl?: string;
  createdAt: string;
  verifiedAt?: string;
  product: {
    id: string;
    productName: string;
    productCode: string;
    category: string;
    manufacturer: {
      companyName: string;
      contactEmail: string;
      contactPhone?: string;
    };
  };
  verificationCodes: Array<{
    id: string;
    code: string;
    isUsed: boolean;
    usedAt?: string;
  }>;
}

// const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const batchesService = {
  // Manufacturer endpoints
  createBatch: async (productId: string, data: CreateBatchPayload) => {
    const response = await apiClient.post<BatchResponse>(
      `/manufacturer/products/${productId}/batches`,
      {
        batchNumber: data.batchNumber,
        manufactureDate: data.manufactureDate,
        expiryDate: data.expiryDate,
        quantity: data.quantity,
      }
    );
    return response;
  },

  getBatchesByProduct: async (productId: string) => {
    const response = await apiClient.get<BatchResponse[]>(
      `/manufacturer/products/${productId}/batches`
    );
    return response;
  },

  getBatchDetail: async (productId: string, batchId: string) => {
    const response = await apiClient.get<BatchResponse>(
      `/manufacturer/products/${productId}/batches/${batchId}`
    );
    return response;
  },

  getManufacturerBatchDetail: async (batchId: string) => {
    const response = await apiClient.get<BatchResponse>(`/manufacturer/products/any/batches/by-id/${batchId}`);
    return response;
  },

  getVerificationCodes: async (productId: string, batchId: string) => {
    const response = await apiClient.get<BatchResponse['verificationCodes']>(
      `/manufacturer/products/${productId}/batches/${batchId}/codes`
    );
    return response;
  },

  // Admin endpoints
  getAllBatches: async (status?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    
    const response = await apiClient.get<BatchResponse[]>(`/admin/batches?${params.toString()}`);
    return response;
  },

  getAdminBatchDetail: async (batchId: string) => {
    const response = await apiClient.get<BatchResponse>(`/admin/batches/${batchId}`);
    return response;
  },

  verifyBatch: async (batchId: string, data: { status: string; notes?: string }) => {
    const response = await apiClient.patch<BatchResponse>(`/admin/batches/${batchId}/verify`, data);
    return response;
  },

  generateBatchQRCode: async (batchId: string) => {
    const response = await apiClient.patch<BatchResponse>(`/admin/batches/${batchId}/qrcode`, {});
    return response;
  },

  getProductBatches: async (productId: string) => {
    const response = await apiClient.get(`/admin/batches/product/${productId}/all`);
    return response;
  },
};
