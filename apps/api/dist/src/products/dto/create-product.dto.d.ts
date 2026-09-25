import { ProductCategory } from '@prisma/client';
export declare class CreateProductDto {
    productName: string;
    description?: string;
    ingredients?: string;
    cautions?: string;
    category: ProductCategory;
}
