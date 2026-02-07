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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
let VerificationService = class VerificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verifyProduct(dto, request, userId) {
        const requestId = (0, uuid_1.v4)();
        const timestamp = new Date();
        try {
            const serialNumber = await this.extractSerialNumber(dto);
            const clientIp = this.getClientIp(request);
            const userAgent = request.headers['user-agent'] || 'Unknown';
            const verificationCode = await this.prisma.verificationCode.findUnique({
                where: { code: serialNumber },
                include: {
                    productBatch: {
                        include: {
                            product: {
                                include: {
                                    manufacturer: {
                                        include: {
                                            user: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            let status;
            let productData = null;
            if (!verificationCode) {
                status = client_1.VerificationStatus.FAKE;
            }
            else {
                if (verificationCode.isUsed) {
                    status = client_1.VerificationStatus.USED;
                }
                else {
                    const now = new Date();
                    const expiryDate = verificationCode.productBatch.expiryDate;
                    if ((0, date_fns_1.isAfter)(now, expiryDate)) {
                        status = client_1.VerificationStatus.EXPIRED;
                    }
                    else {
                        status = client_1.VerificationStatus.VALID;
                    }
                    productData = {
                        productName: verificationCode.productBatch.product.productName,
                        manufacturer: verificationCode.productBatch.product.manufacturer.companyName,
                        batchNumber: verificationCode.productBatch.batchNumber,
                        manufactureDate: verificationCode.productBatch.manufactureDate,
                        expiryDate: verificationCode.productBatch.expiryDate,
                        category: verificationCode.productBatch.product.category,
                        remainingDays: (0, date_fns_1.differenceInDays)(expiryDate, now),
                    };
                }
            }
            const logData = {
                status,
                location: dto.location,
                ipAddress: clientIp,
                deviceInfo: userAgent,
                userId: userId || null,
                verifiedAt: timestamp,
            };
            if (verificationCode?.id) {
                logData.verificationCodeId = verificationCode.id;
            }
            await this.prisma.verificationLog.create({
                data: logData,
            });
            if (status === client_1.VerificationStatus.VALID && verificationCode) {
                await this.prisma.verificationCode.update({
                    where: { id: verificationCode.id },
                    data: {
                        isUsed: true,
                        usedAt: timestamp,
                    },
                });
            }
            return this.buildResponse(status, productData, requestId, timestamp);
        }
        catch (error) {
            await this.logErrorAttempt(dto, request, userId, error.message);
            throw new common_1.InternalServerErrorException('Verification failed. Please try again.');
        }
    }
    async extractSerialNumber(dto) {
        if (dto.serialNumber) {
            return dto.serialNumber.trim().toUpperCase();
        }
        else if (dto.qrData) {
            try {
                const qrData = JSON.parse(dto.qrData);
                if (qrData.serialNumber) {
                    return qrData.serialNumber.trim().toUpperCase();
                }
                else if (qrData.code) {
                    return qrData.code.trim().toUpperCase();
                }
                else if (typeof qrData === 'string') {
                    return qrData.trim().toUpperCase();
                }
            }
            catch {
                return dto.qrData.trim().toUpperCase();
            }
        }
        throw new common_1.BadRequestException('Could not extract serial number from provided data');
    }
    getClientIp(request) {
        const forwardedFor = request.headers['x-forwarded-for'];
        if (forwardedFor) {
            return Array.isArray(forwardedFor)
                ? forwardedFor[0]
                : forwardedFor.split(',')[0].trim();
        }
        const realIp = request.headers['x-real-ip'];
        if (realIp) {
            return Array.isArray(realIp) ? realIp[0] : realIp;
        }
        return request.ip || 'Unknown';
    }
    buildResponse(status, productData, requestId, timestamp) {
        const baseResponse = {
            status,
            timestamp,
            requestId,
        };
        switch (status) {
            case client_1.VerificationStatus.VALID:
                return {
                    ...baseResponse,
                    status: 'VALID',
                    product: {
                        name: productData.productName,
                        manufacturer: productData.manufacturer,
                        batchNumber: productData.batchNumber,
                        manufactureDate: productData.manufactureDate,
                        expiresAt: productData.expiryDate,
                        category: this.formatCategory(productData.category),
                        remainingDays: productData.remainingDays,
                    },
                };
            case client_1.VerificationStatus.EXPIRED:
                const expiredDays = Math.abs((0, date_fns_1.differenceInDays)(productData.expiryDate, new Date()));
                return {
                    ...baseResponse,
                    status: 'EXPIRED',
                    message: `This product expired ${expiredDays} days ago`,
                    product: {
                        name: productData.productName,
                        manufacturer: productData.manufacturer,
                        expiresAt: productData.expiryDate,
                        expiredDays,
                    },
                };
            case client_1.VerificationStatus.FAKE:
                return {
                    ...baseResponse,
                    status: 'FAKE',
                    message: 'Product not found or invalid',
                };
            case client_1.VerificationStatus.USED:
                return {
                    ...baseResponse,
                    status: 'FAKE',
                    message: 'This verification code has already been used',
                };
            default:
                return {
                    ...baseResponse,
                    status: 'FAKE',
                    message: 'Unable to verify product',
                };
        }
    }
    formatCategory(category) {
        const categoryMap = {
            [client_1.ProductCategory.DRUG]: 'Pharmaceutical Drug',
            [client_1.ProductCategory.FOOD]: 'Food Product',
            [client_1.ProductCategory.COSMETIC]: 'Cosmetic Product',
            [client_1.ProductCategory.MEDICAL_DEVICE]: 'Medical Device',
            [client_1.ProductCategory.ELECTRONIC]: 'Electronic Product',
            [client_1.ProductCategory.OTHER]: 'Other Product',
        };
        return categoryMap[category] || 'Product';
    }
    async logErrorAttempt(dto, request, userId, errorMessage) {
        try {
            const clientIp = this.getClientIp(request);
            const userAgent = request.headers['user-agent'] || 'Unknown';
            let attemptedCode = 'UNKNOWN';
            if (dto.serialNumber) {
                attemptedCode = dto.serialNumber.substring(0, 20) + '...';
            }
            else if (dto.qrData) {
                attemptedCode = 'QR_DATA_' + dto.qrData.substring(0, 10) + '...';
            }
            await this.prisma.verificationLog.create({
                data: {
                    status: client_1.VerificationStatus.FAKE,
                    location: dto.location,
                    ipAddress: clientIp,
                    deviceInfo: `${userAgent} | Error: ${errorMessage.substring(0, 100)}`,
                    verificationCodeId: (0, uuid_1.v4)(),
                    userId: userId || null,
                    verifiedAt: new Date(),
                },
            });
        }
        catch (logError) {
            console.error('Failed to log verification error:', logError);
        }
    }
    async getVerificationStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const stats = await this.prisma.verificationLog.groupBy({
            by: ['status'],
            where: {
                verifiedAt: {
                    gte: today,
                },
            },
            _count: true,
        });
        const total = await this.prisma.verificationLog.count({
            where: {
                verifiedAt: {
                    gte: today,
                },
            },
        });
        return {
            date: today,
            total,
            byStatus: stats.reduce((acc, stat) => {
                acc[stat.status] = stat._count;
                return acc;
            }, {}),
        };
    }
    async getRecentVerifications(limit = 10) {
        return this.prisma.verificationLog.findMany({
            take: limit,
            orderBy: {
                verifiedAt: 'desc',
            },
            include: {
                verificationCode: {
                    include: {
                        productBatch: {
                            include: {
                                product: {
                                    include: {
                                        manufacturer: {
                                            select: {
                                                companyName: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async getVerificationsForAdmin(filters) {
        const page = Math.max(1, filters.page || 1);
        const limit = Math.min(Math.max(1, filters.limit || 20), 100);
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.startDate) {
            where.verifiedAt = { gte: new Date(filters.startDate) };
        }
        if (filters.endDate) {
            if (where.verifiedAt) {
                where.verifiedAt.lte = new Date(filters.endDate);
            }
            else {
                where.verifiedAt = { lte: new Date(filters.endDate) };
            }
        }
        if (filters.search) {
            where.OR = [
                { verificationCode: { code: { contains: filters.search, mode: 'insensitive' } } },
                { verificationCode: { productBatch: { batchNumber: { contains: filters.search, mode: 'insensitive' } } } },
                { verificationCode: { productBatch: { product: { productName: { contains: filters.search, mode: 'insensitive' } } } } },
                { verificationCode: { productBatch: { product: { manufacturer: { companyName: { contains: filters.search, mode: 'insensitive' } } } } } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.verificationLog.findMany({
                where,
                include: {
                    verificationCode: {
                        include: {
                            productBatch: {
                                include: {
                                    product: {
                                        include: {
                                            manufacturer: {
                                                select: {
                                                    id: true,
                                                    companyName: true,
                                                    registrationNumber: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: {
                    verifiedAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.verificationLog.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getVerificationDetailsForAdmin(verificationId) {
        const verification = await this.prisma.verificationLog.findUnique({
            where: { id: verificationId },
            include: {
                verificationCode: {
                    include: {
                        productBatch: {
                            include: {
                                product: {
                                    include: {
                                        manufacturer: {
                                            select: {
                                                id: true,
                                                companyName: true,
                                                registrationNumber: true,
                                                contactEmail: true,
                                                address: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        role: true,
                    },
                },
            },
        });
        if (!verification) {
            throw new common_1.BadRequestException('Verification not found');
        }
        return verification;
    }
    async exportVerificationsAsCsv(filters) {
        const where = {};
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.startDate) {
            where.verifiedAt = { gte: new Date(filters.startDate) };
        }
        if (filters.endDate) {
            if (where.verifiedAt) {
                where.verifiedAt.lte = new Date(filters.endDate);
            }
            else {
                where.verifiedAt = { lte: new Date(filters.endDate) };
            }
        }
        const verifications = await this.prisma.verificationLog.findMany({
            where,
            include: {
                verificationCode: {
                    include: {
                        productBatch: {
                            include: {
                                product: {
                                    include: {
                                        manufacturer: true,
                                    },
                                },
                            },
                        },
                    },
                },
                user: true,
            },
            orderBy: {
                verifiedAt: 'desc',
            },
        });
        const headers = [
            'Verification ID',
            'Status',
            'Verification Code',
            'Product Name',
            'Product Code',
            'Category',
            'Manufacturer',
            'Batch Number',
            'Manufacture Date',
            'Expiry Date',
            'Verified At',
            'Location',
            'IP Address',
            'User Email',
            'User Role',
        ];
        const rows = verifications.map((v) => [
            v.id,
            v.status,
            v.verificationCode?.code || '—',
            v.verificationCode?.productBatch?.product?.productName || '—',
            v.verificationCode?.productBatch?.product?.productCode || '—',
            v.verificationCode?.productBatch?.product?.category || '—',
            v.verificationCode?.productBatch?.product?.manufacturer?.companyName || '—',
            v.verificationCode?.productBatch?.batchNumber || '—',
            v.verificationCode?.productBatch?.manufactureDate
                ? new Date(v.verificationCode.productBatch.manufactureDate).toISOString().split('T')[0]
                : '—',
            v.verificationCode?.productBatch?.expiryDate
                ? new Date(v.verificationCode.productBatch.expiryDate).toISOString().split('T')[0]
                : '—',
            new Date(v.verifiedAt).toISOString(),
            v.location || '—',
            v.ipAddress || '—',
            v.user?.email || 'Anonymous',
            v.user?.role || '—',
        ]);
        const csvContent = [
            headers.map((h) => `"${h}"`).join(','),
            ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
        ].join('\n');
        return csvContent;
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map