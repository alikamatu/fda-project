'use client';

import { useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useLogout } from '@/hooks/useAuth';
import { tokenService } from '@/services/token.service';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { mutate: logout } = useLogout();

  useEffect(() => {
    // Register global 401/403 handler
    // Only logout on token validation errors (401 with invalid/expired token)
    // Don't logout on authorization errors (403 - missing roles/permissions)
    apiClient.setUnauthorizedHandler((status: number, message?: string) => {
      console.log('[AuthProvider] Unauthorized/Forbidden error:', { status, message });
      
      const hasToken = tokenService.isAuthenticated();
      
      if (status === 401 && hasToken) {
        // 401 with a token means the token is invalid/expired
        // This is a token validation failure, so logout
        console.log('[AuthProvider] Token validation failed (401), logging out');
        logout();
      } else if (status === 403) {
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
  }, [logout]);

  return <>{children}</>;
}

