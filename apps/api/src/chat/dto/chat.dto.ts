import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SendMessageSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string().min(1, 'El mensaje no puede estar vacío'),
});

export class SendMessageDto extends createZodDto(SendMessageSchema) {}
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
