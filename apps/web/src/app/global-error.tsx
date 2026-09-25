'use client';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gray-50/30 p-4">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-8 sm:p-10">
              <div className="text-center">
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
                  Critical System Error
                </h1>
                <p className="text-xs text-gray-600 mb-6 sm:text-sm">
                  The FDA Verification System has encountered a critical error.
                  Please try again or contact support.
                </p>

                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                  <Button
                    onClick={reset}
                    size="md"
                    className="px-4 py-2 text-sm rounded-md"
                  >
                    Try Again
                  </Button>
                  <Button
                    href="mailto:support@fdaverify.gov.gh"
                    variant="secondary"
                    size="md"
                    className="px-4 py-2 text-sm rounded-md"
                  >
                    Contact Support
                  </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">
                    Error Reference: {error.digest || 'Unknown'}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-medium text-gray-700">
                      Critical Error Detected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </body>
    </html>
  );
}