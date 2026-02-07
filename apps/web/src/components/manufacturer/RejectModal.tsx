'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, internalNote?: string) => Promise<void>;
  manufacturerName: string;
  isLoading: boolean;
}

export function RejectModal({
  isOpen,
  onClose,
  onConfirm,
  manufacturerName,
  isLoading,
}: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Reason for rejection is required');
      return;
    }

    if (reason.length < 10) {
      setError('Reason must be at least 10 characters');
      return;
    }

    setError(null);
    await onConfirm(reason, internalNote);
  };

  const handleClose = () => {
    setReason('');
    setInternalNote('');
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600/50 z-50"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'tween', duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Reject manufacturer"
          >
            <div 
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Reject Manufacturer</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Provide a reason for rejecting {manufacturerName}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-800 font-medium">
                    Warning: This action cannot be undone. The manufacturer will be notified of the rejection.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Reason for Rejection <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
                      rows={4}
                      placeholder="Provide a clear reason for rejection (minimum 10 characters)..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      disabled={isLoading}
                    />
                    {error && (
                      <p className="mt-1.5 text-xs text-red-600">{error}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {reason.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Internal Note (Optional)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
                      rows={3}
                      placeholder="Add any internal notes for the audit trail..."
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      disabled={isLoading}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {internalNote.length}/1000 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !reason.trim()}
                  className="text-xs bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? 'Rejecting...' : 'Reject Manufacturer'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}