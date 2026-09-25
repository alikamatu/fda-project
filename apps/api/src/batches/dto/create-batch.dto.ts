import { IsDateString, IsNotEmpty, IsNumber, IsPositive, Validate } from 'class-validator';
import { IsAfterConstraint } from '../validators/date.validator';

export class CreateBatchDto {
  @IsNotEmpty()
  @IsDateString()
  manufactureDate!: string;

  @IsNotEmpty()
  @IsDateString()
  @Validate(IsAfterConstraint, ['manufactureDate'])
  expiryDate!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity!: number;
}
