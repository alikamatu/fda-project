'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { ProductDetailsHeader } from '@/components/products/ProductDetailsHeader';
import { BatchesTable } from '@/components/products/BatchesTable';
import { useProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ReactNode, use } from 'react';

// Next.js 15+ Params type handling
// The `params` prop is a Promise in recent Next.js versions for server components,
// but for client components (which this page seems to be implicitly or explicitly),
// we use the `useParams` hook or `React.use()` for the params prop.
// However, page components in Next.js App Router receive params as a prop.
// Let's assume standard Next.js App Router behavior: params is a Promise in async components (Server),
// or we can use `useParams()` in Client Components.

// Since we need `useProduct` hook, this MUST be a Client Component.
// So we should use `useParams` hook ideally, or `use(params)` if passed as prop.

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
