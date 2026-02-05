'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { TrustCard } from './TrustCard';
import { staggerContainer } from './animations';
import { ShieldCheckIcon, LockClosedIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'

interface TrustProps {
  icon: string;
  label: string;
  title: string;
  subtitle?: string;
  items: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

const ICONS: Record<string, React.ElementType> = {
  ShieldCheckIcon,
  LockClosedIcon,
  DocumentCheckIcon
}

export function Trust({ 
  icon, 
  label, 
  title, 
  subtitle, 
  items 
}: TrustProps) {
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
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Rounded Container (matches all previous sections) */}
          <div className="bg-white overflow-hidden md:p-12 lg:p-16">
            {/* Section Title */}
            <SectionTitle
              icon={SectionIcon}
              label={label}
              title={title}
              subtitle={subtitle}
              className="mb-8 sm:mb-10 md:mb-12"
            />

            {/* Trust Cards Grid */}
            <motion.div 
              ref={ref}
              className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3"
              {...animationProps}
            >
              {items.map((item, index) => {
                const ItemIcon = ICONS[item.icon] || ShieldCheckIcon;
                return (
                  <TrustCard
                    key={item.title}
                    title={item.title}
                    description={item.description}
                    icon={<ItemIcon className="w-full h-full" />}
                    index={index}
                  />
                );
              })}
            </motion.div>

            {/* Regulatory Compliance Footer */}
            <motion.div 
              className="mt-12 pt-8 border-t border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-gray-700">
                    System Status: Compliant
                  </span>
                </div>
                <p className="text-xs text-gray-500 max-w-md">
                  This verification system operates under FDA guidance and is regularly audited 
                  for compliance with pharmaceutical safety regulations.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}