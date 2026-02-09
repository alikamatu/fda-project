import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BatchesService } from './batches.service';
import { VerifyBatchDto } from './dto/verify-batch.dto';
import { QueryBatchDto } from './dto/query-batch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin/batches')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminBatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Get()
  async getAllBatches(@Query() query: QueryBatchDto) {
    return this.batchesService.findAllBatchesForAdmin(query.status);
  }

  @Get('product/:productId/all')
  async getProductBatches(@Param('productId') productId: string) {
    return this.batchesService.findBatchesByProductForAdmin(productId);
  }

  @Get(':batchId')
  async getBatchDetail(@Param('batchId') batchId: string) {
    console.log(`[AdminBatchesController] getBatchDetail called with batchId=${batchId}`);
    return this.batchesService.findOneBatchForAdmin(batchId);
  }

  @Patch(':batchId/verify')
  async verifyBatch(
    @Param('batchId') batchId: string,
    @Body() verifyBatchDto: VerifyBatchDto,
  ) {
    return this.batchesService.verifyBatch(batchId, verifyBatchDto);
  }

  @Patch(':batchId/qrcode')
  async generateQRCode(@Param('batchId') batchId: string) {
    return this.batchesService.generateAndSaveBatchQRCode(batchId);
  }
}
