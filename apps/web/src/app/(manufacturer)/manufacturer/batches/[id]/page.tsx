'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { useManufacturerBatchDetail } from '@/hooks/useBatches';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/constants';
import Link from 'next/link';
import { ChevronLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';
import { useRef } from 'react';
import { useParams } from 'next/navigation';

export default function BatchDetailPage() {
  const params = useParams();
  const batchId = params?.id as string;
  const { data: batch, isLoading } = useManufacturerBatchDetail(batchId);
  // qrRef is no longer needed since we have the data URL directly

  const downloadQRCode = () => {
    if (batch?.qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `batch-${batch.batchNumber}-qr.png`;
      link.href = batch.qrCodeUrl;
      link.click();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <PageContainer title="Batch Details">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (!batch) {
    return (
      <PageContainer title="Batch Not Found">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Batch not found</p>
          <Link href="/manufacturer/batches">
            <Button variant="outline">Back to Batches</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Batch Details">
      <Link href="/manufacturer/batches" className="mb-4 inline-block">
        <Button variant="ghost" size="sm">
          <ChevronLeftIcon className="h-4 w-4 mr-2" />
          Back to Batches
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Batch Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Batch Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Batch Number</p>
                  <p className="text-lg font-semibold">{batch.batchNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={getStatusColor(batch.status)} className="mt-1">
                    {batch.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Manufacture Date</p>
                  <p className="font-medium">{formatDate(batch.manufactureDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expiry Date</p>
                  <p className="font-medium">{formatDate(batch.expiryDate)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">{batch.quantity} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(batch.createdAt)}</p>
                </div>
              </div>

              {batch.notes && (
                <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
                  <p className="text-sm text-gray-500">Admin Notes</p>
                  <p className="text-gray-700 mt-1">{batch.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Product Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Product Name</p>
                <p className="font-medium">{batch.product.productName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product Code</p>
                <p className="font-medium">{batch.product.productCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{batch.product.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Manufacturer</p>
                <p className="font-medium">{batch.product.manufacturer.companyName}</p>
                <p className="text-sm text-gray-500">{batch.product.manufacturer.contactEmail}</p>
              </div>
            </div>
          </div>

          {/* Verification Codes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Verification Codes ({batch.verificationCodes.length})
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {batch.verificationCodes.map((code) => (
                <div
                  key={code.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-mono text-sm">{code.code}</p>
                    {code.isUsed && (
                      <p className="text-xs text-gray-500 mt-1">
                        Used at {code.usedAt ? formatDate(code.usedAt) : 'Unknown time'}
                      </p>
                    )}
                  </div>
                  <Badge variant={code.isUsed ? 'secondary' : 'success'}>
                    {code.isUsed ? 'Used' : 'Active'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Batch QR Code</h2>

          {batch.qrCodeUrl ? (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded p-4 bg-gray-50 flex items-center justify-center">
                <img src={batch.qrCodeUrl} alt="Batch QR Code" className="w-full" />
              </div>
              <Button
                onClick={downloadQRCode}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded p-4 text-center text-gray-500 text-sm">
              <p>QR Code will be generated once batch is approved</p>
            </div>
          )}

          {batch.status === 'APPROVED' && !batch.qrCodeUrl && (
            <Button
              variant="primary"
              size="sm"
              className="w-full mt-4"
              disabled
            >
              Generating QR Code...
            </Button>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
