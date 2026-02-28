'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '@/services/auth.service';
import { AuthUser, AuthState, LoginRequest, UserRegisterRequest, ManufacturerRegisterRequest } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/lib/routes';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  registerUser: (data: UserRegisterRequest) => Promise<void>;
  registerManufacturer: (data: ManufacturerRegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setState(prev => ({ ...prev, user, isLoading: false }));
    } catch {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleLogin = async (data: LoginRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await AuthService.login(data);
      setState(prev => ({ ...prev, user, isLoading: false }));
      
      // Redirect based on role
      switch (user.role) {
        case 'ADMIN':
          router.push(APP_ROUTES.ADMIN);
          break;
        case 'MANUFACTURER':
          router.push(APP_ROUTES.MANUFACTURER_PENDING);
          break;
        default:
          router.push(APP_ROUTES.VERIFY);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  };

  const handleRegisterUser = async (data: UserRegisterRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await AuthService.registerUser(data);
      setState(prev => ({ ...prev, user, isLoading: false }));
      
      // Redirect based on role
      switch (user.role) {
        case 'ADMIN':
          router.push(APP_ROUTES.ADMIN);
          break;
        case 'MANUFACTURER':
          router.push(APP_ROUTES.MANUFACTURER_PENDING);
          break;
        default:
          router.push(APP_ROUTES.VERIFY);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }));
      throw error;
    }
  };

  const handleRegisterManufacturer = async (data: ManufacturerRegisterRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await AuthService.registerManufacturer(data);
      // store returned user (will have role MANUFACTURER)
      setState(prev => ({ ...prev, user: result.user, isLoading: false }));
      router.push(APP_ROUTES.MANUFACTURER_PENDING);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Manufacturer registration failed',
      }));
      throw error;
    }
  };

  const handleLogout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await AuthService.logout();
      setState({ user: null, isLoading: false, error: null });
      router.push(APP_ROUTES.LOGIN);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      }));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextValue = {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login: handleLogin,
    registerUser: handleRegisterUser,
    registerManufacturer: handleRegisterManufacturer,
    logout: handleLogout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}