'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ManufacturerWithUser } from '@/types/manufacturer';
import { Badge } from '@/components/ui/Badge';
import { ApprovalActions } from './ApprovalActions';
import { 
  XMarkIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface ManufacturerDrawerProps {
  manufacturer: ManufacturerWithUser | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (manufacturerId: string) => Promise<void>;
  onReject: (manufacturerId: string, reason: string) => Promise<void>;
  isLoading: boolean;
}

export function ManufacturerDrawer({
  manufacturer,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isLoading,
}: ManufacturerDrawerProps) {
  const [showActions, setShowActions] = useState(true);

  if (!manufacturer) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysSinceRegistration = () => {
    const createdAt = new Date(manufacturer.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
            className="fixed inset-0 bg-gray-600/50 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Manufacturer details"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Manufacturer Review</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Review manufacturer registration details
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Status Banner */}
                <div className={`p-3 rounded-md mb-6 ${
                  manufacturer.isApproved 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-amber-50 border border-amber-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShieldCheckIcon className={`h-5 w-5 mr-2 ${
                        manufacturer.isApproved ? 'text-green-600' : 'text-amber-600'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {manufacturer.isApproved ? 'Approved' : 'Pending Approval'}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Registered {getDaysSinceRegistration()} day{getDaysSinceRegistration() !== 1 ? 's' : ''} ago
                        </p>
                      </div>
                    </div>
                    <Badge variant={manufacturer.isApproved ? 'success' : 'neutral'} size="sm">
                      {manufacturer.isApproved ? 'APPROVED' : 'PENDING'}
                    </Badge>
                  </div>
                </div>

                {/* Company Information */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-500" />
                    Company Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Company Name</p>
                      <p className="text-sm text-gray-900">{manufacturer.companyName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Registration Number</p>
                      <p className="text-sm font-mono text-gray-900">{manufacturer.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Address</p>
                      <div className="flex items-start">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-900 whitespace-pre-line">{manufacturer.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Contact Email</p>
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <a 
                          href={`mailto:${manufacturer.contactEmail}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {manufacturer.contactEmail}
                        </a>
                      </div>
                    </div>
                    {manufacturer.contactPhone && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Contact Phone</p>
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <a 
                            href={`tel:${manufacturer.contactPhone}`}
                            className="text-sm text-gray-900"
                          >
                            {manufacturer.contactPhone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Owner */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
                    Account Owner
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Full Name</p>
                      <p className="text-sm text-gray-900">{manufacturer.user.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <a 
                        href={`mailto:${manufacturer.user.email}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {manufacturer.user.email}
                      </a>
                    </div>
                    {manufacturer.user.phone && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="text-sm text-gray-900">{manufacturer.user.phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Account Status</p>
                      <Badge 
                        variant={manufacturer.user.isActive ? 'success' : 'error'} 
                        size="sm"
                      >
                        {manufacturer.user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Account Created</p>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-900">{formatDate(manufacturer.user.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Trail (Placeholder) */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Audit Trail</h3>
                  <div className="text-xs text-gray-500 italic">
                    No review actions recorded yet.
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-gray-200 p-6">
                <AnimatePresence>
                  {showActions && !manufacturer.isApproved && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <ApprovalActions
                        manufacturerId={manufacturer.id}
                        manufacturerName={manufacturer.companyName}
                        onApprove={onApprove}
                        onReject={onReject}
                        onClose={() => setShowActions(false)}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {manufacturer.isApproved && (
                  <div className="text-center">
                    <Badge variant="success" size="md" className="mb-3">
                      Approved
                    </Badge>
                    <p className="text-xs text-gray-600">
                      This manufacturer has been approved and can register products.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}