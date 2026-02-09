import { BatchesService } from './batches.service';
import { VerifyBatchDto } from './dto/verify-batch.dto';
import { QueryBatchDto } from './dto/query-batch.dto';
export declare class AdminBatchesController {
    private readonly batchesService;
    constructor(batchesService: BatchesService);
    getAllBatches(query: QueryBatchDto): Promise<{
        productName: string;
        product: {
            id: string;
            manufacturer: {
                id: string;
                companyName: string;
            };
            productName: string;
            productCode: string;
        };
        verificationCodes: {
            id: string;
            code: string;
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
    getProductBatches(productId: string): Promise<({
        product: {
            productName: string;
            productCode: string;
        };
        verificationCodes: {
            id: string;
            code: string;
            isUsed: boolean;
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
    })[]>;
    getBatchDetail(batchId: string): Promise<{
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
            logs: {
                id: string;
                status: import(".prisma/client").$Enums.VerificationStatus;
                verifiedAt: Date;
                location: string | null;
            }[];
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
    verifyBatch(batchId: string, verifyBatchDto: VerifyBatchDto): Promise<{
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
    }>;
    generateQRCode(batchId: string): Promise<{
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
    }>;
}
