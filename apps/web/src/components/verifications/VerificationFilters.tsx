'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GetVerificationsParams } from '@/types/verification';
import { useState } from 'react';

interface VerificationFiltersProps {
  filters: GetVerificationsParams;
  onFilterChange: (filters: Partial<GetVerificationsParams>) => void;
}

export function VerificationFilters({ filters, onFilterChange }: VerificationFiltersProps) {
  const [localFilters, setLocalFilters] = useState<GetVerificationsParams>(filters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const reset: Partial<GetVerificationsParams> = { status: undefined, startDate: '', endDate: '' };
    setLocalFilters(reset as GetVerificationsParams);
    onFilterChange(reset);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={localFilters.status || ''}
          onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value as any || undefined })}
        >
          <option value="">All Statuses</option>
          <option value="VALID">Valid</option>
          <option value="FAKE">Fake</option>
          <option value="EXPIRED">Expired</option>
          <option value="USED">Used</option>
        </select>
      </div>

      <div className="flex-1">
        <Input
          label="Start Date"
          type="date"
          value={localFilters.startDate || ''}
          onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
        />
      </div>

      <div className="flex-1">
        <Input
          label="End Date"
          type="date"
          value={localFilters.endDate || ''}
          onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="primary">Filter</Button>
        <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
      </div>
    </form>
  );
}
