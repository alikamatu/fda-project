import { MetricCard } from '@/components/dashboard/MetricCard';
import { DashboardStats } from '@/services/manufacturer.service';
import { CubeIcon, CheckBadgeIcon, DocumentCheckIcon, ClockIcon } from '@heroicons/react/24/outline';

interface MetricsGridProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export function MetricsGrid({ stats, isLoading }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total Products"
        value={stats?.totalProducts}
        icon={<CubeIcon className="h-6 w-6 text-white" />}
        isLoading={isLoading}
        trend={{ value: 0, label: 'vs last month' }}
        color="blue"
      />
      <MetricCard
        title="Active Products"
        value={stats?.activeProducts}
        icon={<CheckBadgeIcon className="h-6 w-6 text-white" />}
        isLoading={isLoading}
        difference="Approved"
        color="green"
      />
      <MetricCard
        title="Total Verifications"
        value={stats?.totalVerifications}
        icon={<DocumentCheckIcon className="h-6 w-6 text-white" />}
        isLoading={isLoading}
        color="indigo"
      />
      <MetricCard
        title="Recent Activity"
        value={stats?.recentVerificationsCount}
        icon={<ClockIcon className="h-6 w-6 text-white" />}
        isLoading={isLoading}
        trend={{ value: 0, label: 'last 7 days' }}
        color="purple"
      />
    </div>
  );
}
