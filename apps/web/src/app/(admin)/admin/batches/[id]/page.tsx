'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { useAdminBatchDetail, useVerifyBatch, useGenerateBatchQRCode } from '@/hooks/useBatches';
import { Badge, BadgeProps } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/constants';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function AdminBatchDetailPage() {
  const params = useParams();
  const batchId = params?.id as string;
  const { data: batch, isLoading, isError, error } = useAdminBatchDetail(batchId);
  const verifyBatchMutation = useVerifyBatch();
  const generateQRMutation = useGenerateBatchQRCode();
  const [notes, setNotes] = useState<string>('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const getStatusColor = (status: string): BadgeProps['variant'] => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const handleApprove = async () => {
    try {
      await verifyBatchMutation.mutateAsync({
        batchId: batchId,
        status: 'APPROVED',
        notes,
      });
    } catch (err) {
      console.error('Failed to approve batch:', err);
    }
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      await verifyBatchMutation.mutateAsync({
        batchId: batchId,
        status: 'REJECTED',
        notes,
      });
      setShowRejectForm(false);
      setNotes('');
    } catch (err) {
      console.error('Failed to reject batch:', err);
    }
  };

  const handleGenerateQR = async () => {
    try {
      await generateQRMutation.mutateAsync(batchId);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  };

  if (isLoading) {
    return (
      <PageContainer title="Batch Verification">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    const message = (error as { message?: string })?.message || 'An error occurred while fetching the batch';
    return (
      <PageContainer title="Batch Error">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">{message}</p>
          <Link href="/admin/batches">
            <Button variant="outline">Back to Batches</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  if (!batch) {
    return (
      <PageContainer title="Batch Not Found">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Batch not found</p>
          <Link href="/admin/batches">
            <Button variant="outline">Back to Batches</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const isApproved = batch.status === 'APPROVED';
  const isPending = batch.status === 'PENDING';

  return (
    <PageContainer title="Batch Verification">
      <Link href="/admin/batches" className="mb-4 inline-block">
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
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium">{formatDate(batch.createdAt)}</p>
                </div>
              </div>

              {batch.verifiedAt && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Verified At</p>
                    <p className="font-medium">{formatDate(batch.verifiedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product & Manufacturer Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Product & Manufacturer</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Product Name</p>
                <p className="font-medium text-lg">{batch.product.productName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Product Code</p>
                  <p className="font-medium">{batch.product.productCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{batch.product.category}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm text-gray-500 mb-2">Manufacturer Details</p>
                <p className="font-semibold">{batch.product.manufacturer.companyName}</p>
                <p className="text-sm text-gray-600">{batch.product.manufacturer.contactEmail}</p>
                {batch.product.manufacturer.contactPhone && (
                  <p className="text-sm text-gray-600">{batch.product.manufacturer.contactPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Verification Codes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Verification Codes ({batch.verificationCodes.length})
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {batch.verificationCodes.slice(0, 10).map((code) => (
                <div
                  key={code.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-mono text-sm">{code.code}</p>
                  </div>
                  <Badge variant={code.isUsed ? 'neutral' : 'success'}>
                    {code.isUsed ? 'Used' : 'Active'}
                  </Badge>
                </div>
              ))}
              {batch.verificationCodes.length > 10 && (
                <p className="text-sm text-gray-500 mt-2 p-2">
                  +{batch.verificationCodes.length - 10} more codes
                </p>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          {batch.notes && batch.status !== 'PENDING' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Admin Notes</h3>
              <p className="text-gray-700">{batch.notes}</p>
            </div>
          )}
        </div>

        {/* Verification Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit space-y-4">
          <h2 className="text-lg font-semibold">Verification Actions</h2>

          {isPending && (
            <>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this batch..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleApprove}
                  disabled={verifyBatchMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {verifyBatchMutation.isPending ? 'Approving...' : 'Approve Batch'}
                </Button>

                {!showRejectForm ? (
                  <Button
                    onClick={() => setShowRejectForm(true)}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Reject Batch
                  </Button>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason *
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Explain why this batch is rejected..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                    <Button
                      onClick={handleReject}
                      disabled={verifyBatchMutation.isPending}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      {verifyBatchMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowRejectForm(false);
                        setNotes('');
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </>
          )}

          {isApproved && (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-sm text-green-800">
                  ✓ This batch has been approved
                </p>
              </div>

              {batch.qrCodeUrl ? (
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded p-3 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={batch.qrCodeUrl} alt="Batch QR Code" className="w-full" />
                  </div>
                  <p className="text-sm text-gray-600">QR code generated successfully</p>
                </div>
              ) : (
                <Button
                  onClick={handleGenerateQR}
                  disabled={generateQRMutation.isPending}
                  className="w-full"
                >
                  {generateQRMutation.isPending ? 'Generating...' : 'Generate QR Code'}
                </Button>
              )}
            </div>
          )}

          {batch.status === 'REJECTED' && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-800 font-medium">Rejected</p>
              {batch.notes && (
                <p className="text-sm text-red-700 mt-2">{batch.notes}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
