import { fetcher } from '@/lib/fetcher';
import { API_ROUTES } from '@/lib/routes';
import {
  PaginatedManufacturers,
  ManufacturerWithUser,
  ManufacturerReviewRequest,
  ManufacturerFilters,
  ApiResponse,
} from '@/types/manufacturer';

export class ManufacturerService {
  static async getManufacturers(
    filters: ManufacturerFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedManufacturers> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.search && { search: filters.search }),
      ...(filters.status && { status: filters.status }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
      ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
    });

    const response = await fetcher<ApiResponse<PaginatedManufacturers>>(
      `${API_ROUTES.MANUFACTURERS.LIST}?${params}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch manufacturers');
    }

    return response.data;
  }

  static async getManufacturer(id: string): Promise<ManufacturerWithUser> {
    const response = await fetcher<ApiResponse<ManufacturerWithUser>>(
      `${API_ROUTES.MANUFACTURERS.GET}/${id}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch manufacturer');
    }

    return response.data;
  }

  static async approveManufacturer(
    manufacturerId: string,
    data?: Partial<ManufacturerReviewRequest>
  ): Promise<void> {
    const response = await fetcher<ApiResponse>(
      `${API_ROUTES.MANUFACTURERS.APPROVE}/${manufacturerId}`,
      {
        method: 'POST',
        body: JSON.stringify(data || {}),
      }
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to approve manufacturer');
    }
  }

  static async rejectManufacturer(
    manufacturerId: string,
    data: ManufacturerReviewRequest
  ): Promise<void> {
    const response = await fetcher<ApiResponse>(
      `${API_ROUTES.MANUFACTURERS.REJECT}/${manufacturerId}`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to reject manufacturer');
    }
  }

  static async getAuditLogs(manufacturerId: string): Promise<any[]> {
    const response = await fetcher<ApiResponse<any[]>>(
      `${API_ROUTES.MANUFACTURERS.AUDIT_LOGS}/${manufacturerId}`
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch audit logs');
    }

    return response.data || [];
  }
}