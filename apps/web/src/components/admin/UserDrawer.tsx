'use client';

import { Drawer } from '@/components/ui/Drawer';
import { Badge } from '@/components/ui/Badge';
import { ManufacturerUser } from '@/types/admin-users';
import { AccountActions } from './AccountActions';

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: ManufacturerUser | null;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  isPerformingAction: boolean;
}

export function UserDrawer({
  isOpen,
  onClose,
  user,
  onActivate,
  onDeactivate,
  onApprove,
  onReject,
  isPerformingAction,
}: UserDrawerProps) {
  if (!user) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Manufacturer Details"
      footer={
        <div className="w-full">
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
            Actions
          </p>
          <AccountActions
            user={user}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            onApprove={onApprove}
            onReject={onReject}
            isPerformingAction={isPerformingAction}
          />
        </div>
      }
    >
      <div className="space-y-8">
        {/* User Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4 border-b border-gray-100 pb-2">
            User Information
          </h4>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.fullName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.phone || '-'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900">MANUFACTURER</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Account Status</dt>
              <dd className="mt-1">
                <Badge variant={user.isActive ? 'success' : 'secondary'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Registered On</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>

        {/* Manufacturer Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4 border-b border-gray-100 pb-2">
            Manufacturer Information
          </h4>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div className="col-span-2">
              <dt className="text-xs font-medium text-gray-500">Company Name</dt>
              <dd className="mt-1 text-sm text-gray-900 font-medium">
                {user.manufacturer.companyName}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Registration Number</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">
                {user.manufacturer.registrationNumber}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Approval Status</dt>
              <dd className="mt-1">
                <Badge variant={user.manufacturer.isApproved ? 'success' : 'warning'}>
                  {user.manufacturer.isApproved ? 'Approved' : 'Pending'}
                </Badge>
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.manufacturer.address}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Contact Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.manufacturer.contactEmail}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Contact Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user.manufacturer.contactPhone || '-'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Drawer>
  );
}
