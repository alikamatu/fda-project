import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log('Checking for batches without verification codes...');

  const batches = await prisma.productBatch.findMany({
    where: {
      verificationCodes: {
        none: {}
      }
    }
  });

  console.log(`Found ${batches.length} batches missing codes.`);

  for (const batch of batches) {
    console.log(`Generating codes for batch ${batch.batchNumber} (${batch.id})...`);
    
    const qty = Math.min(batch.quantity, 10); // Generate at most 10 codes per batch for fixing
    const codes: { code: string; productBatchId: string }[] = [];
    
    for (let i = 0; i < qty; i++) {
      const uuid = uuidv4();
      const code = `FDA-PROD-${uuid.toUpperCase().replace(/-/g, '').substring(0, 12)}`;
      codes.push({
        code,
        productBatchId: batch.id
      });
    }

    await prisma.verificationCode.createMany({
      data: codes
    });

    console.log(`Created ${codes.length} codes for batch ${batch.batchNumber}.`);
  }

  console.log('Fix complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
