'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLogoutAllSessions } from '@/hooks/useSettings';
import { useLogout } from '@/hooks/useAuth';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  confirmText, 
  onConfirm, 
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 p-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h3 id="modal-title" className="text-sm font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-xs text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DangerZone() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const logoutAllSessions = useLogoutAllSessions();
  const { mutate: logout } = useLogout();

  const handleLogoutAllSessions = () => {
    logoutAllSessions.mutate(undefined, {
      onSuccess: () => {
        setShowLogoutModal(false);
        // After logging out all sessions, also logout the current session
        logout();
      },
    });
  };

  return (
    <>
      <Card className="border-red-200">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-red-700">Danger Zone</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Irreversible and destructive actions
          </p>
        </div>

        <div className="space-y-4">
          {/* Logout All Sessions */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Logout from all sessions
              </p>
              <p className="text-xs text-gray-500">
                This will sign you out from all devices and browsers
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowLogoutModal(true)}
            >
              Logout All
            </Button>
          </div>

          {/* Request Deactivation */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Request account deactivation
              </p>
              <p className="text-xs text-gray-500">
                Contact an administrator to deactivate your account
              </p>
            </div>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setShowDeactivateModal(true)}
              disabled
            >
              Request
            </Button>
          </div>
        </div>
      </Card>

      {/* Logout All Sessions Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Logout from all sessions?"
        message="You will be signed out from all devices and browsers, including this one. You will need to log in again."
        confirmText="Logout All"
        onConfirm={handleLogoutAllSessions}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={logoutAllSessions.isPending}
      />

      {/* Deactivation Info Modal */}
      <ConfirmModal
        isOpen={showDeactivateModal}
        title="Account Deactivation"
        message="To deactivate your account, please contact your system administrator. This action cannot be performed directly from this page for security reasons."
        confirmText="Understood"
        onConfirm={() => setShowDeactivateModal(false)}
        onCancel={() => setShowDeactivateModal(false)}
      />
    </>
  );
}
