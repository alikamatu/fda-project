import { ApprovalStatus, ProductCategory } from '@prisma/client';
declare const UpdateProductDto_base: any;
export declare class UpdateProductDto extends UpdateProductDto_base {
    approvalStatus?: ApprovalStatus;
    productName?: string;
    description?: string;
    category?: ProductCategory;
}
export {};
