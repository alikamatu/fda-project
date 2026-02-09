import { useQuery } from '@tanstack/react-query';
import { ManufacturerService } from '@/services/manufacturer.service';

export function useManufacturerStats() {
  return useQuery({
    queryKey: ['manufacturer-stats'],
    queryFn: ManufacturerService.getDashboardStats,
  });
}

export function useRecentProducts(limit: number = 5) {
  return useQuery({
    queryKey: ['manufacturer-recent-products', limit],
    queryFn: () => ManufacturerService.getRecentProducts(limit),
  });
}

export function useRecentVerifications(limit: number = 10) {
  return useQuery({
    queryKey: ['manufacturer-recent-verifications', limit],
    queryFn: () => ManufacturerService.getRecentVerifications(limit),
  });
}
