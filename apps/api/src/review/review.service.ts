import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateReviewDto) {
    const { serviceId, rating, content } = createDto;

    // Verificar si el servicio existe
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    // Verificar si el usuario ya dejó una reseña para este servicio
    const existingReview = await this.prisma.review.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictException('Ya has dejado una reseña para este servicio');
    }

    // Crear la reseña y actualizar el promedio del servicio en una transacción
    return await this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          rating,
          content,
          user: { connect: { id: userId } },
          service: { connect: { id: serviceId } },
        } as Prisma.ReviewCreateInput,
        include: {
          user: {
            select: {
              profile: {
                select: {
                  displayName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      });

      // Calcular nuevo promedio y total de reseñas
      const aggregate = await tx.review.aggregate({
        where: { serviceId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.service.update({
        where: { id: serviceId },
        data: {
          starsRate: aggregate._avg.rating || 0,
          reviewsCount: aggregate._count.rating || 0,
        },
      });

      // Actualizar también el promedio global del perfil del vendor
      const allVendorReviews = await tx.review.aggregate({
        where: {
          service: {
            vendorId: service.vendorId,
          },
        },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.profile.update({
        where: { userId: service.vendorId },
        data: {
          ratingAvg: allVendorReviews._avg.rating || 0,
          reviewsCount: allVendorReviews._count.rating || 0,
        },
      });

      return review;
    });
  }

  async findByService(serviceId: string) {
    return this.prisma.review.findMany({
      where: { serviceId },
      include: {
        user: {
          select: {
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
