import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingInput, UpdateBookingDto } from './dto/booking.dto';
import { Booking, BookingStatus, SlotStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear una nueva reserva con detalles y bloqueo de slots
   */
  async create(createDto: CreateBookingInput): Promise<Booking> {
    const { customerId, serviceId, scheduledDate, slotIds, quantity } = createDto;

    // 1. Validar Cliente y Servicio
    const customer = await this.prisma.user.findUnique({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Cliente no encontrado');

    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: { unit: true },
    });
    if (!service) throw new NotFoundException('Servicio no encontrado');

    // 2. Validar disponibilidad de slots si se proporcionan
    if (slotIds && slotIds.length > 0) {
      const availableSlots = await this.prisma.serviceSlot.findMany({
        where: {
          id: { in: slotIds },
          serviceId,
          status: SlotStatus.AVAILABLE,
        },
      });

      if (availableSlots.length !== slotIds.length) {
        throw new ConflictException('Uno o más slots seleccionados no están disponibles');
      }
    }

    // 3. Iniciar Transacción
    return this.prisma.$transaction(async (tx) => {
      // 3.1 Crear la Reserva
      const booking = await tx.booking.create({
        data: {
          customerId,
          serviceId,
          scheduledDate: new Date(scheduledDate),
          status: BookingStatus.PENDING,
          slots: slotIds ? {
            connect: slotIds.map(id => ({ id })),
          } : undefined,
        },
      });

      // 3.2 Crear los Detalles (Snapshot)
      const unitPrice = service.basePrice;
      const quantityVal = quantity || 1;
      const grandTotal = Number(unitPrice) * quantityVal;

      await tx.bookingDetails.create({
        data: {
          bookingId: booking.id,
          serviceSnapshot: service as any,
          unitPrice,
          quantity: quantityVal,
          taxTotal: 0, // Por ahora sin impuestos complejos
          grandTotal,
        },
      });

      // 3.3 Marcar slots como ocupados
      if (slotIds) {
        await tx.serviceSlot.updateMany({
          where: { id: { in: slotIds } },
          data: { status: SlotStatus.BOOKED },
        });
      }

      return tx.booking.findUnique({
        where: { id: booking.id },
        include: { details: true, slots: true },
      }) as unknown as Booking;
    });
  }

  /**
   * Obtener todas las reservas (con filtros)
   */
  async findAll(filters: { customerId?: string; vendorId?: string; status?: BookingStatus }): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: {
        customerId: filters.customerId,
        service: filters.vendorId ? { vendorId: filters.vendorId } : undefined,
        status: filters.status,
      },
      include: {
        customer: { select: { email: true, profile: true } },
        service: true,
        details: true,
      },
      orderBy: { scheduledDate: 'desc' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        service: true,
        details: true,
        slots: true,
        payment: true,
      },
    });

    if (!booking) throw new NotFoundException('Reserva no encontrada');
    return booking;
  }

  /**
   * Actualizar estado de la reserva
   */
  async updateStatus(id: string, updateDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { slots: true },
    });

    if (!booking) throw new NotFoundException('Reserva no encontrada');

    // Si se cancela, liberar los slots
    if (updateDto.status === BookingStatus.CANCELLED && booking.slots.length > 0) {
      await this.prisma.serviceSlot.updateMany({
        where: { id: { in: booking.slots.map(s => s.id) } },
        data: { status: SlotStatus.AVAILABLE },
      });
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: updateDto.status },
      include: { details: true },
    });
  }
}
