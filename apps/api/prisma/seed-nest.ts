import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  console.log('🌱 Seed started...');
  const password = await bcrypt.hash('admin123', 10);

  // 0. Create Users
  console.log('👤 Creando usuarios base...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: { password },
    create: {
      email: 'admin@admin.com',
      password,
      role: Role.ADMIN,
    },
  });

  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@vendor.com' },
    update: { password },
    create: {
      email: 'vendor@vendor.com',
      password,
      role: Role.VENDOR,
    },
  });

  const buyerUser = await prisma.user.upsert({
    where: { email: 'buyer@user.com' },
    update: { password },
    create: {
      email: 'buyer@user.com',
      password,
      role: Role.CUSTOMER,
    },
  });

  // Create Profiles
  console.log('👤 Creando perfiles...');
  await prisma.profile.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      displayName: 'Premium Vendor',
      bio: 'Proveedor de servicios premium para Kuin-Twin',
    },
  });

  await prisma.profile.upsert({
    where: { userId: buyerUser.id },
    update: {},
    create: {
      userId: buyerUser.id,
      displayName: 'Comprador Test',
      bio: 'Usuario comprador para pruebas de Kuin-Twin',
    },
  });

  // Create Company for Vendor
  console.log('🏢 Creando empresa...');
  const company = await prisma.company.upsert({
    where: { rfc: 'KUI990101XYZ' },
    update: {},
    create: {
      businessName: 'Kuin Twin Services S.A.',
      rfc: 'KUI990101XYZ',
      legalName: 'Kuin Twin Services S.A. de C.V.',
      fiscalRegime: '601 - General de Ley Personas Morales',
      taxAddress: 'Av. Reforma 123, Ciudad de México',
      taxAddressZip: '06500',
      taxAddressCity: 'CDMX',
      taxAddressState: 'Ciudad de México',
      isActive: true,
      profiles: {
        connect: { userId: vendorUser.id }
      }
    }
  });

  console.log('✅ Usuarios y Empresa creados.');

  // 1. Create Service Units
  const units = [
    { name: 'Hora', abbreviation: 'HR' },
    { name: 'Evento', abbreviation: 'EVT' },
    { name: 'Día', abbreviation: 'DÍA' },
    { name: 'Sesión', abbreviation: 'SES' },
    { name: 'Persona', abbreviation: 'PER' },
    { name: 'm²', abbreviation: 'M²' },
  ];

  console.log('📦 Creando unidades de servicio...');
  const unitMap: Record<string, string> = {};
  for (const unit of units) {
    const createdUnit = await prisma.serviceUnit.upsert({
      where: { abbreviation: unit.abbreviation },
      update: { name: unit.name },
      create: unit,
    });
    unitMap[unit.abbreviation] = createdUnit.id;
  }
  console.log('✅ Unidades de servicio creadas.');

  // 2. Create Nested Categories
  const categories = [
    {
      name: 'Mecánica',
      slug: 'mecanica',
      description: 'Servicios de mecánica general',
      subcategories: [
        { name: 'Mecánica industrial', slug: 'mecanica-industrial', description: 'Mantenimiento preventivo de vehículos.', subcategories: [
          { name: 'Mantenimiento Preventivo (Industrial)', slug: 'mantenimiento-preventivo-industrial', description: 'Mantenimiento preventivo industrial.' },
          { name: 'Mantenimiento Correctivo (Industrial)', slug: 'mantenimiento-correctivo-industrial', description: 'Mantenimiento correctivo industrial.' },
          { name: 'Mantenimiento General (Industrial)', slug: 'mantenimiento-general-industrial', description: 'Mantenimiento general industrial.' },
        ] },
        {name: 'Mecánica Automotriz', slug: 'mecanica-automotriz', description: 'Mantenimiento preventivo de vehículos.', subcategories: [
          { name: 'Mantenimiento Preventivo (Auto)', slug: 'mantenimiento-preventivo-auto', description: 'Mantenimiento preventivo de vehículos.' },
          { name: 'Mantenimiento Correctivo (Auto)', slug: 'mantenimiento-correctivo-auto', description: 'Mantenimiento correctivo de vehículos.' },
          { name: 'Mantenimiento General (Auto)', slug: 'mantenimiento-general-auto', description: 'Mantenimiento general de vehículos.' },
          { name: 'Afinaciones', slug: 'afinaciones', description: 'Afinaciones de vehículos.' },
          { name: 'Frenos', slug: 'frenos', description: 'Frenos de vehículos.' },
          { name: 'Suspensión', slug: 'suspensión', description: 'Suspensión de vehículos.' },
          { name: 'Transmisión', slug: 'transmisión', description: 'Transmisión de vehículos.' },
          { name: 'Eléctrico', slug: 'eléctrico-automotriz', description: 'Eléctrico de vehículos.' },
          { name: 'Aire Acondicionado', slug: 'aire-acondicionado', description: 'Aire acondicionado de vehículos.' },
          { name: 'Llantas', slug: 'llantas', description: 'Llantas de vehículos.' },
          { name: 'Alineación y Balanceo', slug: 'alineacion-balanceo', description: 'Alineación y balanceo de vehículos.' },
          { name: 'Mecánica General', slug: 'mecanica-general-automotriz', description: 'Mecánica general de vehículos.' },
          { name: 'Mecánica Especializada', slug: 'mecanica-especializada', description: 'Mecánica especializada de vehículos.' },
          { name: 'Mecánica de Motos', slug: 'mecanica-motos', description: 'Mecánica de motos.' },
        ],},
      ]
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
      name: 'Limpieza',
      slug: 'limpieza',
      description: 'Servicios de limpieza profesional.',
      subcategories: [
        { name: 'Limpieza de Hogares', slug: 'limpieza-hogares', description: 'Limpieza de hogares.' },
        { name: 'Limpieza de Oficinas', slug: 'limpieza-oficinas', description: 'Limpieza de oficinas.' },
        { name: 'Limpieza de Autos', slug: 'limpieza-autos', description: 'Limpieza de autos.' },
        { name: 'Limpieza de Pisos', slug: 'limpieza-pisos', description: 'Limpieza de pisos.' },
        { name: 'Limpieza de Ventanas', slug: 'limpieza-ventanas', description: 'Limpieza de ventanas.' },
        { name: 'Limpieza de Alfombras', slug: 'limpieza-alfombras', description: 'Limpieza de alfombras.' },
        { name: 'Limpieza de Muebles', slug: 'limpieza-muebles', description: 'Limpieza de muebles.' },
        { name: 'Limpieza de Cocinas', slug: 'limpieza-cocinas', description: 'Limpieza de cocinas.' },
        { name: 'Limpieza de Baños', slug: 'limpieza-banos', description: 'Limpieza de baños.' },
        { name: 'Limpieza de Exteriores', slug: 'limpieza-exteriores', description: 'Limpieza de exteriores.' },
        { name: 'Limpieza de Piscinas', slug: 'limpieza-piscinas', description: 'Limpieza de piscinas.' },
        { name: 'Limpieza de Chimeneas', slug: 'limpieza-chimeneas', description: 'Limpieza de chimeneas.' },
        { name: 'Limpieza de Conductos', slug: 'limpieza-conductos', description: 'Limpieza de conductos.' },
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
      name: 'Electricistas',
      slug: 'electricistas',
      description: 'Servicios de electricidad profesional.',
      subcategories: [
        { name: 'Instalaciones Eléctricas', slug: 'instalaciones-electricas', description: 'Instalaciones de primer nivel.' },
        { name: 'Reparaciones Eléctricas', slug: 'reparaciones-electricas', description: 'Reparaciones urgentes y mantenimiento.' },
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
    return createdCategory;
  }

  for (const category of categories) {
    await seedCategory(category);
  }
  console.log('✅ Categorías anidadas creadas.');

  // 3. Create Services
  console.log('🛠️ Creando servicios...');

  const servicesToCreate = [
    {
      title: 'Chef Gourmet Experience (5 Tiempos)',
      slug: 'chef-gourmet-experience',
      description: 'Experiencia culinaria de 5 tiempos en la comodidad de tu hogar. Incluye ingredientes premium y limpieza de cocina.',
      basePrice: 2500,
      categorySlug: 'chef-privado',
      unitAbbr: 'EVT',
      tags: ['cocina', 'gourmet', 'lujo', 'chef'],
      latitude: 19.4326,
      longitude: -99.1332,
      faqs: [
        { question: '¿Incluye los ingredientes?', answer: 'Sí, todos los ingredientes de alta calidad están incluidos en el precio.' },
        { question: '¿Para cuántas personas es el servicio base?', answer: 'El precio base es para una cena de hasta 4 personas.' }
      ],
      metadata: [
        { key: 'Experiencia', value: '10 años en restaurantes Michelin' },
        { key: 'Idiomas', value: 'Español, Inglés, Francés' }
      ]
    },
    {
      title: 'Masaje Terapéutico Premium & Spa',
      slug: 'masaje-terapeutico-premium',
      description: 'Masaje de cuerpo completo con aromaterapia y aceites esenciales orgánicos. Llevamos todo lo necesario a tu ubicación.',
      basePrice: 1200,
      categorySlug: 'spa-masajes',
      unitAbbr: 'SES',
      tags: ['spa', 'relajación', 'salud', 'bienestar'],
      latitude: 19.4271,
      longitude: -99.1677,
      faqs: [
        { question: '¿Qué necesito tener en mi casa?', answer: 'Solo un espacio libre de aproximadamente 2x3 metros para colocar la camilla.' }
      ],
      metadata: [
        { key: 'Duración', value: '90 minutos' },
        { key: 'Técnica', value: 'Sueco / Tejido Profundo' }
      ]
    },
    {
      title: 'Mantenimiento Automotriz SUV/Sedán Domicilio',
      slug: 'mantenimiento-automotriz-premium',
      description: 'Servicio completo a domicilio: cambio de aceite, filtros, revisión de puntos de seguridad y niveles.',
      basePrice: 1850,
      categorySlug: 'mantenimiento-preventivo-auto',
      unitAbbr: 'EVT',
      tags: ['auto', 'mecanica', 'mantenimiento', 'domicilio'],
      latitude: 19.3907,
      longitude: -99.1436,
      faqs: [
        { question: '¿Usa aceite sintético?', answer: 'Sí, utilizamos aceite sintético de alta gama para proteger mejor su motor.' }
      ],
      metadata: [
        { key: 'Garantía', value: '6 meses o 10,000 km' }
      ]
    },
    {
      title: 'Servicios Eléctricos Residenciales Certificados',
      slug: 'servicios-electricos-certificados',
      description: 'Instalación de luminarias, contactos, centros de carga y cableado especializado. Cumplimiento con normas oficiales.',
      basePrice: 450,
      categorySlug: 'instalaciones-electricas',
      unitAbbr: 'HR',
      tags: ['electricista', 'seguridad', 'hogar', 'instalacion'],
      latitude: 19.4000,
      longitude: -99.1800,
      faqs: [
        { question: '¿Realizan dictámenes eléctricos?', answer: 'Sí, contamos con cédula profesional para emitir certificaciones residenciales.' }
      ],
      metadata: [
        { key: 'Certificación', value: 'Electricista con Cédula Profesional' }
      ]
    },
    {
      title: 'Wellness & High Performance Training',
      slug: 'wellness-high-performance',
      description: 'Plan personalizado de entrenamiento y nutrición enfocado en resultados. Sesiones uno a uno en gimnasio o exteriores.',
      basePrice: 800,
      categorySlug: 'entrenamiento-personal',
      unitAbbr: 'SES',
      tags: ['fitness', 'salud', 'deporte', 'personal-trainer'],
      latitude: 19.4300,
      longitude: -99.2000,
      faqs: [
        { question: '¿Puedo entrenar en un parque?', answer: 'Absolutamente, las sesiones en exteriores son muy populares y efectivas.' }
      ],
      metadata: [
        { key: 'Enfoque', value: 'Hipertrofia / Resistencia / Pérdida de grasa' }
      ]
    },
    {
      title: 'Limpieza Industrial Post-Remodelación',
      slug: 'limpieza-industrial-post-obra',
      description: 'Eliminación total de polvo, restos de materiales y manchas después de remodelaciones. Equipamiento industrial incluido.',
      basePrice: 25,
      categorySlug: 'limpieza-hogares',
      unitAbbr: 'M²',
      tags: ['limpieza', 'hogar', 'remodelacion', 'sanitizacion'],
      latitude: 19.4500,
      longitude: -99.1200,
      faqs: [
        { question: '¿Llevan sus propios productos?', answer: 'Sí, llevamos aspiradoras industriales y solventes específicos para cada superficie.' }
      ],
      metadata: [
        { key: 'Personal', value: 'Equipo de 2 a 4 personas dependiendo el tamaño' }
      ]
    },
    {
      title: 'Protección Ejecutiva y Escolta VIP',
      slug: 'proteccion-ejecutiva-escolta-vip',
      description: 'Protección personal de alto nivel con agentes certificados y vehículos blindados opcionales. Discreción absoluta.',
      basePrice: 5000,
      categorySlug: 'escolta-privada',
      unitAbbr: 'DÍA',
      tags: ['seguridad', 'escolta', 'proteccion', 'vip'],
      latitude: 19.4326,
      longitude: -99.1332,
      faqs: [
        { question: '¿El servicio incluye vehículo?', answer: 'El precio base es solo por el agente. Contamos con paquetes que incluyen camionetas blindadas nivel 5.' }
      ],
      metadata: [
        { key: 'Certificaciones', value: 'Ex-militares con entrenamiento en Israel' },
        { key: 'Idiomas', value: 'Español, Inglés' }
      ]
    },
    {
      title: 'Catering Gourmet para Eventos de Lujo',
      slug: 'catering-gourmet-eventos-lujo',
      description: 'Servicio integral de alimentos y bebidas para reuniones de negocios, lanzamientos y congresos. Menús personalizables.',
      basePrice: 350,
      categorySlug: 'catering-eventos',
      unitAbbr: 'PER',
      tags: ['catering', 'eventos', 'corporativo', 'comida'],
      latitude: 19.4200,
      longitude: -99.1700,
      faqs: [
        { question: '¿Cuál es el mínimo de personas?', answer: 'Atendemos eventos desde 20 hasta 500 personas.' }
      ],
      metadata: [
        { key: 'Opciones', value: 'Vegano, Sin Gluten, Keto' }
      ]
    },
    {
      title: 'Atención a Emergencias Eléctricas 24/7',
      slug: 'emergencias-electricas-24-7',
      description: 'Atención inmediata para cortocircuitos, fallas en centros de carga y apagones inesperados. Servicio garantizado.',
      basePrice: 1200,
      categorySlug: 'reparaciones-electricas',
      unitAbbr: 'EVT',
      tags: ['electricista', 'emergencia', 'reparacion', '24-7'],
      latitude: 19.3800,
      longitude: -99.1500,
      faqs: [
        { question: '¿Cuánto tardan en llegar?', answer: 'Nuestro tiempo promedio de llegada en la CDMX es de 45 a 60 minutos.' }
      ],
      metadata: [
        { key: 'Disponibilidad', value: 'Lunes a Domingo, las 24 horas' }
      ]
    },
    {
      title: 'Ingeniería Mecánica Pesada e Industrial',
      slug: 'ingenieria-mecanica-industrial-pesada',
      description: 'Mantenimiento integral and correctivo de maquinaria pesada, motores estacionarios y sistemas hidráulicos.',
      basePrice: 1500,
      categorySlug: 'mantenimiento-general-industrial',
      unitAbbr: 'HR',
      tags: ['industrial', 'maquinaria', 'mecanica', 'ingenieria'],
      latitude: 19.5000,
      longitude: -99.1000,
      faqs: [
        { question: '¿Cuentan con herramienta especializada?', answer: 'Sí, disponemos de equipos de diagnóstico láser y bancos de prueba móviles.' }
      ],
      metadata: [
        { key: 'Alcance', value: 'Toda la zona metropolitana y Bajío' }
      ]
    },
    {
      title: 'Limpieza Profunda de Tapicería y Alfombras',
      slug: 'limpieza-profunda-tapiceria-alfombras',
      description: 'Limpieza profunda con sistema de inyección-succión y productos de secado rápido. Eliminación de manchas difíciles.',
      basePrice: 85,
      categorySlug: 'limpieza-alfombras',
      unitAbbr: 'M²',
      tags: ['limpieza', 'alfombras', 'mantenimiento', 'hogar'],
      latitude: 19.4100,
      longitude: -99.1900,
      faqs: [
        { question: '¿En cuánto tiempo se secan?', answer: 'Gracias a nuestro equipo de alta potencia, las alfombras quedan secas en 2 a 4 horas.' }
      ],
      metadata: [
        { key: 'Tecnología', value: 'Inyeccion-Succion de vapor seco' }
      ]
    }
  ];

  for (const s of servicesToCreate) {
    const category = await prisma.category.findUnique({ where: { slug: s.categorySlug } });
    if (!category) {
      console.warn(`⚠️ Categoría no encontrada para el slug: ${s.categorySlug}`);
      continue;
    }

    const { categorySlug, unitAbbr, latitude, longitude, faqs, metadata, ...serviceData } = s;

    const createdService = await prisma.service.upsert({
      where: { slug: serviceData.slug },
      update: {
        ...serviceData,
        vendorId: vendorUser.id,
        companyId: company.id,
        categoryId: category.id,
        unitId: unitMap[unitAbbr],
      },
      create: {
        ...serviceData,
        vendorId: vendorUser.id,
        companyId: company.id,
        categoryId: category.id,
        unitId: unitMap[unitAbbr],
        faqs: {
          create: faqs
        },
        metadata: {
          create: metadata
        }
      },
    });

    // Actualizar ubicación PostGIS mediante Raw SQL
    await prisma.$executeRaw`
      UPDATE "Service" 
      SET location = ST_GeomFromText(${`POINT(${longitude} ${latitude})`}, 4326),
          latitude = ${latitude},
          longitude = ${longitude}
      WHERE id = ${createdService.id}
    `;
  }

  console.log('✅ Servicios creados.');

  console.log('🎉 Seed finished successfully!');

  await app.close();
}

bootstrap()
  .catch((e) => {
    console.error('❌ SEED ERROR:', e);
    if (e.code) console.error('Error Code:', e.code);
    if (e.meta) console.error('Error Meta:', e.meta);
    process.exit(1);
  });
