import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { VerificationLog, VerificationStatus } from '@/types/verification';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import { CheckCircleIcon, ClockIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface VerificationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: VerificationLog | null;
}

export function VerificationDetailsModal({
  isOpen,
  onClose,
  verification,
}: VerificationDetailsModalProps) {
  if (!verification) return null;

  const getStatusBadgeProps = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VALID:
        return { variant: 'success' as const, icon: CheckCircleIcon };
      case VerificationStatus.EXPIRED:
        return { variant: 'warning' as const, icon: ClockIcon };
      case VerificationStatus.FAKE:
        return { variant: 'error' as const, icon: XCircleIcon };
      case VerificationStatus.USED:
        return { variant: 'warning' as const, icon: ExclamationTriangleIcon };
      default:
        return { variant: 'neutral' as const, icon: null };
    }
  };

  const formatCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      DRUG: 'Pharmaceutical Drug',
      FOOD: 'Food Product',
      COSMETIC: 'Cosmetic Product',
      MEDICAL_DEVICE: 'Medical Device',
      ELECTRONIC: 'Electronic Product',
      OTHER: 'Other Product',
    };
    return categoryMap[category] || category;
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-full bg-${getStatusBadgeProps(verification.status).variant === 'success' ? 'green' : 'gray'}-100`}>
                       {/* Icon logic repeated, could be cleaner but fine for now */}
                    </div>
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Verification Details
                    </Dialog.Title>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 block border-b border-gray-100 pb-2">
                        Verification Data
                      </h4>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-xs text-gray-500 uppercase tracking-wide">ID</dt>
                          <dd className="text-sm font-mono text-gray-900 break-all mt-0.5">
                            {verification.id}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500 uppercase tracking-wide">Code</dt>
                          <dd className="text-sm font-mono text-gray-900 mt-0.5">
                            {verification.verificationCode?.code || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500 uppercase tracking-wide">Status</dt>
                          <dd className="mt-1">
                            <Badge variant={getStatusBadgeProps(verification.status).variant} size="sm">
                              {verification.status}
                            </Badge>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500 uppercase tracking-wide">Verified At</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">
                            {format(new Date(verification.verifiedAt), 'PPpp')}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* Metadata */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 block border-b border-gray-100 pb-2">
                        Request Metadata
                      </h4>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-xs text-gray-500 uppercase tracking-wide">IP Address</dt>
                          <dd className="text-sm font-mono text-gray-900 mt-0.5">
                            {verification.ipAddress || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500 uppercase tracking-wide">Location</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">
                            {verification.location || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500 uppercase tracking-wide">Device</dt>
                          <dd className="text-sm text-gray-900 break-words mt-0.5">
                            {verification.deviceInfo || '—'}
                          </dd>
                        </div>
                         <div>
                          <dt className="text-xs text-gray-500 uppercase tracking-wide">User</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">
                            {verification.user?.email || 'Anonymous'} 
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* Product Details - Full Width */}
                     {verification.verificationCode?.productBatch?.product && (
                      <div className="md:col-span-2 mt-2 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 block">
                          Product Information
                        </h4>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <div>
                            <dt className="text-xs text-gray-500 uppercase tracking-wide">Product Name</dt>
                            <dd className="text-sm font-medium text-gray-900 mt-0.5">
                              {verification.verificationCode.productBatch.product.productName}
                            </dd>
                          </div>
                          <div>
                             <dt className="text-xs text-gray-500 uppercase tracking-wide">Product Code</dt>
                            <dd className="text-sm font-mono text-gray-900 mt-0.5">
                              {verification.verificationCode.productBatch.product.productCode}
                            </dd>
                          </div>
                          <div>
                             <dt className="text-xs text-gray-500 uppercase tracking-wide">Manufacturer</dt>
                            <dd className="text-sm text-gray-900 mt-0.5">
                              {verification.verificationCode.productBatch.product.manufacturer?.companyName}
                            </dd>
                          </div>
                          <div>
                             <dt className="text-xs text-gray-500 uppercase tracking-wide">Category</dt>
                            <dd className="text-sm text-gray-900 mt-0.5">
                              {formatCategory(verification.verificationCode.productBatch.product.category)}
                            </dd>
                          </div>
                          <div>
                             <dt className="text-xs text-gray-500 uppercase tracking-wide">Batch Number</dt>
                            <dd className="text-sm font-mono text-gray-900 mt-0.5">
                              {verification.verificationCode.productBatch.batchNumber}
                            </dd>
                          </div>
                          <div>
                             <dt className="text-xs text-gray-500 uppercase tracking-wide">Dates</dt>
                            <dd className="text-sm text-gray-900 mt-0.5">
                              Mfg: {format(new Date(verification.verificationCode.productBatch.manufactureDate), 'MMM d, yyyy')}
                              <br />
                              Exp: {format(new Date(verification.verificationCode.productBatch.expiryDate), 'MMM d, yyyy')}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
