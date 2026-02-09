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
exports.AdminBatchesController = void 0;
const common_1 = require("@nestjs/common");
const batches_service_1 = require("./batches.service");
const verify_batch_dto_1 = require("./dto/verify-batch.dto");
const query_batch_dto_1 = require("./dto/query-batch.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AdminBatchesController = class AdminBatchesController {
    batchesService;
    constructor(batchesService) {
        this.batchesService = batchesService;
    }
    async getAllBatches(query) {
        return this.batchesService.findAllBatchesForAdmin(query.status);
    }
    async getProductBatches(productId) {
        return this.batchesService.findBatchesByProductForAdmin(productId);
    }
    async getBatchDetail(batchId) {
        console.log(`[AdminBatchesController] getBatchDetail called with batchId=${batchId}`);
        return this.batchesService.findOneBatchForAdmin(batchId);
    }
    async verifyBatch(batchId, verifyBatchDto) {
        return this.batchesService.verifyBatch(batchId, verifyBatchDto);
    }
    async generateQRCode(batchId) {
        return this.batchesService.generateAndSaveBatchQRCode(batchId);
    }
};
exports.AdminBatchesController = AdminBatchesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_batch_dto_1.QueryBatchDto]),
    __metadata("design:returntype", Promise)
], AdminBatchesController.prototype, "getAllBatches", null);
__decorate([
    (0, common_1.Get)('product/:productId/all'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBatchesController.prototype, "getProductBatches", null);
__decorate([
    (0, common_1.Get)(':batchId'),
    __param(0, (0, common_1.Param)('batchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBatchesController.prototype, "getBatchDetail", null);
__decorate([
    (0, common_1.Patch)(':batchId/verify'),
    __param(0, (0, common_1.Param)('batchId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, verify_batch_dto_1.VerifyBatchDto]),
    __metadata("design:returntype", Promise)
], AdminBatchesController.prototype, "verifyBatch", null);
__decorate([
    (0, common_1.Patch)(':batchId/qrcode'),
    __param(0, (0, common_1.Param)('batchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBatchesController.prototype, "generateQRCode", null);
exports.AdminBatchesController = AdminBatchesController = __decorate([
    (0, common_1.Controller)('admin/batches'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [batches_service_1.BatchesService])
], AdminBatchesController);
//# sourceMappingURL=admin-batches.controller.js.map