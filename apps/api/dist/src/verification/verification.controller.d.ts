import { VerificationService } from './verification.service';
import { VerifyProductDto } from './dto/verify-product.dto';
export declare class VerificationController {
    private readonly verificationService;
    constructor(verificationService: VerificationService);
    verifyProduct(verifyProductDto: VerifyProductDto, req: any): unknown;
    getVerificationStats(): unknown;
    getRecentVerifications(): unknown;
}
