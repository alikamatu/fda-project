import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ManufacturerRow } from './ManufacturerRow';
import { ManufacturerWithUser } from '@/types/manufacturer';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface ManufacturerTableProps {
  manufacturers: ManufacturerWithUser[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewManufacturer: (manufacturer: ManufacturerWithUser) => void;
  isLoading: boolean;
}

export function ManufacturerTable({
  manufacturers,
  totalPages,
  currentPage,
  onPageChange,
  onViewManufacturer,
  isLoading,
}: ManufacturerTableProps) {
  const headers = ['Company Name', 'Registration No.', 'Contact Email', 'Approval Status', 'Registered On', 'Actions'];

  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  if (manufacturers.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg">
        <EmptyState
          title="No manufacturers found"
          description="Try adjusting your search or filter criteria"
          icon={<BuildingOfficeIcon />}
        />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Table headers={headers}>
        {manufacturers.map((manufacturer) => (
          <ManufacturerRow
            key={manufacturer.id}
            manufacturer={manufacturer}
            onView={onViewManufacturer}
          />
        ))}
      </Table>
      
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}