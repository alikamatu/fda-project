import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
export declare class BatchesService {
    private prisma;
    constructor(prisma: PrismaService);
    createBatch(manufacturerId: string, productId: string, dto: CreateBatchDto): unknown;
    findAllBatches(manufacturerId: string, productId: string): unknown;
    findOneBatch(manufacturerId: string, productId: string, batchId: string): unknown;
    getVerificationCodes(manufacturerId: string, productId: string, batchId: string): unknown;
    private generateVerificationCodes;
    private generateQRCodeBase64;
}
