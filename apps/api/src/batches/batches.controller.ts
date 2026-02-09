import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('manufacturer/products/:productId/batches')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MANUFACTURER)
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  async createBatch(
    @Request() req,
    @Param('productId') productId: string,
    @Body() createBatchDto: CreateBatchDto,
  ) {
    const manufacturerId = req.user.id;
    return this.batchesService.createBatch(manufacturerId, productId, createBatchDto);
  }

  @Get()
  async getAllBatches(@Request() req, @Param('productId') productId: string) {
    const manufacturerId = req.user.id;
    return this.batchesService.findAllBatches(manufacturerId, productId);
  }

  @Get('by-id/:batchId')
  async getBatchById(@Request() req, @Param('batchId') batchId: string) {
    const manufacturerId = req.user.id;
    return this.batchesService.findOneBatchById(manufacturerId, batchId);
  }

  @Get(':batchId')
  async getBatch(
    @Request() req,
    @Param('productId') productId: string,
    @Param('batchId') batchId: string,
  ) {
    const manufacturerId = req.user.id;
    return this.batchesService.findOneBatch(manufacturerId, productId, batchId);
  }

  @Get(':batchId/codes')
  async getVerificationCodes(
    @Request() req,
    @Param('productId') productId: string,
    @Param('batchId') batchId: string,
  ) {
    const manufacturerId = req.user.id;
    return this.batchesService.getVerificationCodes(manufacturerId, productId, batchId);
  }
}