'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { ProductDetailsHeader } from '@/components/products/ProductDetailsHeader';
import { BatchesTable } from '@/components/products/BatchesTable';
import { useProduct } from '@/hooks/useProducts';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { useParams } from 'next/navigation';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params?.id as string;
  
  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <PageContainer title="Loading...">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </PageContainer>
    );
  }

  if (error || !product) {
    return (
      <PageContainer title="Error">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Product not found</h2>
          <Link href="/manufacturer/products" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to Products
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Product Details"
      actions={
        <Link 
          href="/manufacturer/products"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      }
    >
      <div className="space-y-6 -mt-4">
        <ProductDetailsHeader product={product} />
        
        <BatchesTable batches={product.batches || []} />
      </div>
    </PageContainer>
  );
}
