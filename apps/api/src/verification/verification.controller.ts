import { Controller, Post, Body, Request, UseGuards, Optional, Get, UseInterceptors } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerifyProductDto } from './dto/verify-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('verify')
@UseGuards(ThrottlerGuard) // Rate limiting for all verification endpoints
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60 } }) // 10 requests per minute
  @UseGuards(OptionalJwtAuthGuard) // Optional authentication
  async verifyProduct(
    @Body() verifyProductDto: VerifyProductDto,
    @Request() req,
  ) {
    const userId = req.user?.id;
    return this.verificationService.verifyProduct(verifyProductDto, req, userId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANUFACTURER)
  async getVerificationStats() {
    return this.verificationService.getVerificationStats();
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANUFACTURER)
  async getRecentVerifications() {
    return this.verificationService.getRecentVerifications(20);
  }
}