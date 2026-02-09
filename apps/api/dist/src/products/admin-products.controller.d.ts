import { ProductsService } from './products.service';
export declare class AdminProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: any): Promise<{
        data: ({
            manufacturer: {
                companyName: string;
            };
            _count: {
                batches: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productName: string;
            productCode: string;
            description: string | null;
            category: import(".prisma/client").$Enums.ProductCategory;
            approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
            manufacturerId: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        manufacturer: {
            companyName: string;
            registrationNumber: string;
            contactEmail: string;
            contactPhone: string | null;
        };
        batches: {
            id: string;
            createdAt: Date;
            batchNumber: string;
            manufactureDate: Date;
            expiryDate: Date;
            quantity: number;
            productId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productName: string;
        productCode: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        manufacturerId: string;
    }>;
    approve(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productName: string;
        productCode: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        manufacturerId: string;
    }>;
    reject(id: string, reason?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productName: string;
        productCode: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        manufacturerId: string;
    }>;
}
