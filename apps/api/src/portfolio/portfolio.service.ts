import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePortfolioItemInput } from './dto';
import { PortfolioItem } from '@prisma/client';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  /**
   * Agregar un item al portafolio de un usuario
   */
  async addPortfolioItem(userId: string, itemDto: CreatePortfolioItemInput): Promise<PortfolioItem> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`El usuario con ID ${userId} no tiene un perfil creado aún.`);
    }

    return this.prisma.portfolioItem.create({
      data: {
        imageUrl: itemDto.imageUrl,
        description: itemDto.description,
        imageGallery: itemDto.imageGallery,
        dynamicAttributes: itemDto.dynamicAttributes as any,
        profileId: profile.id,
      },
    });
  }

  /**
   * Eliminar un item del portafolio
   */
  async removePortfolioItem(itemId: string): Promise<void> {
    const item = await this.prisma.portfolioItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item de portafolio con ID ${itemId} no encontrado`);
    }

    await this.prisma.portfolioItem.delete({
      where: { id: itemId },
    });
  }

  /**
   * Obtener items de portafolio de un usuario
   */
  async getByUserId(userId: string): Promise<PortfolioItem[]> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { portfolio: true },
    });

    if (!profile) {
      throw new NotFoundException(`Perfil no encontrado para el usuario ${userId}`);
    }

    return profile.portfolio;
  }
}
