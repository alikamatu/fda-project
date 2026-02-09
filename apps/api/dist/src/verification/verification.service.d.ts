import { PrismaService } from '../prisma/prisma.service';
import { VerifyProductDto } from './dto/verify-product.dto';
import { VerificationResponse } from './interfaces/verification-response.interface';
import { Request } from 'express';
export declare class VerificationService {
    private prisma;
    constructor(prisma: PrismaService);
    verifyProduct(dto: VerifyProductDto, request: Request, userId?: string): Promise<VerificationResponse>;
    private extractSerialNumber;
    private getClientIp;
    private buildResponse;
    private formatCategory;
    private logErrorAttempt;
    getVerificationStats(): Promise<{
        date: Date;
        total: number;
        byStatus: {};
    }>;
    getRecentVerifications(limit?: number): Promise<({
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        } | null;
        verificationCode: {
            productBatch: {
                product: {
                    manufacturer: {
                        companyName: string;
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
    })[]>;
    getVerificationsForAdmin(filters: {
        status?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<{
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
    getVerificationDetailsForAdmin(verificationId: string): Promise<{
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
    exportVerificationsAsCsv(filters: {
        status?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<string>;
}
