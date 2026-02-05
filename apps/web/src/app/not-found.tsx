'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Card Container */}
            <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden md:p-12">
              <div className="text-center">
                {/* Error Code */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center justify-center">
                    <div className="relative">
                      {/* Background circle */}
                      <div className="absolute inset-0 w-32 h-32 rounded-full bg-blue-50/50" />
                      
                      {/* Error number */}
                      <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-blue-100 bg-white">
                        <span className="text-4xl font-bold text-blue-900">404</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Main Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mb-6"
                >
                  <h1 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl md:text-2xl mb-3">
                    Page Not Found
                  </h1>
                  <p className="text-xs text-gray-600 max-w-xl mx-auto leading-relaxed sm:text-sm">
                    The page you are looking for might have been removed, had its name changed, 
                    or is temporarily unavailable.
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
                >
                  <Button
                    href="/"
                    size="md"
                    className="px-4 py-2 text-sm rounded-md shadow-sm"
                  >
                    Return to Home
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-8"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-gray-700">
                    System Status: Operational
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 text-center">
                  If you believe this is an error, please report it to our support team.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </main>

      {/* Footer Section - Simplified */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <Container>
          <div className="flex flex-col items-center text-center">
            <div className="mb-2">
              <span className="text-xs font-medium text-gray-900">
                FDA Product Verification System
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              A digital platform for verifying FDA-approved products
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
                Official Government System
              </span>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}