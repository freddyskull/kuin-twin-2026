import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { Service, Role } from '@prisma/client';

@Injectable()
export class ServiceService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Crear un nuevo servicio
   */
  async create(createDto: CreateServiceDto): Promise<Service> {
    const { vendorId, categoryId, unitId, ...rest } = createDto;

    // 1. Validar Vendor
    const vendor = await this.prisma.user.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundException('Vendedor no encontrado');
    if (vendor.role !== Role.VENDOR && vendor.role !== Role.ADMIN) {
      throw new ForbiddenException('Solo los usuarios con rol VENDOR pueden crear servicios');
    }

    // 2. Validar Categoría
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new NotFoundException('Categoría no encontrada');

    // 3. Validar Unidad
    const unit = await this.prisma.serviceUnit.findUnique({ where: { id: unitId } });
    if (!unit) throw new NotFoundException('Unidad de servicio no encontrada');

    const service = await this.prisma.service.create({
      data: {
        ...rest,
        vendorId,
        categoryId,
        unitId,
        metadata: {
          create: createDto.metadata || [],
        },
        workSchedule: createDto.workSchedule as any,
        slots: {
          create: (createDto.slots || []).map((slot: any) => {
            // Basic logic: generate the next occurrence of that day
            const now = new Date();
            const dayMap: Record<string, number> = {
              'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
              'Thursday': 4, 'Friday': 5, 'Saturday': 6
            };
            const targetDay = dayMap[slot.day];
            const currentDay = now.getDay();
            const daysUntil = (targetDay + 7 - currentDay) % 7;
            
            const startDate = new Date(now);
            startDate.setDate(now.getDate() + daysUntil);
            const [startH, startM] = slot.startTime.split(':');
            startDate.setHours(parseInt(startH), parseInt(startM), 0, 0);

            const endDate = new Date(startDate);
            const [endH, endM] = slot.endTime.split(':');
            endDate.setHours(parseInt(endH), parseInt(endM), 0, 0);

            return {
              startTime: startDate,
              endTime: endDate,
              isRecurring: slot.isRecurring,
              status: 'AVAILABLE'
            };
          })
        }
      },
      include: {
        metadata: true,
        slots: true
      }
    });

    // Invalidar cache de listados
    await this.cacheManager.del('services:all');
    await this.cacheManager.del(`services:vendor:${vendorId}`);
    await this.cacheManager.del(`services:category:${categoryId}`);

    return service;
  }

  /**
   * Listar todos los servicios con filtros opcionales
   */
  async findAll(filters?: { vendorId?: string; categoryId?: string; isActive?: boolean }): Promise<Service[]> {
    // Generar clave de cache basada en filtros
    const cacheKey = filters?.vendorId 
      ? `services:vendor:${filters.vendorId}`
      : filters?.categoryId
      ? `services:category:${filters.categoryId}`
      : 'services:all';

    // Intentar obtener del cache
    const cached = await this.cacheManager.get<Service[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Si no está en cache, consultar DB
    const services = await this.prisma.service.findMany({
      where: {
        vendorId: filters?.vendorId,
        categoryId: filters?.categoryId,
        isActive: filters?.isActive,
      },
      include: {
        category: true,
        unit: true,
        vendor: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
      },
      orderBy: { title: 'asc' },
    });

    // Guardar en cache por 5 minutos
    await this.cacheManager.set(cacheKey, services, 300000);

    return services;
  }

  /**
   * Obtener un servicio por ID con todo su detalle
   */
  async findOne(id: string): Promise<Service> {
    const cacheKey = `service:${id}`;
    
    // Intentar obtener del cache
    const cached = await this.cacheManager.get<Service>(cacheKey);
    if (cached) {
      return cached;
    }

    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        unit: true,
        vendor: {
          include: { profile: true },
        },
        metadata: true,
        slots: {
          where: { status: 'AVAILABLE' },
          take: 10,
        },
      },
    });

    if (!service) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }

    // Guardar en cache por 10 minutos
    await this.cacheManager.set(cacheKey, service, 600000);

    return service;
  }

  /**
   * Actualizar un servicio
   */
  async update(id: string, updateDto: UpdateServiceDto): Promise<Service> {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException(`Servicio con ID ${id} no encontrado`);

    const { metadata, slots, workSchedule, ...rest } = updateDto;
    
    // Preparar el objeto de actualización de Prisma
    const updateData: any = { ...rest };
    
    if (workSchedule) {
      updateData.workSchedule = workSchedule;
    }

    // Manejar metadatos si vienen en el DTO
    if (metadata) {
      updateData.metadata = {
        deleteMany: {},
        create: metadata,
      };
    }

    // Manejar slots si vienen en el DTO
    if (slots) {
      updateData.slots = {
        deleteMany: {},
        create: slots.map((slot: any) => {
          // Si el slot ya tiene startTime/endTime de tipo Date (porque viene de DB), usarlos
          if (slot.startTime instanceof Date || (typeof slot.startTime === 'string' && slot.startTime.includes('T'))) {
            return {
              startTime: new Date(slot.startTime),
              endTime: new Date(slot.endTime),
              isRecurring: slot.isRecurring,
              status: slot.status || 'AVAILABLE',
            };
          }

          // Si viene del formulario con formato 'Monday', '09:00', usar la lógica de generación
          const now = new Date();
          const dayMap: Record<string, number> = {
            'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
            'Thursday': 4, 'Friday': 5, 'Saturday': 6
          };
          const targetDay = dayMap[slot.day];
          if (targetDay === undefined) return null; // O ignorar

          const currentDay = now.getDay();
          const daysUntil = (targetDay + 7 - currentDay) % 7;
          
          const startDate = new Date(now);
          startDate.setDate(now.getDate() + daysUntil);
          const [startH, startM] = slot.startTime.split(':');
          startDate.setHours(parseInt(startH), parseInt(startM), 0, 0);

          const endDate = new Date(startDate);
          const [endH, endM] = slot.endTime.split(':');
          endDate.setHours(parseInt(endH), parseInt(endM), 0, 0);

          return {
            startTime: startDate,
            endTime: endDate,
            isRecurring: slot.isRecurring,
            status: 'AVAILABLE'
          };
        }).filter(Boolean),
      };
    }

    const updated = await this.prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        metadata: true,
        slots: true,
      }
    });

    // Invalidar caches relacionados
    await this.cacheManager.del(`service:${id}`);
    await this.cacheManager.del('services:all');
    await this.cacheManager.del(`services:vendor:${service.vendorId}`);
    await this.cacheManager.del(`services:category:${service.categoryId}`);

    return updated;
  }

  /**
   * Eliminar un servicio (Soft delete o físico?)
   * Por ahora físico, pero validando que no tenga reservas activas
   */
  async remove(id: string): Promise<void> {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { bookings: { where: { status: 'PENDING' } } },
    });

    if (!service) throw new NotFoundException(`Servicio con ID ${id} no encontrado`);

    if (service.isActive) {
      throw new ForbiddenException('No se puede eliminar un servicio activo. Por favor, desactívalo primero.');
    }

    if (service.bookings.length > 0) {
      throw new ForbiddenException('No se puede eliminar un servicio con reservas pendientes');
    }

    // Eliminar imagen física del servidor si existe
    if (service.imageUrl) {
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        
        // Extraer el path relativo de la URL (e.g., /uploads/media/filename.webp)
        const imagePath = service.imageUrl.replace(/^\//, '');
        const fullPath = path.join(process.cwd(), imagePath);
        
        // Verificar si el archivo existe antes de intentar eliminarlo
        await fs.access(fullPath);
        await fs.unlink(fullPath);
        console.log(`🗑️ Imagen eliminada: ${fullPath}`);
      } catch (error) {
        // Si el archivo no existe o hay error, solo loguearlo sin fallar la eliminación
        console.warn(`⚠️ No se pudo eliminar la imagen: ${service.imageUrl}`, error.message);
      }
    }

    // Invalidar caches antes de eliminar
    await this.cacheManager.del(`service:${id}`);
    await this.cacheManager.del('services:all');
    await this.cacheManager.del(`services:vendor:${service.vendorId}`);
    await this.cacheManager.del(`services:category:${service.categoryId}`);

    // Nota: En una app real preferiríamos isActive = false
    // Pero para permitir la eliminación física, debemos limpiar las relaciones manuales
    // si no se definieron con ON DELETE CASCADE en el esquema Prisma.
    await this.prisma.$transaction([
      this.prisma.serviceMetadata.deleteMany({ where: { serviceId: id } }),
      this.prisma.serviceSlot.deleteMany({ where: { serviceId: id } }),
      this.prisma.service.delete({ where: { id } }),
    ]);
  }
}
