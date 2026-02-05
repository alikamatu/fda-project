'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeInVariants } from './animations';

interface HowItWorksStepProps {
  stepNumber: number;
  title: string;
  description: string;
  icon: React.ElementType;
  index: number;
}

export function HowItWorksStep({ 
  stepNumber, 
  title, 
  description, 
  icon: Icon,
  index 
}: HowItWorksStepProps) {
  return (
    <motion.div
      variants={fadeInVariants}
      custom={index * 0.1}
      className="flex flex-col items-center text-center"
    >
      {/* Step Number and Icon Container */}
      <div className="relative mb-4 sm:mb-5">
        {/* Step Number Background */}
        <div className="absolute inset-0 w-16 h-16 rounded-full bg-blue-50/50" />
        
        {/* Step Number */}
        <div className="relative w-16 h-16 flex items-center justify-center rounded-full border border-blue-100 bg-white">
          <span className="text-sm font-semibold text-blue-600">
            {stepNumber}
          </span>
        </div>
        
        {/* Icon */}
        <div className="absolute -top-2 -right-2 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm">
          <div className="text-gray-600 w-5 h-5">
            <Icon className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2 sm:text-lg">
          {title}
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed sm:text-sm">
          {description}
        </p>
      </div>

      {/* Connecting Line (visible only on desktop) */}
      {stepNumber < 3 && (
        <div className="hidden lg:block absolute top-8 -right-8 w-16 h-0.5 bg-gray-200" />
      )}
    </motion.div>
  );
}