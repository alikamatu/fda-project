import { BatchesService } from './batches.service';
import { VerifyBatchDto } from './dto/verify-batch.dto';
import { QueryBatchDto } from './dto/query-batch.dto';
export declare class AdminBatchesController {
    private readonly batchesService;
    constructor(batchesService: BatchesService);
    getAllBatches(query: QueryBatchDto): Promise<{
        productName: string;
        product: {
            manufacturer: {
                id: string;
                companyName: string;
            };
            id: string;
            productName: string;
            productCode: string;
        };
        verificationCodes: {
            id: string;
            code: string;
        }[];
        id: string;
        batchNumber: string;
        manufactureDate: Date;
        expiryDate: Date;
        quantity: number;
        status: import(".prisma/client").$Enums.BatchStatus;
        notes: string | null;
        qrCodeUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        verifiedAt: Date | null;
        productId: string;
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
        batchNumber: string;
        manufactureDate: Date;
        expiryDate: Date;
        quantity: number;
        status: import(".prisma/client").$Enums.BatchStatus;
        notes: string | null;
        qrCodeUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        verifiedAt: Date | null;
        productId: string;
    })[]>;
    getBatchDetail(batchId: string): Promise<{
        product: {
            manufacturer: {
                id: string;
                companyName: string;
                contactEmail: string;
                contactPhone: string | null;
            };
            id: string;
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
        batchNumber: string;
        manufactureDate: Date;
        expiryDate: Date;
        quantity: number;
        status: import(".prisma/client").$Enums.BatchStatus;
        notes: string | null;
        qrCodeUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        verifiedAt: Date | null;
        productId: string;
    }>;
    verifyBatch(batchId: string, verifyBatchDto: VerifyBatchDto): Promise<{
        product: {
            productName: string;
        };
    } & {
        id: string;
        batchNumber: string;
        manufactureDate: Date;
        expiryDate: Date;
        quantity: number;
        status: import(".prisma/client").$Enums.BatchStatus;
        notes: string | null;
        qrCodeUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        verifiedAt: Date | null;
        productId: string;
    }>;
    generateQRCode(batchId: string): Promise<{
        product: {
            productName: string;
        };
    } & {
        id: string;
        batchNumber: string;
        manufactureDate: Date;
        expiryDate: Date;
        quantity: number;
        status: import(".prisma/client").$Enums.BatchStatus;
        notes: string | null;
        qrCodeUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        verifiedAt: Date | null;
        productId: string;
    }>;
}
