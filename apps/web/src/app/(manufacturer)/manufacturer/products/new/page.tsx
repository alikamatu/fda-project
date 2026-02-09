'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { CreateProductForm } from '@/components/products/CreateProductForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <PageContainer
      title="Register New Product"
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
      <div className="mb-6 -mt-4">
        <p className="text-sm text-gray-600">
          Add a new product to your manufacturing catalog. Once registered, you can create batches.
        </p>
      </div>

      <CreateProductForm />
    </PageContainer>
  );
}
