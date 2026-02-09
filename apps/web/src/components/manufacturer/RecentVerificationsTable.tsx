import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RecentVerification } from '@/services/manufacturer.service';
import Link from 'next/link';

interface RecentVerificationsTableProps {
  verifications: RecentVerification[];
  isLoading: boolean;
}

export function RecentVerificationsTable({ verifications, isLoading }: RecentVerificationsTableProps) {
  if (isLoading) {
    return <Card className="p-8 text-center text-gray-500">Loading verifications...</Card>;
  }

  if (verifications.length === 0) {
    return (
      <Card className="p-8 text-center text-gray-500">
        No verification activity recorded yet.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-900">Recent Verifications</h3>
        <Link href="/manufacturer/verifications" className="text-xs text-blue-600 hover:text-blue-800">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {verifications.map((log) => {
              const statusColors = {
                VALID: 'success',
                EXPIRED: 'warning',
                FAKE: 'error',
                USED: 'warning',
              } as const;

              return (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={statusColors[log.status]} size="sm">
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.verificationCode.productBatch.product.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.verificationCode.productBatch.batchNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.verifiedAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
