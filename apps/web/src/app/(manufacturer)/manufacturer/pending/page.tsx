'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useAuth';
import { ManufacturerService } from '@/services/manufacturer.service';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ApprovalBanner } from '@/components/manufacturer/ApprovalBanner';
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

interface ManufacturerProfile {
  id: string;
  companyName: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone?: string;
  address: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    isActive: boolean;
    createdAt: string;
  };
}

/**
 * Manufacturer Pending Page
 * Shows approval status and company information while account is under review
 */
export default function ManufacturerPendingPage() {
  const router = useRouter();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const [manufacturer, setManufacturer] = useState<ManufacturerProfile | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch manufacturer profile and check approval status
  useEffect(() => {
    if (!userLoading && currentUser) {
      const fetchData = async () => {
        try {
          setIsLoading(true);

          // Try to fetch dashboard stats to check approval status
          const statsData = await ManufacturerService.getDashboardStats();
          setStats(statsData);

          // If approved, redirect to dashboard
          if (statsData?.isApproved) {
            router.push('/manufacturer/dashboard');
            return;
          }
        } catch (err) {
          // Expected to fail if user is not manufacturer
          console.debug('Could not fetch manufacturer data:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [userLoading, currentUser, router]);

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-600">Loading verification status...</p>
        </div>
      </div>
    );
  }

  // If not a manufacturer, redirect
  if (currentUser?.role !== 'MANUFACTURER') {
    return (
      <PageContainer title="Not Authorized">
        <Card>
          <div className="text-center py-12">
            <div className="text-2xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600 mb-6">This page is only accessible to manufacturer accounts.</p>
            <Button href="/" variant="primary">
              Return to Home
            </Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Account Under Review"
      actions={
        <Badge variant="warning" size="md">
          <ClockIcon className="w-4 h-4 mr-1" />
          Pending Approval
        </Badge>
      }
    >
      {/* Approval Banner */}
      <ApprovalBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Overview Card */}
          <Card>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h2>

                {/* Timeline */}
                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      label: 'Account Created',
                      description: 'Your manufacturer account has been registered',
                      completed: true,
                      current: false,
                    },
                    {
                      step: 2,
                      label: 'Under Review',
                      description: 'FDA is reviewing your company information and credentials',
                      completed: false,
                      current: true,
                    },
                    {
                      step: 3,
                      label: 'Approval / Rejection',
                      description: 'You will receive notification of the decision',
                      completed: false,
                      current: false,
                    },
                    {
                      step: 4,
                      label: 'Access Dashboard',
                      description: 'Upon approval, you can start managing products and batches',
                      completed: false,
                      current: false,
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                            ${
                              item.completed
                                ? 'bg-green-100 text-green-700'
                                : item.current
                                  ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-400'
                                  : 'bg-gray-100 text-gray-700'
                            }
                          `}
                        >
                          {item.completed ? (
                            <CheckCircleIcon className="w-5 h-5" />
                          ) : (
                            item.step
                          )}
                        </div>
                        {index < 3 && (
                          <div
                            className={`
                              w-1 h-6 mt-1
                              ${item.completed || item.current ? 'bg-blue-300' : 'bg-gray-200'}
                            `}
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* What to Expect Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens During Review?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <DocumentCheckIcon className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Document Verification</p>
                  <p className="text-sm text-gray-600 mt-1">
                    We verify your business registration, licenses, and company information.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <EnvelopeIcon className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Communication</p>
                  <p className="text-sm text-gray-600 mt-1">
                    We may contact you via email or phone if we need additional information.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Final Decision</p>
                  <p className="text-sm text-gray-600 mt-1">
                    You'll receive a notification with the approval decision via email.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Company Information Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  Company Name
                </label>
                <p className="text-gray-900">{currentUser?.fullName || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  Account Email
                </label>
                <div className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <a
                    href={`mailto:${currentUser?.email}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {currentUser?.email}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  Account Status
                </label>
                <Badge variant="warning" size="md">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  Pending Verification
                </Badge>
              </div>

              <div className="pt-2 border-t border-gray-200 mt-4">
                <p className="text-xs text-gray-500 mb-3">
                  Submitted on {new Date(currentUser?.id || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Estimated Timeline Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Typical Timeline</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Standard Review</p>
                <p className="text-xs text-gray-600 mt-1">5-7 business days</p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Most manufacturer accounts are reviewed and approved within one week. Complex cases may take longer.
                </p>
              </div>
            </div>
          </Card>

          {/* Support Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you have questions about your application or need to update your information, please contact our support team.
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => (window.location.href = 'mailto:support@fda.gov')}
              >
                Contact Support
              </Button>
              <Button
                variant="ghost"
                size="md"
                className="w-full"
                href="/how-it-works"
              >
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
