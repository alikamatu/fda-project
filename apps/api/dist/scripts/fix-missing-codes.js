"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const uuid_1 = require("uuid");
require("dotenv/config");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}
const pool = new pg_1.Pool({ connectionString });
const prisma = new client_1.PrismaClient({ adapter: new adapter_pg_1.PrismaPg(pool) });
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
        const qty = Math.min(batch.quantity, 10);
        const codes = [];
        for (let i = 0; i < qty; i++) {
            const uuid = (0, uuid_1.v4)();
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
//# sourceMappingURL=fix-missing-codes.js.map