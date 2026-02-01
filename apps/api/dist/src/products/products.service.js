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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProduct(manufacturerId, dto) {
        const manufacturer = await this.prisma.manufacturer.findUnique({
            where: { userId: manufacturerId },
            include: { user: true },
        });
        if (!manufacturer) {
            throw new common_1.NotFoundException('Manufacturer not found');
        }
        if (!manufacturer.isApproved) {
            throw new common_1.ForbiddenException('Manufacturer account is not approved');
        }
        if (!manufacturer.user.isActive) {
            throw new common_1.ForbiddenException('Manufacturer account is not active');
        }
        const productCode = await this.generateUniqueProductCode(dto.productName);
        const product = await this.prisma.product.create({
            data: {
                productName: dto.productName,
                productCode,
                description: dto.description,
                category: dto.category,
                manufacturerId: manufacturer.id,
                approvalStatus: client_1.ApprovalStatus.PENDING,
            },
            include: {
                manufacturer: {
                    select: {
                        companyName: true,
                        registrationNumber: true,
                    },
                },
            },
        });
        return product;
    }
    async findAllProducts(manufacturerId) {
        const manufacturer = await this.prisma.manufacturer.findUnique({
            where: { userId: manufacturerId },
        });
        if (!manufacturer) {
            throw new common_1.NotFoundException('Manufacturer not found');
        }
        const products = await this.prisma.product.findMany({
            where: {
                manufacturerId: manufacturer.id,
            },
            include: {
                batches: {
                    select: {
                        id: true,
                        batchNumber: true,
                        manufactureDate: true,
                        expiryDate: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return products;
    }
    async findOneProduct(manufacturerId, productId) {
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
            include: {
                manufacturer: {
                    select: {
                        companyName: true,
                        registrationNumber: true,
                    },
                },
                batches: {
                    include: {
                        verificationCodes: {
                            select: {
                                id: true,
                                code: true,
                                isUsed: true,
                                createdAt: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found or access denied');
        }
        return product;
    }
    async updateProduct(manufacturerId, productId, dto) {
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
        const updateData = {};
        if (product.approvalStatus === client_1.ApprovalStatus.PENDING) {
            if (dto.productName)
                updateData.productName = dto.productName;
            if (dto.description)
                updateData.description = dto.description;
            if (dto.category)
                updateData.category = dto.category;
        }
        else {
            if (dto.description)
                updateData.description = dto.description;
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id: productId },
            data: updateData,
        });
        return updatedProduct;
    }
    async generateUniqueProductCode(productName) {
        const baseCode = productName
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .substring(0, 10);
        let uniqueCode = `${baseCode}-${Date.now().toString().slice(-4)}`;
        let counter = 1;
        while (await this.isProductCodeExists(uniqueCode)) {
            uniqueCode = `${baseCode}-${Date.now().toString().slice(-4)}-${counter}`;
            counter++;
        }
        return uniqueCode;
    }
    async isProductCodeExists(productCode) {
        const existing = await this.prisma.product.findUnique({
            where: { productCode },
        });
        return !!existing;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map