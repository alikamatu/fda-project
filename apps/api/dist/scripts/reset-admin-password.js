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
    const email = 'admin@fda.gov';
    const newPassword = 'Admin1234';
    console.log(`Resetting password for ${email}...`);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    try {
        const user = await prisma.user.update({
            where: { email },
            data: {
                passwordHash: hashedPassword,
                isActive: true,
            },
        });
        console.log(`✅ Password successfully reset for ${user.email}`);
    }
    catch (error) {
        console.error('❌ Failed to update user:', error);
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=reset-admin-password.js.map