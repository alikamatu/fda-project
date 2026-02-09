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
    findOneBatch(manufacturerId: string, productId: string, batchId: string): Promise<{
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
                    fullName: string;
                    email: string;
                } | null;
                id: string;
                status: import(".prisma/client").$Enums.VerificationStatus;
                verifiedAt: Date;
                location: string | null;
            }[];
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
    findOneBatchForAdmin(batchId: string): Promise<{
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
    findOneBatchById(manufacturerId: string, batchId: string): Promise<{
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
    verifyBatch(batchId: string, dto: {
        status: BatchStatus;
        notes?: string;
    }): Promise<{
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
    generateAndSaveBatchQRCode(batchId: string): Promise<{
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
    private generateQRCodeBase64;
}
