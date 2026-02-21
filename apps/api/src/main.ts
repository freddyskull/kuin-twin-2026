import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar validación global con Zod (nestjs-zod)
  app.useGlobalPipes(new ZodValidationPipe());

  // Configurar prefijo global /api
  app.setGlobalPrefix('api');
  
  app.enableCors();
  
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  
  console.log(`\n🚀 Kuin Twin API`);
  console.log(`📡 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Endpoint: http://localhost:${port}/api`);
  console.log(`⚙️ Admin Panel: http://localhost:5173/admin/`);
}
bootstrap();

