import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(manufacturerId: string, dto: CreateProductDto): Promise<{
        manufacturer: {
            companyName: string;
            registrationNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productName: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        productCode: string;
        manufacturerId: string;
    }>;
    findAllProducts(manufacturerId: string): Promise<({
        batches: {
            id: string;
            createdAt: Date;
            batchNumber: string;
            manufactureDate: Date;
            expiryDate: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productName: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        productCode: string;
        manufacturerId: string;
    })[]>;
    findOneProduct(manufacturerId: string, productId: string): Promise<{
        manufacturer: {
            companyName: string;
            registrationNumber: string;
        };
        batches: ({
            verificationCodes: {
                id: string;
                createdAt: Date;
                code: string;
                isUsed: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            batchNumber: string;
            manufactureDate: Date;
            expiryDate: Date;
            quantity: number;
            productId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productName: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        productCode: string;
        manufacturerId: string;
    }>;
    updateProduct(manufacturerId: string, productId: string, dto: UpdateProductDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productName: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        productCode: string;
        manufacturerId: string;
    }>;
    private generateUniqueProductCode;
    private isProductCodeExists;
}
