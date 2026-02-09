'use client';

import { BatchResponse } from '@/services/batches.service';
import { formatDate } from '@/lib/constants';
import { Badge, BadgeProps } from '@/components/ui/Badge';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface BatchesTableProps {
  batches: BatchResponse[];
  isLoading: boolean;
  productId?: string;
  productName?: string;
  onBatchSelect?: (batchId: string) => void;
  showProductName?: boolean;
  userRole?: 'MANUFACTURER' | 'ADMIN';
}

export function BatchesTable({
  batches,
  isLoading,
  productId,
  onBatchSelect,
  showProductName,
  userRole = 'MANUFACTURER',
}: BatchesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-200 rounded" />
        ))}
      </div>
    );
  }

  if (!batches || batches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No batches found</p>
      </div>
    );
  }

  const getStatusColor = (status: string): BadgeProps['variant'] => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
              Batch Number
            </th>
            {showProductName && (
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                Product
              </th>
            )}
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
              Quantity
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
              Manufacture Date
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
              Expiry Date
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4 text-sm font-medium">{batch.batchNumber}</td>
              {showProductName && (
                <td className="py-3 px-4 text-sm text-gray-600">{batch.productName}</td>
              )}
              <td className="py-3 px-4 text-sm text-gray-600">{batch.quantity}</td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {formatDate(batch.manufactureDate)}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {formatDate(batch.expiryDate)}
              </td>
              <td className="py-3 px-4 text-sm">
                <Badge variant={getStatusColor(batch.status)}>
                  {batch.status}
                </Badge>
              </td>
              <td className="py-3 px-4">
                {userRole === 'ADMIN' ? (
                  <Link href={`/admin/batches/${batch.id}`}>
                    <Button size="sm" variant="ghost">
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : productId ? (
                  <Link href={`/manufacturer/batches/${batch.id}`}>
                    <Button size="sm" variant="ghost">
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onBatchSelect?.(batch.id)}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
