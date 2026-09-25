'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { HeroImageReveal } from './HeroImageReveal';
import { fadeInVariants, sequentialFadeUp } from './animations';

interface HeroProps {
  title: string;
  subtitle: string;
  image: {
    src: string;
    alt: string;
    priority?: boolean;
  };
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export function Hero({
  title,
  subtitle,
  image,
  primaryAction,
  secondaryAction,
}: HeroProps) {
  const ref = useRef(null);
  const [revealComplete, setRevealComplete] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Auto-start animation for reduced motion
  useEffect(() => {
    if (shouldReduceMotion && !revealComplete) {
      const timer = setTimeout(() => {
        setRevealComplete(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [shouldReduceMotion, revealComplete]);

  const handleRevealComplete = () => {
    setRevealComplete(true);
  };

  const animationProps = {
    initial: "hidden",
    animate: revealComplete ? "visible" : "hidden"
  };

  return (
    <section 
      ref={ref}
      className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8"
    >
      <Container className="w-full">
        <div className="max-w-7xl mx-auto">
          {/* Hero Card Container */}
            {/* Image Reveal Component */}
            <HeroImageReveal
              src={image.src}
              alt={image.alt}
              priority={image.priority}
              onRevealComplete={handleRevealComplete}
            />

            {/* Headline */}
            <motion.h1
              className="text-xl font-semibold tracking-tight text-gray-900 text-center sm:text-2xl md:text-3xl font-montserrat"
              {...animationProps}
              variants={sequentialFadeUp}
              custom={shouldReduceMotion ? 0 : 0.2}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-3 text-xs text-gray-600 text-center max-w-xl mx-auto leading-relaxed sm:text-sm sm:mt-4 md:text-base md:mt-5"
              {...animationProps}
              variants={sequentialFadeUp}
              custom={shouldReduceMotion ? 0.1 : 0.3}
            >
              {subtitle}
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 sm:mt-8"
              {...animationProps}
              variants={fadeInVariants}
              custom={shouldReduceMotion ? 0.2 : 0.4}
            >
              <Button
                href={primaryAction.href}
                size="md"
                className="px-4 py-2 text-sm rounded-md"
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
            </motion.div>
        </div>
      </Container>
    </section>
  );
}