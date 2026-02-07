export interface ManufacturerWithUser {
  id: string;
  companyName: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone?: string;
  address: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    isActive: boolean;
    createdAt: string;
  };
}

export interface ManufacturerReviewRequest {
  manufacturerId: string;
  reason?: string;
  internalNote?: string;
}

export interface ManufacturerFilters {
  search?: string;
  status?: 'pending' | 'approved' | 'rejected';
  sortBy?: 'createdAt' | 'companyName';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedManufacturers {
  data: ManufacturerWithUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditLog {
  id: string;
  action: 'APPROVE' | 'REJECT' | 'REVIEW';
  entityType: 'MANUFACTURER';
  entityId: string;
  adminId: string;
  adminName: string;
  reason?: string;
  createdAt: string;
}