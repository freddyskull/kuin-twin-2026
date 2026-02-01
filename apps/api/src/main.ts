import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar validación global con Zod
  app.useGlobalPipes(new ZodValidationPipe());
  
  // Configurar Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Kuin Twin API')
    .setDescription(`
      API completa para la plataforma de marketplace de servicios Kuin Twin.
      
      ## Características
      - 🔐 Gestión de usuarios (Clientes y Proveedores)
      - 📁 Categorías jerárquicas de servicios
      - 🛠️ Catálogo de servicios con disponibilidad
      - 📅 Sistema de reservas con slots
      - 💳 Procesamiento de pagos
      - 💬 Chat interno en tiempo real
      - 📸 Galería de medios para proveedores
      - 🚀 Caché con Redis para optimización
      - 🔌 WebSockets para notificaciones en tiempo real
      
      ## Autenticación
      Actualmente la API no requiere autenticación. Se recomienda implementar JWT en producción.
      
      ## Caché
      La API utiliza Redis para cachear consultas frecuentes:
      - Servicios: 5-10 minutos
      - Categorías: 15 minutos
      - Usuarios: 3-5 minutos
      
      ## WebSockets
      Conectar a \`ws://localhost:3001\` con query param \`userId\` para recibir notificaciones en tiempo real.
      
      ## Recursos Adicionales
      - [Documentación Completa](/docs/README.md)
      - [Sandbox de Pruebas](/docs/SANDBOX.md)
      - [Guía de Redis](/docs/REDIS_CACHE.md)
    `)
    .setVersion('1.0.0')
    .setContact(
      'Equipo de Desarrollo',
      'https://github.com/tu-usuario/kuin-twin-2026',
      'dev@kuintwin.com'
    )
    .setLicense('Privado', '')
    .addBearerAuth()
    .addTag('Auth', 'Autenticación de usuarios')
    .addTag('Users', 'Gestión de usuarios y perfiles')
    .addTag('Portfolio', 'Portafolio de trabajos de proveedores')
    .addTag('Media', 'Galería de medios (estilo WordPress)')
    .addTag('Categories', 'Categorías de servicios')
    .addTag('Service Units', 'Unidades de medida para servicios')
    .addTag('Services', 'Catálogo de servicios')
    .addTag('Slots', 'Disponibilidad horaria')
    .addTag('Bookings', 'Reservas y contrataciones')
    .addTag('Payments', 'Procesamiento de pagos')
    .addTag('Chat', 'Mensajería interna')
    .addServer('http://localhost:3001', 'Desarrollo Local')
    .addServer('https://api.kuintwin.com', 'Producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'Kuin Twin API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { font-size: 36px }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai'
      }
    }
  });
  
  app.enableCors();
  
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  
  console.log(`🚀 API corriendo en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api-docs`);
  console.log(`🛒 Web Store: http://localhost:${port}`);
  console.log(`⚙️ Admin Panel: http://localhost:${port}/admin`);
}
bootstrap();
