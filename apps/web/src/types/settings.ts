export interface UserSettings {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateProfileInput {
  fullName: string;
  phone?: string;
}

export interface PasswordChangeInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileUpdateResponse {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface PasswordChangeResponse {
  message: string;
}

export interface LogoutAllResponse {
  message: string;
}
