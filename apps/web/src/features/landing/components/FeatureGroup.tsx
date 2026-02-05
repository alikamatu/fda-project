'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeInVariants } from './animations';

interface FeatureGroupProps {
  title: string;
  icon: ReactNode;
  items: string[];
  index: number;
}

export function FeatureGroup({ 
  title, 
  icon, 
  items, 
  index 
}: FeatureGroupProps) {
  return (
    <motion.div
      variants={fadeInVariants}
      custom={index * 0.15}
      className="h-full"
    >
      <div className="h-full bg-white rounded-lg border border-gray-100 p-5 sm:p-6 transition-colors hover:bg-gray-50/50">
        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
            <div className="text-blue-600 w-5 h-5">
              {icon}
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        {/* Divider */}
        <div className="w-12 h-0.5 bg-gray-200 mb-4 sm:mb-5" />

        {/* Feature List */}
        <ul className="space-y-3">
          {items.map((item, itemIndex) => (
            <motion.li 
              key={itemIndex}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: (index * 0.15) + (itemIndex * 0.05) + 0.3,
                duration: 0.3 
              }}
              className="flex items-start"
            >
              {/* Bullet */}
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mr-3 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              
              {/* Feature Text */}
              <span className="text-xs text-gray-600 leading-relaxed sm:text-sm">
                {item}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}