export enum UserRole {
  ADMIN = 'ADMIN',
  CONSUMER = 'CONSUMER',
  MANUFACTURER = 'MANUFACTURER',
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface ManufacturerRegisterRequest extends UserRegisterRequest {
  companyName: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone?: string;
  address: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}