'use client';

import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AuditService } from '@/services/audit.service';
import { AuditLog, AuditLogsFilter } from '@/types/audit';
import { format } from 'date-fns';
import { 
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [actions, setActions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<AuditLogsFilter>({
    page: 1,
    limit: 20,
    action: '',
    search: '',
  });

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const data = await AuditService.getActions();
        setActions(data);
      } catch (error) {
        console.error('Failed to fetch actions:', error);
      }
    };
    fetchActions();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const response = await AuditService.getLogs(filters);
        setLogs(response.data);
        setTotal(response.meta.total);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchLogs();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const totalPages = Math.ceil(total / (filters.limit || 20));

  return (
    <PageContainer title="Audit Logs">
      <div className="space-y-6">
        {/* Filters and Search */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Input
                  placeholder="Search by Entity ID, Type, or Performer..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  className="pl-9"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Action</label>
              <Select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
                options={[
                  { value: '', label: 'All Actions' },
                  ...actions.map(action => ({
                    value: action,
                    label: action.replace(/_/g, ' ')
                  }))
                ]}
              />
            </div>

            <div>
               <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
               <div className="grid grid-cols-2 gap-2">
                  <Input 
                    type="date" 
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
                  />
                  <Input 
                    type="date"
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
                  />
               </div>
            </div>
          </div>
        </Card>

        {/* Logs Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Entity</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Performer</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Metadata</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-32 bg-gray-100 rounded" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-24 bg-gray-100 rounded" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-40 bg-gray-100 rounded" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-32 bg-gray-100 rounded" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-40 bg-gray-100 rounded" /></td>
                    </tr>
                  ))
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="neutral" size="sm" className="font-medium">
                          {log.action.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-900">{log.entityType}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{log.entityId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-900">{log.user?.fullName || 'System'}</span>
                          <span className="text-[10px] text-gray-500">{log.user?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        <pre className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap bg-gray-50 p-1 rounded font-mono text-[10px]">
                          {JSON.stringify(log.metadata)}
                        </pre>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-2 text-sm text-gray-500">No logs found matching your filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg sm:px-6">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(filters.page! - 1) * filters.limit! + 1}</span> to{' '}
                <span className="font-medium">{Math.min(filters.page! * filters.limit!, total)}</span> of{' '}
                <span className="font-medium">{total}</span> results
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page! - 1 })}
                disabled={filters.page === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page! + 1 })}
                disabled={filters.page === totalPages}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
