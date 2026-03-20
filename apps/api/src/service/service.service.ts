import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { Service, Role, Prisma } from '@prisma/client';
import { slugify, transformSlots } from './service-mapper.utils';
import { mapCreateServiceData, mapUpdateServiceData } from './service.mapper';

@Injectable()
export class ServiceService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createDto: CreateServiceDto): Promise<Service> {
    const cleanTitle = createDto.title.trim();
    const slug = createDto.slug || slugify(cleanTitle);
    
    const vendor = await this.prisma.user.findUnique({ where: { id: createDto.vendorId } });
    
    if (!vendor || (vendor.role !== Role.VENDOR && vendor.role !== Role.ADMIN)) {
      throw new ForbiddenException('Solo los usuarios con rol VENDOR pueden crear servicios');
    }

    const existingTitle = await this.prisma.service.findFirst({
      where: { vendorId: createDto.vendorId, title: { equals: cleanTitle, mode: 'insensitive' } }
    });
    if (existingTitle) throw new ForbiddenException(`Ya tienes un servicio registrado con el título "${cleanTitle}"`);

    const existingSlug = await this.prisma.service.findUnique({ where: { slug } });
    if (existingSlug) throw new ForbiddenException(`El slug "${slug}" ya está en uso por otro servicio`);

    const mappedData = mapCreateServiceData(createDto, slug);
    
    // Extender mappedData con relaciones anidadas manteniendo el tipado
    const data: Prisma.ServiceCreateInput = {
      ...mappedData,
      metadata: { 
        create: (createDto.metadata || []).map(m => ({
          key: m.key,
          value: m.value
        }))
      },
      faqs: { 
        create: (createDto.faqs || []).map(f => ({
          question: f.question,
          answer: f.answer,
          order: f.order
        }))
      },
      slots: { 
        create: transformSlots(createDto.slots || [])
      }
    };

    const service = await this.prisma.service.create({
      data,
      include: { metadata: true, faqs: true, slots: true, branches: true, unit: true }
    });

    await this.updateGisLocation(service.id, createDto.latitude, createDto.longitude);
    
    await this.clearServiceCache(createDto.vendorId, createDto.categoryId);
    return service;
  }

  async findAll(filters?: { 
    vendorId?: string; 
    categoryId?: string; 
    isActive?: boolean; 
    page?: number; 
    limit?: number;
    search?: string;
    lat?: number;
    lng?: number;
    radiusKm?: number;
  }): Promise<{ items: Service[]; total: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ServiceWhereInput = { 
      vendorId: filters?.vendorId, 
      categoryId: filters?.categoryId, 
      isActive: filters?.isActive,
      ...(filters?.search ? {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { slug: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { tags: { hasSome: [filters.search] } },
          // Búsqueda aproximada en tags (si el backend lo soporta vía JSON o si tags fuera un string simple)
          // Como tags es string[], hasSome es lo más cercano, pero podemos añadir más campos
        ]
      } : {})
    };

    // Si hay coordenadas, usamos una query diferente para ordenar por relevancia + proximidad
    if (filters?.lat !== undefined && filters?.lng !== undefined) {
      const radiusMeters = (filters.radiusKm || 50) * 1000;
      const lng = filters.lng;
      const lat = filters.lat;
      const searchTerm = filters.search ? `%${filters.search}%` : null;

      // Query con sistema de puntuación:
      // - Score 100: Título coincide exactamente (ignore case)
      // - Score 50: Título contiene la palabra
      // - Score 20: Descripción contiene la palabra
      const items: any[] = await this.prisma.$queryRaw`
        SELECT s.id, 
               ST_Distance(s.location, ST_GeomFromText(${`POINT(${lng} ${lat})`}, 4326)) as distance,
               CASE 
                 WHEN ${filters.search || ''} = '' THEN 1
                 WHEN s."title" ILIKE ${filters.search || ''} THEN 100
                 WHEN s."title" ILIKE ${searchTerm || ''} THEN 50
                 WHEN s."description" ILIKE ${searchTerm || ''} THEN 20
                 ELSE 0
               END as relevance_score
        FROM "Service" s
        WHERE s."isActive" = ${filters.isActive ?? true}
        ${filters.categoryId ? Prisma.sql`AND s."categoryId" = ${filters.categoryId}` : Prisma.empty}
        ${filters.vendorId ? Prisma.sql`AND s."vendorId" = ${filters.vendorId}` : Prisma.empty}
        ${filters.search ? Prisma.sql`AND (s."title" ILIKE ${searchTerm} OR s."description" ILIKE ${searchTerm} OR ${filters.search} = ANY(s."tags"))` : Prisma.empty}
        ORDER BY relevance_score DESC, distance ASC NULLS LAST
        LIMIT ${limit} OFFSET ${skip}
      `;

      const total: any[] = await this.prisma.$queryRaw`
        SELECT COUNT(*)::int as count
        FROM "Service" s
        WHERE s."isActive" = ${filters.isActive ?? true}
        ${filters.categoryId ? Prisma.sql`AND s."categoryId" = ${filters.categoryId}` : Prisma.empty}
        ${filters.search ? Prisma.sql`AND (s."title" ILIKE ${searchTerm} OR s."description" ILIKE ${searchTerm})` : Prisma.empty}
      `;

      if (items.length === 0) return { items: [], total: 0 };

      const ids = items.map(i => i.id);
      const services = await this.prisma.service.findMany({
        where: { id: { in: ids } },
        include: { 
          category: true, 
          unit: true, 
          company: true, 
          branches: true, 
          metadata: true, 
          faqs: { orderBy: { order: 'asc' } },
          vendor: { select: { id: true, email: true, profile: true } } 
        }
      });

      // Reordenar por distancia
      const sortedItems = ids.map(id => services.find(s => s.id === id)).filter(Boolean);
      return { items: sortedItems as Service[], total: total[0]?.count || 0 };
    }

    // Comportamiento estándar sin proximidad
    const [items, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        include: { 
          category: true, 
          unit: true, 
          company: true, 
          branches: true, 
          metadata: true, 
          faqs: { orderBy: { order: 'asc' } },
          vendor: { select: { id: true, email: true, profile: true } } 
        },
        orderBy: { title: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.service.count({ where }),
    ]);

    return { items: items as Service[], total };
  }

  async findOne(term: string): Promise<Service> {
    const cached = await this.cacheManager.get<Service>(`service:${term}`);
    if (cached) return cached;

    const service = await this.prisma.service.findFirst({
      where: { OR: [{ id: term }, { slug: term }] },
      include: {
        category: true, unit: true, company: true, branches: true,
        vendor: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: true,
          }
        },
        metadata: true,
        faqs: { orderBy: { order: 'asc' } },
        slots: { where: { status: 'AVAILABLE' }, take: 10 },
      },
    });

    if (!service) throw new NotFoundException(`Servicio no encontrado: ${term}`);
    await this.cacheManager.set(`service:${term}`, service, 600000);
    return service as Service;
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
    
    if (updateDto.metadata) {
      updateData.metadata = { 
        deleteMany: {}, 
        create: updateDto.metadata.map(m => ({ key: m.key, value: m.value })) 
      };
    }
    
    if (updateDto.faqs) {
      updateData.faqs = { 
        deleteMany: {}, 
        create: updateDto.faqs.map(f => ({ question: f.question, answer: f.answer, order: f.order })) 
      };
    }
    
    if (updateDto.slots) {
      updateData.slots = { 
        deleteMany: {}, 
        create: transformSlots(updateDto.slots) 
      };
    }

    const updated = await this.prisma.service.update({
      where: { id },
      data: updateData,
      include: { metadata: true, faqs: true, slots: true, branches: true, unit: true }
    });

    await this.updateGisLocation(id, updateDto.latitude, updateDto.longitude);
    
    await this.clearServiceCache(service.vendorId, service.categoryId, id);
    return updated as Service;
  }

  async updateGisLocation(id: string, lat?: number, lng?: number) {
    if (lat === undefined || lng === undefined) return;
    
    // Usamos raw SQL para PostGIS ya que Prisma no soporta geography(Point) nativamente
    await this.prisma.$executeRaw`
      UPDATE "Service" 
      SET location = ST_GeomFromText(${`POINT(${lng} ${lat})`}, 4326) 
      WHERE id = ${id}
    `;
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
      this.prisma.serviceFaq.deleteMany({ where: { serviceId: id } }),
      this.prisma.serviceSlot.deleteMany({ where: { serviceId: id } }),
      this.prisma.service.delete({ where: { id } }),
    ]);
  }

  async findRelated(id: string, limit: number = 4): Promise<Service[]> {
    const service = await this.prisma.service.findUnique({
      where: { id },
      select: { categoryId: true, companyId: true, tags: true }
    });

    if (!service) throw new NotFoundException(`Servicio no encontrado`);

    const related = await this.prisma.service.findMany({
      where: {
        id: { not: id },
        isActive: true,
        OR: [
          { categoryId: service.categoryId },
          { tags: { hasSome: service.tags } }
        ]
      },
      include: {
        category: true,
        unit: true,
        company: true,
        vendor: { 
          select: { 
            id: true, 
            profile: {
              select: {
                displayName: true,
                avatarUrl: true
              }
            } 
          } 
        }
      },
      take: limit,
      orderBy: { starsRate: 'desc' }
    });

    return related as Service[];
  }

  async findNearby(lat: number, lng: number, radiusKm: number = 10, limit: number = 10): Promise<Service[]> {
    // Usamos SQL puro para aprovechar PostGIS ST_DWithin
    // 1 km = 1000 metros
    const radiusMeters = radiusKm * 1000;

    // Nota: Prisma queryRaw devuelve una lista de objetos.
    // Necesitamos asegurarnos de que el esquema coincida con lo que esperamos.
    const nearbyServices: any[] = await this.prisma.$queryRaw`
      SELECT s.*, 
             ST_Distance(s.location, ST_GeomFromText(${`POINT(${lng} ${lat})`}, 4326)) as distance
      FROM "Service" s
      WHERE ST_DWithin(
        s.location, 
        ST_GeomFromText(${`POINT(${lng} ${lat})`}, 4326), 
        ${radiusMeters}
      ) AND s."isActive" = true
      ORDER BY distance ASC
      LIMIT ${limit}
    `;

    // Como queryRaw no hace "include" de forma automática, 
    // si necesitamos relaciones podemos hacer una segunda consulta 
    // o refinar la query SQL. Por simplicidad y consistencia con el resto de la app,
    // usaremos los IDs obtenidos para traer los objetos completos con Prisma.
    if (nearbyServices.length === 0) return [];

    const ids = nearbyServices.map(s => s.id);
    const services = await this.prisma.service.findMany({
      where: { id: { in: ids } },
      include: { 
        category: true, 
        unit: true, 
        company: true,
        vendor: { select: { id: true, profile: { select: { displayName: true, avatarUrl: true } } } }
      }
    });

    // Reordenar para mantener la distancia (ya que findMany no garantiza orden de IN)
    return ids.map(id => services.find(s => s.id === id)).filter(Boolean) as Service[];
  }

  private async clearServiceCache(vId: string, cId: string, sId?: string) {
    if (sId) await this.cacheManager.del(`service:${sId}`);
    // Limpiar variantes de caché incluyendo filtros de isActive
    await Promise.all([
      this.cacheManager.del('services:all'),
      this.cacheManager.del('services:active:true'),
      this.cacheManager.del('services:active:false'),
      this.cacheManager.del(`services:vendor:${vId}`),
      this.cacheManager.del(`services:vendor:${vId}:active:true`),
      this.cacheManager.del(`services:vendor:${vId}:active:false`),
      this.cacheManager.del(`services:category:${cId}`),
      this.cacheManager.del(`services:category:${cId}:active:true`),
      this.cacheManager.del(`services:category:${cId}:active:false`),
    ]);
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
