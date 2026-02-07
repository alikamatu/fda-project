import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createProduct(req: any, createProductDto: CreateProductDto): Promise<{
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
    getAllProducts(req: any): Promise<({
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
    getProduct(req: any, productId: string): Promise<{
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
    updateProduct(req: any, productId: string, updateProductDto: UpdateProductDto): Promise<{
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
}
