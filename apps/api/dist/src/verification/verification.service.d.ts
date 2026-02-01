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
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        } | null;
    } & {
        id: string;
        status: import(".prisma/client").$Enums.VerificationStatus;
        location: string | null;
        ipAddress: string | null;
        deviceInfo: string | null;
        verificationCodeId: string;
        userId: string | null;
        verifiedAt: Date;
    })[]>;
}
