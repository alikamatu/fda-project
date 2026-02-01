import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: any): unknown;
}
export {};
