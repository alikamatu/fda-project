'use client';

import { useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { tokenService } from '@/services/token.service';

export function AuthProvider({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    // Register global 401/403 handler
    // Only logout on token validation errors (401 with invalid/expired token)
    // Don't logout on authorization errors (403 - missing roles/permissions)
apiClient.setUnauthorizedHandler((status: number, message?: string) => {
  console.log('[AuthProvider] Unauthorized/Forbidden error:', { 
    status, 
    message,
    token: tokenService.getToken() ? 'EXISTS' : 'MISSING',
    isAuthenticating: true
  });
  
  const hasToken = tokenService.isAuthenticated();
  
  if (status === 401 && hasToken) {
    // 401 on a route that HAD a token means the token is likely invalid/expired
    console.error('[AuthProvider] Token exists but returned 401 - likely validation failed or expired');
  }  else if (status === 403) {
        // 403 means the token is valid but user lacks permissions (or is inactive)
        console.warn('[AuthProvider] Access forbidden (403):', message);
      } else if (status === 401 && !hasToken) {
        // 401 without a token is expected for protected routes OR failed login
        console.log('[AuthProvider] Unauthorized (401):', message);
      }
    });

    // Cleanup
    return () => {
      apiClient.setUnauthorizedHandler(() => {});
    };
  }, []);

  return <>{children}</>;
}

