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
    console.error('[AuthProvider] Token exists but returned 401 - likely validation failed');
    console.error('[AuthProvider] Check: Does user exist in DB? Is user.isActive = true?');
  }  else if (status === 403) {
        // 403 means the token is valid but user lacks permissions
        // Don't logout, just let the page handle the error
        console.warn('[AuthProvider] User lacks required permissions (403):', message);
      } else if (status === 401 && !hasToken) {
        // 401 without a token is expected for protected routes
        // Don't logout, user isn't logged in anyway
        console.log('[AuthProvider] No token provided for protected route (401)');
      }
    });

    // Cleanup
    return () => {
      apiClient.setUnauthorizedHandler(() => {});
    };
  }, []);

  return <>{children}</>;
}

