import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { rateLimitConfig } from '../config/rate-limit.config';

@Module({
  imports: [
    ThrottlerModule.forRoot(rateLimitConfig),
  ],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}