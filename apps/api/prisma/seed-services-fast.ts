import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seed Services started (Prisma 7 Fast Mode)...');

  const vendorUser = await prisma.user.findUnique({
    where: { email: 'vendor@vendor.com' },
  });

  if (!vendorUser) {
    console.error('❌ Vendor user not found. Please run seed-nest.ts first.');
    return;
  }

  const company = await prisma.company.findFirst({
    where: { profiles: { some: { userId: vendorUser.id } } }
  });

  const categories = await prisma.category.findMany({
    where: { parentId: { not: null } }
  });

  if (categories.length === 0) {
    console.error('❌ Categories not found. Please run seed-nest.ts first.');
    return;
  }

  const units = await prisma.serviceUnit.findMany();

  const servicesData = [
    { title: 'Chófer Privado de Lujo', description: 'Servicio de transporte privado con chófer bilingüe y vehículos de gama alta.' },
    { title: 'Chef a Domicilio - Cena Romántica', description: 'Menú degustación de 5 tiempos preparado en la comodidad de su hogar.' },
    { title: 'Yate de Lujo 40ft', description: 'Recorrido por la bahía con catering y tripulación incluida.' },
    { title: 'Masaje Relajante Profundo', description: 'Sesión de 90 minutos con aceites esenciales y música ambiental.' },
    { title: 'Entrenamiento Personalizado', description: 'Plan de entrenamiento y nutrición adaptado a sus objetivos.' },
    { title: 'Escolta Privada VIP', description: 'Seguridad profesional discreta para eventos o traslados.' },
    { title: 'Catering para Eventos Corporativos', description: 'Buffet internacional y servicio de meseros para su empresa.' },
    { title: 'Limpieza Profunda de Residencias', description: 'Equipo especializado para dejar su hogar impecable.' },
    { title: 'Decoración de Interiores Express', description: 'Asesoría para renovar sus espacios en un solo día.' },
    { title: 'Jets Privados - Vuelo Nacional', description: 'Traslado rápido y seguro en aeronave de última generación.' },
    { title: 'Barman Profesional para Fiestas', description: 'Mixología creativa y servicio de coctelería para sus invitados.' },
    { title: 'Jardinería de Paisaje', description: 'Diseño y mantenimiento de jardines zen y modernos.' },
    { title: 'Soporte Técnico de IT a Domicilio', description: 'Reparación de equipos y configuración de redes seguras.' },
    { title: 'Fotógrafo Profesional para Eventos', description: 'Capturamos los mejores momentos de su celebración.' },
    { title: 'Maquillaje Social de Gala', description: 'Look perfecto para bodas, graduaciones y eventos especiales.' },
    { title: 'Clases de Yoga al Amanecer', description: 'Encuentre el equilibrio mental y físico frente al mar.' },
    { title: 'Paseo en Helicóptero - City Tour', description: 'La mejor vista de la ciudad desde las alturas.' },
    { title: 'Lavado de Autos Premium', description: 'Detallado automotriz completo en su ubicación.' },
    { title: 'Niñera Bilingüe Calificada', description: 'Cuidado profesional y educativo para sus hijos.' },
    { title: 'Clases de Tenis Personalizadas', description: 'Mejore su técnica con instructores certificados.' },
    { title: 'Organización de Armarios (Home Organizer)', description: 'Optimización de espacios y orden sistemático.' },
    { title: 'Servicio de Concierge Lifestyle', description: 'Gestión de reservas y compras exclusivas.' },
    { title: 'Mantenimiento de Albercas VIP', description: 'Cuidado químico y limpieza profunda programada.' },
    { title: 'Peluquería Canina a Domicilio', description: 'Spaw para su mascota sin salir de casa.' },
    { title: 'Sommelier Privado - Cata de Vinos', description: 'Descubra los secretos de las mejores cavas del mundo.' },
    { title: 'Mago para Eventos Infantiles', description: 'Show de magia e ilusionismo garantizado.' },
    { title: 'Reparación de Relojes de Lujo', description: 'Servicio técnico especializado en alta relojería.' },
    { title: 'Personal Shopper de Moda', description: 'Actualice su guardarropa con las últimas tendencias.' },
    { title: 'Renta de Villa con Alberca', description: 'Escapada exclusiva de fin de semana en locación secreta.' },
    { title: 'Excursión en Cuatrimoto Guiada', description: 'Aventura de montaña con equipo de seguridad premium.' },
  ];

  const imageFiles = [
    '1.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.png', '17.png', '18.jpg', 
    '19.jpg', '2.png', '20.jpg', '21.jpg', '22.jpg', '23.png', '24.jpg', '25.png', '26.png', '27.png', 
    '28.png', '29.png', '3.jpg', '30.png', '4.png', '5.png', '6.png', '7.png', '8.png', '1.jpg'
  ];

  console.log(`🚀 Creando ${servicesData.length} servicios...`);

  for (let i = 0; i < servicesData.length; i++) {
    const data = servicesData[i];
    const category = categories[i % categories.length];
    const unit = units[i % units.length];
    const imageName = imageFiles[i];
    const imageUrl = `/uploads/media/examples/${imageName}`;

    // Determinar si el servicio es "por cotización" (aprox 30% de probabilidad o servicios específicos)
    const isQuotation = i % 4 === 0 || data.title.toLowerCase().includes('personalizada') || data.title.toLowerCase().includes('exclusiva') || data.title.toLowerCase().includes('jet');
    const basePrice = isQuotation ? null : Math.floor(Math.random() * (5000 - 500 + 1)) + 500;
    const showPrice = !isQuotation;

    await prisma.service.upsert({
      where: {
        vendorId_title: {
          vendorId: vendorUser.id,
          title: data.title
        }
      },
      update: {
        description: data.description,
        imageUrl,
        categoryId: category.id,
        unitId: unit?.id,
        isActive: true,
        basePrice,
        showPrice,
        slug: data.title.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        latitude: 19.4326 + (Math.random() - 0.5) * 0.1,
        longitude: -99.1332 + (Math.random() - 0.5) * 0.1,
        address: 'Ciudad de México, CP 06500'
      },
      create: {
        vendorId: vendorUser.id,
        companyId: company?.id,
        title: data.title,
        description: data.description,
        imageUrl,
        categoryId: category.id,
        unitId: unit?.id,
        isActive: true,
        basePrice,
        showPrice,
        slug: data.title.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        latitude: 19.4326 + (Math.random() - 0.5) * 0.1,
        longitude: -99.1332 + (Math.random() - 0.5) * 0.1,
        address: 'Ciudad de México, CP 06500'
      }
    });
  }

  console.log('🎉 Seed Services finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed Services error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
