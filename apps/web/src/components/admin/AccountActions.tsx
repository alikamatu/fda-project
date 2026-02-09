'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { RejectModal } from './RejectModal';
import { ManufacturerUser } from '@/types/admin-users'; // Assuming this type exists or will exist

interface AccountActionsProps {
  user: ManufacturerUser;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  isPerformingAction: boolean;
}

export function AccountActions({
  user,
  onActivate,
  onDeactivate,
  onApprove,
  onReject,
  isPerformingAction,
}: AccountActionsProps) {
  const [showConfirmAction, setShowConfirmAction] = useState<{
    type: 'activate' | 'deactivate' | 'approve' | null;
  }>({ type: null });
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleConfirm = () => {
    if (!showConfirmAction.type) return;

    if (showConfirmAction.type === 'activate') {
      onActivate(user.id);
    } else if (showConfirmAction.type === 'deactivate') {
      onDeactivate(user.id);
    } else if (showConfirmAction.type === 'approve') {
      onApprove(user.id);
    }
    setShowConfirmAction({ type: null });
  };

  const getConfirmationDetails = () => {
    switch (showConfirmAction.type) {
      case 'activate':
        return {
          title: 'Activate User Account',
          message: `Are you sure you want to activate the account for ${user.fullName}? They will be able to log in.`,
          confirmText: 'Activate',
          variant: 'primary' as const,
        };
      case 'deactivate':
        return {
          title: 'Deactivate User Account',
          message: `Are you sure you want to deactivate the account for ${user.fullName}? They will not be able to log in.`,
          confirmText: 'Deactivate',
          variant: 'danger' as const,
        };
      case 'approve':
        return {
          title: 'Approve Manufacturer',
          message: `Are you sure you want to approve ${user.manufacturer.companyName}? This will grant them full access to manufacturer features.`,
          confirmText: 'Approve',
          variant: 'primary' as const,
        };
      default:
        return { title: '', message: '', confirmText: '', variant: 'primary' as const };
    }
  };

  const { title, message, confirmText, variant } = getConfirmationDetails();

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {/* Account Status Actions */}
        {user.isActive ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowConfirmAction({ type: 'deactivate' })}
            disabled={isPerformingAction}
          >
            Deactivate User
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowConfirmAction({ type: 'activate' })}
            disabled={isPerformingAction}
          >
            Activate User
          </Button>
        )}

        {/* Manufacturer Approval Actions */}
        {!user.manufacturer.isApproved && (
          <>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setShowConfirmAction({ type: 'approve' })}
              disabled={isPerformingAction}
            >
              Approve Manufacturer
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setShowRejectModal(true)}
              disabled={isPerformingAction}
            >
              Reject
            </Button>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!showConfirmAction.type}
        onClose={() => setShowConfirmAction({ type: null })}
        title={title}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmAction({ type: null })}
              disabled={isPerformingAction}
            >
              Cancel
            </Button>
            <Button
              variant={variant}
              onClick={handleConfirm}
              isLoading={isPerformingAction}
            >
              {confirmText}
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">{message}</p>
      </Modal>

      {/* Reject Modal */}
      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={(reason) => {
          onReject(user.id, reason);
          setShowRejectModal(false);
        }}
        isLoading={isPerformingAction}
        manufacturerName={user.manufacturer.companyName}
      />
    </>
  );
}
