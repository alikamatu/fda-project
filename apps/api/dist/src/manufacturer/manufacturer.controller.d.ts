import { ManufacturerService } from './manufacturer.service';
export declare class ManufacturerController {
    private readonly manufacturerService;
    constructor(manufacturerService: ManufacturerService);
    getDashboardStats(req: any): Promise<{
        isApproved: boolean;
        totalProducts: number;
        activeProducts: number;
        totalVerifications: number;
        recentVerificationsCount: number;
    } | null>;
    getVerifications(req: any, query: any): Promise<{
        data: ({
            verificationCode: {
                productBatch: {
                    product: {
                        productName: string;
                        productCode: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    batchNumber: string;
                    manufactureDate: Date;
                    expiryDate: Date;
                    quantity: number;
                    productId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                code: string;
                qrImageUrl: string | null;
                isUsed: boolean;
                productBatchId: string;
                usedAt: Date | null;
            };
        } & {
            id: string;
            userId: string | null;
            status: import(".prisma/client").$Enums.VerificationStatus;
            location: string | null;
            ipAddress: string | null;
            deviceInfo: string | null;
            verificationCodeId: string;
            verifiedAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getRecentProducts(req: any, limit?: number): Promise<({
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
    })[]>;
    getRecentVerifications(req: any, limit?: number): Promise<({
        verificationCode: {
            productBatch: {
                product: {
                    productName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                batchNumber: string;
                manufactureDate: Date;
                expiryDate: Date;
                quantity: number;
                productId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            code: string;
            qrImageUrl: string | null;
            isUsed: boolean;
            productBatchId: string;
            usedAt: Date | null;
        };
    } & {
        id: string;
        userId: string | null;
        status: import(".prisma/client").$Enums.VerificationStatus;
        location: string | null;
        ipAddress: string | null;
        deviceInfo: string | null;
        verificationCodeId: string;
        verifiedAt: Date;
    })[]>;
}
