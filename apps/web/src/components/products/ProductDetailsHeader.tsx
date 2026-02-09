'use client';

import { Badge } from '@/components/ui/Badge';
import { Product } from '@/services/products.service';

interface ProductDetailsHeaderProps {
  product: Product;
}

export function ProductDetailsHeader({ product }: ProductDetailsHeaderProps) {
  return (
    <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.productName}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>Code: <span className="font-mono text-gray-700">{product.productCode}</span></span>
            <span>Category: <span className="text-gray-700">{product.category}</span></span>
            <Badge 
              variant={
                product.approvalStatus === 'APPROVED' ? 'success' : 
                product.approvalStatus === 'REJECTED' ? 'error' : 'warning'
              }
            >
              {product.approvalStatus}
            </Badge>
          </div>
        </div>
        <div>
          {/* Future: Edit Button */}
        </div>
      </div>
      {product.description && (
        <div className="px-6 py-4 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900 mb-1">Description</h3>
          <p className="text-sm text-gray-600 max-w-3xl">{product.description}</p>
        </div>
      )}
    </div>
  );
}
