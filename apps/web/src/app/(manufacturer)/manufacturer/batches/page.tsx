'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useProducts } from '@/hooks/useProducts';
import { useBatches } from '@/hooks/useBatches';
import { BatchesTable } from '@/components/manufacturer/BatchesTable';
import Link from 'next/link';
import { useState } from 'react';

export default function ManufacturerBatchesPage() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const { data: batches, isLoading: batchesLoading } = useBatches(selectedProductId || undefined);

  if (productsLoading) {
    return (
      <PageContainer title="Product Batches">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Product Batches"
      actions={
        <Link href="/manufacturer/batches/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Batch
          </Button>
        </Link>
      }
    >
      <div className="mb-6 -mt-4">
        <p className="text-sm text-gray-600">
          Submit product batches for FDA verification and generate unique verification codes for product authentication.
        </p>
      </div>

      {products && products.length > 0 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Product (Optional)
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Products</option>
              {products.map((product: any) => (
                <option key={product.id} value={product.id}>
                  {product.productName} ({product.productCode})
                </option>
              ))}
            </select>
          </div>

          {selectedProductId || products.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <BatchesTable 
                batches={batches || []} 
                isLoading={batchesLoading} 
                productId={selectedProductId}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          <p>You need to create a product first before creating batches.</p>
          <Link href="/manufacturer/products/new" className="mt-2 inline-block">
            <Button size="sm" variant="outline">
              Create Product
            </Button>
          </Link>
        </div>
      )}
    </PageContainer>
  );
}
