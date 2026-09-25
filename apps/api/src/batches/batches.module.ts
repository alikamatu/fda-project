import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { AdminBatchesController } from './admin-batches.controller';

@Module({
  controllers: [BatchesController, AdminBatchesController],
  providers: [BatchesService],
  exports: [BatchesService],
})
export class BatchesModule {}
