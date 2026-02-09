import { apiClient } from '@/lib/api-client';
import { tokenService } from './token.service';
import type {
  AuthUser,
  LoginRequest,
  UserRegisterRequest,
  ManufacturerRegisterRequest,
} from '@/types/auth';

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

interface RegisterResponse {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
}

interface ManufacturerRegisterResponse {
  user: RegisterResponse;
  manufacturer: {
    companyName: string;
    registrationNumber: string;
    isApproved: boolean;
  };
}

export const AuthService = {
  async login(data: LoginRequest): Promise<AuthUser> {
    try {
      console.log('[AuthService] Attempting login with:', { email: data.email });
      const response = await apiClient.post<LoginResponse>('/auth/login', data);
      console.log('[AuthService] Login response:', { 
        hasAccessToken: !!response.accessToken,
        user: response.user 
      });
      tokenService.setToken(response.accessToken);
      console.log('[AuthService] Token set, stored token:', { 
        token: tokenService.getToken() ? 'EXISTS' : 'MISSING' 
      });
      return response.user;
    } catch (error) {
      console.error('[AuthService] Login failed:', error);
      throw error;
    }
  },

  async registerUser(data: UserRegisterRequest): Promise<AuthUser> {
    // Remove confirmPassword before sending to API
    const { confirmPassword: _, ...payload } = data;
    const response = await apiClient.post<RegisterResponse>('/auth/register/user', payload);
    return {
      id: response.id,
      email: response.email,
      fullName: response.fullName,
      role: response.role as AuthUser['role'],
      isActive: response.isActive,
    };
  },

  async registerManufacturer(data: ManufacturerRegisterRequest): Promise<ManufacturerRegisterResponse> {
    // Remove confirmPassword and role before sending to API (API sets role automatically)
    const { confirmPassword: _, role: __, ...payload } = data;
    return apiClient.post<ManufacturerRegisterResponse>('/auth/register/manufacturer', payload);
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!tokenService.isAuthenticated()) {
      console.log('[AuthService] No token, returning null');
      return null;
    }

    try {
      console.log('[AuthService] Fetching current user');
      const user = await apiClient.get<AuthUser>('/auth/me');
      console.log('[AuthService] Got user:', user);
      return user;
    } catch (error) {
      console.error('[AuthService] Failed to get user:', error);
      return null;
    }
  },

  logout(): void {
    tokenService.removeToken();
  },
};