'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useProducts } from '@/hooks/useProducts';
import { ProductsTable } from '@/components/manufacturer/ProductsTable';
import Link from 'next/link';

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();

  return (
    <PageContainer
      title="My Products"
      actions={
        <Link href="/manufacturer/products/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Product
          </Button>
        </Link>
      }
    >
      <div className="mb-6 -mt-4">
        <p className="text-sm text-gray-600">
          Manage your registered pharmaceutical products and view their approval status.
        </p>
      </div>

      <ProductsTable 
        products={products || []} 
        isLoading={isLoading} 
        title=""
      />
    </PageContainer>
  );
}
