'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/services/products.service';

interface ProductDetailsHeaderProps {
  product: Product;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export function ProductDetailsHeader({ product }: ProductDetailsHeaderProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <>
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
        </div>

        {product.images && product.images.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Product Images</h3>
            <div className="flex flex-wrap gap-3">
              {product.images.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxSrc(`${API_URL}${url}`)}
                  className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 hover:ring-2 hover:ring-blue-400 focus:outline-none transition"
                >
                  <img
                    src={`${API_URL}${url}`}
                    alt={`${product.productName} image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {product.description && (
          <div className="px-6 py-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Description</h3>
            <p className="text-sm text-gray-600 max-w-3xl">{product.description}</p>
          </div>
        )}

        {product.ingredients && (
          <div className="px-6 py-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Ingredients</h3>
            <p className="text-sm text-gray-600 max-w-3xl whitespace-pre-line">{product.ingredients}</p>
          </div>
        )}

        {product.cautions && (
          <div className="px-6 py-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Cautions</h3>
            <p className="text-sm text-gray-600 max-w-3xl whitespace-pre-line">{product.cautions}</p>
          </div>
        )}
      </div>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxSrc(null)}
        >
          <img
            src={lightboxSrc}
            alt="Product image"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-9 h-9 flex items-center justify-center text-lg hover:bg-black/70"
            onClick={() => setLightboxSrc(null)}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
