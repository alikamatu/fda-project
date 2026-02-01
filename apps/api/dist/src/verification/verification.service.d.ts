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
    getVerificationStats(): unknown;
    getRecentVerifications(limit?: number): unknown;
}
