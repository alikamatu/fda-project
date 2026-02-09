'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { AdminProductsTable } from '@/components/admin/products/AdminProductsTable';
import { AdminProductsService, GetAdminProductsParams } from '@/services/admin-products.service';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ApprovalStatus } from '@/services/products.service';

export default function AdminProductsPage() {
  const [params, setParams] = useState<GetAdminProductsParams>({
    page: 1,
    limit: 10,
    status: undefined, // Default to All to ensure products are seen
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-products', params],
    queryFn: () => AdminProductsService.getProducts(params),
  });

  if (isError) {
    return (
      <PageContainer title="Product Reviews">
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          Error loading products: {(error as Error).message}
        </div>
      </PageContainer>
    );
  }

  const products = data?.data || [];
  const filters = [
    { label: 'Pending Review', value: ApprovalStatus.PENDING },
    { label: 'Approved', value: ApprovalStatus.APPROVED },
    { label: 'Rejected', value: ApprovalStatus.REJECTED },
    { label: 'All', value: '' },
  ];

  return (
    <PageContainer title="Product Reviews">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex gap-2 border-b border-gray-200 pb-4 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setParams({ ...params, status: filter.value as ApprovalStatus || undefined, page: 1 })}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                (params.status === filter.value || (filter.value === '' && !params.status))
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <AdminProductsTable products={products} isLoading={isLoading} />
      </div>
    </PageContainer>
  );
}
