import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { VerificationStatus } from '@/types/verification';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface VerificationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: VerificationStatus | 'all';
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

export function VerificationFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onClearFilters,
}: VerificationFiltersProps) {
  return (
    <Card className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Search Verifications
          </label>
          <Input
            type="search"
            placeholder="Search by code, product, or batch..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<MagnifyingGlassIcon className="h-4 w-4" />}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Filter by Status
          </label>
          <Select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: VerificationStatus.VALID, label: '✓ Valid' },
              { value: VerificationStatus.EXPIRED, label: '⏰ Expired' },
              { value: VerificationStatus.FAKE, label: '✗ Fake/Not Found' },
              { value: VerificationStatus.USED, label: '⚠ Already Used' },
            ]}
            icon={<FunnelIcon className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearFilters}
            className="w-full text-xs"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </Card>
  );
}
