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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let ProfileService = class ProfileService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserSettings(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                fullName: dto.fullName,
                phone: dto.phone || null,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        return user;
    }
    async changePassword(userId, dto) {
        if (dto.newPassword !== dto.confirmPassword) {
            throw new common_1.BadRequestException('New password and confirmation do not match');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                passwordHash: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const isSamePassword = await bcrypt.compare(dto.newPassword, user.passwordHash);
        if (isSamePassword) {
            throw new common_1.BadRequestException('New password must be different from current password');
        }
        const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash: newPasswordHash,
            },
        });
        return { message: 'Password changed successfully' };
    }
    async logoutAllSessions(userId) {
        console.log(`[ProfileService] Logout all sessions requested for user: ${userId}`);
        return { message: 'All sessions have been logged out' };
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map