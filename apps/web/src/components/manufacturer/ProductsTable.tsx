import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ApprovalStatus } from '@/services/products.service';
import Link from 'next/link';

interface ProductRow {
  id: string;
  productName: string;
  productCode: string;
  approvalStatus: string | ApprovalStatus;
  _count?: { batches: number };
  batches?: { id: string }[];
}

interface ProductsTableProps {
  products: ProductRow[];
  isLoading: boolean;
  title?: string;
  showViewAll?: boolean;
}

export function ProductsTable({ 
  products, 
  isLoading, 
  title = "Products", 
  showViewAll = false 
}: ProductsTableProps) {
  if (isLoading) {
    return <Card className="p-8 text-center text-gray-500">Loading products...</Card>;
  }

  if (products.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 mb-2">No products found.</p>
        <Link href="/manufacturer/products/new">
          <Button variant="primary" size="sm">Register New Product</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {(title || showViewAll) && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          {title && <h3 className="text-sm font-medium text-gray-900">{title}</h3>}
          {showViewAll && (
            <Link href="/manufacturer/products" className="text-xs text-blue-600 hover:text-blue-800">
              View All
            </Link>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batches</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.productCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product._count?.batches ?? (product.batches?.length || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant={
                      product.approvalStatus === 'APPROVED' ? 'success' : 
                      product.approvalStatus === 'REJECTED' ? 'error' : 'warning'
                    }
                    size="sm"
                  >
                    {product.approvalStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/manufacturer/products/${product.id}`} className="text-blue-600 hover:text-blue-900">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
