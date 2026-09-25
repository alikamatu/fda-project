import { Controller, Get, Patch, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Profile Controller
 * Endpoints for authenticated users to manage their own profile
 */
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get current user settings
   */
  @Get()
  async getUserSettings(@Request() req: { user: { id: string } }) {
    return this.profileService.getUserSettings(req.user.id);
  }

  /**
   * Update profile (name and phone)
   */
  @Patch()
  async updateProfile(
    @Request() req: { user: { id: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(req.user.id, dto);
  }

  /**
   * Change password
   */
  @Post('change-password')
  async changePassword(
    @Request() req: { user: { id: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.profileService.changePassword(req.user.id, dto);
  }

  /**
   * Logout from all sessions
   */
  @Post('logout-all')
  async logoutAllSessions(@Request() req: { user: { id: string } }) {
    return this.profileService.logoutAllSessions(req.user.id);
  }
}
