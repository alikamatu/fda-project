import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
export declare class BatchesController {
    private readonly batchesService;
    constructor(batchesService: BatchesService);
    createBatch(req: any, productId: string, createBatchDto: CreateBatchDto): Promise<{
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
    getAllBatches(req: any, productId: string): Promise<{
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
    getBatch(req: any, productId: string, batchId: string): Promise<{
        qrCodeBase64: string;
        verificationCodes: {
            id: string;
            createdAt: Date;
            code: string;
            isUsed: boolean;
            usedAt: Date | null;
            logs: {
                user: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                id: string;
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
    getVerificationCodes(req: any, productId: string, batchId: string): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        qrImageUrl: string | null;
        isUsed: boolean;
        usedAt: Date | null;
    }[]>;
}
