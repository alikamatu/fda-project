import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    const sslEnv = process.env.DATABASE_SSL;
    const enableSsl = sslEnv === 'true' || (sslEnv === undefined && !isLocalhost && !connectionString.includes('sslmode=disable'));

    const pool = new Pool({ 
      connectionString,
      ...(enableSsl ? { ssl: { rejectUnauthorized: false } } : {})
    });

    super({
      adapter: new PrismaPg(pool),
      log: ['query', 'info', 'warn', 'error'],
    });

    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    if (this.pool) {
      await this.pool.end();
    }
  }
}