'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { fadeInVariants } from './animations';

interface CTAProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export function CTA({ 
  title, 
  description, 
  primaryAction, 
  secondaryAction 
}: CTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  const animationProps = shouldReduceMotion ? {
    initial: "visible",
    animate: "visible",
  } : {
    initial: "hidden",
    animate: isInView ? "visible" : "hidden",
    variants: fadeInVariants,
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Minimal Rounded Container */}
          <div 
            ref={ref}
            className="bg-gradient-to-b from-white to-gray-50/50 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 md:p-12"
          >
            <motion.div 
              className="text-center"
              {...animationProps}
            >
              {/* Title */}
              <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl md:text-2xl">
                {title}
              </h2>

              {/* Description */}
              <p className="mt-3 text-xs text-gray-600 max-w-xl mx-auto leading-relaxed sm:text-sm sm:mt-4">
                {description}
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 sm:mt-8">
                <Button
                  href={primaryAction.href}
                  size="md"
                  className="px-4 py-2 text-sm rounded-md shadow-sm"
                >
                  {primaryAction.label}
                </Button>
                {secondaryAction && (
                  <Button
                    variant="secondary"
                    href={secondaryAction.href}
                    size="md"
                    className="px-4 py-2 text-sm rounded-md"
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </div>

              {/* Trust Indicator - Subtle */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                  FDA Verification System • Secure • Compliant
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}