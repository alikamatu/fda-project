'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { HowItWorksStep } from './HowItWorksStep';
import { staggerContainer } from './animations';

import { 
  ShieldCheckIcon, 
  QrCodeIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

import { StepItem } from '../types';

export const ICONS: Record<string, React.ElementType> = {
  ShieldCheckIcon,
  QrCodeIcon,
  CheckCircleIcon,
};

interface HowItWorksProps {
  icon: string;
  label: string;
  title: string;
  subtitle?: string;
  steps: StepItem[];
}

export function HowItWorks({ 
  icon: iconName, 
  label, 
  title, 
  subtitle, 
  steps 
}: HowItWorksProps) {
  const IconComponent = ICONS[iconName] || CheckCircleIcon; 
  // steps also have icons as strings now, need to resolve them before mapping
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  const animationProps = shouldReduceMotion ? {
    initial: "visible",
    animate: "visible",
  } : {
    initial: "hidden",
    animate: isInView ? "visible" : "hidden",
    variants: staggerContainer,
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" id="how-it-works">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Rounded Container (matches Hero style) */}
          <div className="bg-white overflow-hidden md:p-12 lg:p-16">
            {/* Section Title */}
            <SectionTitle
              icon={IconComponent}
              label={label}
              title={title}
              subtitle={subtitle}
              className="mb-8 sm:mb-10 md:mb-12"
            />

            {/* Steps */}
            <motion.div 
              ref={ref}
              className="relative"
              {...animationProps}
            >
              {/* Grid Container */}
              <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-3 lg:gap-12">
                {steps.map((step, index) => {
                  const StepIcon = ICONS[step.icon] || CheckCircleIcon;
                  return (
                    <div key={step.stepNumber} className="relative">
                      <HowItWorksStep
                        stepNumber={step.stepNumber}
                        title={step.title}
                        description={step.description}
                        icon={StepIcon}
                        index={index}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Mobile Connecting Dots */}
              <div className="lg:hidden mt-8 flex justify-center">
                <div className="flex space-x-2">
                  {[1, 2, 3].map((dot) => (
                    <div
                      key={dot}
                      className="w-2 h-2 rounded-full bg-gray-200"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}