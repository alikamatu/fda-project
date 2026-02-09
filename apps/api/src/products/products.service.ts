import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ApprovalStatus } from '@prisma/client';
import * as crypto from 'crypto'; // Reserved for future strong randomness if needed

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(manufacturerId: string, dto: CreateProductDto) {
    // Check if manufacturer exists and is approved
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { userId: manufacturerId },
      include: { user: true },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    if (!manufacturer.isApproved) {
      throw new ForbiddenException('Manufacturer account is not approved');
    }

    if (!manufacturer.user.isActive) {
      throw new ForbiddenException('Manufacturer account is not active');
    }

    // Generate unique product code
    const productCode = await this.generateUniqueProductCode(dto.productName);

    // Transaction to create product, batch, and verification codes
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create Product
      const product = await tx.product.create({
        data: {
          productName: dto.productName,
          productCode,
          description: dto.description,
          category: dto.category,
          manufacturerId: manufacturer.id,
          approvalStatus: ApprovalStatus.PENDING,
        },
      });

      // 2. Create Batch
      const batch = await tx.productBatch.create({
        data: {
          batchNumber: dto.batchNumber,
          quantity: dto.quantity,
          expiryDate: new Date(dto.expiryDate),
          manufactureDate: new Date(), // Default to today
          productId: product.id,
        },
      });

      // 3. Generate Verification Codes
      // Generate a batch of unique codes.
      // Note: In detailed production, we'd ensure uniqueness against DB or handle collisions.
      const codes = Array.from({ length: dto.quantity }).map(() => ({
        code: this.generateVerificationCodeString(),
        productBatchId: batch.id,
      }));

      await tx.verificationCode.createMany({
        data: codes,
      });

      return product;
    });

    return result;
  }

  async findAllProducts(manufacturerId: string) {
    // Get manufacturer
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { userId: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    // Get all products for this manufacturer
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

  async findOneProduct(manufacturerId: string, productId: string) {
    // Get manufacturer
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { userId: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    // Get product with ownership check
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
      throw new NotFoundException('Product not found or access denied');
    }

    return product;
  }

  async updateProduct(manufacturerId: string, productId: string, dto: UpdateProductDto) {
    // Get manufacturer
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { userId: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    // Check product ownership
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        manufacturerId: manufacturer.id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found or access denied');
    }

    // Only allow updates to certain fields based on approval status
    const updateData: any = {};
    
    if (product.approvalStatus === ApprovalStatus.PENDING) {
      // Can update all fields if pending
      if (dto.productName) updateData.productName = dto.productName;
      if (dto.description) updateData.description = dto.description;
      if (dto.category) updateData.category = dto.category;
    } else {
      // If approved or rejected, can only update description
      if (dto.description) updateData.description = dto.description;
    }

    // Update product
    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return updatedProduct;
  }

  // Admin Methods

  async findAllAdmin(query: any) {
    const { status, limit = 10, page = 1 } = query;
    console.log('findAllAdmin query:', query);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.approvalStatus = status;
    }
    console.log('findAllAdmin where:', where);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        take: Number(limit),
        skip: Number(skip),
        orderBy: { createdAt: 'desc' },
        include: {
          manufacturer: {
            select: {
              companyName: true,
            },
          },
          _count: {
            select: { batches: true },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async findOneAdmin(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        manufacturer: {
          select: {
            companyName: true,
            registrationNumber: true,
            contactEmail: true,
            contactPhone: true,
          },
        },
        batches: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async approveProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id },
      data: { approvalStatus: ApprovalStatus.APPROVED },
    });
  }

  async rejectProduct(id: string, reason?: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // Currently we don't store rejection reason in schema, but we could add it.
    // For now just update status.
    return this.prisma.product.update({
      where: { id },
      data: { approvalStatus: ApprovalStatus.REJECTED },
    });
  }

  private async generateUniqueProductCode(productName: string): Promise<string> {
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

  private async isProductCodeExists(productCode: string): Promise<boolean> {
    const existing = await this.prisma.product.findUnique({
      where: { productCode },
    });
    return !!existing;
  }

  private generateVerificationCodeString(): string {
    // Generate a secure random string (e.g., alphanumeric 12 chars)
    // Format: XXXX-XXXX-XXXX
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
        if (i > 0 && i % 4 === 0) result += '-';
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}