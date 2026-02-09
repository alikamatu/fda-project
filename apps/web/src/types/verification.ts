/**
 * Verification types for admin dashboard
 * Comprehensive types for product verification management
 */

export enum VerificationStatus {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
  FAKE = 'FAKE',
  USED = 'USED',
}

export enum ProductCategory {
  DRUG = 'DRUG',
  FOOD = 'FOOD',
  COSMETIC = 'COSMETIC',
  MEDICAL_DEVICE = 'MEDICAL_DEVICE',
  ELECTRONIC = 'ELECTRONIC',
  OTHER = 'OTHER',
}

export interface VerificationLog {
  id: string;
  status: VerificationStatus;
  location?: string;
  ipAddress?: string;
  deviceInfo?: string;
  verifiedAt: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  verificationCode?: {
    code: string;
    productBatch?: {
      id: string;
      batchNumber: string;
      manufactureDate: string;
      expiryDate: string;
      product?: {
        id: string;
        productName: string;
        productCode: string;
        category: ProductCategory;
        manufacturer?: {
          id: string;
          companyName: string;
          registrationNumber: string;
        };
      };
    };
  };
}

export interface VerificationStats {
  total: number;
  byStatus: {
    [key in VerificationStatus]?: number;
  };
  date: string;
}

export interface VerificationFilter {
  status?: VerificationStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface VerificationListResponse {
  data: VerificationLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetVerificationsParams {
  status?: VerificationStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}