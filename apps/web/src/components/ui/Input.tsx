'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, icon, rightElement, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs sm:text-[13px] font-medium text-slate-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <motion.div className="relative" whileFocus={{ scale: 1.002 }} transition={{ duration: 0.1 }}>
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full h-11 sm:h-12 text-sm bg-white border rounded-xl
              ${icon ? 'pl-10' : 'px-3.5'}
              ${rightElement ? 'pr-11' : 'pr-3.5'}
              ${error 
                ? 'border-red-400 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                : 'border-slate-200 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15'
              }
              placeholder:text-slate-400
              focus:outline-none
              disabled:bg-slate-50 disabled:text-slate-500
              transition-all duration-150 shadow-2xs
              ${className}
            `}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightElement}
            </div>
          )}
        </motion.div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-xs text-red-600 font-medium"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';