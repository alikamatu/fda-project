'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { fadeInVariants } from './animations';

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const shouldReduceMotion = useReducedMotion();

  const currentYear = new Date().getFullYear();

  const animationProps = shouldReduceMotion ? {
    initial: "visible",
    animate: "visible",
  } : {
    initial: "hidden",
    animate: isInView ? "visible" : "hidden",
    variants: fadeInVariants,
  };

  return (
    <footer 
      ref={ref}
      className="bg-gray-50 border-t border-gray-200 pt-8 pb-6"
      role="contentinfo"
      aria-label="Footer"
    >
      <Container>
        <motion.div {...animationProps}>
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
            {/* Brand / System Name */}
            <div className="md:col-span-1">
              <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                FDA Product Verification System
              </h2>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                A digital platform for verifying FDA-approved products and preventing counterfeit distribution.
              </p>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                System
              </h3>
              <ul className="space-y-2" role="list">
                <li>
                  <Link 
                    href="/verify" 
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Verify Product
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/register" 
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Manufacturer Registration
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin" 
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Resources
              </h3>
              <ul className="space-y-2" role="list">
                <li>
                  <Link 
                    href="/how-it-works" 
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/features" 
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/trust" 
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Trust & Compliance
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Contact Information */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Legal & Contact
              </h3>
              
              {/* Legal Links */}
              <div className="mb-4">
                <ul className="space-y-2" role="list">
                  <li>
                    <Link 
                      href="/privacy" 
                      className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/terms" 
                      className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/disclaimer" 
                      className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Information */}
              <div>
                <p className="text-xs text-gray-600 mb-1">
                  Email:{' '}
                  <a 
                    href="mailto:support@fdaverify.gov.gh" 
                    className="text-gray-900 hover:text-blue-700 transition-colors"
                  >
                    support@fdaverify.gov.gh
                  </a>
                </p>
                <p className="text-xs text-gray-600">
                  Office: Accra, Ghana
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-300">
            {/* Copyright */}
            <div className="flex flex-col items-start md:flex-row md:justify-between md:items-center">
              <p className="text-xs text-gray-500">
                © {currentYear} FDA Product Verification System. All rights reserved.
              </p>
              
              {/* Government Badge */}
              <div className="mt-2 md:mt-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                  <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
                    Official Government System
                  </span>
                </div>
              </div>
            </div>

            {/* Compliance Notice */}
            <div className="mt-4">
              <p className="text-[10px] text-gray-400 leading-relaxed">
                This system operates under the authority of the Food and Drugs Authority of Ghana 
                and complies with international pharmaceutical verification standards.
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
}