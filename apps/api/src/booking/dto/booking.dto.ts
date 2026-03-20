import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { BookingStatus } from '@prisma/client';

export const CreateBookingSchema = z.object({
  customerId: z.string().uuid({ message: 'ID de cliente inválido' }),
  serviceId: z.string().uuid({ message: 'ID de servicio inválido' }),
  scheduledDate: z.coerce.date({ message: 'Fecha programada inválida' }),
  slotIds: z.array(z.string().uuid()).optional(),
  quantity: z.coerce.number().int().min(1).optional().default(1),
});

export class CreateBookingDto extends createZodDto(CreateBookingSchema) {}

export type CreateBookingInput = CreateBookingDto;

export const UpdateBookingSchema = z.object({
  status: z.nativeEnum(BookingStatus),
});

export class UpdateBookingDto extends createZodDto(UpdateBookingSchema) {}
