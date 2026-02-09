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
    console.log('Debugging login for admin@fda.gov...');
    const user = await prisma.user.findUnique({
        where: { email: 'admin@fda.gov' },
    });
    if (!user) {
        console.error('❌ User admin@fda.gov NOT FOUND in database.');
        return;
    }
    console.log('✅ User found:', {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        passwordHash: user.passwordHash ? '(present)' : '(missing)',
    });
    const password = 'Admin1234';
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (isMatch) {
        console.log('✅ Password "Admin1234" MATCHES the stored hash.');
    }
    else {
        console.error('❌ Password "Admin1234" DOES NOT MATCH the stored hash.');
        const newHash = await bcrypt.hash(password, 10);
        console.log('New hash generated for comparison:', newHash);
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
//# sourceMappingURL=debug-login.js.map