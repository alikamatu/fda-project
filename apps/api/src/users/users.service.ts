import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true,
      },
    });
  }

  async findAllManufacturers(params: {
    skip?: number;
    take?: number;
    search?: string;
    isActive?: boolean;
    isApproved?: boolean;
  }) {
    const { skip, take, search, isActive, isApproved } = params;

    const where: any = {
      role: 'MANUFACTURER',
    };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isApproved !== undefined) {
      where.manufacturer = {
        isApproved,
      };
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        {
          manufacturer: {
            companyName: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
          manufacturer: {
            select: {
              id: true,
              companyName: true,
              registrationNumber: true,
              contactEmail: true,
              contactPhone: true,
              address: true,
              isApproved: true,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        skip,
        take,
      },
    };
  }

  async activateUser(userId: string, adminId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'ACTIVATE_USER',
        entityType: 'User',
        entityId: userId,
        performedBy: adminId,
        metadata: { previousStatus: 'inactive', newStatus: 'active' },
      },
    });

    return user;
  }

  async deactivateUser(userId: string, adminId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'DEACTIVATE_USER',
        entityType: 'User',
        entityId: userId,
        performedBy: adminId,
        metadata: { previousStatus: 'active', newStatus: 'inactive' },
      },
    });

    return user;
  }

  async approveManufacturer(userId: string, adminId: string) {
    const manufacturer = await this.prisma.manufacturer.update({
      where: { userId },
      data: { isApproved: true },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'APPROVE_MANUFACTURER',
        entityType: 'Manufacturer',
        entityId: manufacturer.id,
        performedBy: adminId,
        metadata: { previousStatus: 'pending', newStatus: 'approved' },
      },
    });

    return manufacturer;
  }

  async rejectManufacturer(userId: string, reason: string, adminId: string) {
    const manufacturer = await this.prisma.manufacturer.update({
      where: { userId },
      data: { isApproved: false },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'REJECT_MANUFACTURER',
        entityType: 'Manufacturer',
        entityId: manufacturer.id,
        performedBy: adminId,
        metadata: { reason, previousStatus: 'pending', newStatus: 'rejected' },
      },
    });

    return manufacturer;
  }
}
