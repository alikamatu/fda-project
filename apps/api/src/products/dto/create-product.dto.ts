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

}