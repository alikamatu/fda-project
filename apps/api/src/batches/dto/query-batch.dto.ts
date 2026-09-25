import { IsOptional, IsEnum } from 'class-validator';
import { BatchStatus } from '@prisma/client';

export class QueryBatchDto {
  @IsOptional()
  @IsEnum(BatchStatus)
  status?: BatchStatus;
}
