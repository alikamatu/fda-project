"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
if (process.env.NODE_ENV !== 'production' || process.env.DATABASE_URL?.includes('supabase')) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const uuid_1 = require("uuid");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}
const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
const sslEnv = process.env.DATABASE_SSL;
const enableSsl = sslEnv === 'true' || (sslEnv === undefined && !isLocalhost && !connectionString.includes('sslmode=disable'));
const pool = new pg_1.Pool({
    connectionString,
    ...(enableSsl ? { ssl: { rejectUnauthorized: false } } : {})
});
const prisma = new client_1.PrismaClient({ adapter: new adapter_pg_1.PrismaPg(pool) });
async function main() {
    console.log('Seeding database with test data...');
    const adminPassword = await bcrypt.hash('Admin@1234', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@fda.gov' },
        update: {
            fullName: 'FDA Administrator',
            passwordHash: adminPassword,
            role: client_1.UserRole.ADMIN,
            isActive: true,
        },
        create: {
            email: 'admin@fda.gov',
            fullName: 'FDA Administrator',
            passwordHash: adminPassword,
            role: client_1.UserRole.ADMIN,
            isActive: true,
        },
    });
    const manufacturerPassword = await bcrypt.hash('Manufacturer1234', 10);
    const manufacturerUser = await prisma.user.upsert({
        where: { email: 'manufacturer@pharma.com' },
        update: {
            fullName: 'Pharma Corp CEO',
            passwordHash: manufacturerPassword,
            role: client_1.UserRole.MANUFACTURER,
            isActive: true,
        },
        create: {
            email: 'manufacturer@pharma.com',
            fullName: 'Pharma Corp CEO',
            passwordHash: manufacturerPassword,
            role: client_1.UserRole.MANUFACTURER,
            isActive: true,
        },
    });
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
    const consumerPassword = await bcrypt.hash('Consumer1234', 10);
    const consumer = await prisma.user.upsert({
        where: { email: 'consumer@example.com' },
        update: {
            fullName: 'John Consumer',
            passwordHash: consumerPassword,
            role: client_1.UserRole.CONSUMER,
            isActive: true,
        },
        create: {
            email: 'consumer@example.com',
            fullName: 'John Consumer',
            passwordHash: consumerPassword,
            role: client_1.UserRole.CONSUMER,
            isActive: true,
        },
    });
    const generateCodes = (qty) => {
        const codes = [];
        for (let i = 0; i < qty; i++) {
            const uuid = (0, uuid_1.v4)();
            codes.push(`FDA-PROD-${uuid.toUpperCase().replace(/-/g, '').substring(0, 12)}`);
        }
        return codes;
    };
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
                category: client_1.ProductCategory.DRUG,
                manufacturerId: manufacturer.id,
            },
        });
    }
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
//# sourceMappingURL=seed-test-data.js.map