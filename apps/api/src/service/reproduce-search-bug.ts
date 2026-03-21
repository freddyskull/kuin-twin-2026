import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ServiceService } from './service.service';

async function bootstrap() {
  console.log('🧪 Reproduciendo bug de búsqueda...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(ServiceService);

  try {
    const searchTerms = ['Chef', 'Masaje', 'limpieza', 'lujo'];

    for (const term of searchTerms) {
      console.log(`\n🔍 Buscando: "${term}"`);
      const result = await service.findAll({ search: term, isActive: true });
      console.log(`✅ Encontrados: ${result.total} servicios`);
      result.items.forEach(s => {
        console.log(`   - [${s.id}] ${s.title} (Tags: ${s.tags.join(', ')})`);
      });
    }

    console.log('\n🔍 Buscando sin términos (Debe traer todo)');
    const all = await service.findAll({ isActive: true });
    console.log(`✅ Total: ${all.total} servicios`);

  } catch (error) {
    console.error('\n❌ Error durante la reproducción:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap();
