import { apiClient } from '@/lib/api-client';
import {
  UserSettings,
  UpdateProfileInput,
  PasswordChangeInput,
  ProfileUpdateResponse,
  PasswordChangeResponse,
  LogoutAllResponse,
} from '@/types/settings';

/**
 * Profile API Service
 * Handles all API communication for user profile operations
 */
export const ProfileService = {
  /**
   * Get current user settings
   */
  async getUserSettings(): Promise<UserSettings> {
    return apiClient.get<UserSettings>('/profile');
  },

  /**
   * Update user profile (name and phone)
   */
  async updateProfile(data: UpdateProfileInput): Promise<ProfileUpdateResponse> {
    return apiClient.patch<ProfileUpdateResponse>('/profile', data);
  },

  /**
   * Change user password
   */
  async changePassword(data: PasswordChangeInput): Promise<PasswordChangeResponse> {
    return apiClient.post<PasswordChangeResponse>('/profile/change-password', data);
  },

  /**
   * Logout from all sessions
   */
  async logoutAllSessions(): Promise<LogoutAllResponse> {
    return apiClient.post<LogoutAllResponse>('/profile/logout-all');
  },
};
