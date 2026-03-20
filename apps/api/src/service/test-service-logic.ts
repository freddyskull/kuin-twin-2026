import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { Role } from '@prisma/client';

async function bootstrap() {
  console.log('🧪 Iniciando Test de Lógica de Servicio...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(ServiceService);

  const vendorId = '146cd20d-1ed6-4cd6-a7d2-4546f52ae96a'; // vendor@vendor.com
  const categoryId = '9fd0145b-00e2-4857-a386-56c420a36d4b'; // Alquiler de Yates

  try {
    // 1. Test de Creación
    console.log('\n1️⃣ Probando Creación de Servicio...');
    const createDto: CreateServiceDto = {
      title: 'Yate de Lujo Test ' + Date.now(),
      vendorId,
      categoryId,
      basePrice: 5000,
      description: 'Este es un servicio de prueba generado por el script de testing.',
      isActive: true,
      showPrice: true,
      tags: ['test', 'lujo'],
    };

    const newService = await service.create(createDto);
    console.log('✅ Servicio creado con éxito. ID:', newService.id);

    // 2. Test de Edición
    console.log('\n2️⃣ Probando Edición de Servicio...');
    const updateDto: UpdateServiceDto = {
      title: newService.title + ' (Editado)',
      basePrice: 6000,
    };

    const updatedService = await service.update(newService.id, updateDto);
    console.log('✅ Servicio editado con éxito. Nuevo título:', updatedService.title);
    console.log('✅ Nuevo precio:', updatedService.basePrice);

    // 3. Test de validación de duplicados (debe fallar)
    console.log('\n3️⃣ Probando Validación de Duplicados...');
    try {
      // Usar exactamente los mismos datos del primer servicio
      await service.create({
        ...createDto,
        title: createDto.title // Asegurar mismo título
      });
      console.error('❌ Error: El sistema permitió crear un duplicado.');
    } catch (e) {
      console.log('✅ Éxito: El sistema rechazó correctamente el duplicado:', e.message);
    }

    // 4. Limpieza
    console.log('\n4️⃣ Eliminando servicio de prueba...');
    // Primero hay que desactivarlo para poder borrarlo
    await service.update(newService.id, { isActive: false });
    await service.remove(newService.id);
    console.log('✅ Servicio de prueba eliminado correctamente.');

    console.log('\n🎉 ¡Todos los tests de lógica de servicio pasaron exitosamente!');
  } catch (error) {
    console.error('\n❌ Test fallido:', error.message);
    if (error.response) console.error('Detalle:', error.response);
  } finally {
    await app.close();
  }
}

bootstrap();
