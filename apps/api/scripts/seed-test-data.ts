import { PrismaClient, UserRole, ProductCategory } from '@prisma/client';
import * as bcrypt from 'bcrypt';

if (process.env.NODE_ENV !== 'production' || process.env.DATABASE_URL?.includes('supabase')) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

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
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log('Seeding database with test data...');

  // 1. Create or update test admin
  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fda.gov' },
    update: {
      fullName: 'FDA Administrator',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      email: 'admin@fda.gov',
      fullName: 'FDA Administrator',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  // 2. Create or update test manufacturer user
  const manufacturerPassword = await bcrypt.hash('Manufacturer1234', 10);
  const manufacturerUser = await prisma.user.upsert({
    where: { email: 'manufacturer@pharma.com' },
    update: {
      fullName: 'Pharma Corp CEO',
      passwordHash: manufacturerPassword,
      role: UserRole.MANUFACTURER,
      isActive: true,
    },
    create: {
      email: 'manufacturer@pharma.com',
      fullName: 'Pharma Corp CEO',
      passwordHash: manufacturerPassword,
      role: UserRole.MANUFACTURER,
      isActive: true,
    },
  });

  // 3. Create or update manufacturer profile
  const manufacturer = await prisma.manufacturer.upsert({
    where: { registrationNumber: 'PHARMA-001' },
    update: {
      companyName: 'Pharma Corporation',
      contactEmail: 'contact@pharmacorp.com',
      address: '123 Pharma Street, Medical City',
      userId: manufacturerUser.id,
      isApproved: true,
    },
    create: {
      companyName: 'Pharma Corporation',
      registrationNumber: 'PHARMA-001',
      contactEmail: 'contact@pharmacorp.com',
      address: '123 Pharma Street, Medical City',
      userId: manufacturerUser.id,
      isApproved: true,
    },
  });

  // 4. Create or update test consumer user
  const consumerPassword = await bcrypt.hash('Consumer1234', 10);
  const consumer = await prisma.user.upsert({
    where: { email: 'consumer@example.com' },
    update: {
      fullName: 'John Consumer',
      passwordHash: consumerPassword,
      role: UserRole.CONSUMER,
      isActive: true,
    },
    create: {
      email: 'consumer@example.com',
      fullName: 'John Consumer',
      passwordHash: consumerPassword,
      role: UserRole.CONSUMER,
      isActive: true,
    },
  });

  // 5. Helper for generating verification codes
  const generateCodes = (qty: number) => {
    const codes: string[] = [];
    for (let i = 0; i < qty; i++) {
      const uuid = uuidv4();
      codes.push(`FDA-PROD-${uuid.toUpperCase().replace(/-/g, '').substring(0, 12)}`);
    }
    return codes;
  };

  // 6. Create product if not already existing
  let product = await prisma.product.findUnique({
    where: { productCode: 'PRM-1001' },
  });

  if (!product) {
    product = await prisma.product.create({
      data: {
        productName: 'Pain Relief Medicine',
        productCode: 'PRM-1001',
        description: 'Effective pain relief for headaches and muscle pain.',
        ingredients: 'Ibuprofen 200mg, Excipients',
        cautions: 'Not for use in pregnancy without doctor consult; keep out of reach of children.',
        category: ProductCategory.DRUG,
        manufacturerId: manufacturer.id,
      },
    });
  }

  // 7. Create batch if not already existing
  const existingBatch = await prisma.productBatch.findFirst({
    where: { batchNumber: 'BATCH-001', productId: product.id },
  });

  if (!existingBatch) {
    await prisma.productBatch.create({
      data: {
        batchNumber: 'BATCH-001',
        quantity: 1000,
        manufactureDate: new Date('2024-01-01'),
        expiryDate: new Date('2026-12-31'),
        productId: product.id,
        verificationCodes: {
          create: generateCodes(10).map((code) => ({ code })),
        },
      },
    });
  }

  console.log('\n==================================================');
  console.log('✅ SEEDING COMPLETE - USER CREDENTIALS:');
  console.log('==================================================');
  console.log(`🛡️  Admin Account:`);
  console.log(`   Email:    ${admin.email}`);
  console.log(`   Password: Admin@1234`);
  console.log(`   Role:     ADMIN`);
  console.log('--------------------------------------------------');
  console.log(`🏭 Manufacturer Account:`);
  console.log(`   Email:    ${manufacturerUser.email}`);
  console.log(`   Password: Manufacturer1234`);
  console.log(`   Company:  ${manufacturer.companyName} (${manufacturer.registrationNumber})`);
  console.log('--------------------------------------------------');
  console.log(`👤 Consumer Account:`);
  console.log(`   Email:    ${consumer.email}`);
  console.log(`   Password: Consumer1234`);
  console.log('==================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });