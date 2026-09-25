import { AuditLogsService } from './audit-logs.service';
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    findAll(skip?: number, take?: number, action?: string, search?: string, startDate?: string, endDate?: string): Promise<{
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
