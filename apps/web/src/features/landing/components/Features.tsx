'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { FeatureGroup } from './FeatureGroup';
import { staggerContainer } from './animations';
import { 
  ShieldCheckIcon, 
  QrCodeIcon, 
  DocumentCheckIcon,
  UserIcon, 
  UsersIcon,
  BuildingOfficeIcon, 
  ShieldExclamationIcon 
} from '@heroicons/react/24/outline';

const ICONS: Record<string, React.ElementType> = {
  ShieldCheckIcon,
  QrCodeIcon,
  DocumentCheckIcon,
  UserIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ShieldExclamationIcon
};

interface FeaturesProps {
  icon: string;
  label: string;
  title: string;
  subtitle?: string;
  featureGroups: Array<{
    title: string;
    icon: string;
    items: string[];
  }>;
}

export function Features({ 
  icon, 
  label, 
  title, 
  subtitle, 
  featureGroups 
}: FeaturesProps) {
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

  const SectionIcon = ICONS[icon] || ShieldCheckIcon;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white" id="features">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Rounded Container (matches Hero and HowItWorks) */}
          <div className="bg-gray-50/50 overflow-hiddenmd:p-12 lg:p-16">
            {/* Section Title */}
            <SectionTitle
              icon={SectionIcon}
              label={label}
              title={title}
              subtitle={subtitle}
              className="mb-8 sm:mb-10 md:mb-12"
            />

            {/* Feature Groups Grid */}
            <motion.div 
              ref={ref}
              className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3"
              {...animationProps}
            >
              {featureGroups.map((group, index) => {
                const GroupIcon = ICONS[group.icon] || UserIcon;
                return (
                  <FeatureGroup
                    key={group.title}
                    title={group.title}
                    icon={<GroupIcon className="w-full h-full" />}
                    items={group.items}
                    index={index}
                  />
                );
              })}
            </motion.div>

            {/* Note about accessibility */}
            <motion.div 
              className="mt-10 pt-6 border-t border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-xs text-gray-500 text-center">
                All features are designed to meet FDA accessibility and compliance standards.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}