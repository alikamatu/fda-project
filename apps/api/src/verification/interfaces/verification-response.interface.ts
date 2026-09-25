import { VerificationStatus } from '@prisma/client';

export interface BaseVerificationResponse {
  status: VerificationStatus;
  timestamp: Date;
  requestId: string;
}

export interface ValidVerificationResponse extends BaseVerificationResponse {
  status: 'VALID';
  product: {
    name: string;
    manufacturer: string;
    batchNumber: string;
    manufactureDate: Date;
    expiresAt: Date;
    category: string;
    remainingDays: number;
  };
}

export interface ExpiredVerificationResponse extends BaseVerificationResponse {
  status: 'EXPIRED';
  message: string;
  product: {
    name: string;
    manufacturer: string;
    expiresAt: Date;
    expiredDays: number;
  };
}

export interface FakeVerificationResponse extends BaseVerificationResponse {
  status: 'FAKE';
  message: string;
}

export type VerificationResponse = 
  | ValidVerificationResponse 
  | ExpiredVerificationResponse 
  | FakeVerificationResponse;