import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}

export function PageContainer({ children, title, actions }: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto"
    >
      {/* Page Header */}
      {(title || actions) && (
        <div className="mb-6 flex items-center justify-between">
          {title && (
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-600 mt-1">
                FDA Product Verification System Administration
              </p>
            </div>
          )}
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Page Content */}
      <div className="space-y-6">
        {children}
      </div>
    </motion.div>
  );
}