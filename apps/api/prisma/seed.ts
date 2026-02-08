import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed started...');

  // 1. Create Service Units
  const units = [
    { name: 'Hour', abbreviation: 'HR' },
    { name: 'Event', abbreviation: 'EVT' },
    { name: 'Day', abbreviation: 'DAY' },
    { name: 'Session', abbreviation: 'SES' },
    { name: 'Person', abbreviation: 'PER' },
  ];

  for (const unit of units) {
    await prisma.serviceUnit.upsert({
      where: { abbreviation: unit.abbreviation },
      update: {},
      create: {
        name: unit.name,
        abbreviation: unit.abbreviation,
      },
    });
  }
  console.log('Service units seeded.');

  // 2. Create Categories
  const categories = [
    { name: 'Private Aviation', slug: 'private-aviation' },
    { name: 'Luxury Concierge', slug: 'luxury-concierge' },
    { name: 'Private Chef', slug: 'private-chef' },
    { name: 'Superyacht Charter', slug: 'superyacht-charter' },
    { name: 'Wellness & SPA', slug: 'wellness-spa' },
    { name: 'Chauffeur Services', slug: 'chauffeur-services' },
    { name: 'Security & Bodyguards', slug: 'security-bodyguards' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: `Premium services for ${cat.name}`,
      },
    });
  }
  console.log('Categories seeded.');

  console.log('Seed finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
