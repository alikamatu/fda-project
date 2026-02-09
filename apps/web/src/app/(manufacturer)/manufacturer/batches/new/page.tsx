'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { useProducts } from '@/hooks/useProducts';
import { BatchForm } from '@/components/manufacturer/BatchForm';
import { useState } from 'react';

export default function NewBatchPage() {
  const { data: products, isLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  if (isLoading) {
    return (
      <PageContainer title="Create New Batch">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </PageContainer>
    );
  }

  if (!products || products.length === 0) {
    return (
      <PageContainer title="Create New Batch">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          <p>You need to create a product first before creating batches.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Create New Batch">
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Select a product and provide batch details. Each batch will generate unique verification codes for product authentication.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Product *
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a product...</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.productName} ({product.productCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedProduct && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Batch Details</h3>
          <BatchForm productId={selectedProduct} />
        </div>
      )}
    </PageContainer>
  );
}
