import { VerificationStatus } from '@prisma/client';
export declare class GetVerificationsQueryDto {
    page?: number;
    limit?: number;
    status?: VerificationStatus;
    productId?: string;
    startDate?: string;
    endDate?: string;
}
