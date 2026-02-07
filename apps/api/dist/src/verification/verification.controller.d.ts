import { VerificationService } from './verification.service';
import { VerifyProductDto } from './dto/verify-product.dto';
export declare class VerificationController {
    private readonly verificationService;
    constructor(verificationService: VerificationService);
    verifyProduct(verifyProductDto: VerifyProductDto, req: any): Promise<import("./interfaces/verification-response.interface").VerificationResponse>;
    getVerificationStats(): Promise<{
        date: Date;
        total: number;
        byStatus: {};
    }>;
    getRecentVerifications(): Promise<({
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
                    description: string | null;
                    category: import(".prisma/client").$Enums.ProductCategory;
                    approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
                    productCode: string;
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
}
