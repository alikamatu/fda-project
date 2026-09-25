import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VerificationLog, VerificationStatus } from '@/types/verification';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { format, formatDistanceToNow } from 'date-fns';

interface VerificationTableProps {
  verifications: VerificationLog[];
  isLoading: boolean;
  onViewDetails: (verification: VerificationLog) => void;
}

export function VerificationTable({
  verifications,
  isLoading,
  onViewDetails,
}: VerificationTableProps) {
  const getStatusBadgeProps = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VALID:
        return { variant: 'success' as const, icon: CheckCircleIcon };
      case VerificationStatus.EXPIRED:
        return { variant: 'warning' as const, icon: ClockIcon };
      case VerificationStatus.FAKE:
        return { variant: 'error' as const, icon: XCircleIcon };
      case VerificationStatus.USED:
        return { variant: 'warning' as const, icon: ExclamationTriangleIcon };
      default:
        return { variant: 'neutral' as const, icon: null };
    }
  };

  if (isLoading && verifications.length === 0) {
    return (
      <Card>
        <div className="py-12 text-center">
          <div className="inline-block">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-gray-600">Loading verifications...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (verifications.length === 0) {
    return (
      <Card>
        <div className="py-12 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-600">No verifications found</p>
          <p className="text-xs text-gray-500 mt-1">
            Try adjusting your filters or search terms
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
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Batch
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Verified
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {verifications.map((verification) => {
              const statusBadge = getStatusBadgeProps(verification.status);
              const productName = verification.verificationCode?.productBatch?.product?.productName || 'Unknown';
              const batchNumber = verification.verificationCode?.productBatch?.batchNumber || '—';
              const manufacturer = verification.verificationCode?.productBatch?.product?.manufacturer?.companyName || '—';

              return (
                <tr key={verification.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={statusBadge.variant} size="sm">
                      {verification.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-xs font-medium text-gray-900">{productName}</p>
                      <p className="text-xs text-gray-500">{manufacturer}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                    {batchNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                       <span>{format(new Date(verification.verifiedAt), 'MMM d, yyyy')}</span>
                      <span className="text-gray-400 text-[10px]">
                        {formatDistanceToNow(new Date(verification.verifiedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                    {verification.location || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onViewDetails(verification)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
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
