import { PrismaClient } from '@prisma/client';
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

  const passwordsToTest = ['Admin@1234', 'Admin1234'];
  for (const pw of passwordsToTest) {
    const isMatch = await bcrypt.compare(pw, user.passwordHash);
    if (isMatch) {
      console.log(`✅ Password "${pw}" MATCHES the stored hash.`);
    } else {
      console.log(`ℹ️  Password "${pw}" does not match.`);
    }
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
