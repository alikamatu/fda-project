import { Controller, Get, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('manufacturers')
  async findAllManufacturers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('isApproved') isApproved?: string,
  ) {
    return this.usersService.findAllManufacturers({
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit ? Number(limit) : undefined,
      search,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      isApproved: isApproved === 'true' ? true : isApproved === 'false' ? false : undefined,
    });
  }

  @Patch(':id/activate')
  async activateUser(@Param('id') id: string, @Request() req) {
    return this.usersService.activateUser(id, req.user.id);
  }

  @Patch(':id/deactivate')
  async deactivateUser(@Param('id') id: string, @Request() req) {
    return this.usersService.deactivateUser(id, req.user.id);
  }

  @Patch(':id/approve-manufacturer')
  async approveManufacturer(@Param('id') id: string, @Request() req) {
    return this.usersService.approveManufacturer(id, req.user.id);
  }

  @Patch(':id/reject-manufacturer')
  async rejectManufacturer(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Request() req,
  ) {
    return this.usersService.rejectManufacturer(id, reason, req.user.id);
  }
}
