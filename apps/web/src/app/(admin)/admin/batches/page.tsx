'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { useAdminBatches } from '@/hooks/useBatches';
import { BatchesTable } from '@/components/manufacturer/BatchesTable';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function AdminBatchesPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const { data: batches, isLoading } = useAdminBatches(statusFilter);

  return (
    <PageContainer title="Product Batches Verification">
      <div className="mb-6 -mt-4">
        <p className="text-sm text-gray-600">
          Review and verify product batches submitted by manufacturers. Approved batches will generate QR codes.
        </p>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={!statusFilter ? 'default' : 'outline'}
          onClick={() => setStatusFilter(undefined)}
        >
          All Batches
        </Button>
        <Button
          size="sm"
          variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('PENDING')}
        >
          Pending Review
        </Button>
        <Button
          size="sm"
          variant={statusFilter === 'APPROVED' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('APPROVED')}
        >
          Approved
        </Button>
        <Button
          size="sm"
          variant={statusFilter === 'REJECTED' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('REJECTED')}
        >
          Rejected
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <BatchesTable
          batches={batches || []}
          isLoading={isLoading}
          showProductName={true}
          userRole="ADMIN"
        />
      </div>
    </PageContainer>
  );
}
