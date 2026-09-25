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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
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
    async findByEmail(email) {
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
    async findAllManufacturers(params) {
        const { skip, take, search, isActive, isApproved } = params;
        const where = {
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
    async activateUser(userId, adminId) {
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
    async deactivateUser(userId, adminId) {
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
    async approveManufacturer(userId, adminId) {
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
    async rejectManufacturer(userId, reason, adminId) {
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map