import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateMediaSchema = z.object({
  url: z.string().url('URL de medio inválida'),
  key: z.string().optional(),
  fileName: z.string().min(1, 'El nombre de archivo es requerido'),
  mimeType: z.string().min(1, 'El tipo MIME es requerido'),
  size: z.number().int().min(0),
  alt: z.string().optional(),
});

export class CreateMediaDto extends createZodDto(CreateMediaSchema) {}
export type CreateMediaInput = z.infer<typeof CreateMediaSchema>;
