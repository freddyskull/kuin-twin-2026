import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, serviceId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_serviceId: { userId, serviceId },
      },
    });

    if (existing) {
      await this.prisma.favorite.delete({
        where: { id: existing.id },
      });
      return { isFavorite: false };
    }

    const data: Prisma.FavoriteCreateInput = {
      user: { connect: { id: userId } },
      service: { connect: { id: serviceId } },
    };

    await this.prisma.favorite.create({
      data,
    });
    return { isFavorite: true };
  }

  async isFavorite(userId: string, serviceId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_serviceId: { userId, serviceId },
      },
    });
    return !!favorite;
  }

  async findAllByUser(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        service: {
          include: {
            category: true,
            unit: true,
            company: true,
          },
        },
      },
    });
  }
}
