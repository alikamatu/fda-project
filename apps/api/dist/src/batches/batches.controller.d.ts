import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
export declare class BatchesController {
    private readonly batchesService;
    constructor(batchesService: BatchesService);
    createBatch(req: any, productId: string, createBatchDto: CreateBatchDto): unknown;
    getAllBatches(req: any, productId: string): unknown;
    getBatch(req: any, productId: string, batchId: string): unknown;
    getVerificationCodes(req: any, productId: string, batchId: string): unknown;
}
