import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMediaInput } from './dto/create-media.dto';
import { Media, Role } from '@prisma/client';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  /**
   * Agregar un medio a la galería del usuario
   * Restringido a usuarios tipo VENDOR (o ADMIN)
   */
  async addMedia(userId: string, createMediaDto: CreateMediaInput): Promise<Media> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Verificar que el usuario sea VENDOR o ADMIN
    if (user.role !== Role.VENDOR && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Solo los usuarios tipo VENDOR pueden gestionar una galería de medios');
    }

    return this.prisma.media.create({
      data: {
        ...createMediaDto,
        userId,
      },
    });
  }

  /**
   * Obtener todos los medios de un usuario
   */
  async findAllByUser(userId: string): Promise<Media[]> {
    return this.prisma.media.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Eliminar un medio de la galería
   */
  async remove(mediaId: string): Promise<void> {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new NotFoundException(`Medio con ID ${mediaId} no encontrado`);
    }

    // 1. Eliminar archivo físico
    if (media.url.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), media.url);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error(`Error al eliminar archivo físico: ${filePath}`, error);
      }
    }

    // 2. Eliminar de DB
    await this.prisma.media.delete({
      where: { id: mediaId },
    });
  }
}
