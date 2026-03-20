import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateServiceUnitInput, UpdateServiceUnitDto } from './dto/service-unit.dto';
import { ServiceUnit, Prisma } from '@prisma/client';

@Injectable()
export class ServiceUnitService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateServiceUnitInput): Promise<ServiceUnit> {
    const existingName = await this.prisma.serviceUnit.findUnique({
      where: { name: createDto.name },
    });
    if (existingName) {
      throw new ConflictException(`La unidad con nombre ${createDto.name} ya existe`);
    }

    const existingAbbr = await this.prisma.serviceUnit.findUnique({
      where: { abbreviation: createDto.abbreviation },
    });
    if (existingAbbr) {
      throw new ConflictException(`La abreviación ${createDto.abbreviation} ya existe`);
    }

    const data: Prisma.ServiceUnitCreateInput = {
      name: createDto.name,
      abbreviation: createDto.abbreviation,
    };

    return this.prisma.serviceUnit.create({
      data,
    });
  }

  async findAll(): Promise<ServiceUnit[]> {
    return this.prisma.serviceUnit.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<ServiceUnit> {
    const unit = await this.prisma.serviceUnit.findUnique({
      where: { id },
    });

    if (!unit) {
      throw new NotFoundException(`Unidad de servicio con ID ${id} no encontrada`);
    }

    return unit;
  }

  async update(id: string, updateDto: UpdateServiceUnitDto): Promise<ServiceUnit> {
    const unit = await this.prisma.serviceUnit.findUnique({ where: { id } });

    if (!unit) {
      throw new NotFoundException(`Unidad de servicio con ID ${id} no encontrada`);
    }

    const data: Prisma.ServiceUnitUpdateInput = {
      name: updateDto.name,
      abbreviation: updateDto.abbreviation,
    };

    return this.prisma.serviceUnit.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<void> {
    const unit = await this.prisma.serviceUnit.findUnique({
      where: { id },
      include: { services: true },
    });

    if (!unit) {
      throw new NotFoundException(`Unidad de servicio con ID ${id} no encontrada`);
    }

    if (unit.services.length > 0) {
      throw new ConflictException('No se puede eliminar una unidad que está siendo utilizada por servicios');
    }

    await this.prisma.serviceUnit.delete({ where: { id } });
  }
}
