import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { BatchStatus } from '@prisma/client';
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
      manufactureDate: dto.manufactureDate,
      expiryDate: dto.expiryDate,
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
          productName: product.productName,
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

  // Admin methods for batch verification
  async findAllBatchesForAdmin(status?: string) {
    const whereClause: any = {};
    
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

    // Map batches to include productName as a top-level field
    return batches.map(batch => ({
      ...batch,
      productName: batch.product.productName,
    }));
  }

  async findBatchesByProductForAdmin(productId: string) {
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

  async findOneBatchForAdmin(batchId: string) {
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
      throw new NotFoundException('Batch not found');
    }

    console.log(`[BatchesService] findOneBatchForAdmin: found batch id=${batch.id} productId=${batch.productId}`);

    return batch;
  }
  
  async findOneBatchById(manufacturerId: string, batchId: string) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { userId: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
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
      throw new NotFoundException('Batch not found');
    }

    if (batch.product.manufacturer.id !== manufacturer.id) {
      throw new ForbiddenException('Access denied to this batch');
    }

    return batch;
  }

  async verifyBatch(batchId: string, dto: { status: BatchStatus; notes?: string }) {
    const batch = await this.prisma.productBatch.findUnique({
      where: { id: batchId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
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

  async generateAndSaveBatchQRCode(batchId: string) {
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
      throw new NotFoundException('Batch not found');
    }

    if (batch.status !== 'APPROVED') {
      throw new BadRequestException('Batch must be approved before generating QR code');
    }

    // Get first verification code
    const firstCode = await this.prisma.verificationCode.findFirst({
      where: {
        productBatchId: batchId,
      },
    });

    if (!firstCode) {
      throw new NotFoundException('No verification codes found for this batch');
    }

    // Generate QR code data
    const qrData: QRCodeData = {
      serialNumber: firstCode.code,
      productId: batch.product.id,
      batchId: batch.id,
      productName: batch.product.productName,
      batchNumber: batch.batchNumber,
      manufactureDate: batch.manufactureDate.toISOString(),
      expiryDate: batch.expiryDate.toISOString(),
    };

    // Generate QR code as data URL
    const qrCodeBase64 = await this.generateQRCodeBase64(qrData);

    // Save QR code URL to batch
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