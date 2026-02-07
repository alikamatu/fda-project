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
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    tokenService.setToken(response.accessToken);
    return response.user;
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
      return null;
    }
    try {
      return await apiClient.get<AuthUser>('/auth/me');
    } catch (error) {
      // Only remove token if it's actually invalid (401 Unauthorized)
      // Don't remove token on other errors (network, server errors, etc)
      if (error instanceof Error && 'status' in error && (error as any).status === 401) {
        tokenService.removeToken();
      }
      return null;
    }
  },

  logout(): void {
    tokenService.removeToken();
  },
};