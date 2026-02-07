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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminVerificationsController = void 0;
const common_1 = require("@nestjs/common");
const verification_service_1 = require("./verification.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AdminVerificationsController = class AdminVerificationsController {
    verificationService;
    constructor(verificationService) {
        this.verificationService = verificationService;
    }
    async getVerifications(status, search, startDate, endDate, page = 1, limit = 20) {
        return this.verificationService.getVerificationsForAdmin({
            status,
            search,
            startDate,
            endDate,
            page: Math.max(1, page),
            limit: Math.min(Math.max(1, limit), 100),
        });
    }
    async exportVerifications(response, status, search, startDate, endDate) {
        const csvContent = await this.verificationService.exportVerificationsAsCsv({
            status,
            search,
            startDate,
            endDate,
        });
        response.setHeader('Content-Type', 'text/csv; charset=utf-8');
        response.setHeader('Content-Disposition', `attachment; filename=verifications-${new Date().toISOString().split('T')[0]}.csv`);
        response.send(csvContent);
    }
    async getVerificationDetails(verificationId) {
        try {
            return await this.verificationService.getVerificationDetailsForAdmin(verificationId);
        }
        catch (error) {
            throw new common_1.NotFoundException('Verification not found');
        }
    }
};
exports.AdminVerificationsController = AdminVerificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(5, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminVerificationsController.prototype, "getVerifications", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminVerificationsController.prototype, "exportVerifications", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminVerificationsController.prototype, "getVerificationDetails", null);
exports.AdminVerificationsController = AdminVerificationsController = __decorate([
    (0, common_1.Controller)('admin/verifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [verification_service_1.VerificationService])
], AdminVerificationsController);
//# sourceMappingURL=admin-verifications.controller.js.map