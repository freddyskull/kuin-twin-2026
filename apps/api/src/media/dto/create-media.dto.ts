import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateMediaSchema = z.object({
  url: z.string().url({ message: 'URL de medio inválida' }),
  key: z.string().optional(),
  fileName: z.string().min(1, { message: 'El nombre de archivo es requerido' }),
  mimeType: z.string().min(1, { message: 'El tipo MIME es requerido' }),
  size: z.coerce.number().int().min(0),
  alt: z.string().optional(),
});

export class CreateMediaDto extends createZodDto(CreateMediaSchema) {}

export type CreateMediaInput = CreateMediaDto;
