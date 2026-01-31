import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateServiceInput, UpdateServiceDto } from './dto/service.dto';
import { Service, Role } from '@prisma/client';

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.service.create({
      data: {
        ...rest,
        vendorId,
        categoryId,
        unitId,
      },
    });
  }

  /**
   * Listar todos los servicios con filtros opcionales
   */
  async findAll(filters?: { vendorId?: string; categoryId?: string; isActive?: boolean }): Promise<Service[]> {
    return this.prisma.service.findMany({
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
  }

  /**
   * Obtener un servicio por ID con todo su detalle
   */
  async findOne(id: string): Promise<Service> {
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

    return service;
  }

  /**
   * Actualizar un servicio
   */
  async update(id: string, updateDto: UpdateServiceDto): Promise<Service> {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException(`Servicio con ID ${id} no encontrado`);

    return this.prisma.service.update({
      where: { id },
      data: updateDto as any,
    });
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

    // Nota: En una app real preferiríamos isActive = false
    await this.prisma.service.delete({ where: { id } });
  }
}
