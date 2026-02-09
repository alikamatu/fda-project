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
  const email = 'admin@fda.gov';
  const newPassword = 'Admin@1234';
  
  console.log(`Resetting password for ${email}...`);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        passwordHash: hashedPassword,
        isActive: true, // Ensure active just in case
      },
    });
    console.log(`✅ Password successfully reset for ${user.email}`);
  } catch (error) {
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
