import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    action?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { skip, take, action, search, startDate, endDate } = params;

    const where: any = {};

    if (action) {
      where.action = action;
    }

    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate ? { gte: new Date(startDate) } : {}),
        ...(endDate ? { lte: new Date(endDate) } : {}),
      };
    }

    if (search) {
      where.OR = [
        { entityId: { contains: search, mode: 'insensitive' } },
        { entityType: { contains: search, mode: 'insensitive' } },
        { 
          user: { 
            fullName: { contains: search, mode: 'insensitive' } 
          } 
        },
        { 
          user: { 
            email: { contains: search, mode: 'insensitive' } 
          } 
        },
      ];
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        skip,
        take,
      },
    };
  }

  async getActions() {
    const actions = await this.prisma.auditLog.groupBy({
      by: ['action'],
    });
    return actions.map(a => a.action);
  }
}
