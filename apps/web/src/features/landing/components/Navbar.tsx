'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface NavItem {
  label: string;
  href: string;
  primary?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Trust & Compliance', href: '#trust' },
  { label: 'Register', href: '/auth/register', primary: true },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  // Only depend on `pathname` so opening the menu doesn't trigger an immediate close.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200'
            : 'bg-white border-b border-gray-100'
        }`}
        role="banner"
      >
        <Container>
          <nav className="flex items-center justify-between py-4" aria-label="Main navigation">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-base font-semibold tracking-tight text-gray-900 hover:text-blue-700 transition-colors"
                aria-label="FDA Product Verification System - Home"
              >
                <span className="text-blue-900">FDA</span>
                <span className="text-gray-700">Verify</span>
              </Link>
              <div className="hidden sm:block ml-3 pl-3 border-l border-gray-200">
                <span className="text-xs text-gray-500 font-medium">
                  Product Verification System
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <div key={item.href}>
                  {item.primary ? (
                    <Button
                      href={item.href}
                      size="sm"
                      className="px-4 py-1.5 text-xs rounded-md"
                    >
                      {item.label}
                    </Button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-xs font-medium transition-colors ${
                        pathname === item.href
                          ? 'text-blue-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </nav>
        </Container>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-600/50 z-[60] lg:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-[60] lg:hidden shadow-xl"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="text-base font-semibold tracking-tight text-gray-900">
                      <span className="text-blue-900">FDA</span>
                      <span className="text-gray-700">Verify</span>
                    </span>
                    <div className="ml-3 pl-3 border-l border-gray-200">
                      <span className="text-xs text-gray-500 font-medium">System</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto p-6" aria-label="Mobile navigation">
                  <div className="space-y-6">
                    {NAV_ITEMS.map((item) => (
                      <div key={item.href}>
                        {item.primary ? (
                          <Button
                            href={item.href}
                            size="md"
                            className="w-full justify-center px-4 py-2.5 text-sm rounded-md"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.label}
                          </Button>
                        ) : (
                          <Link
                            href={item.href}
                            className={`block text-sm font-medium transition-colors py-2 ${
                              pathname === item.href
                                ? 'text-blue-700'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            onClick={() => setIsOpen(false)}
                            aria-current={pathname === item.href ? 'page' : undefined}
                          >
                            {item.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-600 mr-2" />
                      <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
                        Official Government System
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      For assistance: support@fdaverify.gov.gh
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}