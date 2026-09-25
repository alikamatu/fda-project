import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalVerifications,
      validVerifications,
      fakeVerifications,
      expiredVerifications,
      registeredManufacturers,
      totalProducts,
      activeUsers,
    ] = await Promise.all([
      this.prisma.verificationLog.count(),
      this.prisma.verificationLog.count({
        where: { status: VerificationStatus.VALID },
      }),
      this.prisma.verificationLog.count({
        where: { status: VerificationStatus.FAKE },
      }),
      this.prisma.verificationLog.count({
        where: { status: VerificationStatus.EXPIRED },
      }),
      this.prisma.manufacturer.count(),
      this.prisma.product.count(),
      this.prisma.user.count({
        where: { isActive: true },
      }),
    ]);

    return {
      totalVerifications,
      validVerifications,
      fakeVerifications,
      expiredVerifications,
      registeredManufacturers,
      totalProducts,
      activeUsers,
    };
  }
}
