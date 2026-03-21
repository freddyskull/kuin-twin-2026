import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Testing connection to:', connectionString);
  try {
    const users = await prisma.user.findMany();
    const services = await prisma.service.findMany();
    console.log('Success! Found users:', users.length);
    console.log('Success! Found services:', services.length);
    services.forEach(s => console.log(` - ${s.title} (${s.slug}) [Vendor: ${s.vendorId}]`));
  } catch (e) {
    console.error('Connection failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
