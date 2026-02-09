'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AdminProduct } from '@/services/admin-products.service';
import { ApprovalStatus } from '@/services/products.service';
import { format } from 'date-fns';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ProductReviewCardProps {
  product: AdminProduct;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}

export function ProductReviewCard({ product, onApprove, onReject, isProcessing }: ProductReviewCardProps) {
  const getStatusVariant = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.APPROVED: return 'success';
      case ApprovalStatus.REJECTED: return 'error';
      default: return 'warning';
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Information */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{product.productName}</h2>
            <p className="text-sm text-gray-500 mt-1">Code: {product.productCode}</p>
          </div>
          <Badge variant={getStatusVariant(product.approvalStatus)} size="lg">
            {product.approvalStatus}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500 uppercase">Category</dt>
                <dd className="text-sm font-medium text-gray-900">{product.category}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Description</dt>
                <dd className="text-sm text-gray-700 mt-1">{product.description || 'No description provided'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Registered Date</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {format(new Date(product.createdAt), 'PPP p')}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Manufacturer</h3>
            <dl className="space-y-3 bg-gray-50 p-4 rounded-md">
              <div>
                <dt className="text-xs text-gray-500 uppercase">Company Name</dt>
                <dd className="text-sm font-medium text-gray-900">{product.manufacturer.companyName}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Registration No.</dt>
                <dd className="text-sm text-gray-900">{product.manufacturer.registrationNumber || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Contact</dt>
                <dd className="text-sm text-gray-900">
                  {product.manufacturer.email}<br/>
                  {product.manufacturer.phoneNumber}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Card>

      {/* Batches Preview */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Batches ({product.batches?.length || 0})</h3>
        {product.batches && product.batches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {product.batches.map((batch) => (
                  <tr key={batch.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{batch.batchNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(batch.expiryDate), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No batches recorded.</p>
        )}
      </Card>

      {/* Action Buttons */}
      {product.approvalStatus === ApprovalStatus.PENDING && (
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button 
            variant="outline" 
            onClick={onReject} 
            disabled={isProcessing}
            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
          >
            <XCircleIcon className="h-5 w-5 mr-2" />
            Reject Product
          </Button>
          <Button 
            variant="primary" 
            onClick={onApprove} 
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Approve & Generate QR Codes
          </Button>
        </div>
      )}
    </div>
  );
}
