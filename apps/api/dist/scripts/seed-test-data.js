"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}
const pool = new pg_1.Pool({ connectionString });
const prisma = new client_1.PrismaClient({ adapter: new adapter_pg_1.PrismaPg(pool) });
async function main() {
    console.log('Seeding test data...');
    const adminPassword = await bcrypt.hash('Admin1234', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@fda.gov',
            fullName: 'FDA Administrator',
            passwordHash: adminPassword,
            role: client_1.UserRole.ADMIN,
            isActive: true,
        },
    });
    const manufacturerPassword = await bcrypt.hash('Manufacturer1234', 10);
    const manufacturerUser = await prisma.user.create({
        data: {
            email: 'manufacturer@pharma.com',
            fullName: 'Pharma Corp CEO',
            passwordHash: manufacturerPassword,
            role: client_1.UserRole.MANUFACTURER,
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
    const consumerPassword = await bcrypt.hash('Consumer1234', 10);
    const consumer = await prisma.user.create({
        data: {
            email: 'consumer@example.com',
            fullName: 'John Consumer',
            passwordHash: consumerPassword,
            role: client_1.UserRole.CONSUMER,
            isActive: true,
        },
    });
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
                    category: client_1.ProductCategory.DRUG,
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
//# sourceMappingURL=seed-test-data.js.map