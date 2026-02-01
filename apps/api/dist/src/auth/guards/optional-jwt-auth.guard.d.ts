import { ExecutionContext } from '@nestjs/common';
declare const OptionalJwtAuthGuard_base: any;
export declare class OptionalJwtAuthGuard extends OptionalJwtAuthGuard_base {
    canActivate(context: ExecutionContext): unknown;
    handleRequest(err: any, user: any, info: any, context: any): any;
}
export {};
