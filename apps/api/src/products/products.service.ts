import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ApprovalStatus } from '@prisma/client';

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

    // Create product
    const product = await this.prisma.product.create({
      data: {
        productName: dto.productName,
        productCode,
        description: dto.description,
        category: dto.category,
        manufacturerId: manufacturer.id,
        approvalStatus: ApprovalStatus.PENDING,
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
}