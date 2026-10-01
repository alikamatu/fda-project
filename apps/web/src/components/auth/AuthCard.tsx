'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  maxWidth?: 'md' | 'lg';
  headerBadge?: string;
  noCard?: boolean;
}

export function AuthCard({ 
  children, 
  title, 
  subtitle, 
  maxWidth = 'md',
  headerBadge,
  noCard = false,
}: AuthCardProps) {
  const maxWidthClass = maxWidth === 'lg' ? 'max-w-xl' : 'max-w-md';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full ${maxWidthClass} mx-auto my-auto`}
    >
      <div 
        className={
          noCard
            ? 'w-full bg-transparent p-0 relative transition-all duration-300'
            : 'bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/5 p-5 sm:p-7 relative overflow-hidden transition-all duration-300'
        }
      >
        {/* Subtle decorative top border accent only for card mode */}
        {!noCard && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-900" />
        )}

        {/* Header */}
        <div className="text-center mb-4 sm:mb-5">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50/90 border border-blue-100 flex items-center justify-center text-blue-900 shadow-2xs">
              <svg
                className="w-5 h-5 text-blue-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            {headerBadge && (
              <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-900 bg-blue-100/70 border border-blue-200/70 px-2.5 py-0.5 rounded-full">
                {headerBadge}
              </span>
            )}
          </div>
          
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </motion.div>
  );
}