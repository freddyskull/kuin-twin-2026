import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL no definida');

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const i = (name: string) => `/uploads/media/examples/${name}`;

// Imágenes verificadas visualmente
const FOTOS = {
  barman: i('01.png'),
  catering: i('02.jpg'),
  cena: i('03.jpg'),
  chofer: i('04.png'),
  tenis: i('05.jpg'),
  yoga: i('06.jpg'),
  interiores: i('07.jpg'),
  gym: i('08.jpg'),
  escolta: i('09.jpg'),
  cuatrimoto: i('10.jpg'),
  fotografo: i('11.jpg'),
  jardin: i('12.jpg'),
  auto_lujo: i('14.jpg'),
  limpieza: i('15.jpg'),
  mago: i('16.jpg'),
  alberca: i('17.jpg'),
  maquillaje: i('18.jpg'),
  masaje: i('19.jpg'),
  jet: i('20.jpg'),
};

const SHUFFLE_GALLERY = [
  ...Object.values(FOTOS)
];

function getGallery(main: string, count = 4): string[] {
  return SHUFFLE_GALLERY
    .filter(img => img !== main)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

const DEFAULT_SCHEDULE = {
  schedule: [
    { day: 'Monday', startTime: '09:00', endTime: '18:00', enabled: true },
    { day: 'Tuesday', startTime: '09:00', endTime: '18:00', enabled: true },
    { day: 'Wednesday', startTime: '09:00', endTime: '18:00', enabled: true },
    { day: 'Thursday', startTime: '09:00', endTime: '18:00', enabled: true },
    { day: 'Friday', startTime: '09:00', endTime: '20:00', enabled: true },
    { day: 'Saturday', startTime: '10:00', endTime: '15:00', enabled: true },
    { day: 'Sunday', startTime: '00:00', endTime: '00:00', enabled: false },
  ]
};

const VIP_SCHEDULE = {
  schedule: [
    { day: 'Monday', startTime: '00:00', endTime: '23:59', enabled: true },
    { day: 'Tuesday', startTime: '00:00', endTime: '23:59', enabled: true },
    { day: 'Wednesday', startTime: '00:00', endTime: '23:59', enabled: true },
    { day: 'Thursday', startTime: '00:00', endTime: '23:59', enabled: true },
    { day: 'Friday', startTime: '00:00', endTime: '23:59', enabled: true },
    { day: 'Saturday', startTime: '00:00', endTime: '23:59', enabled: true },
    { day: 'Sunday', startTime: '00:00', endTime: '23:59', enabled: true },
  ]
};

const COMPANIES = [
  {
    businessName: 'LuxeLife Services',
    description: 'Ofrecemos experiencias exclusivas diseñadas para clientes que buscan lo extraordinario. Desde concierge personal hasta seguridad privada de alto nivel, nuestro compromiso es la excelencia y la discreción absoluta en cada detalle de su vida diaria.',
    rfc: 'LLS240101AB1',
    legalName: 'LuxeLife Services S.A. de C.V.',
    fiscalRegime: '601 - General de Ley Personas Morales',
    taxAddress: 'Av. Presidente Masaryk 123, Polanco',
    taxAddressZip: '11560', taxAddressCity: 'Ciudad de México',
    taxAddressState: 'CDMX', taxAddressCounty: 'Miguel Hidalgo',
  },
  {
    businessName: 'EliteHome Pro',
    description: 'Transformamos espacios en hogares impecables. Especialistas en limpieza profunda, diseño de interiores y mantenimiento residencial de alta gama, utilizando tecnologías eco-amigables y personal altamente capacitado para garantizar su confort total.',
    rfc: 'EHP240201CD2',
    legalName: 'Elite Home Professional S. de R.L. de C.V.',
    fiscalRegime: '601 - General de Ley Personas Morales',
    taxAddress: 'Blvd. Manuel Ávila Camacho 88, Lomas',
    taxAddressZip: '11000', taxAddressCity: 'Ciudad de México',
    taxAddressState: 'CDMX', taxAddressCounty: 'Naucalpan',
  },
  {
    businessName: 'Aventura & Travel MX',
    description: 'Su puerta de entrada a experiencias de viaje inigualables. Gestionamos logística de transporte privado terrestre, aéreo y marítimo, creando itinerarios de aventura personalizados que combinan la adrenalina con el lujo y la seguridad de clase mundial.',
    rfc: 'ATM240301EF3',
    legalName: 'Aventura & Travel México S.A. de C.V.',
    fiscalRegime: '601 - General de Ley Personas Morales',
    taxAddress: 'Paseo de la Reforma 250, Cuauhtémoc',
    taxAddressZip: '06600', taxAddressCity: 'Ciudad de México',
    taxAddressState: 'CDMX', taxAddressCounty: 'Cuauhtémoc',
  },
  {
    businessName: 'Wellness & Fit Studio',
    description: 'Dedicados a cultivar su mejor versión. Nuestro enfoque holístico combina entrenamiento físico de alto rendimiento con prácticas de bienestar mental. Contamos con expertos certificados en nutrición, yoga y terapias corporales avanzadas para su salud integral.',
    rfc: 'WFS240401GH4',
    legalName: 'Wellness & Fit Studio S.C.',
    fiscalRegime: '612 - Personas Físicas con Actividades Empresariales',
    taxAddress: 'Av. Insurgentes Sur 1602, Del Valle',
    taxAddressZip: '03100', taxAddressCity: 'Ciudad de México',
    taxAddressState: 'CDMX', taxAddressCounty: 'Benito Juárez',
  },
  {
    businessName: 'Gourmet & Events CDMX',
    description: 'Elevamos el arte de la hospitalidad y la gastronomía. Desde cenas íntimas hasta eventos corporativos masivos, cada detalle de nuestro servicio está diseñado para cautivar los sentidos, con chefs de renombre y una ejecución impecable para momentos memorables.',
    rfc: 'GEC240501IJ5',
    legalName: 'Gourmet & Events Ciudad de México S.A.',
    fiscalRegime: '601 - General de Ley Personas Morales',
    taxAddress: 'Calle Ámsterdam 72, Hipódromo',
    taxAddressZip: '06100', taxAddressCity: 'Ciudad de México',
    taxAddressState: 'CDMX', taxAddressCounty: 'Cuauhtémoc',
  },
];

const SERVICES = [
  {
    title: 'Chófer Privado de Lujo',
    description: 'Experimente el máximo confort en sus traslados con nuestro servicio de chófer privado bilingüe. Contamos con una flota de vehículos de última generación, equipados con amenidades ejecutivas, Wi-Fi de alta velocidad y blindaje opcional. Ideal para traslados corporativos, eventos de gala o turismo de lujo en la CDMX con total discreción y seguridad puntual.',
    mainImg: FOTOS.chofer,
    companyIdx: 2, isQuotation: false, price: 3500,
    schedule: VIP_SCHEDULE,
    metadata: [
      { key: 'Vehículos', value: 'Mercedes Clase S, BMW Serie 7' },
      { key: 'Idiomas', value: 'Español, Inglés, Francés' },
      { key: 'Certificación', value: 'Conducción Defensiva VIP' }
    ],
    tags: ['transporte', 'lujo', 'premium', 'chofer', 'bilingüe']
  },
  {
    title: 'Jets Privados - Vuelo Nacional',
    description: 'Optimice su tiempo con nuestra flota de jets privados listos para despegar en 2 horas hacia cualquier destino nacional. Olvide las filas y las esperas; nuestro servicio incluye acceso a terminales privadas (FBO), catering gourmet personalizado a bordo, concierge de vuelo y traslados terrestres de puerta a puerta coordinados a la perfección.',
    mainImg: FOTOS.jet,
    companyIdx: 2, isQuotation: true, price: null,
    schedule: VIP_SCHEDULE,
    metadata: [
      { key: 'Capacidad', value: 'Hasta 12 pasajeros' },
      { key: 'Autonomía', value: '5,000 km sin escalas' },
      { key: 'Extras', value: 'Permiso para mascotas, Kit de Descanso' }
    ],
    tags: ['aviación', 'jet', 'vuelo', 'privado', 'rápido']
  },
  {
    title: 'Barman Profesional para Fiestas',
    description: 'Transforme su evento en una experiencia sensorial única con nuestra mixología de autor. Nuestros barman certificados no solo preparan bebidas, crean espectáculos visuales con ingredientes orgánicos, cristalería de diseño y barras temáticas iluminadas. Incluye carta de cócteles personalizada según la temática de su celebración y servicio premium de destilados.',
    mainImg: FOTOS.barman,
    companyIdx: 4, isQuotation: false, price: 4500,
    schedule: DEFAULT_SCHEDULE,
    metadata: [
      { key: 'Especialidad', value: 'Mixología Molecular' },
      { key: 'Duración', value: 'Desde 5 horas de servicio' },
      { key: 'Barra', value: 'Incluye barra móvil LED' }
    ],
    tags: ['bebidas', 'cócteles', 'fiesta', 'barman', 'mixología']
  },
  {
    title: 'Masaje Relajante Profundo',
    description: 'Recupere su equilibrio interior con una terapia corporal diseñada para disolver el estrés acumulado. Utilizamos una combinación de técnicas suecas, tejido profundo y aromaterapia con aceites orgánicos de grado terapéutico. El servicio incluye música ambiental, sábanas de algodón egipcio y camilla profesional, trasladando la experiencia completa de un spa de lujo hasta la comodidad de su hogar.',
    mainImg: FOTOS.masaje,
    companyIdx: 3, isQuotation: false, price: 2100,
    schedule: DEFAULT_SCHEDULE,
    metadata: [
      { key: 'Técnica', value: 'Deep Tissue / Aromaterapia' },
      { key: 'Duración', value: '90 minutos' },
      { key: 'Material', value: 'Aceites Orgánicos Certificados' }
    ],
    tags: ['bienestar', 'spa', 'masaje', 'relajación', 'salud']
  },
  {
    title: 'Limpieza Profunda de Residencias',
    description: 'Devolvemos la frescura original a su hogar con un protocolo de limpieza detallado y exhaustivo. Nuestro equipo de profesionales utiliza tecnología de vapor, desinfección con ozono y productos hipoalergénicos para eliminar el 99% de alérgenos y suciedad oculta en alfombras, cristales, juntas y áreas de difícil acceso. Un servicio pensado para quienes exigen un ambiente saludable e impecable.',
    mainImg: FOTOS.limpieza,
    companyIdx: 1, isQuotation: false, price: 2800,
    schedule: DEFAULT_SCHEDULE,
    metadata: [
      { key: 'Equipamiento', value: 'Tecnología de Vapor Karcher' },
      { key: 'Garantía', value: 'Revisión de calidad al finalizar' },
      { key: 'Seguridad', value: 'Personal investigado y uniformado' }
    ],
    tags: ['hogar', 'limpieza', 'desinfección', 'profesional', 'casa']
  },
  {
    title: 'Chef a Domicilio - Cena Romántica',
    description: 'Sorprenda a esa persona especial con una velada gastronómica inigualable. Nuestro chef de alta cocina diseñará un menú de cinco tiempos basado en sus preferencias, cocinando en vivo con ingredientes frescos de mercado. El servicio incluye montaje de mesa de gala, decoración floral, maridaje de vinos y limpieza total de la cocina, permitiéndoles disfrutar del momento sin preocupaciones.',
    mainImg: FOTOS.cena,
    companyIdx: 4, isQuotation: false, price: 5500,
    schedule: DEFAULT_SCHEDULE,
    metadata: [
      { key: 'Menú', value: 'Degustación 5 Tiempos' },
      { key: 'Vinos', value: 'Selección de Sommelier incluida' },
      { key: 'Personal', value: 'Chef + 1 Mesero de servicio' }
    ],
    tags: ['comida', 'chef', 'cena', 'romántico', 'gourmet']
  },
  {
    title: 'Escolta Privada VIP',
    description: 'Protección ejecutiva de clase mundial centrada en la prevención y la discreción. Nuestro personal cuenta con entrenamiento militar y táctico especializado en protección de dignatarios. Se realiza un análisis previo de rutas y vulnerabilidades para garantizar traslados seguros en cualquier zona de la ciudad, manteniendo siempre un perfil discreto y profesional adaptado a su agenda corporativa o social.',
    mainImg: FOTOS.escolta,
    companyIdx: 0, isQuotation: true, price: null,
    schedule: VIP_SCHEDULE,
    metadata: [
      { key: 'Perfil', value: 'Ex-Militar / Policía Federal' },
      { key: 'Armamento', value: 'Autorizado SEDENA (opcional)' },
      { key: 'Táctica', value: 'Protocolo de Extracción Segura' }
    ],
    tags: ['seguridad', 'escolta', 'protección', 'VIP', 'prevención']
  },
  {
    title: 'Decoración de Interiores Express',
    description: 'Renueve la energía de sus espacios en tiempo récord. Nuestra consultoría integral de diseño se enfoca en maximizar el potencial de su hogar mediante la redistribución inteligente de mobiliario, actualización de paleta cromática y selección de piezas clave de decoración. Ideal para quienes buscan un cambio visual impactante sin las complicaciones de una obra mayor, logrando ambientes sofisticados y funcionales en cuestión de días.',
    mainImg: FOTOS.interiores,
    companyIdx: 1, isQuotation: true, price: null,
    schedule: DEFAULT_SCHEDULE,
    metadata: [
      { key: 'Alcance', value: 'Hasta 3 áreas por proyecto' },
      { key: 'Entrega', value: 'Render 3D y lista de compras' },
      { key: 'Estilo', value: 'Contemporáneo / Minimalista' }
    ],
    tags: ['diseño', 'interiores', 'decoración', 'remodelación', 'hogar']
  },
  {
    title: 'Entrenamiento Personalizado',
    description: 'Alcance sus objetivos fitness con un método científico y motivador. Diseñamos planes de entrenamiento que se adaptan a su ritmo biológico y metas específicas (pérdida de grasa, hipertrofia o movilidad). Incluye evaluación antropométrica mensual, seguimiento nutricional por expertos y sesiones guiadas donde la técnica impecable es la prioridad para evitar lesiones y maximizar resultados en cada minuto de su rutina.',
    mainImg: FOTOS.gym,
    companyIdx: 3, isQuotation: false, price: 1200,
    schedule: DEFAULT_SCHEDULE,
    metadata: [
      { key: 'Evaluación', value: 'Escaneo InBody mensual' },
      { key: 'Nutrición', value: 'Plan de alimentación incluido' },
      { key: 'App', value: 'Acceso a seguimiento en tiempo real' }
    ],
    tags: ['fitness', 'ejercicio', 'gimnasio', 'entrenador', 'salud']
  },
  {
    title: 'Yoga al Amanecer',
    description: 'Conecte con su serenidad interior mientras la ciudad despierta. Nuestras sesiones de yoga Hatha y Vinyasa frente al mar o en jardines privados están diseñadas para armonizar cuerpo y mente mediante el control consciente de la respiración y secuencias de asanas fluidas. Una experiencia revitalizante que le permitirá afrontar el día con claridad mental, vitalidad física y una profunda sensación de paz.',
    mainImg: FOTOS.yoga,
    companyIdx: 3, isQuotation: false, price: 750,
    schedule: DEFAULT_SCHEDULE,
    metadata: [
      { key: 'Nivel', value: 'Todos los niveles (desde cero)' },
      { key: 'Material', value: 'Incluye Mat de alta densidad' },
      { key: 'Duración', value: '75 minutos de práctica' }
    ],
    tags: ['yoga', 'meditación', 'bienestar', 'amanecer', 'paz']
  },
  {
    title: 'Jardinería de Paisaje',
    description: 'Creamos oasis privados que respiran elegancia. Nuestro equipo de paisajistas especializados diseña y mantiene jardines arquitectónicos que combinan especies nativas con sistemas de riego automatizado eficaces. Realizamos poda técnica, abonado orgánico estacional y control fitosanitario preventivo, asegurando que su espacio exterior luzca espectacular durante todo el año, aumentando el valor estético y comercial de su propiedad.',
    mainImg: FOTOS.jardin,
    companyIdx: 1, isQuotation: false, price: 1950,
    schedule: DEFAULT_SCHEDULE,
    metadata: [
      { key: 'Servicio', value: 'Diseño + Ejecución + Mantenimiento' },
      { key: 'Sostenibilidad', value: 'Uso de plantas xero-paisajistas' },
      { key: 'Garantía', value: 'Seguro de vida para plantas mayores' }
    ],
    tags: ['jardín', 'paisajismo', 'exterior', 'naturaleza', 'plantas']
  },
  {
    title: 'Fotógrafo Profesional para Eventos',
    description: 'Inmortalizamos sus momentos más valiosos con una mirada cinematográfica. Especialistas en narrativa visual para bodas, aniversarios y eventos corporativos de alto nivel. Utilizamos tecnología de formato completo y drones para capturar perspectivas únicas, entregando no solo fotografías, sino una historia visual editada con estándares artísticos que perdurará por generaciones como su legado más preciado.',
    mainImg: FOTOS.fotografo,
    companyIdx: 0, isQuotation: false, price: 4200,
    schedule: DEFAULT_SCHEDULE,
    metadata: [
      { key: 'Equipo', value: 'Sony Alpha Formato Completo' },
      { key: 'Entrega', value: 'Galería digital en 48 horas' },
      { key: 'Extras', value: 'Uso de Drone 4K incluido' }
    ],
    tags: ['foto', 'video', 'eventos', 'recuerdos', 'profesional']
  }
];

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  console.log('🌱 Seed Services v4 (Attributes, Schedules & Long Descriptions)...');

  const vendorUser = await prisma.user.findUnique({ where: { email: 'vendor@vendor.com' } });
  if (!vendorUser) { console.error('❌ Vendor user not found.'); return; }

  // 1. Crear Empresas
  console.log('🏢 Creando/actualizando empresas...');
  const companies = await Promise.all(
    COMPANIES.map((c) => prisma.company.upsert({
      where: { rfc: c.rfc },
      update: { businessName: c.businessName, description: c.description },
      create: { ...c },
    }))
  );

  const categories = await prisma.category.findMany({ where: { parentId: { not: null } } });
  const units = await prisma.serviceUnit.findMany();

  console.log(`🚀 Procesando ${SERVICES.length} servicios mejorados...`);

  for (let idx = 0; idx < SERVICES.length; idx++) {
    const s = SERVICES[idx];
    const company = companies[s.companyIdx];
    const category = categories[idx % categories.length];
    const unit = units[idx % units.length];
    const galls = getGallery(s.mainImg, 5);

    // Upsert Service
    const service = await prisma.service.upsert({
      where: { vendorId_title: { vendorId: vendorUser.id, title: s.title } },
      update: {
        description: s.description,
        imageUrl: s.mainImg,
        imageGallery: [s.mainImg, ...galls],
        categoryId: category.id,
        unitId: unit?.id,
        isActive: true,
        basePrice: s.price,
        showPrice: !s.isQuotation,
        companyId: company.id,
        slug: slugify(s.title),
        workSchedule: s.schedule as any,
        tags: s.tags,
        latitude: 19.4326 + (Math.random() - 0.5) * 0.1,
        longitude: -99.1332 + (Math.random() - 0.5) * 0.1,
        address: `${company.taxAddress}, ${company.taxAddressCity}`,
      },
      create: {
        vendorId: vendorUser.id,
        companyId: company.id,
        title: s.title,
        description: s.description,
        imageUrl: s.mainImg,
        imageGallery: [s.mainImg, ...galls],
        categoryId: category.id,
        unitId: unit?.id,
        isActive: true,
        basePrice: s.price,
        showPrice: !s.isQuotation,
        slug: slugify(s.title),
        workSchedule: s.schedule as any,
        tags: s.tags,
        latitude: 19.4326 + (Math.random() - 0.5) * 0.1,
        longitude: -99.1332 + (Math.random() - 0.5) * 0.1,
        address: `${company.taxAddress}, ${company.taxAddressCity}`,
      },
    });

    // 2. Gestionar Atributos (Metadata)
    // Borrar antiguos para re-crear (limpieza de seed)
    await prisma.serviceMetadata.deleteMany({ where: { serviceId: service.id } });
    if (s.metadata) {
      await prisma.serviceMetadata.createMany({
        data: s.metadata.map(m => ({
          serviceId: service.id,
          key: m.key,
          value: m.value
        }))
      });
    }

    console.log(`   ✅ [${idx + 1}/${SERVICES.length}] ${s.title}`);
  }

  console.log('\n🎉 Seed v4 completado exitosamente!');
}

main()
  .catch((e) => { console.error('❌ Error en seed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
