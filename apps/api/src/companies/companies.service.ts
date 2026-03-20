import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: createCompanyDto as Prisma.CompanyCreateInput,
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      include: {
        _count: {
          select: { branches: true, profiles: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        branches: true,
        profiles: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      return await this.prisma.company.update({
        where: { id },
        data: updateCompanyDto as Prisma.CompanyUpdateInput,
      });
    } catch (error) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.company.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    }
  }
}
