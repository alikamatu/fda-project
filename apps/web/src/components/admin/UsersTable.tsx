'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { ManufacturerUser } from '@/types/admin-users';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UserCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface UsersTableProps {
  data: ManufacturerUser[];
  onViewUser: (user: ManufacturerUser) => void;
  isLoading?: boolean;
}

const columnHelper = createColumnHelper<ManufacturerUser>();

export function UsersTable({ data, onViewUser, isLoading }: UsersTableProps) {
  const columns = [
    columnHelper.accessor('fullName', {
      header: 'User Name',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <UserCircleIcon className="h-5 w-5 text-gray-500" />
          </div>
          <span className="font-medium text-gray-900">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => <span className="text-gray-500">{info.getValue()}</span>,
    }),
    columnHelper.accessor('manufacturer.companyName', {
      header: 'Company',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-900">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('manufacturer.registrationNumber', {
      header: 'Reg. No.',
      cell: (info) => (
        <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('isActive', {
      header: 'Account Status',
      cell: (info) => (
        <Badge variant={info.getValue() ? 'success' : 'secondary'} size="sm">
          {info.getValue() ? 'Active' : 'Inactive'}
        </Badge>
      ),
    }),
    columnHelper.accessor('manufacturer.isApproved', {
      header: 'Manufacturer',
      cell: (info) => (
        <Badge variant={info.getValue() ? 'success' : 'warning'} size="sm">
          {info.getValue() ? 'Approved' : 'Pending'}
        </Badge>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Registered On',
      cell: (info) => (
        <span className="text-gray-500 text-xs">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewUser(info.row.original)}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          View Details
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading && data.length === 0) {
    return (
      <Card>
        <div className="py-12 text-center">
          <div className="inline-block">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-gray-600">Loading users...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <div className="py-12 text-center">
           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
             <UserCircleIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
           </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by waiting for manufacturers to register or adjusting filters.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
