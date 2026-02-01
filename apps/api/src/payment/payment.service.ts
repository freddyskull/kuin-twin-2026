import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePaymentInput } from './dto/payment.dto';
import { Payment, BookingStatus } from '@prisma/client';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async create(createDto: CreatePaymentInput): Promise<Payment> {
    const { bookingId, ...rest } = createDto;

    const booking = await this.prisma.booking.findUnique({ 
      where: { id: bookingId },
      include: { customer: true }
    });
    if (!booking) throw new NotFoundException('Reserva no encontrada');

    const result = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          ...rest,
          bookingId,
        },
      });

      // Si el pago es exitoso, actualizar la reserva a ACTIVE
      if (rest.status === 'succeeded') {
        const updatedBooking = await tx.booking.update({
          where: { id: bookingId },
          data: { status: BookingStatus.ACTIVE },
          include: { service: true }
        });

        // NOTIFICAR AL CLIENTE
        this.socketGateway.sendToUser(booking.customerId, 'payment_confirmed', {
          bookingId,
          status: rest.status,
          amount: rest.amount,
        });

        // NOTIFICAR AL VENDEDOR
        this.socketGateway.sendToUser(updatedBooking.service.vendorId, 'booking_paid', {
          bookingId,
          amount: rest.amount,
        });
      }

      return payment;
    });

    return result;
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Pago no encontrado');
    return payment;
  }
}
