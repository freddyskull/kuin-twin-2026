import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1, 'El mensaje no puede estar vacío'),
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  isRead: z.boolean().default(false),
  createdAt: z.coerce.date(),
});

export const SendMessageSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string().min(1, 'El mensaje no puede estar vacío'),
});

export type MessageDto = z.infer<typeof MessageSchema>;
export type SendMessageDto = z.infer<typeof SendMessageSchema>;
