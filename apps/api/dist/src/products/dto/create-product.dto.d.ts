import { ProductCategory } from '@prisma/client';
export declare class CreateProductDto {
    productName: string;
    description?: string;
    category: ProductCategory;
    batchNumber: string;
    expiryDate: string;
    quantity: number;
}
