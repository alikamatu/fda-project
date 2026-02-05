'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { swipeRevealVariants } from './animations';

interface HeroImageRevealProps {
  src: string;
  alt: string;
  priority?: boolean;
  onRevealComplete?: () => void;
}

export function HeroImageReveal({ 
  src, 
  alt, 
  priority = false,
  onRevealComplete 
}: HeroImageRevealProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAnimationComplete = () => {
    onRevealComplete?.();
  };

  // Track overlays completion so `onRevealComplete` is only called once
  const overlaysCompletedRef = useRef(0);
  const handleOverlayComplete = () => {
    overlaysCompletedRef.current += 1;
    if (overlaysCompletedRef.current >= 2) {
      onRevealComplete?.();
    }
  };

    // If reduced motion is preferred, show image immediately
  if (shouldReduceMotion) {
    return (
      <div className="relative mx-auto mb-8 sm:mb-10 md:mb-12">
        <div className="relative aspect-[4/3] w-full max-w-[920px] mx-auto sm:max-w-[640px] md:max-w-[800px] rounded-2xl overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover rounded-2xl"
            priority={priority}
            sizes="(max-width: 640px) 280px, (max-width: 768px) 640px, 920px"
            onLoadingComplete={() => setImageLoaded(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative mx-auto mb-8 sm:mb-10 md:mb-12"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full max-w-[920px] mx-auto sm:max-w-[640px] md:max-w-[800px] overflow-hidden rounded-2xl">
        {/* Main Image */}
        <div className={`relative w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover rounded-2xl"
            priority={priority}
            sizes="(max-width: 640px) 280px, (max-width: 768px) 640px, 920px"
            onLoadingComplete={() => setImageLoaded(true)}
          />
        </div>

        {/* Left Overlay */}
        {imageLoaded && (
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-white origin-left"
            initial="hidden"
            animate="visible"
            variants={swipeRevealVariants}
            custom={0}
            onAnimationComplete={handleOverlayComplete}
            style={{
              transformOrigin: 'left center'
            }}
          />
        )}

        {/* Right Overlay */}
        {imageLoaded && (
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full bg-white origin-right"
            initial="hidden"
            animate="visible"
            variants={swipeRevealVariants}
            custom={1}
            onAnimationComplete={handleOverlayComplete}
            style={{
              transformOrigin: 'right center'
            }}
          />
        )}
      </div>
    </div>
  );
}