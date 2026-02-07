import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
export declare class BatchesService {
    private prisma;
    constructor(prisma: PrismaService);
    createBatch(manufacturerId: string, productId: string, dto: CreateBatchDto): Promise<{
        verificationCodes: string[];
        qrCodeBase64: string;
        product: {
            productName: string;
            productCode: string;
        };
        id: string;
        createdAt: Date;
        batchNumber: string;
        manufactureDate: Date;
        expiryDate: Date;
        quantity: number;
        productId: string;
    }>;
    findAllBatches(manufacturerId: string, productId: string): Promise<{
        qrCodeBase64: string;
        verificationCodes: {
            id: string;
            createdAt: Date;
            code: string;
            isUsed: boolean;
            usedAt: Date | null;
        }[];
        id: string;
        createdAt: Date;
        batchNumber: string;
        manufactureDate: Date;
        expiryDate: Date;
        quantity: number;
        productId: string;
    }[]>;
    findOneBatch(manufacturerId: string, productId: string, batchId: string): Promise<{
        qrCodeBase64: string;
        verificationCodes: {
            id: string;
            createdAt: Date;
            code: string;
            isUsed: boolean;
            usedAt: Date | null;
            logs: {
                id: string;
                user: {
                    id: string;
                    fullName: string;
                    email: string;
                } | null;
                status: import(".prisma/client").$Enums.VerificationStatus;
                location: string | null;
                verifiedAt: Date;
            }[];
        }[];
        id: string;
        createdAt: Date;
        batchNumber: string;
        manufactureDate: Date;
        expiryDate: Date;
        quantity: number;
        productId: string;
    }>;
    getVerificationCodes(manufacturerId: string, productId: string, batchId: string): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        qrImageUrl: string | null;
        isUsed: boolean;
        usedAt: Date | null;
    }[]>;
    private generateVerificationCodes;
    private generateQRCodeBase64;
}
