import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryInput, UpdateCategoryDto } from './dto/category.dto';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear una nueva categoría
   */
  async create(createDto: CreateCategoryInput): Promise<Category> {
    // Verificar si el slug ya existe
    const existing = await this.prisma.category.findUnique({
      where: { slug: createDto.slug },
    });

    if (existing) {
      throw new ConflictException(`Ya existe una categoría con el slug: ${createDto.slug}`);
    }

    return this.prisma.category.create({
      data: {
        ...createDto,
      },
    });
  }

  /**
   * Obtener todas las categorías (árbol o lista plana)
   */
  async findAll(onlyRoots = false): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: onlyRoots ? { parentId: null } : {},
      include: {
        children: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Obtener una categoría por ID o Slug
   */
  async findOne(idOrSlug: string): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
      },
      include: {
        children: true,
        parent: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Categoría ${idOrSlug} no encontrada`);
    }

    return category;
  }

  /**
   * Actualizar una categoría
   */
  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    // Si hay slug, verificar unicidad
    if (updateDto.slug && updateDto.slug !== category.slug) {
      const slugExists = await this.prisma.category.findUnique({
        where: { slug: updateDto.slug },
      });
      if (slugExists) {
        throw new ConflictException(`El slug ${updateDto.slug} ya está en uso`);
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateDto as any,
    });
  }

  /**
   * Eliminar una categoría
   */
  async remove(id: string): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    if (category.children.length > 0) {
      throw new ConflictException('No se puede eliminar una categoría que tiene subcategorías');
    }

    await this.prisma.category.delete({ where: { id } });
  }
}
