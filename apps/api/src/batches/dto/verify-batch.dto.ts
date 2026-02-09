import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BatchStatus } from '@prisma/client';

export class VerifyBatchDto {
  @IsEnum(BatchStatus)
  status: BatchStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
