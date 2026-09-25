import { apiClient } from '@/lib/api-client';

export enum ProductCategory {
  DRUG = 'DRUG',
  FOOD = 'FOOD',
  COSMETIC = 'COSMETIC',
  MEDICAL_DEVICE = 'MEDICAL_DEVICE',
  ELECTRONIC = 'ELECTRONIC',
  OTHER = 'OTHER',
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface CreateProductDto {
  productName: string;
  description?: string;
  ingredients?: string;
  cautions?: string;
  category: ProductCategory;
}

export interface Product {
  id: string;
  productName: string;
  productCode: string;
  description?: string;
  ingredients?: string;
  cautions?: string;
  images: string[];
  category: ProductCategory;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  _count?: {
    batches: number;
  };
  batches?: {
    id: string;
    batchNumber: string | null;
    quantity: number;
    expiryDate: string;
  }[];
}

export const ProductsService = {
  createProduct: async (data: CreateProductDto): Promise<Product> => {
    return apiClient.post('/manufacturer/products', data);
  },

  uploadProductImages: async (productId: string, files: File[]): Promise<Product> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return apiClient.postForm(`/manufacturer/products/${productId}/images`, formData);
  },

  getProducts: async (): Promise<Product[]> => {
    return apiClient.get('/manufacturer/products');
  },

  getProduct: async (id: string): Promise<Product> => {
    return apiClient.get(`/manufacturer/products/${id}`);
  },
};
