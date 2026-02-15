import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    select: { name: true, slug: true }
  });
  console.log('---CATEGORIES---');
  console.log(JSON.stringify(categories, null, 2));
  console.log('---END---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
