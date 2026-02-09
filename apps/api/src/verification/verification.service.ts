import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerifyProductDto } from './dto/verify-product.dto';
import { VerificationResponse, ValidVerificationResponse, ExpiredVerificationResponse, FakeVerificationResponse } from './interfaces/verification-response.interface';
import { VerificationStatus, ProductCategory } from '@prisma/client';
import { Request } from 'express';
import { differenceInDays, isAfter } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  async verifyProduct(
    dto: VerifyProductDto,
    request: Request,
    userId?: string
  ): Promise<VerificationResponse> {
    const requestId = uuidv4();
    const timestamp = new Date();
    
    try {
      // Step 1: Normalize input
      const serialNumber = await this.extractSerialNumber(dto);
      
      // Step 2: Log verification attempt (even before checking)
      const clientIp = this.getClientIp(request);
      const userAgent = request.headers['user-agent'] || 'Unknown';
      
      // Step 3: Lookup verification code
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
      
      // Step 4: Determine verification result
      let status: VerificationStatus;
      let productData: any = null;
      
      if (!verificationCode) {
        // Not found in database
        status = VerificationStatus.FAKE;
      } else {
        // Check if already used
        if (verificationCode.isUsed) {
          status = VerificationStatus.USED;
        } else {
          // Check expiration
          const now = new Date();
          const expiryDate = verificationCode.productBatch.expiryDate;
          
          if (isAfter(now, expiryDate)) {
            status = VerificationStatus.EXPIRED;
          } else {
            status = VerificationStatus.VALID;
          }
          
          // Prepare product data for response
          productData = {
            productName: verificationCode.productBatch.product.productName,
            manufacturer: verificationCode.productBatch.product.manufacturer.companyName,
            batchNumber: verificationCode.productBatch.batchNumber,
            manufactureDate: verificationCode.productBatch.manufactureDate,
            expiryDate: verificationCode.productBatch.expiryDate,
            category: verificationCode.productBatch.product.category,
            remainingDays: differenceInDays(expiryDate, now),
          };
        }
      }
      
      // Step 5: Create verification log
      const logData: any = {
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
      
      // Step 6: If valid, mark code as used
      if (status === VerificationStatus.VALID && verificationCode) {
        await this.prisma.verificationCode.update({
          where: { id: verificationCode.id },
          data: { 
            isUsed: true,
            usedAt: timestamp,
          },
        });
      }
      
      // Step 7: Prepare and return response
      return this.buildResponse(status, productData, requestId, timestamp);
      
    } catch (error) {
      // Even if there's an error, try to log the attempt
      await this.logErrorAttempt(dto, request, userId, error.message);
      throw new InternalServerErrorException('Verification failed. Please try again.');
    }
  }

  private async extractSerialNumber(dto: VerifyProductDto): Promise<string> {
    if (dto.serialNumber) {
      // Clean and validate serial number
      return dto.serialNumber.trim().toUpperCase();
    } else if (dto.qrData) {
      // Try to parse QR data
      try {
        // Try to parse as JSON (QR code might contain structured data)
        const qrData = JSON.parse(dto.qrData);
        
        // Extract serial number from common QR code formats
        if (qrData.serialNumber) {
          return qrData.serialNumber.trim().toUpperCase();
        } else if (qrData.code) {
          return qrData.code.trim().toUpperCase();
        } else if (typeof qrData === 'string') {
          return qrData.trim().toUpperCase();
        }
      } catch {
        // If not JSON, assume it's the serial number directly
        return dto.qrData.trim().toUpperCase();
      }
    }
    
    throw new BadRequestException('Could not extract serial number from provided data');
  }

  private getClientIp(request: Request): string {
    // Try to get IP from various headers (for proxy support)
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

  private buildResponse(
    status: VerificationStatus,
    productData: any,
    requestId: string,
    timestamp: Date
  ): VerificationResponse {
    const baseResponse = {
      status,
      timestamp,
      requestId,
    };
    
    switch (status) {
      case VerificationStatus.VALID:
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
        } as ValidVerificationResponse;
        
      case VerificationStatus.EXPIRED:
        const expiredDays = Math.abs(differenceInDays(productData.expiryDate, new Date()));
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
        } as ExpiredVerificationResponse;
        
      case VerificationStatus.FAKE:
        return {
          ...baseResponse,
          status: 'FAKE',
          message: 'Product not found or invalid',
        } as FakeVerificationResponse;
        
      case VerificationStatus.USED:
        return {
          ...baseResponse,
          status: 'FAKE', // Treat USED as FAKE for security
          message: 'This verification code has already been used',
        } as FakeVerificationResponse;
        
      default:
        return {
          ...baseResponse,
          status: 'FAKE',
          message: 'Unable to verify product',
        } as FakeVerificationResponse;
    }
  }

  private formatCategory(category: ProductCategory): string {
    const categoryMap = {
      [ProductCategory.DRUG]: 'Pharmaceutical Drug',
      [ProductCategory.FOOD]: 'Food Product',
      [ProductCategory.COSMETIC]: 'Cosmetic Product',
      [ProductCategory.MEDICAL_DEVICE]: 'Medical Device',
      [ProductCategory.ELECTRONIC]: 'Electronic Product',
      [ProductCategory.OTHER]: 'Other Product',
    };
    
    return categoryMap[category] || 'Product';
  }

  private async logErrorAttempt(
    dto: VerifyProductDto,
    request: Request,
    userId: string | undefined,
    errorMessage: string
  ): Promise<void> {
    try {
      const clientIp = this.getClientIp(request);
      const userAgent = request.headers['user-agent'] || 'Unknown';
      
      // Extract what we can from the DTO
      let attemptedCode = 'UNKNOWN';
      if (dto.serialNumber) {
        attemptedCode = dto.serialNumber.substring(0, 20) + '...';
      } else if (dto.qrData) {
        attemptedCode = 'QR_DATA_' + dto.qrData.substring(0, 10) + '...';
      }
      
      await this.prisma.verificationLog.create({
        data: {
          status: VerificationStatus.FAKE,
          location: dto.location,
          ipAddress: clientIp,
          deviceInfo: `${userAgent} | Error: ${errorMessage.substring(0, 100)}`,
          verificationCodeId: uuidv4(),
          userId: userId || null,
          verifiedAt: new Date(),
        },
      });
    } catch (logError) {
      // Silently fail logging - don't let logging errors break the main flow
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

  async getRecentVerifications(limit: number = 10) {
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

  /**
   * Get paginated verifications for admin dashboard with filtering
   */
  async getVerificationsForAdmin(filters: {
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(Math.max(1, filters.limit || 20), 100);
    const skip = (page - 1) * limit;

    // Build where conditions
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDate) {
      where.verifiedAt = { gte: new Date(filters.startDate) };
    }

    if (filters.endDate) {
      if (where.verifiedAt) {
        where.verifiedAt.lte = new Date(filters.endDate);
      } else {
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

    // Fetch with full relations
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

  /**
   * Get detailed information about a specific verification
   */
  async getVerificationDetailsForAdmin(verificationId: string) {
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
      throw new BadRequestException('Verification not found');
    }

    return verification;
  }

  /**
   * Export verifications as CSV
   */
  async exportVerificationsAsCsv(filters: {
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<string> {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDate) {
      where.verifiedAt = { gte: new Date(filters.startDate) };
    }

    if (filters.endDate) {
      if (where.verifiedAt) {
        where.verifiedAt.lte = new Date(filters.endDate);
      } else {
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

    // Build CSV headers
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

    // Build CSV rows
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

    // Format CSV
    const csvContent = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return csvContent;
  }
}