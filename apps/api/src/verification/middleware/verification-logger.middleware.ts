import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class VerificationLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('VerificationRequest');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    
    // Log verification attempts
    if (method === 'POST' && originalUrl === '/verify') {
      this.logger.log(`Verification attempt from ${ip} - ${userAgent}`);
    }
    
    next();
  }
}