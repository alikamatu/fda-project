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
exports.ManufacturerController = void 0;
const common_1 = require("@nestjs/common");
const manufacturer_service_1 = require("./manufacturer.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let ManufacturerController = class ManufacturerController {
    manufacturerService;
    constructor(manufacturerService) {
        this.manufacturerService = manufacturerService;
    }
    async getDashboardStats(req) {
        return this.manufacturerService.getDashboardStats(req.user.id);
    }
    async getVerifications(req, query) {
        return this.manufacturerService.getVerifications(req.user.id, query);
    }
    async getRecentProducts(req, limit) {
        return this.manufacturerService.getRecentProducts(req.user.id, limit ? Number(limit) : 5);
    }
    async getRecentVerifications(req, limit) {
        return this.manufacturerService.getRecentVerifications(req.user.id, limit ? Number(limit) : 10);
    }
};
exports.ManufacturerController = ManufacturerController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManufacturerController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('verifications'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManufacturerController.prototype, "getVerifications", null);
__decorate([
    (0, common_1.Get)('products/recent'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ManufacturerController.prototype, "getRecentProducts", null);
__decorate([
    (0, common_1.Get)('verifications/recent'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ManufacturerController.prototype, "getRecentVerifications", null);
exports.ManufacturerController = ManufacturerController = __decorate([
    (0, common_1.Controller)('manufacturer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MANUFACTURER),
    __metadata("design:paramtypes", [manufacturer_service_1.ManufacturerService])
], ManufacturerController);
//# sourceMappingURL=manufacturer.controller.js.map