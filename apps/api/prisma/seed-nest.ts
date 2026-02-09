import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  console.log('🌱 Seed started...');

  // 1. Create Service Units
  const units = [
    { name: 'Hora', abbreviation: 'HR' },
    { name: 'Evento', abbreviation: 'EVT' },
    { name: 'Día', abbreviation: 'DÍA' },
    { name: 'Sesión', abbreviation: 'SES' },
    { name: 'Persona', abbreviation: 'PER' },
  ];

  console.log('📦 Creando unidades de servicio...');
  for (const unit of units) {
    await prisma.serviceUnit.upsert({
      where: { abbreviation: unit.abbreviation },
      update: { name: unit.name },
      create: unit,
    });
  }
  console.log('✅ Unidades de servicio creadas.');

  // 2. Create Nested Categories
  const categories = [
    {
      name: 'Transporte VIP',
      slug: 'transporte-vip',
      description: 'Traslados de lujo por tierra, mar y aire.',
      subcategories: [
        { name: 'Aviación Privada', slug: 'aviacion-privada', description: 'Jets privados y helicópteros.' },
        { name: 'Alquiler de Yates', slug: 'alquiler-yates', description: 'Embarcaciones de lujo y charters.' },
        { name: 'Chófer y Traslados', slug: 'chofer-traslados', description: 'Vehículos de alta gama con conductor.' },
      ],
    },
    {
      name: 'Gastronomía',
      slug: 'gastronomia',
      description: 'Experiencias culinarias exclusivas.',
      subcategories: [
        { name: 'Chef Privado', slug: 'chef-privado', description: 'Cocina de autor en su domicilio.' },
        { name: 'Catering de Eventos', slug: 'catering-eventos', description: 'Servicios gastronómicos para celebraciones.' },
      ],
    },
    {
      name: 'Bienestar y Salud',
      slug: 'bienestar-salud',
      description: 'Cuidado personal y relajación.',
      subcategories: [
        { name: 'SPA y Masajes', slug: 'spa-masajes', description: 'Tratamientos de relajación a domicilio o en centros.' },
        { name: 'Entrenamiento Personal', slug: 'entrenamiento-personal', description: 'Fitness y alto rendimiento.' },
      ],
    },
    {
      name: 'Seguridad',
      slug: 'seguridad',
      description: 'Protección y vigilancia profesional.',
      subcategories: [
        { name: 'Escolta Privada', slug: 'escolta-privada', description: 'Protección personal cercana.' },
        { name: 'Seguridad para Eventos', slug: 'seguridad-eventos', description: 'Control de acceso y vigilancia.' },
      ],
    },
    {
      name: 'Conserjería',
      slug: 'conserjeria',
      description: 'Gestión de estilo de vida y asistencia.',
      subcategories: [
        { name: 'Reservas Exclusivas', slug: 'reservas-exclusivas', description: 'Gestión de mesas y eventos VIP.' },
        { name: 'Lifestyle Management', slug: 'lifestyle-management', description: 'Asistencia personal y gestión de tareas.' },
      ],
    },
  ];

  console.log('📂 Creando categorías anidadas...');

  async function seedCategory(cat: any, parentId: string | null = null) {
    const { subcategories, ...catData } = cat;
    
    const createdCategory = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: { 
        name: catData.name, 
        description: catData.description,
        parentId: parentId 
      },
      create: {
        ...catData,
        parentId: parentId,
      },
    });

    if (subcategories && subcategories.length > 0) {
      for (const sub of subcategories) {
        await seedCategory(sub, createdCategory.id);
      }
    }
  }

  for (const category of categories) {
    await seedCategory(category);
  }
  console.log('✅ Categorías anidadas creadas.');

  console.log('🎉 Seed finished successfully!');

  await app.close();
}

bootstrap()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  });
