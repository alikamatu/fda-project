import { BatchStatus } from '@prisma/client';
export declare class VerifyBatchDto {
    status: BatchStatus;
    notes?: string;
}
