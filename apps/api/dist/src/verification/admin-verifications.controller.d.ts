import { Response } from 'express';
import { VerificationService } from './verification.service';
export declare class AdminVerificationsController {
    private readonly verificationService;
    constructor(verificationService: VerificationService);
    getVerifications(status?: string, search?: string, startDate?: string, endDate?: string, page?: number, limit?: number): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
            } | null;
            verificationCode: {
                productBatch: {
                    product: {
                        manufacturer: {
                            id: string;
                            companyName: string;
                            registrationNumber: string;
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
    exportVerifications(response: Response, status?: string, search?: string, startDate?: string, endDate?: string): Promise<void>;
    getVerificationDetails(verificationId: string): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        } | null;
        verificationCode: {
            productBatch: {
                product: {
                    manufacturer: {
                        id: string;
                        companyName: string;
                        registrationNumber: string;
                        contactEmail: string;
                        address: string;
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
    }>;
}
