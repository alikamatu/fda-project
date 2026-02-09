import { PrismaClient, UserRole, ProductCategory } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log('Seeding test data...');

  // Create test admin
  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fda.gov',
      fullName: 'FDA Administrator',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  // Create test manufacturer
  const manufacturerPassword = await bcrypt.hash('Manufacturer1234', 10);
  const manufacturerUser = await prisma.user.create({
    data: {
      email: 'manufacturer@pharma.com',
      fullName: 'Pharma Corp CEO',
      passwordHash: manufacturerPassword,
      role: UserRole.MANUFACTURER,
      isActive: true,
    },
  });

  const manufacturer = await prisma.manufacturer.create({
    data: {
      companyName: 'Pharma Corporation',
      registrationNumber: 'PHARMA-001',
      contactEmail: 'contact@pharmacorp.com',
      address: '123 Pharma Street, Medical City',
      userId: manufacturerUser.id,
      isApproved: true,
    },
  });

  // Create test consumer
  const consumerPassword = await bcrypt.hash('Consumer1234', 10);
  const consumer = await prisma.user.create({
    data: {
      email: 'consumer@example.com',
      fullName: 'John Consumer',
      passwordHash: consumerPassword,
      role: UserRole.CONSUMER,
      isActive: true,
    },
  });

  //create test product batch
  const productBatch = await prisma.productBatch.create({
    data: {
      batchNumber: 'BATCH-001',
      quantity: 1000,
      manufactureDate: new Date('2024-01-01'),
      expiryDate: new Date('2025-01-01'),
      product: {
        create: {
          productName: 'Pain Relief Medicine',
          productCode: 'PRM-1001',
          category: ProductCategory.DRUG,
          manufacturerId: manufacturer.id,
        },
      },
    },
  });

  console.log('Test data created:');
  console.log(`- Admin: ${admin.email} / password: Admin1234`);
  console.log(`- Manufacturer: ${manufacturerUser.email} / password: Manufacturer1234`);
  console.log(`- Consumer: ${consumer.email} / password: Consumer1234`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });