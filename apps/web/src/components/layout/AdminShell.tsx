'use client';

import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useCurrentUser } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/lib/routes';

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: user, isLoading } = useCurrentUser();
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
    if (isMobile && sidebarOpen) {
      const timer = setTimeout(() => {
        setSidebarOpen(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [router, isMobile, sidebarOpen]);

  // Redirect non-admin users
  // But give some time for loading in case of temporary network issues
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // User is not loaded and we're done loading - might be auth error
        // Give them 2 seconds in case it's a temporary network issue
        const timer = setTimeout(() => {
          if (!user) {
            router.push(APP_ROUTES.LOGIN);
          }
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        // Role-based redirection
        if (user.role === 'CONSUMER') {
          router.push(APP_ROUTES.VERIFY);
        } else if (user.role === 'ADMIN' && window.location.pathname.startsWith('/manufacturer')) {
          router.push('/admin');
        } else if (user.role === 'MANUFACTURER' && window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/admin/settings')) {
           // Allow settings for now, or redirect to dashboard
           // For now, let's redirect to dashboard if they try to access admin-only pages
           router.push('/manufacturer/dashboard');
        }
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-600">Loading admin dashboard...</p>
          {typeof window !== 'undefined' && (
            <p className="text-xs text-gray-500 mt-2">
              Token in localStorage: {localStorage.getItem('auth_token') ? '✓' : '✗'}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-sm mb-2">⚠️ Authentication Failed</div>
          <p className="text-xs text-gray-600">Unable to verify admin access.</p>
          {typeof window !== 'undefined' && (
            <p className="text-xs text-gray-500 mt-2">
              Token: {localStorage.getItem('auth_token') ? '✓ found' : '✗ missing'}
            </p>
          )}
          <button 
            onClick={() => router.push(APP_ROUTES.LOGIN)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
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
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}