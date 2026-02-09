import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, Validate } from 'class-validator';
import { IsAfterConstraint } from '../validators/date.validator';

export class CreateBatchDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  batchNumber: string;

  @IsNotEmpty()
  @IsDateString()
  manufactureDate: string;

  @IsNotEmpty()
  @IsDateString()
  @Validate(IsAfterConstraint, ['manufactureDate'])
  expiryDate: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}