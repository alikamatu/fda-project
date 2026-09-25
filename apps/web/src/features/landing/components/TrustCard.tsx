'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { fadeInVariants } from './animations';

interface TrustCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  index: number;
}

export function TrustCard({ 
  title, 
  description, 
  icon, 
  index 
}: TrustCardProps) {
  return (
    <motion.div
      variants={fadeInVariants}
      custom={index * 0.15}
      className="h-full"
    >
      <Card className="h-full flex flex-col p-5 sm:p-6 transition-colors hover:bg-gray-50/30">
        {/* Icon Container */}
        <div className="mb-4 sm:mb-5">
          <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
            <div className="text-gray-600 w-6 h-6">
              {icon}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-600 leading-relaxed flex-grow sm:text-sm">
          {description}
        </p>

        {/* Compliance Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
              FDA Compliant
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}