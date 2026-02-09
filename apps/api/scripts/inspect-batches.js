"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_service_1 = require("../src/prisma/prisma.service");
async function run() {
    const prisma = new prisma_service_1.PrismaService();
    try {
        await prisma.$connect();
        const batches = await prisma.productBatch.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: { product: { select: { productName: true } } },
        });
        console.log('Found batches:', batches.length);
        console.log(JSON.stringify(batches.map((b) => ({ id: b.id, batchNumber: b.batchNumber, productId: b.productId, productName: b.product?.productName, status: b.status, createdAt: b.createdAt })), null, 2));
    }
    catch (err) {
        console.error('Error querying batches:', err);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
run();
//# sourceMappingURL=inspect-batches.js.map