import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { QRCodeData, BatchWithQR } from './types/qr-code.types';

@Injectable()
export class BatchesService {
  constructor(private prisma: PrismaService) {}

  async createBatch(manufacturerId: string, productId: string, dto: CreateBatchDto) {
    // Get manufacturer
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { userId: manufacturerId },
      include: { user: true },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    if (!manufacturer.isApproved || !manufacturer.user.isActive) {
      throw new ForbiddenException('Manufacturer account is not approved or active');
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

    // Check for duplicate batch number for this product
    const existingBatch = await this.prisma.productBatch.findFirst({
      where: {
        productId,
        batchNumber: dto.batchNumber,
      },
    });

    if (existingBatch) {
      throw new ConflictException(`Batch number '${dto.batchNumber}' already exists for this product`);
    }

    // Generate unique verification codes for this batch
    const verificationCodes = await this.generateVerificationCodes(dto.quantity);

    // Create batch with verification codes in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create the batch
      const batch = await tx.productBatch.create({
        data: {
          batchNumber: dto.batchNumber,
          manufactureDate: dto.manufactureDate,
          expiryDate: dto.expiryDate,
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

      // Create verification codes
      await tx.verificationCode.createMany({
        data: verificationCodes.map(code => ({
          code,
          productBatchId: batch.id,
        })),
      });

      return batch;
    });

    // Generate QR code data for the first verification code (or batch info)
    const firstCode = verificationCodes[0];
    const qrData: QRCodeData = {
      serialNumber: firstCode,
      productId: product.id,
      batchId: result.id,
      productName: product.productName,
      batchNumber: dto.batchNumber,
      manufactureDate: dto.manufactureDate.toISOString(),
      expiryDate: dto.expiryDate.toISOString(),
    };

    // Generate QR code
    const qrCodeBase64 = await this.generateQRCodeBase64(qrData);

    return {
      ...result,
      verificationCodes: verificationCodes,
      qrCodeBase64,
    };
  }

  async findAllBatches(manufacturerId: string, productId: string) {
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

    // Get all batches for this product
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

    // Generate QR codes for each batch
    const batchesWithQR = await Promise.all(
      batches.map(async (batch) => {
        const qrData: QRCodeData = {
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
      })
    );

    return batchesWithQR;
  }

  async findOneBatch(manufacturerId: string, productId: string, batchId: string) {
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

    // Get the specific batch
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
      throw new NotFoundException('Batch not found or access denied');
    }

    // Generate QR code
    const qrData: QRCodeData = {
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

  async getVerificationCodes(manufacturerId: string, productId: string, batchId: string) {
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

    // Get verification codes for this batch
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
      throw new NotFoundException('Batch not found or access denied');
    }

    return batch.verificationCodes;
  }

  private async generateVerificationCodes(quantity: number): Promise<string[]> {
    const codes: string[] = [];
    
    for (let i = 0; i < quantity; i++) {
      const uuid = uuidv4();
      const code = `FDA-PROD-${uuid.toUpperCase().replace(/-/g, '').substring(0, 12)}`;
      
      // Check if code already exists (extremely unlikely but we should verify)
      const existing = await this.prisma.verificationCode.findUnique({
        where: { code },
      });
      
      if (!existing) {
        codes.push(code);
      } else {
        // If by some chance it exists, generate a different one
        i--; // Retry this iteration
      }
    }
    
    return codes;
  }

  private async generateQRCodeBase64(data: QRCodeData): Promise<string> {
    try {
      const jsonString = JSON.stringify(data);
      const qrCodeBase64 = await QRCode.toDataURL(jsonString);
      return qrCodeBase64;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  }
}