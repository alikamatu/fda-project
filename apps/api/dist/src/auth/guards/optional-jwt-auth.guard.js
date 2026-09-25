"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalJwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const rxjs_1 = require("rxjs");
let OptionalJwtAuthGuard = class OptionalJwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    async canActivate(context) {
        try {
            const result = super.canActivate(context);
            if (result instanceof Promise) {
                await result;
            }
            else if ((0, rxjs_1.isObservable)(result)) {
                await (0, rxjs_1.firstValueFrom)(result);
            }
            return true;
        }
        catch {
            return true;
        }
    }
    handleRequest(err, user, info, context) {
        return user || null;
    }
};
exports.OptionalJwtAuthGuard = OptionalJwtAuthGuard;
exports.OptionalJwtAuthGuard = OptionalJwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], OptionalJwtAuthGuard);
//# sourceMappingURL=optional-jwt-auth.guard.js.map