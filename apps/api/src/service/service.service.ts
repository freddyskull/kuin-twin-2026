import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { Service, Role } from '@prisma/client';
import { slugify, transformSlots } from './service-mapper.utils';
import { mapCreateServiceData, mapUpdateServiceData } from './service.mapper';

@Injectable()
export class ServiceService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createDto: CreateServiceDto): Promise<Service> {
    const slug = createDto.slug || slugify(createDto.title);
    const vendor = await this.prisma.user.findUnique({ where: { id: createDto.vendorId } });
    
    if (!vendor || (vendor.role !== Role.VENDOR && vendor.role !== Role.ADMIN)) {
      throw new ForbiddenException('Solo los usuarios con rol VENDOR pueden crear servicios');
    }

    const existing = await this.prisma.service.findFirst({
      where: { vendorId: createDto.vendorId, title: { equals: createDto.title, mode: 'insensitive' } }
    });
    if (existing) throw new ForbiddenException(`Ya tienes un servicio registrado con el título "${createDto.title}"`);

    const data = mapCreateServiceData(createDto, slug);
    const service = await this.prisma.service.create({
      data: {
        ...data,
        metadata: { create: createDto.metadata || [] },
        slots: { create: transformSlots(createDto.slots || []) }
      },
      include: { metadata: true, slots: true }
    });

    await this.clearServiceCache(createDto.vendorId, createDto.categoryId);
    return service;
  }

  async findAll(filters?: { vendorId?: string; categoryId?: string; isActive?: boolean }): Promise<Service[]> {
    const cacheKey = filters?.vendorId ? `services:vendor:${filters.vendorId}` : filters?.categoryId ? `services:category:${filters.categoryId}` : 'services:all';
    const cached = await this.cacheManager.get<Service[]>(cacheKey);
    if (cached) return cached;

    const services = await this.prisma.service.findMany({
      where: { vendorId: filters?.vendorId, categoryId: filters?.categoryId, isActive: filters?.isActive },
      include: { category: true, unit: true, company: true, vendor: { select: { id: true, email: true, profile: true } } },
      orderBy: { title: 'asc' },
    });

    await this.cacheManager.set(cacheKey, services, 300000);
    return services;
  }

  async findOne(term: string): Promise<Service> {
    const cached = await this.cacheManager.get<Service>(`service:${term}`);
    if (cached) return cached;

    const service = await this.prisma.service.findFirst({
      where: { OR: [{ id: term }, { slug: term }] },
      include: {
        category: true, unit: true, company: true,
        vendor: { include: { profile: true } },
        metadata: true,
        slots: { where: { status: 'AVAILABLE' }, take: 10 },
      },
    });

    if (!service) throw new NotFoundException(`Servicio no encontrado: ${term}`);
    await this.cacheManager.set(`service:${term}`, service, 600000);
    return service;
  }

  async update(id: string, updateDto: UpdateServiceDto): Promise<Service> {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException(`Servicio con ID ${id} no encontrado`);

    if (updateDto.title && updateDto.title.toLowerCase() !== service.title.toLowerCase()) {
      const duplicate = await this.prisma.service.findFirst({
        where: { vendorId: service.vendorId, title: { equals: updateDto.title, mode: 'insensitive' }, id: { not: id } }
      });
      if (duplicate) throw new ForbiddenException(`Ya tienes otro servicio registrado con el título "${updateDto.title}"`);
    }

    const updateData = mapUpdateServiceData(updateDto);
    if (updateDto.metadata) updateData.metadata = { deleteMany: {}, create: updateDto.metadata };
    if (updateDto.slots) updateData.slots = { deleteMany: {}, create: transformSlots(updateDto.slots) };

    const updated = await this.prisma.service.update({
      where: { id },
      data: updateData,
      include: { metadata: true, slots: true }
    });

    await this.clearServiceCache(service.vendorId, service.categoryId, id);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { bookings: { where: { status: 'PENDING' } } },
    });

    if (!service) throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    if (service.isActive) throw new ForbiddenException('No se puede eliminar un servicio activo. Desactívalo primero.');
    if (service.bookings.length > 0) throw new ForbiddenException('No se puede eliminar un servicio con reservas pendientes');

    if (service.imageUrl) await this.deletePhysicalImage(service.imageUrl);

    await this.clearServiceCache(service.vendorId, service.categoryId, id);
    await this.prisma.$transaction([
      this.prisma.serviceMetadata.deleteMany({ where: { serviceId: id } }),
      this.prisma.serviceSlot.deleteMany({ where: { serviceId: id } }),
      this.prisma.service.delete({ where: { id } }),
    ]);
  }

  private async clearServiceCache(vId: string, cId: string, sId?: string) {
    if (sId) await this.cacheManager.del(`service:${sId}`);
    await this.cacheManager.del('services:all');
    await this.cacheManager.del(`services:vendor:${vId}`);
    await this.cacheManager.del(`services:category:${cId}`);
  }

  private async deletePhysicalImage(imageUrl: string) {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const fullPath = path.join(process.cwd(), imageUrl.replace(/^\//, ''));
      await fs.access(fullPath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.warn(`⚠️ No se pudo eliminar la imagen: ${imageUrl}`, error.message);
    }
  }
}


