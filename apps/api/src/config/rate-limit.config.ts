import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const rateLimitConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: 60000, // 1 minute in milliseconds
      limit: 10, // 10 requests per minute for verification
    },
  ],
};