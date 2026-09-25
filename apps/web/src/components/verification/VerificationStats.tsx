import { Card } from '@/components/ui/Card';
import { VerificationStatus, VerificationStats } from '@/types/verification';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface VerificationStatsProps {
  stats: VerificationStats | null;
  isLoading: boolean;
}

export function VerificationStatsCards({ stats, isLoading }: VerificationStatsProps) {
  const statsByStatus = {
    valid: stats?.byStatus?.[VerificationStatus.VALID] || 0,
    expired: stats?.byStatus?.[VerificationStatus.EXPIRED] || 0,
    fake: stats?.byStatus?.[VerificationStatus.FAKE] || 0,
    used: stats?.byStatus?.[VerificationStatus.USED] || 0,
  };

  const statCards = [
    {
      title: 'Valid',
      value: statsByStatus.valid,
      variant: 'success' as const,
      icon: CheckCircleIcon,
    },
    {
      title: 'Expired',
      value: statsByStatus.expired,
      variant: 'warning' as const,
      icon: ClockIcon,
    },
    {
      title: 'Fake',
      value: statsByStatus.fake,
      variant: 'error' as const,
      icon: XCircleIcon,
    },
    {
      title: 'Already Used',
      value: statsByStatus.used,
      variant: 'warning' as const,
      icon: ExclamationTriangleIcon,
    },
  ];

  const getStatusColor = (variant: string): string => {
    const colorMap: Record<string, string> = {
      success: 'green',
      warning: 'amber',
      error: 'red',
      neutral: 'gray',
    };
    return colorMap[variant] || 'gray';
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {statCards.map((stat) => (
        <Card key={stat.title} hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading ? (
                  <span className="animate-pulse bg-gray-200 h-6 w-12 rounded inline-block" />
                ) : (
                  stat.value.toLocaleString()
                )}
              </p>
            </div>
            {stat.icon && (
              <stat.icon className={`h-5 w-5 text-${getStatusColor(stat.variant)}-500`} />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
