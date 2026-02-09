'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { ApprovalBanner } from '@/components/manufacturer/ApprovalBanner';
import { MetricsGrid } from '@/components/manufacturer/MetricsGrid';
import { QuickActions } from '@/components/manufacturer/QuickActions';
import { ProductsTable } from '@/components/manufacturer/ProductsTable';
import { RecentVerificationsTable } from '@/components/manufacturer/RecentVerificationsTable';
import {
  useManufacturerStats,
  useRecentProducts,
  useRecentVerifications,
} from '@/hooks/useManufacturerDashboard';

export default function ManufacturerDashboard() {
  const { data: stats, isLoading: statsLoading } = useManufacturerStats();
  const { data: recentProducts, isLoading: productsLoading } = useRecentProducts();
  const { data: recentVerifications, isLoading: verificationsLoading } = useRecentVerifications();

  // Use approval status from stats, defaulting to false while loading
  const isApproved = stats?.isApproved ?? false;

  return (
    <PageContainer
      title="Manufacturer Dashboard"
    >
      <div className="mb-6 -mt-4">
        <p className="text-xs text-gray-600">
          Manage your products and monitor verification activity.
        </p>
      </div>

      {!statsLoading && !isApproved && <ApprovalBanner />}

      <MetricsGrid stats={stats} isLoading={statsLoading} />

      <QuickActions isApproved={isApproved} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductsTable 
          products={recentProducts || []} 
          isLoading={productsLoading}
          title="Recent Products"
          showViewAll={true}
        />
        <RecentVerificationsTable 
          verifications={recentVerifications || []} 
          isLoading={verificationsLoading} 
        />
      </div>
    </PageContainer>
  );
}
