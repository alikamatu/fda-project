import { CreateProductDto } from './create-product.dto';
import { ApprovalStatus, ProductCategory } from '@prisma/client';
declare const UpdateProductDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateProductDto>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
    approvalStatus?: ApprovalStatus;
    productName?: string;
    description?: string;
    category?: ProductCategory;
}
export {};
