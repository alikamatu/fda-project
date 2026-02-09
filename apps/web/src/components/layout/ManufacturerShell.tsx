'use client';

import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useCurrentUser } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/lib/routes';
import { ManufacturerService } from '@/services/manufacturer.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ManufacturerShellProps {
  children: ReactNode;
}

/**
 * ManufacturerShell Component
 * Provides layout for manufacturer-only pages with role and approval verification
 * Redirects unapproved manufacturers to pending page
 * Redirects non-manufacturers to home page
 */
export function ManufacturerShell({ children }: ManufacturerShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: user, isLoading } = useCurrentUser();
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [approvalLoading, setApprovalLoading] = useState(true);
  const router = useRouter();

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [router, isMobile]);

  // Check approval status
  useEffect(() => {
    if (!isLoading && user?.role === 'MANUFACTURER') {
      const checkApprovalStatus = async () => {
        try {
          const stats = await ManufacturerService.getDashboardStats();
          setIsApproved(stats.isApproved);

          // Redirect unapproved users to pending page
          if (!stats.isApproved) {
            router.push(APP_ROUTES.MANUFACTURER_PENDING);
          }
        } catch (error) {
          // If we can't fetch stats, assume not approved (safer default)
          setIsApproved(false);
          console.debug('Could not fetch manufacturer approval status:', error);
        } finally {
          setApprovalLoading(false);
        }
      };

      checkApprovalStatus();
    }
  }, [user, isLoading, router]);

  // Redirect non-manufacturer users
  useEffect(() => {
    if (!isLoading && user && user.role !== 'MANUFACTURER') {
      router.push(APP_ROUTES.VERIFY);
    }
  }, [user, isLoading, router]);

  const isLoadingPage = isLoading || approvalLoading;

  if (isLoadingPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-600">Loading manufacturer dashboard...</p>
          {typeof window !== 'undefined' && (
            <p className="text-xs text-gray-500 mt-2">
              Token in localStorage: {localStorage.getItem('auth_token') ? '✓' : '✗'}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show error if not approved or not a manufacturer
  if (!user || user.role !== 'MANUFACTURER' || (isApproved === false && !approvalLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card>
          <div className="text-center py-12 max-w-md">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600 mb-2">
              {!user
                ? 'You must be logged in to access this page.'
                : user.role !== 'MANUFACTURER'
                  ? 'This page is only accessible to manufacturer accounts.'
                  : 'Your manufacturer account is pending approval.'}
            </p>
            {!user || user.role !== 'MANUFACTURER' ? (
              <div className="space-y-2 mt-6">
                <Button href={APP_ROUTES.LOGIN} variant="primary" className="w-full">
                  Go to Login
                </Button>
                <Button href="/" variant="secondary" className="w-full">
                  Return Home
                </Button>
              </div>
            ) : (
              <div className="space-y-2 mt-6">
                <Button href={APP_ROUTES.MANUFACTURER_PENDING} variant="primary" className="w-full">
                  Check Status
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-600/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
