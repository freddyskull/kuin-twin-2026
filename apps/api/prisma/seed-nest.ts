import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  console.log('🌱 Seed started...');

  // 1. Create Service Units
  const units = [
    { name: 'Hour', abbreviation: 'HR' },
    { name: 'Event', abbreviation: 'EVT' },
    { name: 'Day', abbreviation: 'DAY' },
    { name: 'Session', abbreviation: 'SES' },
    { name: 'Person', abbreviation: 'PER' },
  ];

  console.log('📦 Creating service units...');
  for (const unit of units) {
    await prisma.serviceUnit.upsert({
      where: { abbreviation: unit.abbreviation },
      update: {},
      create: unit,
    });
  }
  console.log('✅ Service units seeded.');

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

  console.log('📂 Creating categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        ...cat,
        description: `Premium services for ${cat.name}`,
      },
    });
  }
  console.log('✅ Categories seeded.');

  console.log('🎉 Seed finished successfully!');

  await app.close();
}

bootstrap()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  });
