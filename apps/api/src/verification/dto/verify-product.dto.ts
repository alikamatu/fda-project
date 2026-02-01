import { IsOptional, IsString } from 'class-validator';
import { ExactlyOneField } from '../validators/exactly-one-field.validator';

export class VerifyProductDto {
  @IsOptional()
  @IsString()
  @ExactlyOneField(['serialNumber', 'qrData'])
  serialNumber?: string;

  @IsOptional()
  @IsString()
  @ExactlyOneField(['serialNumber', 'qrData'])
  qrData?: string;

  @IsOptional()
  @IsString()
  location?: string;
}