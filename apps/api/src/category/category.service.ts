import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { CreateCategoryInput, UpdateCategoryDto } from './dto/category.dto';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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

    const category = await this.prisma.category.create({
      data: {
        ...createDto,
      },
    });

    // Invalidar cache de categorías
    await this.cacheManager.del('categories:all');
    await this.cacheManager.del('categories:roots');

    return category;
  }

  /**
   * Obtener todas las categorías (árbol o lista plana)
   */
  async findAll(onlyRoots = false): Promise<Category[]> {
    const cacheKey = onlyRoots ? 'categories:roots' : 'categories:all';

    // Intentar obtener del cache
    const cached = await this.cacheManager.get<Category[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const categories = await this.prisma.category.findMany({
      where: onlyRoots ? { parentId: null } : {},
      include: {
        children: true,
      },
      orderBy: { name: 'asc' },
    });

    // Guardar en cache por 15 minutos (las categorías cambian poco)
    await this.cacheManager.set(cacheKey, categories, 900000);

    return categories;
  }

  /**
   * Obtener una categoría por ID o Slug
   */
  async findOne(idOrSlug: string): Promise<Category> {
    const cacheKey = `category:${idOrSlug}`;

    // Intentar obtener del cache
    const cached = await this.cacheManager.get<Category>(cacheKey);
    if (cached) {
      return cached;
    }

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

    // Guardar en cache por 15 minutos
    await this.cacheManager.set(cacheKey, category, 900000);

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

    const updated = await this.prisma.category.update({
      where: { id },
      data: updateDto as any,
    });

    // Invalidar caches
    await this.cacheManager.del(`category:${id}`);
    await this.cacheManager.del(`category:${category.slug}`);
    await this.cacheManager.del('categories:all');
    await this.cacheManager.del('categories:roots');

    return updated;
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

    // Invalidar caches
    await this.cacheManager.del(`category:${id}`);
    await this.cacheManager.del(`category:${category.slug}`);
    await this.cacheManager.del('categories:all');
    await this.cacheManager.del('categories:roots');

    await this.prisma.category.delete({ where: { id } });
  }
}
