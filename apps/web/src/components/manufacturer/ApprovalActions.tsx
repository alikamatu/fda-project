'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { RejectModal } from './RejectModal';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface ApprovalActionsProps {
  manufacturerId: string;
  manufacturerName: string;
  onApprove: (manufacturerId: string) => Promise<void>;
  onReject: (manufacturerId: string, reason: string) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

export function ApprovalActions({
  manufacturerId,
  manufacturerName,
  onApprove,
  onReject,
  onClose,
  isLoading,
}: ApprovalActionsProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    if (!window.confirm(`Approve ${manufacturerName}? Once approved, the manufacturer will be able to register products.`)) {
      return;
    }

    setIsApproving(true);
    setError(null);

    try {
      await onApprove(manufacturerId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve manufacturer');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (reason: string, internalNote?: string) => {
    try {
      await onReject(manufacturerId, reason);
      setShowRejectModal(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject manufacturer');
    }
  };

  return (
    <>
      <FormError message={error || ''} />

      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            Once approved, the manufacturer will be able to register products and manage their pharmaceutical inventory.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="secondary"
          onClick={() => setShowRejectModal(true)}
          disabled={isLoading || isApproving}
          className="flex-1"
        >
          <XCircleIcon className="h-4 w-4 mr-2" />
          Reject
        </Button>
        
        <Button
          onClick={handleApprove}
          disabled={isLoading || isApproving}
          className="flex-1"
        >
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          {isApproving ? 'Approving...' : 'Approve Manufacturer'}
        </Button>
      </div>

      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        manufacturerName={manufacturerName}
        isLoading={isLoading}
      />
    </>
  );
}