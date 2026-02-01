import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterManufacturerDto } from './dto/register-manufacturer.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register/user')
  async registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }

  @Post('register/manufacturer')
  async registerManufacturer(@Body() dto: RegisterManufacturerDto) {
    return this.authService.registerManufacturer(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private authService: AuthService) {}

  @Post('activate-user/:id')
  async activateUser(@Body('id') userId: string) {
    // Implementation would activate a user
    // This is a placeholder - you'd need to implement the actual activation logic
    return { message: 'User activated successfully', userId };
  }

  @Post('deactivate-user/:id')
  async deactivateUser(@Body('id') userId: string) {
    // Implementation would deactivate a user
    // This is a placeholder - you'd need to implement the actual deactivation logic
    return { message: 'User deactivated successfully', userId };
  }
}