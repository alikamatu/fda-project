'use client';

import { useCallback, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { useVerifications } from '@/hooks/useVerifications';
import { VerificationStatus, VerificationLog } from '@/types/verification';
import {
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ChevronLeftIcon,  
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { VerificationStatsCards } from '@/components/verification/VerificationStats';
import { VerificationFilters } from '@/components/verification/VerificationFilters';
import { VerificationTable } from '@/components/verification/VerificationTable';
import { VerificationDetailsModal } from '@/components/verification/VerificationDetailsModal';

export default function VerificationsPage() {
  const [search, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<VerificationLog | null>(null);

  const {
    verifications,
    stats,
    isLoading,
    isStatsLoading,
    error,
    totalPages,
    currentPage,
    total,
    setFilters,
    setPage,
    clearFilters,
    clearError,
    exportData,
  } = useVerifications({
    initialFilters: { limit: 25 },
    autoFetch: true,
  });

  /**
   * Handle search input change
   */
  const handleSearch = useCallback(
    (value: string) => {
      setLocalSearch(value);
      setFilters({ search: value || undefined });
    },
    [setFilters]
  );

  /**
   * Handle status filter change
   */
  const handleStatusChange = useCallback(
    (value: string) => {
      setStatusFilter(value as any);
      if (value === 'all') {
        setFilters({ status: undefined });
      } else {
        setFilters({ status: value as VerificationStatus });
      }
    },
    [setFilters]
  );

  /**
   * Handle clear filters
   */
  const handleClearFilters = useCallback(() => {
    setLocalSearch('');
    setStatusFilter('all');
    clearFilters();
  }, [clearFilters]);

  /**
   * Handle export with loading state
   */
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportData();
    } finally {
      setIsExporting(false);
    }
  }, [exportData]);

  return (
    <PageContainer
      title="Product Verifications"
      description="Monitor and manage product verification records"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            disabled={isExporting || verifications.length === 0}
            className="text-xs"
          >
            <DocumentArrowDownIcon className="h-3.5 w-3.5 mr-1.5" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-xs"
          >
            <ArrowPathIcon className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      }
    >
      {/* Description */}
      <div className="mb-6">
        <p className="text-xs text-gray-600 leading-relaxed">
          Manage and review all product verification logs. Monitor verification patterns,
          identify suspicious activity, and track verification statistics in real-time.
        </p>
      </div>

      <VerificationStatsCards stats={stats} isLoading={isStatsLoading} />

      <VerificationFilters
        search={search}
        onSearchChange={handleSearch}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
      />

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-900">Error loading verifications</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 text-xs font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <VerificationTable
        verifications={verifications}
        isLoading={isLoading}
        onViewDetails={setSelectedVerification}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 border-t border-gray-200 pt-4 flex items-center justify-between">
          <p className="text-xs text-gray-600">
            Showing {(currentPage - 1) * 25 + 1} to{' '}
            {Math.min(currentPage * 25, total)} of {total.toLocaleString()} verifications
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="text-xs"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum = currentPage - 2 + i;
                if (pageNum < 1 || pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-2 py-1 text-xs rounded ${
                      pageNum === currentPage
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
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="text-xs"
            >
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <VerificationDetailsModal
        isOpen={!!selectedVerification}
        onClose={() => setSelectedVerification(null)}
        verification={selectedVerification}
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
            All verification data is logged and auditable
          </p>
        </div>
      </div>
    </PageContainer>
  );
}