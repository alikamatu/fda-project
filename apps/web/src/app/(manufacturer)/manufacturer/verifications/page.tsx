'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { VerificationsTable } from '@/components/verifications/VerificationsTable';
import { VerificationFilters } from '@/components/verifications/VerificationFilters';
import { useVerifications } from '@/hooks/useVerifications';

export default function VerificationsPage() {
  const { data, isLoading, params, updateParams } = useVerifications(); // Using default hook behavior

  // Safely handle data structure from API
  const verifications = data?.data || [];
  const total = data?.total || 0;
  const page = data?.page || 1;
  const limit = data?.limit || 10;

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
  };

  const handleFilterChange = (newFilters: any) => {
    updateParams(newFilters);
  };

  return (
    <PageContainer title="Verification Logs">
      <div className="space-y-6">
        <VerificationFilters 
          filters={params} 
          onFilterChange={handleFilterChange} 
        />
        
        <VerificationsTable 
          verifications={verifications}
          isLoading={isLoading}
          total={total}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </div>
    </PageContainer>
  );
}
