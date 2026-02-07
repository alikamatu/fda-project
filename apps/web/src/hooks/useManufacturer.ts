import { useState, useEffect, useCallback } from 'react';
import { ManufacturerService } from '@/services/manufacturer.service';
import {
  PaginatedManufacturers,
  ManufacturerFilters,
  ManufacturerWithUser,
  ManufacturerReviewRequest,
} from '@/types/manufacturer';

export function useManufacturers(
  initialFilters: ManufacturerFilters = {},
  initialPage: number = 1,
  limit: number = 20
) {
  const [data, setData] = useState<PaginatedManufacturers | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<ManufacturerWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ManufacturerFilters>(initialFilters);
  const [page, setPage] = useState(initialPage);

  const fetchManufacturers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ManufacturerService.getManufacturers(filters, page, limit);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch manufacturers');
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, limit]);

  const fetchManufacturer = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ManufacturerService.getManufacturer(id);
      setSelectedManufacturer(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch manufacturer');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approveManufacturer = useCallback(async (
    manufacturerId: string,
    reviewData?: Partial<ManufacturerReviewRequest>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await ManufacturerService.approveManufacturer(manufacturerId, reviewData);
      await fetchManufacturers(); // Refresh list
      if (selectedManufacturer?.id === manufacturerId) {
        await fetchManufacturer(manufacturerId); // Refresh selected
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve manufacturer');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchManufacturers, fetchManufacturer, selectedManufacturer]);

  const rejectManufacturer = useCallback(async (
    manufacturerId: string,
    reviewData: ManufacturerReviewRequest
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await ManufacturerService.rejectManufacturer(manufacturerId, reviewData);
      await fetchManufacturers(); // Refresh list
      if (selectedManufacturer?.id === manufacturerId) {
        await fetchManufacturer(manufacturerId); // Refresh selected
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject manufacturer');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchManufacturers, fetchManufacturer, selectedManufacturer]);

  useEffect(() => {
    fetchManufacturers();
  }, [fetchManufacturers]);

  return {
    data,
    selectedManufacturer,
    isLoading,
    error,
    filters,
    page,
    setFilters,
    setPage,
    fetchManufacturer,
    approveManufacturer,
    rejectManufacturer,
    clearError: () => setError(null),
    clearSelection: () => setSelectedManufacturer(null),
  };
}