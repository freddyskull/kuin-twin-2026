import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async create(createBranchDto: CreateBranchDto) {
    const { companyId, ...data } = createBranchDto;
    return this.prisma.branch.create({
      data: {
        ...data,
        company: { connect: { id: companyId } },
        businessHours: createBranchDto.businessHours as Prisma.InputJsonValue ?? Prisma.JsonNull,
      } as Prisma.BranchCreateInput,
    });
  }

  async findAll(companyId?: string) {
    return this.prisma.branch.findMany({
      where: companyId ? { companyId } : {},
      include: {
        company: {
          select: {
            businessName: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!branch) {
      throw new NotFoundException(`Sucursal con ID ${id} no encontrada`);
    }

    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    try {
      const { businessHours, ...data } = updateBranchDto;
      const updateData: Prisma.BranchUpdateInput = {
        ...data,
      };
      
      if (businessHours !== undefined) {
        updateData.businessHours = businessHours as Prisma.InputJsonValue ?? Prisma.JsonNull;
      }

      return await this.prisma.branch.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new NotFoundException(`Sucursal con ID ${id} no encontrada`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.branch.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Sucursal con ID ${id} no encontrada`);
    }
  }
}
