'use client';

import { useQuery } from '@tanstack/react-query';
import { ManufacturerService, GetVerificationsParams } from '@/services/manufacturer.service';
import { useState } from 'react';

export function useVerifications(initialParams: GetVerificationsParams = {}) {
  const [params, setParams] = useState<GetVerificationsParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const query = useQuery({
    queryKey: ['manufacturer-verifications', params],
    queryFn: () => ManufacturerService.getVerifications(params),
    placeholderData: (previousData) => previousData,
  });

  const updateParams = (newParams: Partial<GetVerificationsParams>) => {
    setParams((prev) => {
      const isFilterChange = Object.keys(newParams).some(key => key !== 'page' && key !== 'limit');
      return {
        ...prev,
        ...newParams,
        page: isFilterChange ? 1 : (newParams.page || prev.page),
      };
    });
  };

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    params,
    updateParams,
  };
}
