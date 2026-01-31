import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePaymentInput } from './dto/payment.dto';
import { Payment, BookingStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePaymentInput): Promise<Payment> {
    const { bookingId, ...rest } = createDto;

    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Reserva no encontrada');

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          ...rest,
          bookingId,
        },
      });

      // Si el pago es exitoso, actualizar la reserva a ACTIVE o COMPLETED
      if (rest.status === 'succeeded') {
        await tx.booking.update({
          where: { id: bookingId },
          data: { status: BookingStatus.ACTIVE },
        });
      }

      return payment;
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Pago no encontrado');
    return payment;
  }
}
