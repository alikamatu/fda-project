'use client';

import { fadeUpVariants } from '@/features/landing/components/animations';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

interface SectionTitleProps {
  icon: React.ElementType;
  label: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ 
  icon: Icon, 
  label, 
  title, 
  subtitle, 
  className = '' 
}: SectionTitleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  const animationProps = shouldReduceMotion ? {
    initial: "visible",
    animate: "visible",
  } : {
    initial: "hidden",
    animate: isInView ? "visible" : "hidden",
    variants: fadeUpVariants,
  };

  return (
    <div ref={ref} className={`text-center ${className}`}>
      {/* Label with Icon */}
      <motion.div 
        className="flex items-center justify-center gap-2 mb-3"
        {...animationProps}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 border border-gray-100">
          <div className="text-gray-500 w-4 h-4">
            <Icon className="w-full h-full" />
          </div>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500 sm:text-xs">
          {label}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2 
        className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl md:text-2xl"
        {...animationProps}
        transition={{ delay: 0.1 }}
      >
        {title}
      </motion.h2>

      {/* Optional Subtitle */}
      {subtitle && (
        <motion.p 
          className="mt-2 text-xs text-gray-600 max-w-xl mx-auto leading-relaxed sm:text-sm sm:mt-3"
          {...animationProps}
          transition={{ delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}