import { BatchStatus } from '@prisma/client';
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
    findAllBatches(manufacturerId: string, productId: string): Promise<{
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
    getVerificationCodes(manufacturerId: string, productId: string, batchId: string): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        qrImageUrl: string | null;
        isUsed: boolean;
        usedAt: Date | null;
    }[]>;
    private generateVerificationCodes;
    findAllBatchesForAdmin(status?: string): Promise<{
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
    findBatchesByProductForAdmin(productId: string): Promise<({
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
    findOneBatchForAdmin(batchId: string): Promise<{
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
    findOneBatchById(manufacturerId: string, batchId: string): Promise<{
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
    verifyBatch(batchId: string, dto: {
        status: BatchStatus;
        notes?: string;
    }): Promise<{
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
    generateAndSaveBatchQRCode(batchId: string): Promise<{
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
    private generateQRCodeBase64;
}
