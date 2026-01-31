import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  bookingId: z.string().uuid(),
  amount: z.number().positive(),
  processorId: z.string().min(1),
  status: z.string().min(1),
});

export class CreatePaymentDto extends createZodDto(CreatePaymentSchema) {}
export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
