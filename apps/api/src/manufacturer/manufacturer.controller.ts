import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ManufacturerService } from './manufacturer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('manufacturer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MANUFACTURER)
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Get('dashboard')
  async getDashboardStats(@Request() req) {
    return this.manufacturerService.getDashboardStats(req.user.id);
  }

  @Get('verifications')
  async getVerifications(@Request() req, @Query() query: any) {
    // Note: In a real app, use the DTO for validation. Here we rely on the service to handle safe defaults or basic casting.
    return this.manufacturerService.getVerifications(req.user.id, query);
  }

  @Get('products/recent')
  async getRecentProducts(
    @Request() req,
    @Query('limit') limit?: number,
  ) {
    return this.manufacturerService.getRecentProducts(
      req.user.id,
      limit ? Number(limit) : 5,
    );
  }

  @Get('verifications/recent')
  async getRecentVerifications(
    @Request() req,
    @Query('limit') limit?: number,
  ) {
    return this.manufacturerService.getRecentVerifications(
      req.user.id,
      limit ? Number(limit) : 10,
    );
  }
}
