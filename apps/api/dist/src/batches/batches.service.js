"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchesService = void 0;
const common_1 = require("@nestjs/common");
const QRCode = require("qrcode");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../prisma/prisma.service");
let BatchesService = class BatchesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBatch(manufacturerId, productId, dto) {
        const manufacturer = await this.prisma.manufacturer.findUnique({
            where: { userId: manufacturerId },
            include: { user: true },
        });
        if (!manufacturer) {
            throw new common_1.NotFoundException('Manufacturer not found');
        }
        if (!manufacturer.isApproved || !manufacturer.user.isActive) {
            throw new common_1.ForbiddenException('Manufacturer account is not approved or active');
        }
        const product = await this.prisma.product.findFirst({
            where: {
                id: productId,
                manufacturerId: manufacturer.id,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found or access denied');
        }
        const existingBatch = await this.prisma.productBatch.findFirst({
            where: {
                productId,
                batchNumber: dto.batchNumber,
            },
        });
        if (existingBatch) {
            throw new common_1.ConflictException(`Batch number '${dto.batchNumber}' already exists for this product`);
        }
        const verificationCodes = await this.generateVerificationCodes(dto.quantity);
        const result = await this.prisma.$transaction(async (tx) => {
            const batch = await tx.productBatch.create({
                data: {
                    batchNumber: dto.batchNumber,
                    manufactureDate: new Date(dto.manufactureDate),
                    expiryDate: new Date(dto.expiryDate),
                    quantity: dto.quantity,
                    productId,
                },
                include: {
                    product: {
                        select: {
                            productName: true,
                            productCode: true,
                        },
                    },
                },
            });
            await tx.verificationCode.createMany({
                data: verificationCodes.map(code => ({
                    code,
                    productBatchId: batch.id,
                })),
            });
            return batch;
        });
        const firstCode = verificationCodes[0];
        const qrData = {
            serialNumber: firstCode,
            productId: product.id,
            batchId: result.id,
            productName: product.productName,
            batchNumber: dto.batchNumber,
            manufactureDate: dto.manufactureDate,
            expiryDate: dto.expiryDate,
        };
        const qrCodeBase64 = await this.generateQRCodeBase64(qrData);
        return {
            ...result,
            verificationCodes: verificationCodes,
            qrCodeBase64,
        };
    }
    async findAllBatches(manufacturerId, productId) {
        const manufacturer = await this.prisma.manufacturer.findUnique({
            where: { userId: manufacturerId },
        });
        if (!manufacturer) {
            throw new common_1.NotFoundException('Manufacturer not found');
        }
        const product = await this.prisma.product.findFirst({
            where: {
                id: productId,
                manufacturerId: manufacturer.id,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found or access denied');
        }
        const batches = await this.prisma.productBatch.findMany({
            where: {
                productId,
            },
            include: {
                verificationCodes: {
                    select: {
                        id: true,
                        code: true,
                        isUsed: true,
                        createdAt: true,
                        usedAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const batchesWithQR = await Promise.all(batches.map(async (batch) => {
            const qrData = {
                serialNumber: batch.verificationCodes[0]?.code || 'N/A',
                productId: product.id,
                batchId: batch.id,
                productName: product.productName,
                batchNumber: batch.batchNumber,
                manufactureDate: batch.manufactureDate.toISOString(),
                expiryDate: batch.expiryDate.toISOString(),
            };
            const qrCodeBase64 = await this.generateQRCodeBase64(qrData);
            return {
                ...batch,
                productName: product.productName,
                qrCodeBase64,
            };
        }));
        return batchesWithQR;
    }
    async findOneBatch(manufacturerId, productId, batchId) {
        const manufacturer = await this.prisma.manufacturer.findUnique({
            where: { userId: manufacturerId },
        });
        if (!manufacturer) {
            throw new common_1.NotFoundException('Manufacturer not found');
        }
        const product = await this.prisma.product.findFirst({
            where: {
                id: productId,
                manufacturerId: manufacturer.id,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found or access denied');
        }
        const batch = await this.prisma.productBatch.findFirst({
            where: {
                id: batchId,
                productId,
            },
            include: {
                verificationCodes: {
                    select: {
                        id: true,
                        code: true,
                        isUsed: true,
                        createdAt: true,
                        usedAt: true,
                        logs: {
                            select: {
                                id: true,
                                status: true,
                                location: true,
                                verifiedAt: true,
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        fullName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!batch) {
            throw new common_1.NotFoundException('Batch not found or access denied');
        }
        const qrData = {
            serialNumber: batch.verificationCodes[0]?.code || 'N/A',
            productId: product.id,
            batchId: batch.id,
            productName: product.productName,
            batchNumber: batch.batchNumber,
            manufactureDate: batch.manufactureDate.toISOString(),
            expiryDate: batch.expiryDate.toISOString(),
        };
        const qrCodeBase64 = await this.generateQRCodeBase64(qrData);
        return {
            ...batch,
            qrCodeBase64,
        };
    }
    async getVerificationCodes(manufacturerId, productId, batchId) {
        const manufacturer = await this.prisma.manufacturer.findUnique({
            where: { userId: manufacturerId },
        });
        if (!manufacturer) {
            throw new common_1.NotFoundException('Manufacturer not found');
        }
        const product = await this.prisma.product.findFirst({
            where: {
                id: productId,
                manufacturerId: manufacturer.id,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found or access denied');
        }
        const batch = await this.prisma.productBatch.findFirst({
            where: {
                id: batchId,
                productId,
            },
            include: {
                verificationCodes: {
                    select: {
                        id: true,
                        code: true,
                        isUsed: true,
                        createdAt: true,
                        usedAt: true,
                        qrImageUrl: true,
                    },
                },
            },
        });
        if (!batch) {
            throw new common_1.NotFoundException('Batch not found or access denied');
        }
        return batch.verificationCodes;
    }
    async generateVerificationCodes(quantity) {
        const codes = [];
        for (let i = 0; i < quantity; i++) {
            const uuid = (0, uuid_1.v4)();
            const code = `FDA-PROD-${uuid.toUpperCase().replace(/-/g, '').substring(0, 12)}`;
            const existing = await this.prisma.verificationCode.findUnique({
                where: { code },
            });
            if (!existing) {
                codes.push(code);
            }
            else {
                i--;
            }
        }
        return codes;
    }
    async findAllBatchesForAdmin(status) {
        const whereClause = {};
        if (status) {
            whereClause.status = status;
        }
        const batches = await this.prisma.productBatch.findMany({
            where: whereClause,
            include: {
                product: {
                    select: {
                        id: true,
                        productName: true,
                        productCode: true,
                        manufacturer: {
                            select: {
                                id: true,
                                companyName: true,
                            },
                        },
                    },
                },
                verificationCodes: {
                    select: {
                        id: true,
                        code: true,
                    },
                    take: 5,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return batches.map(batch => ({
            ...batch,
            productName: batch.product.productName,
        }));
    }
    async findBatchesByProductForAdmin(productId) {
        const batches = await this.prisma.productBatch.findMany({
            where: {
                productId,
            },
            include: {
                product: {
                    select: {
                        productName: true,
                        productCode: true,
                    },
                },
                verificationCodes: {
                    select: {
                        id: true,
                        code: true,
                        isUsed: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return batches;
    }
    async findOneBatchForAdmin(batchId) {
        console.log(`[BatchesService] findOneBatchForAdmin lookup id=${batchId}`);
        const batch = await this.prisma.productBatch.findUnique({
            where: { id: batchId },
            include: {
                product: {
                    select: {
                        id: true,
                        productName: true,
                        productCode: true,
                        category: true,
                        manufacturer: {
                            select: {
                                id: true,
                                companyName: true,
                                contactEmail: true,
                                contactPhone: true,
                            },
                        },
                    },
                },
                verificationCodes: {
                    select: {
                        id: true,
                        code: true,
                        qrImageUrl: true,
                        isUsed: true,
                        createdAt: true,
                        usedAt: true,
                        logs: {
                            select: {
                                id: true,
                                status: true,
                                location: true,
                                verifiedAt: true,
                            },
                        },
                    },
                },
            },
        });
        if (!batch) {
            console.log(`[BatchesService] findOneBatchForAdmin: no batch found for id=${batchId}`);
            throw new common_1.NotFoundException('Batch not found');
        }
        console.log(`[BatchesService] findOneBatchForAdmin: found batch id=${batch.id} productId=${batch.productId}`);
        return batch;
    }
    async findOneBatchById(manufacturerId, batchId) {
        const manufacturer = await this.prisma.manufacturer.findUnique({
            where: { userId: manufacturerId },
        });
        if (!manufacturer) {
            throw new common_1.NotFoundException('Manufacturer not found');
        }
        const batch = await this.prisma.productBatch.findUnique({
            where: { id: batchId },
            include: {
                product: {
                    select: {
                        id: true,
                        productName: true,
                        productCode: true,
                        category: true,
                        manufacturer: {
                            select: {
                                id: true,
                                companyName: true,
                                contactEmail: true,
                                contactPhone: true,
                            },
                        },
                    },
                },
                verificationCodes: {
                    select: {
                        id: true,
                        code: true,
                        qrImageUrl: true,
                        isUsed: true,
                        createdAt: true,
                        usedAt: true,
                    },
                },
            },
        });
        if (!batch) {
            throw new common_1.NotFoundException('Batch not found');
        }
        if (batch.product.manufacturer.id !== manufacturer.id) {
            throw new common_1.ForbiddenException('Access denied to this batch');
        }
        return batch;
    }
    async verifyBatch(batchId, dto) {
        const batch = await this.prisma.productBatch.findUnique({
            where: { id: batchId },
        });
        if (!batch) {
            throw new common_1.NotFoundException('Batch not found');
        }
        const updatedBatch = await this.prisma.productBatch.update({
            where: { id: batchId },
            data: {
                status: dto.status,
                notes: dto.notes,
                verifiedAt: dto.status !== 'PENDING' ? new Date() : null,
            },
            include: {
                product: {
                    select: {
                        productName: true,
                    },
                },
            },
        });
        return updatedBatch;
    }
    async generateAndSaveBatchQRCode(batchId) {
        const batch = await this.prisma.productBatch.findUnique({
            where: { id: batchId },
            include: {
                product: {
                    select: {
                        id: true,
                        productName: true,
                        productCode: true,
                    },
                },
            },
        });
        if (!batch) {
            throw new common_1.NotFoundException('Batch not found');
        }
        if (batch.status !== 'APPROVED') {
            throw new common_1.BadRequestException('Batch must be approved before generating QR code');
        }
        const firstCode = await this.prisma.verificationCode.findFirst({
            where: {
                productBatchId: batchId,
            },
        });
        if (!firstCode) {
            throw new common_1.NotFoundException('No verification codes found for this batch');
        }
        const qrData = {
            serialNumber: firstCode.code,
            productId: batch.product.id,
            batchId: batch.id,
            productName: batch.product.productName,
            batchNumber: batch.batchNumber,
            manufactureDate: batch.manufactureDate.toISOString(),
            expiryDate: batch.expiryDate.toISOString(),
        };
        const qrCodeBase64 = await this.generateQRCodeBase64(qrData);
        const updatedBatch = await this.prisma.productBatch.update({
            where: { id: batchId },
            data: {
                qrCodeUrl: qrCodeBase64,
            },
            include: {
                product: {
                    select: {
                        productName: true,
                    },
                },
            },
        });
        return updatedBatch;
    }
    async generateQRCodeBase64(data) {
        try {
            const jsonString = JSON.stringify(data);
            const qrCodeBase64 = await QRCode.toDataURL(jsonString);
            return qrCodeBase64;
        }
        catch (error) {
            console.error('Error generating QR code:', error);
            return '';
        }
    }
};
exports.BatchesService = BatchesService;
exports.BatchesService = BatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BatchesService);
//# sourceMappingURL=batches.service.js.map