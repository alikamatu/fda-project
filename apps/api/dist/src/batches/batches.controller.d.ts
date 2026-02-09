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
    }>;
    getAllBatches(req: any, productId: string): Promise<{
        productName: string;
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
    }[]>;
    getBatchById(req: any, batchId: string): Promise<{
        product: {
            id: string;
            manufacturer: {
                id: string;
                companyName: string;
                contactEmail: string;
                contactPhone: string | null;
            };
            productName: string;
            productCode: string;
            category: import(".prisma/client").$Enums.ProductCategory;
        };
        verificationCodes: {
            id: string;
            createdAt: Date;
            code: string;
            qrImageUrl: string | null;
            isUsed: boolean;
            usedAt: Date | null;
        }[];
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
    }>;
    getBatch(req: any, productId: string, batchId: string): Promise<{
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
                    email: string;
                    fullName: string;
                } | null;
                status: import(".prisma/client").$Enums.VerificationStatus;
                verifiedAt: Date;
                location: string | null;
            }[];
        }[];
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
