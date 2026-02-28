import { PrismaService } from '../prisma/prisma.service';
export declare class AdminDashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalVerifications: number;
        validVerifications: number;
        fakeVerifications: number;
        expiredVerifications: number;
        registeredManufacturers: number;
        totalProducts: number;
        activeUsers: number;
    }>;
}
