'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-8 sm:p-10">
            <div className="text-center">
              {/* Error Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 border-4 border-red-100">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl mb-3">
                System Error
              </h1>
              <p className="text-xs text-gray-600 mb-6 sm:text-sm">
                An unexpected error has occurred. Our technical team has been notified.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-8">
                <p className="text-xs text-gray-600 mb-2">
                  <span className="font-medium">Error Reference:</span>{' '}
                  <code className="text-gray-500">{error.digest || 'Unknown'}</code>
                </p>
                <p className="text-xs text-gray-500">
                  This reference has been logged for investigation.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Button
                  onClick={reset}
                  size="md"
                  className="px-4 py-2 text-sm rounded-md"
                >
                  Try Again
                </Button>
                <Button
                  href="/"
                  variant="secondary"
                  size="md"
                  className="px-4 py-2 text-sm rounded-md"
                >
                  Return to Home
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-gray-700">
                    System Status: Experiencing Issues
                  </span>
                </div>
                <a
                  href="mailto:support@fdaverify.gov.gh"
                  className="text-xs text-blue-700 hover:text-blue-800 transition-colors"
                >
                  support@fdaverify.gov.gh
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}