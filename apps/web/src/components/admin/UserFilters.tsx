'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusChange: (value: string) => void;
  approvalFilter: 'all' | 'approved' | 'pending';
  onApprovalChange: (value: string) => void;
  onClearFilters: () => void;
}

export function UserFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  approvalFilter,
  onApprovalChange,
  onClearFilters,
}: UserFiltersProps) {
  return (
    <Card className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Search Users
          </label>
          <Input
            type="search"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<MagnifyingGlassIcon className="h-4 w-4" />}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Account Status
          </label>
          <Select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            icon={<FunnelIcon className="h-4 w-4" />}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Manufacturer Approval
          </label>
          <Select
            value={approvalFilter}
            onChange={(e) => onApprovalChange(e.target.value)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'approved', label: 'Approved' },
              { value: 'pending', label: 'Pending' },
            ]}
            icon={<FunnelIcon className="h-4 w-4" />}
          />
        </div>

        <div className="md:col-span-4 flex justify-end border-t border-gray-100 pt-4 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </Card>
  );
}
