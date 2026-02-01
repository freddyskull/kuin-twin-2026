import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { CreateServiceInput, UpdateServiceDto } from './dto/service.dto';
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
  async create(createDto: CreateServiceInput): Promise<Service> {
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
      },
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

    const updated = await this.prisma.service.update({
      where: { id },
      data: updateDto as any,
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

    if (service.bookings.length > 0) {
      throw new ForbiddenException('No se puede eliminar un servicio con reservas pendientes');
    }

    // Invalidar caches antes de eliminar
    await this.cacheManager.del(`service:${id}`);
    await this.cacheManager.del('services:all');
    await this.cacheManager.del(`services:vendor:${service.vendorId}`);
    await this.cacheManager.del(`services:category:${service.categoryId}`);

    // Nota: En una app real preferiríamos isActive = false
    await this.prisma.service.delete({ where: { id } });
  }
}
