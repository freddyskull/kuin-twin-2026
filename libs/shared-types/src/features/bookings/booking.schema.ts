import { z } from 'zod';
import { BookingStatusSchema } from '../../common/enums';

export type BookingStatus = z.infer<typeof BookingStatusSchema>;

export const BookingDetailsSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  serviceSnapshot: z.any(),
  unitPrice: z.coerce.number(),
  quantity: z.number().int().positive(),
  taxTotal: z.coerce.number(),
  grandTotal: z.coerce.number(),
});

export type BookingDetailsDto = z.infer<typeof BookingDetailsSchema>;

export const BookingSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  status: BookingStatusSchema.default('PENDING'),
  scheduledDate: z.coerce.date(),
  
  // Relations
  details: BookingDetailsSchema.optional(),
  slots: z.array(z.any()).optional(), // Will define SlotSchema later if needed
  service: z.any().optional(), // Avoid circular dependency by using any or specialized DTO
});

export type BookingDto = z.infer<typeof BookingSchema>;
