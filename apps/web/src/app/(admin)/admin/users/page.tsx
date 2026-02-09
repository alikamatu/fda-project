'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { UsersTable } from '@/components/admin/UsersTable';
import { UserDrawer } from '@/components/admin/UserDrawer';
import { UserFilters } from '@/components/admin/UserFilters';
import {
  useManufacturerUsers,
  useActivateUser,
  useDeactivateUser,
  useApproveManufacturer,
  useRejectManufacturer,
} from '@/hooks/useAdminUsers';
import { ManufacturerUser } from '@/types/admin-users';

export default function AdminUsersPage() {
  // State
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  
  const [selectedUser, setSelectedUser] = useState<ManufacturerUser | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Queries
  const { data, isLoading, refetch } = useManufacturerUsers({
    search: debouncedSearch,
    page,
    limit,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    isApproved: approvalFilter === 'all' ? undefined : approvalFilter === 'approved',
  });

  // Mutations
  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const approveManufacturer = useApproveManufacturer();
  const rejectManufacturer = useRejectManufacturer();

  // Handlers
  const handleViewUser = (user: ManufacturerUser) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setApprovalFilter('all');
    setPage(1);
  };

  const isPerformingAction =
    activateUser.isPending ||
    deactivateUser.isPending ||
    approveManufacturer.isPending ||
    rejectManufacturer.isPending;

  // Pagination Logic
  const total = data?.meta.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <PageContainer
      title="Manufacturer Accounts"
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          className="text-xs"
        >
          <ArrowPathIcon className="h-3.5 w-3.5 mr-1.5" />
          Refresh
        </Button>
      }
    >
      <div className="mb-6 -mt-4">
        <p className="text-xs text-gray-600 leading-relaxed">
          Review and manage manufacturer user accounts. Approve new registrations, 
          manage access, and ensure regulatory compliance.
        </p>
      </div>

      <UserFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={(val) => setStatusFilter(val as any)}
        approvalFilter={approvalFilter}
        onApprovalChange={(val) => setApprovalFilter(val as any)}
        onClearFilters={handleClearFilters}
      />

      <UsersTable 
        data={data?.data || []} 
        onViewUser={handleViewUser}
        isLoading={isLoading} 
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 border-t border-gray-200 pt-4 flex items-center justify-between">
          <p className="text-xs text-gray-600">
            Showing {(page - 1) * limit + 1} to{' '}
            {Math.min(page * limit, total)} of {total.toLocaleString()} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="text-xs"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = page;
                if (totalPages <= 5) {
                   pageNum = i + 1;
                } else if (page <= 3) {
                   pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                   pageNum = totalPages - 4 + i;
                } else {
                   pageNum = page - 2 + i;
                }

                if (pageNum < 1 || pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      pageNum === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <Button
              variant="ghost"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="text-xs"
            >
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* User Details Drawer */}
      <UserDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        user={selectedUser}
        onActivate={(id) => activateUser.mutate(id)}
        onDeactivate={(id) => deactivateUser.mutate(id)}
        onApprove={(id) => approveManufacturer.mutate(id)}
        onReject={(id, reason) => rejectManufacturer.mutate({ userId: id, reason })}
        isPerformingAction={isPerformingAction}
      />

      {/* Compliance Notice */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-gray-700">
              FDA Compliance Mode: Active
            </span>
          </div>
          <p className="text-xs text-gray-500">
            All user actions are logged and auditable
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
