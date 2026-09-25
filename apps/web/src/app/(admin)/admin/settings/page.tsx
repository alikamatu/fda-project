'use client';

import { motion, Variants } from 'framer-motion';
import { useUserSettings } from '@/hooks/useSettings';
import { AccountInfoForm } from '@/components/settings/AccountInfoForm';
import { SecurityForm } from '@/components/settings/SecurityForm';
import { NotificationPreferences } from '@/components/settings/NotificationPreferences';
import { DangerZone } from '@/components/settings/DangerZone';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export default function SettingsPage() {
  const { data: settings, isLoading, error } = useUserSettings();

  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const containerVariants: Variants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      };

  const itemVariants: Variants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      };

  if (isLoading) {
    return (
      <div className="max-w-3xl">
        <div className="mb-6">
          <LoadingSkeleton className="h-6 w-48 mb-1" />
          <LoadingSkeleton className="h-4 w-72" />
        </div>
        <div className="space-y-6">
          <LoadingSkeleton className="h-80" />
          <LoadingSkeleton className="h-64" />
          <LoadingSkeleton className="h-48" />
          <LoadingSkeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="max-w-3xl">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-900">
            Failed to load settings
          </p>
          <p className="text-xs text-red-700 mt-1">
            {error instanceof Error ? error.message : 'Please try again later'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Account Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your personal information and security preferences.
        </p>
      </div>

      {/* Settings Sections */}
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <AccountInfoForm settings={settings} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SecurityForm />
        </motion.div>

        <motion.div variants={itemVariants}>
          <NotificationPreferences />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DangerZone />
        </motion.div>
      </motion.div>
    </div>
  );
}
