"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = require("bcrypt");
if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === undefined) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
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
    console.log('Seeding specific verification test data...');
    let manufacturerUser = await prisma.user.findUnique({
        where: { email: 'test-mfr@pharma.com' }
    });
    if (!manufacturerUser) {
        const manufacturerPassword = await bcrypt.hash('Manufacturer1234', 10);
        manufacturerUser = await prisma.user.create({
            data: {
                email: 'test-mfr@pharma.com',
                fullName: 'Test Manufacturer',
                passwordHash: manufacturerPassword,
                role: client_1.UserRole.MANUFACTURER,
                isActive: true,
            },
        });
    }
    let manufacturer = await prisma.manufacturer.findUnique({
        where: { userId: manufacturerUser.id }
    });
    if (!manufacturer) {
        manufacturer = await prisma.manufacturer.create({
            data: {
                companyName: 'Test Pharma Corp',
                registrationNumber: 'TEST-MFR-001-' + Date.now(),
                contactEmail: 'test@pharma.com',
                address: 'Test Address',
                userId: manufacturerUser.id,
                isApproved: true,
            },
        });
    }
    const existingValid = await prisma.productBatch.findFirst({
        where: { batchNumber: 'VALID-BATCH-2027' },
    });
    if (!existingValid) {
        await prisma.productBatch.create({
            data: {
                batchNumber: 'VALID-BATCH-2027',
                quantity: 100,
                manufactureDate: new Date('2024-01-01'),
                expiryDate: new Date('2027-01-01'),
                product: {
                    connectOrCreate: {
                        where: { productCode: 'AL-101' },
                        create: {
                            productName: 'Authentic LifeSaver',
                            productCode: 'AL-101',
                            category: client_1.ProductCategory.DRUG,
                            manufacturerId: manufacturer.id,
                        },
                    },
                },
                verificationCodes: {
                    create: [{ code: 'VALID-QR-CODE-123' }],
                },
            },
        });
    }
    const existingExpired = await prisma.productBatch.findFirst({
        where: { batchNumber: 'EXPIRED-BATCH-2025' },
    });
    if (!existingExpired) {
        await prisma.productBatch.create({
            data: {
                batchNumber: 'EXPIRED-BATCH-2025',
                quantity: 100,
                manufactureDate: new Date('2023-01-01'),
                expiryDate: new Date('2025-01-01'),
                product: {
                    connectOrCreate: {
                        where: { productCode: 'OM-202' },
                        create: {
                            productName: 'Old Medicine',
                            productCode: 'OM-202',
                            category: client_1.ProductCategory.DRUG,
                            manufacturerId: manufacturer.id,
                        },
                    },
                },
                verificationCodes: {
                    create: [{ code: 'EXPIRED-QR-CODE-456' }],
                },
            },
        });
    }
    console.log('Verification test data seeded correctly:');
    console.log('VALID Code: VALID-QR-CODE-123');
    console.log('EXPIRED Code: EXPIRED-QR-CODE-456');
    console.log('FAKE Code: ANY-OTHER-CODE');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-verification.js.map