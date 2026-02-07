'use client';

import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  DocumentCheckIcon, 
  BuildingOfficeIcon, 
  CubeIcon, 
  UsersIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalVerifications: number;
  validVerifications: number;
  fakeVerifications: number;
  expiredVerifications: number;
  registeredManufacturers: number;
  totalProducts: number;
  activeUsers: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      setStats({
        totalVerifications: 12543,
        validVerifications: 11230,
        fakeVerifications: 230,
        expiredVerifications: 1083,
        registeredManufacturers: 142,
        totalProducts: 2450,
        activeUsers: 89,
      });
      setIsLoading(false);
    }, 500);
  }, []);

  const statCards = [
    {
      title: 'Total Verifications',
      value: stats?.totalVerifications.toLocaleString() || '0',
      icon: DocumentCheckIcon,
      color: 'blue',
      change: '+12%',
    },
    {
      title: 'Manufacturers',
      value: stats?.registeredManufacturers.toLocaleString() || '0',
      icon: BuildingOfficeIcon,
      color: 'green',
      subValue: `${stats ? Math.round((stats.registeredManufacturers / 200) * 100) : 0}% of target`,
    },
    {
      title: 'Products',
      value: stats?.totalProducts.toLocaleString() || '0',
      icon: CubeIcon,
      color: 'purple',
      change: '+5%',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers.toLocaleString() || '0',
      icon: UsersIcon,
      color: 'amber',
    },
  ];

  return (
    <PageContainer title="Dashboard Overview">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                {stat.subValue && (
                  <p className="text-xs text-gray-500 mt-1">{stat.subValue}</p>
                )}
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
            {stat.change && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <Badge variant={stat.change.startsWith('+') ? 'success' : 'error'} size="sm">
                  {stat.change} from last month
                </Badge>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Verification Status */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-medium text-gray-900">Verification Status</h2>
            <p className="text-xs text-gray-500 mt-1">Real-time verification results</p>
          </div>
          <ChartBarIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-semibold text-green-600">
                {stats.validVerifications.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Valid</p>
              <div className="h-2 bg-green-100 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ 
                    width: `${(stats.validVerifications / stats.totalVerifications) * 100}%` 
                  }} 
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-semibold text-red-600">
                {stats.fakeVerifications.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Fake</p>
              <div className="h-2 bg-red-100 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ 
                    width: `${(stats.fakeVerifications / stats.totalVerifications) * 100}%` 
                  }} 
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-semibold text-amber-600">
                {stats.expiredVerifications.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Expired</p>
              <div className="h-2 bg-amber-100 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ 
                    width: `${(stats.expiredVerifications / stats.totalVerifications) * 100}%` 
                  }} 
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Verifications */}
        <Card>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Verifications</h3>
          <div className="space-y-3">
            {[
              { id: 'V-7891', status: 'VALID', product: 'Amoxicillin 500mg', time: '2 min ago' },
              { id: 'V-7890', status: 'FAKE', product: 'Paracetamol 500mg', time: '15 min ago' },
              { id: 'V-7889', status: 'EXPIRED', product: 'Ibuprofen 200mg', time: '1 hour ago' },
              { id: 'V-7888', status: 'VALID', product: 'Vitamin C 1000mg', time: '2 hours ago' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-xs font-medium text-gray-900">{item.id}</p>
                  <p className="text-xs text-gray-500">{item.product}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    item.status === 'VALID' ? 'success' : 
                    item.status === 'FAKE' ? 'error' : 'warning'
                  } size="sm">
                    {item.status}
                  </Badge>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Status */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-medium text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-700">Database Health</span>
                <Badge variant="success" size="sm">Optimal</Badge>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '98%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-700">API Response Time</span>
                <Badge variant="success" size="sm">Fast</Badge>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-700">Uptime (30 days)</span>
                <span className="text-xs font-medium text-gray-900">99.97%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '99.97%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}