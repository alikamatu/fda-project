import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params: {
        skip?: number;
        take?: number;
        action?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                fullName: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            action: string;
            entityType: string;
            entityId: string;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            performedBy: string;
        })[];
        meta: {
            total: number;
            skip: number | undefined;
            take: number | undefined;
        };
    }>;
    getActions(): Promise<string[]>;
}
