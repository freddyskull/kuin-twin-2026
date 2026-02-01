import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSlotInput, UpdateSlotDto } from './dto/slot.dto';
import { ServiceSlot, SlotStatus } from '@prisma/client';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class SlotService {
  constructor(
    private prisma: PrismaService,
    private readonly socketGateway: SocketGateway,
  ) {}

  /**
   * Crear un slot de tiempo para un servicio
   */
  async create(createDto: CreateSlotInput): Promise<ServiceSlot> {
    const { serviceId, startTime, endTime } = createDto;

    // 1. Validar que el servicio existe
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new NotFoundException('Servicio no encontrado');

    // 2. Validar que el inicio sea antes que el fin
    if (new Date(startTime) >= new Date(endTime)) {
      throw new ConflictException('La hora de inicio debe ser anterior a la hora de fin');
    }

    // 3. (Opcional) Validar solapamientos del mismo servicio
    const overlap = await this.prisma.serviceSlot.findFirst({
      where: {
        serviceId,
        OR: [
          {
            startTime: { lte: new Date(endTime) },
            endTime: { gte: new Date(startTime) },
          },
        ],
      },
    });

    if (overlap) {
      throw new ConflictException('El horario se solapa con un slot existente para este servicio');
    }

    const slot = await this.prisma.serviceSlot.create({
      data: {
        ...createDto,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    // Notificar actualización de disponibilidad global
    this.socketGateway.broadcast('slots_updated', {
      serviceId: slot.serviceId,
      slotIds: [slot.id],
      status: slot.status,
    });

    return slot;
  }

  /**
   * Obtener slots por servicio y rango de fechas
   */
  async findAll(serviceId: string, from?: Date, to?: Date): Promise<ServiceSlot[]> {
    return this.prisma.serviceSlot.findMany({
      where: {
        serviceId,
        startTime: from ? { gte: from } : undefined,
        endTime: to ? { lte: to } : undefined,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  /**
   * Obtener un slot específico
   */
  async findOne(id: string): Promise<ServiceSlot> {
    const slot = await this.prisma.serviceSlot.findUnique({ where: { id } });
    if (!slot) throw new NotFoundException('Slot no encontrado');
    return slot;
  }

  /**
   * Actualizar estado o tiempos del slot
   */
  async update(id: string, updateDto: UpdateSlotDto): Promise<ServiceSlot> {
    const slot = await this.prisma.serviceSlot.findUnique({ where: { id } });
    if (!slot) throw new NotFoundException('Slot no encontrado');

    return this.prisma.serviceSlot.update({
      where: { id },
      data: {
        ...updateDto,
        startTime: updateDto.startTime ? new Date(updateDto.startTime) : undefined,
        endTime: updateDto.endTime ? new Date(updateDto.endTime) : undefined,
      } as any,
    });
  }

  /**
   * Eliminar un slot
   */
  async remove(id: string): Promise<void> {
    const slot = await this.prisma.serviceSlot.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!slot) throw new NotFoundException('Slot no encontrado');

    await this.prisma.serviceSlot.delete({ where: { id } });

    // Notificar eliminación (para que desaparezca del UI)
    this.socketGateway.broadcast('slots_updated', {
      serviceId: slot.serviceId,
      slotIds: [slot.id],
      status: 'DELETED',
    });
  }
}
