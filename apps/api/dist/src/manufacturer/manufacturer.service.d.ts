import { PrismaService } from '../prisma/prisma.service';
export declare class ManufacturerService {
    private prisma;
    constructor(prisma: PrismaService);
    private getManufacturerId;
    getDashboardStats(userId: string): Promise<{
        isApproved: boolean;
        totalProducts: number;
        activeProducts: number;
        totalVerifications: number;
        recentVerificationsCount: number;
    } | null>;
    getVerifications(userId: string, query: any): Promise<{
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
                    updatedAt: Date;
                    batchNumber: string;
                    manufactureDate: Date;
                    expiryDate: Date;
                    quantity: number;
                    status: import(".prisma/client").$Enums.BatchStatus;
                    notes: string | null;
                    qrCodeUrl: string | null;
                    productId: string;
                    verifiedAt: Date | null;
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
            status: import(".prisma/client").$Enums.VerificationStatus;
            verifiedAt: Date;
            userId: string | null;
            location: string | null;
            ipAddress: string | null;
            deviceInfo: string | null;
            verificationCodeId: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getRecentProducts(userId: string, limit: number): Promise<({
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
    getRecentVerifications(userId: string, limit: number): Promise<({
        verificationCode: {
            productBatch: {
                product: {
                    productName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                batchNumber: string;
                manufactureDate: Date;
                expiryDate: Date;
                quantity: number;
                status: import(".prisma/client").$Enums.BatchStatus;
                notes: string | null;
                qrCodeUrl: string | null;
                productId: string;
                verifiedAt: Date | null;
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
        status: import(".prisma/client").$Enums.VerificationStatus;
        verifiedAt: Date;
        userId: string | null;
        location: string | null;
        ipAddress: string | null;
        deviceInfo: string | null;
        verificationCodeId: string;
    })[]>;
}
