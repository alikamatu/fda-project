import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ManufacturerService {
  constructor(private prisma: PrismaService) {}

  private async getManufacturerId(userId: string) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { userId },
      select: { id: true },
    });
    return manufacturer?.id;
  }

  async getDashboardStats(userId: string) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { userId },
      select: { id: true, isApproved: true },
    });
    
    if (!manufacturer) return null;
    const manufacturerId = manufacturer.id;

    const [
      totalProducts,
      activeProducts,
      totalVerifications,
      recentVerificationsCount,
    ] = await Promise.all([
      this.prisma.product.count({
        where: { manufacturerId },
      }),
      this.prisma.product.count({
        where: { manufacturerId, approvalStatus: 'APPROVED' },
      }),
      this.prisma.verificationLog.count({
        where: {
          verificationCode: {
            productBatch: {
              product: { manufacturerId },
            },
          },
        },
      }),
      this.prisma.verificationLog.count({
        where: {
          verificationCode: {
            productBatch: {
              product: { manufacturerId },
            },
          },
          verifiedAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      }),
    ]);

    return {
      isApproved: manufacturer.isApproved,
      totalProducts,
      activeProducts,
      totalVerifications,
      recentVerificationsCount, // Verifications in last 7 days
    };
  }

  async getVerifications(userId: string, query: any) {
    const manufacturerId = await this.getManufacturerId(userId);
    if (!manufacturerId) return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };

    const { page = 1, limit = 10, status, productId, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      verificationCode: {
        productBatch: {
          product: {
            manufacturerId,
            ...(productId ? { id: productId } : {}),
          },
        },
      },
      ...(status ? { status } : {}),
      ...(startDate || endDate ? {
        verifiedAt: {
          ...(startDate ? { gte: new Date(startDate) } : {}),
          ...(endDate ? { lte: new Date(endDate) } : {}),
        },
      } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.verificationLog.findMany({
        where,
        take: Number(limit),
        skip: Number(skip),
        orderBy: { verifiedAt: 'desc' },
        include: {
          verificationCode: {
            include: {
              productBatch: {
                include: {
                  product: {
                    select: { productName: true, productCode: true },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.verificationLog.count({ where }),
    ]);

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async getRecentProducts(userId: string, limit: number) {
    const manufacturerId = await this.getManufacturerId(userId);
    if (!manufacturerId) return [];

    return this.prisma.product.findMany({
      where: { manufacturerId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { batches: true },
        },
      },
    });
  }

  async getRecentVerifications(userId: string, limit: number) {
    const manufacturerId = await this.getManufacturerId(userId);
    if (!manufacturerId) return [];

    return this.prisma.verificationLog.findMany({
      where: {
        verificationCode: {
          productBatch: {
            product: { manufacturerId },
          },
        },
      },
      take: limit,
      orderBy: { verifiedAt: 'desc' },
      include: {
        verificationCode: {
          include: {
            productBatch: {
              include: {
                product: {
                  select: { productName: true },
                },
              },
            },
          },
        },
      },
    });
  }
}
