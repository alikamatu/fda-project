import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, IsNumber, Min, IsDateString } from 'class-validator';
import { ProductCategory } from '@prisma/client';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  productName: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsNotEmpty()
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  batchNumber: string;

  @IsNotEmpty()
  @IsDateString()
  expiryDate: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}