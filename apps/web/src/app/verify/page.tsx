'use client';

import { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Verification {
  id: string;
  productName: string;
  manufacturer: string;
  status: 'VALID' | 'FAKE' | 'EXPIRED';
  scannedAt: string;
  scannedBy: string;
  location: string;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'VALID', label: 'Valid' },
  { value: 'FAKE', label: 'Fake' },
  { value: 'EXPIRED', label: 'Expired' },
];

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      const mockData: Verification[] = Array.from({ length: 45 }, (_, i) => ({
        id: `V-${7890 - i}`,
        productName: `Product ${i + 1}`,
        manufacturer: `Manufacturer ${(i % 5) + 1}`,
        status: i % 3 === 0 ? 'VALID' : i % 3 === 1 ? 'FAKE' : 'EXPIRED',
        scannedAt: new Date(Date.now() - i * 3600000).toISOString(),
        scannedBy: `User ${(i % 10) + 1}`,
        location: i % 2 === 0 ? 'Pharmacy A' : 'Hospital B',
      }));
      setVerifications(mockData);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter and paginate data
  const filteredVerifications = verifications.filter(v => {
    const matchesSearch = v.id.toLowerCase().includes(search.toLowerCase()) ||
                         v.productName.toLowerCase().includes(search.toLowerCase()) ||
                         v.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVerifications.length / itemsPerPage);
  const paginatedVerifications = filteredVerifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: Verification['status']) => {
    switch (status) {
      case 'VALID':
        return <Badge variant="success">VALID</Badge>;
      case 'FAKE':
        return <Badge variant="error">FAKE</Badge>;
      case 'EXPIRED':
        return <Badge variant="warning">EXPIRED</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <PageContainer 
      title="Verifications" 
      actions={
        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
            className="w-40"
          />
          <Input
            type="search"
            placeholder="Search verifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
      }
    >
      <Card>
        {isLoading ? (
          <LoadingSkeleton rows={8} />
        ) : filteredVerifications.length === 0 ? (
          <EmptyState
            title="No verifications found"
            description="Try adjusting your search or filter criteria"
            icon={<MagnifyingGlassIcon />}
          />
        ) : (
          <>
            <Table headers={['ID', 'Product', 'Manufacturer', 'Status', 'Scanned By', 'Location', 'Date']}>
              {paginatedVerifications.map((verification) => (
                <tr key={verification.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs font-medium text-gray-900">{verification.id}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs text-gray-900">{verification.productName}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs text-gray-600">{verification.manufacturer}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(verification.status)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs text-gray-600">{verification.scannedBy}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs text-gray-600">{verification.location}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs text-gray-500">{formatDate(verification.scannedAt)}</div>
                  </td>
                </tr>
              ))}
            </Table>

            <div className="px-4 py-3 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </Card>

      {/* Summary Stats */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {filteredVerifications.length.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Total Results</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600">
                {filteredVerifications.filter(v => v.status === 'VALID').length.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Valid</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-semibold text-red-600">
                {filteredVerifications.filter(v => v.status === 'FAKE').length.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Fake</p>
            </div>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}