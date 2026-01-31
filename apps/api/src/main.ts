import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar validación global con Zod
  app.useGlobalPipes(new ZodValidationPipe());
  
  
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
