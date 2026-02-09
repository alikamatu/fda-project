export interface ManufacturerUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
  manufacturer: {
    id: string;
    companyName: string;
    registrationNumber: string;
    isApproved: boolean;
    contactEmail: string;
    contactPhone?: string | null;
    address: string;
  };
}

export interface ManufacturerUserParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isApproved?: boolean;
}

export interface UsersResponse {
  data: ManufacturerUser[];
  meta: {
    total: number;
    skip: number;
    take: number;
  };
}
