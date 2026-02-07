import { Controller, Get, Param, Query, UseGuards, HttpCode, HttpStatus, NotFoundException, Res, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

/**
 * Admin Verifications Controller
 * Endpoints for admin users to view and manage verification logs
 * Protected by JWT authentication and role guards
 */
@Controller('admin/verifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminVerificationsController {
  constructor(private readonly verificationService: VerificationService) {}

  /**
   * Get paginated list of verification logs with optional filters
   * Query params:
   * - status: VerificationStatus (VALID, EXPIRED, FAKE, USED)
   * - search: string (search in product name, batch number)
   * - startDate: ISO date string
   * - endDate: ISO date string
   * - page: number (default: 1)
   * - limit: number (default: 20, max: 100)
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getVerifications(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    return this.verificationService.getVerificationsForAdmin(
      {
        status,
        search,
        startDate,
        endDate,
        page: Math.max(1, page),
        limit: Math.min(Math.max(1, limit), 100),
      },
    );
  }

  /**
   * Export verifications as CSV
   * Supports the same filters as getVerifications
   * MUST be defined before :id route to match correctly
   */
  @Get('export')
  @HttpCode(HttpStatus.OK)
  async exportVerifications(
    @Res() response: Response,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const csvContent = await this.verificationService.exportVerificationsAsCsv({
      status,
      search,
      startDate,
      endDate,
    });

    // Set response headers for CSV download
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=verifications-${new Date().toISOString().split('T')[0]}.csv`
    );

    response.send(csvContent);
  }

  /**
   * Get details for a specific verification log
   * Includes full product, batch, and manufacturer information
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getVerificationDetails(@Param('id') verificationId: string) {
    try {
      return await this.verificationService.getVerificationDetailsForAdmin(verificationId);
    } catch (error) {
      throw new NotFoundException('Verification not found');
    }
  }
}
