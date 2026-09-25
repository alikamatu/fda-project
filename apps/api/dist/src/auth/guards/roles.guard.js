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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../decorators/roles.decorator");
let RolesGuard = class RolesGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            console.log('[RolesGuard] No roles required for this endpoint');
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        console.log('[RolesGuard] Checking roles:', {
            requiredRoles,
            userRole: user?.role,
            userEmail: user?.email
        });
        if (!user) {
            console.error('[RolesGuard] No user found in request');
            throw new common_1.ForbiddenException('No authentication provided');
        }
        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
            console.error('[RolesGuard] User lacks required role:', {
                userRole: user.role,
                requiredRoles
            });
            throw new common_1.ForbiddenException(`Required roles: ${requiredRoles.join(', ')}`);
        }
        console.log('[RolesGuard] Role validation successful');
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map