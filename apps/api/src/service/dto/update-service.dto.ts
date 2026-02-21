import { createZodDto } from 'nestjs-zod';
import { UpdateServiceSchema } from 'shared-types';

export class UpdateServiceDto extends createZodDto(UpdateServiceSchema) {}
